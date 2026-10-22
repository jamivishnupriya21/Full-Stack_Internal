import { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Toast from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";
import Dashboard from "./pages/Dashboard";
import AllAssignments from "./pages/AllAssignments";
import AddAssignment from "./pages/AddAssignment";
import UpcomingDeadlines from "./pages/UpcomingDeadlines";
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  updateAssignment,
} from "./services/api";

function NotFound() {
  return (
    <div className="empty-state">
      <div className="empty-icon">🧭</div>
      <h3>Page not found</h3>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}

function App() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load all assignments from the backend.
  const loadAssignments = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await getAssignments();
      setAssignments(data);
      setLoadError("");
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // Hide the toast message after 4 seconds.
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (type, message) => setToast({ type, message });

  // Create (no id) or update (with id). After saving, reload from the backend.
  async function saveAssignment(values, id) {
    try {
      const saved = id ? await updateAssignment(id, values) : await createAssignment(values);
      await loadAssignments(false);
      notify("success", id ? "Assignment updated successfully." : "Assignment added successfully.");
      return saved;
    } catch (error) {
      notify("error", error.message);
      throw error; // lets the form show field errors
    }
  }

  // Switch between Pending and Completed.
  async function toggleStatus(assignment) {
    const newStatus = assignment.status === "Completed" ? "Pending" : "Completed";
    try {
      await updateAssignment(assignment.id, {
        title: assignment.title,
        subject: assignment.subject,
        description: assignment.description,
        dueDate: assignment.dueDate,
        priority: assignment.priority,
        status: newStatus,
      });
      await loadAssignments(false);
      notify("success", `Marked as ${newStatus.toLowerCase()}.`);
    } catch (error) {
      notify("error", error.message);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteAssignment(deleteTarget.id);
      await loadAssignments(false);
      notify("success", "Assignment deleted.");
    } catch (error) {
      notify("error", error.message);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  let content;
  if (loading) {
    content = (
      <div className="center-state">
        <div className="spinner"></div>
        <p>Loading assignments...</p>
      </div>
    );
  } else if (loadError) {
    content = (
      <div className="center-state error-box">
        <div className="empty-icon">⚠️</div>
        <h3>Could not load assignments</h3>
        <p>{loadError}</p>
        <button className="btn btn-primary" onClick={() => loadAssignments()}>
          Try again
        </button>
      </div>
    );
  } else {
    content = (
      <Routes>
        <Route path="/" element={<Dashboard assignments={assignments} />} />
        <Route
          path="/assignments"
          element={
            <AllAssignments
              assignments={assignments}
              onToggle={toggleStatus}
              onDelete={setDeleteTarget}
            />
          }
        />
        <Route
          path="/add"
          element={<AddAssignment assignments={assignments} onSave={saveAssignment} />}
        />
        <Route
          path="/edit/:id"
          element={<AddAssignment assignments={assignments} onSave={saveAssignment} />}
        />
        <Route
          path="/upcoming"
          element={
            <UpcomingDeadlines
              assignments={assignments}
              onToggle={toggleStatus}
              onDelete={setDeleteTarget}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="content">{content}</main>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <ConfirmModal
        assignment={deleteTarget}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default App;
