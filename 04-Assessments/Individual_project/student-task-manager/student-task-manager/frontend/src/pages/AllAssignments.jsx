import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AssignmentList from "../components/AssignmentList";
import { isOverdue, sortByDueDate } from "../utils/helpers";

function AllAssignments({ assignments, onToggle, onDelete }) {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  // Subjects for the dropdown come from the real data.
  const subjects = useMemo(
    () => [...new Set(assignments.map((a) => a.subject))].sort(),
    [assignments]
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = assignments.filter((a) => {
      if (term && !a.title.toLowerCase().includes(term)) return false;
      if (subject !== "All" && a.subject !== subject) return false;
      if (priority !== "All" && a.priority !== priority) return false;
      if (status === "Overdue" && !isOverdue(a)) return false;
      if ((status === "Pending" || status === "Completed") && a.status !== status) return false;
      return true;
    });

    return sortByDueDate(filtered, sortOrder);
  }, [assignments, search, subject, status, priority, sortOrder]);

  const filtersActive =
    search !== "" || subject !== "All" || status !== "All" || priority !== "All";

  function clearFilters() {
    setSearch("");
    setSubject("All");
    setStatus("All");
    setPriority("All");
  }

  return (
    <div>
      <div className="panel filters">
        <div className="filter-search">
          <label htmlFor="search">Search by title</label>
          <input
            id="search"
            type="search"
            placeholder="Type a title..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="subjectFilter">Subject</label>
          <select id="subjectFilter" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="All">All subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="statusFilter">Status</label>
          <select id="statusFilter" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label htmlFor="priorityFilter">Priority</label>
          <select id="priorityFilter" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="All">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder">Sort by due date</label>
          <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Earliest first</option>
            <option value="desc">Latest first</option>
          </select>
        </div>
      </div>

      <div className="result-bar">
        <p>
          Showing <strong>{visible.length}</strong> of <strong>{assignments.length}</strong> assignments
        </p>
        {filtersActive && (
          <button className="btn btn-small btn-outline" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <AssignmentList
        assignments={visible}
        onToggle={onToggle}
        onDelete={onDelete}
        emptyTitle={assignments.length === 0 ? "No assignments yet" : "No assignments match"}
        emptyText={
          assignments.length === 0
            ? "Add your first assignment to get started."
            : "Try a different search or clear the filters."
        }
      >
        {assignments.length === 0 && (
          <Link to="/add" className="btn btn-primary">
            + Add Assignment
          </Link>
        )}
      </AssignmentList>
    </div>
  );
}

export default AllAssignments;
