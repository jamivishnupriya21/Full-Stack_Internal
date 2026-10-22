// All communication with the Express backend happens in this file.
const BASE_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const config = { ...options };

  // Only send a JSON header when we actually send a body.
  if (config.body !== undefined) {
    config.headers = { "Content-Type": "application/json" };
    config.body = JSON.stringify(config.body);
  }

  // 1. Network failure (backend is off, wrong port, no internet)
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, config);
  } catch {
    throw new Error("Cannot reach the server. Make sure the backend is running on port 5000.");
  }

  // 2. Empty response (some servers return no body) -> data stays null
  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  // 3. HTTP error (400, 404, 500...) -> throw an Error with the server message
  if (!response.ok) {
    const message = (data && data.message) || `Request failed with status ${response.status}.`;
    const error = new Error(message);
    error.fieldErrors = (data && data.errors) || {};
    throw error;
  }

  // 4. Success
  return data;
}

export const getAssignments = () => request("/assignments");
export const getAssignment = (id) => request(`/assignments/${id}`);
export const createAssignment = (assignment) =>
  request("/assignments", { method: "POST", body: assignment });
export const updateAssignment = (id, assignment) =>
  request(`/assignments/${id}`, { method: "PUT", body: assignment });
export const deleteAssignment = (id) => request(`/assignments/${id}`, { method: "DELETE" });
