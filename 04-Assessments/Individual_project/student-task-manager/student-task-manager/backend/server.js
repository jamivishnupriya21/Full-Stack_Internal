import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// In ES modules __dirname does not exist, so we create it.
// This keeps the path to db.json correct on Windows from any start folder.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

const PORT = 5000;
const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["Pending", "Completed"];

const app = express();
app.use(cors()); // allow the React app (another port) to call this server
app.use(express.json()); // read JSON sent in request bodies

// ---------- Database helpers (db.json) ----------

async function readAssignments() {
  let text;
  try {
    text = await fs.readFile(DB_PATH, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeAssignments([]);
      return [];
    }
    throw error;
  }

  text = text.replace(/^\uFEFF/, ""); // remove invisible BOM character
  if (text.trim() === "") return [];

  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    // Stop instead of overwriting the file, so no data is lost.
    throw new Error("db.json contains invalid JSON. Fix the file before using the API.");
  }
  if (!Array.isArray(data)) {
    throw new Error("db.json must contain an array of assignments.");
  }
  return data;
}

// Write to a temporary file first, then rename it over db.json.
// If something fails half-way, the real db.json is not damaged.
async function writeAssignments(assignments) {
  const tempPath = DB_PATH + ".tmp";
  const json = JSON.stringify(assignments, null, 2);
  try {
    await fs.writeFile(tempPath, json, "utf-8");
    await fs.rename(tempPath, DB_PATH);
  } catch (error) {
    await fs.rm(tempPath, { force: true });
    throw error;
  }
}

// Run file operations one at a time so quick requests cannot
// overwrite each other's changes.
let queue = Promise.resolve();
function runExclusive(task) {
  const result = queue.then(task);
  queue = result.catch(() => {});
  return result;
}

// ---------- Validation helpers ----------

function isValidIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// Returns { errors, data }. errors is an object like { title: "Title is required." }
function validateAssignmentBody(body) {
  const errors = {};

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { errors: { body: "Request body must be a JSON object." }, data: null };
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const dueDate = typeof body.dueDate === "string" ? body.dueDate.trim() : "";

  let description = "";
  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== "string") {
      errors.description = "Description must be text.";
    } else {
      description = body.description.trim();
    }
  }

  let priority = "Medium";
  if (body.priority !== undefined && body.priority !== "") priority = body.priority;

  let status = "Pending";
  if (body.status !== undefined && body.status !== "") status = body.status;

  if (!title) errors.title = "Title is required.";
  else if (title.length > 100) errors.title = "Title must be 100 characters or less.";

  if (!subject) errors.subject = "Subject is required.";
  else if (subject.length > 60) errors.subject = "Subject must be 60 characters or less.";

  if (!dueDate) errors.dueDate = "Due date is required.";
  else if (!isValidIsoDate(dueDate)) {
    errors.dueDate = "Due date must be a valid date in YYYY-MM-DD format.";
  }

  if (description.length > 500) errors.description = "Description must be 500 characters or less.";
  if (!PRIORITIES.includes(priority)) errors.priority = "Priority must be High, Medium or Low.";
  if (!STATUSES.includes(status)) errors.status = "Status must be Pending or Completed.";

  return { errors, data: { title, subject, description, dueDate, priority, status } };
}

function parseId(value) {
  return /^\d+$/.test(value) ? Number(value) : null;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ---------- Routes ----------

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.get(
  "/api/assignments",
  asyncHandler(async (req, res) => {
    const assignments = await runExclusive(readAssignments);
    res.status(200).json(assignments);
  })
);

app.get(
  "/api/assignments/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid assignment ID." });

    const assignments = await runExclusive(readAssignments);
    const assignment = assignments.find((item) => Number(item.id) === id);
    if (!assignment) return res.status(404).json({ message: `Assignment ${id} not found.` });

    res.status(200).json(assignment);
  })
);

app.post(
  "/api/assignments",
  asyncHandler(async (req, res) => {
    const { errors, data } = validateAssignmentBody(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed.", errors });
    }

    const created = await runExclusive(async () => {
      const assignments = await readAssignments();
      const highestId = assignments.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
      const newAssignment = { id: highestId + 1, ...data, createdAt: todayIso() };
      assignments.push(newAssignment);
      await writeAssignments(assignments);
      return newAssignment;
    });

    res.status(201).json(created);
  })
);

app.put(
  "/api/assignments/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid assignment ID." });

    const { errors, data } = validateAssignmentBody(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed.", errors });
    }

    const updated = await runExclusive(async () => {
      const assignments = await readAssignments();
      const index = assignments.findIndex((item) => Number(item.id) === id);
      if (index === -1) return null;

      // Keep the old id and createdAt, replace the other fields.
      const updatedAssignment = { ...assignments[index], ...data, id };
      assignments[index] = updatedAssignment;
      await writeAssignments(assignments);
      return updatedAssignment;
    });

    if (!updated) return res.status(404).json({ message: `Assignment ${id} not found.` });
    res.status(200).json(updated);
  })
);

app.delete(
  "/api/assignments/:id",
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid assignment ID." });

    const deleted = await runExclusive(async () => {
      const assignments = await readAssignments();
      const index = assignments.findIndex((item) => Number(item.id) === id);
      if (index === -1) return null;

      const [removed] = assignments.splice(index, 1);
      await writeAssignments(assignments);
      return removed;
    });

    if (!deleted) return res.status(404).json({ message: `Assignment ${id} not found.` });
    res.status(200).json({ message: "Assignment deleted.", assignment: deleted });
  })
);

// ---------- Error handling ----------

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body." });
  }
  console.error("Server error:", err.message);
  res.status(500).json({ message: "Internal server error. The request could not be completed." });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
