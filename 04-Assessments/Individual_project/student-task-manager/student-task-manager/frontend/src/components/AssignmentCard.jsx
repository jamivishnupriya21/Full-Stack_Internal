import { Link } from "react-router-dom";
import { dueLabel, formatDate, isOverdue } from "../utils/helpers";

function AssignmentCard({ assignment, onToggle, onDelete }) {
  const overdue = isOverdue(assignment);
  const completed = assignment.status === "Completed";

  const statusText = overdue ? "Overdue" : assignment.status;
  const statusClass = overdue ? "status-overdue" : completed ? "status-completed" : "status-pending";

  return (
    <article
      className={`assignment-card ${overdue ? "card-overdue" : ""} ${completed ? "card-completed" : ""}`}
    >
      <div className="card-top">
        <span className="subject-tag">{assignment.subject}</span>
        <span className={`badge priority-${assignment.priority.toLowerCase()}`}>
          {assignment.priority}
        </span>
      </div>

      <h3 className="card-title">{assignment.title}</h3>
      <p className="card-desc">{assignment.description || "No description provided."}</p>

      <div className="card-meta">
        <span>📅 {formatDate(assignment.dueDate)}</span>
        <span className={`badge ${statusClass}`}>{statusText}</span>
      </div>
      <p className={`due-label ${overdue ? "due-overdue" : ""}`}>{dueLabel(assignment)}</p>

      <div className="card-actions">
        <button
          className={`btn btn-small ${completed ? "btn-outline" : "btn-success"}`}
          onClick={() => onToggle(assignment)}
        >
          {completed ? "↩ Mark Pending" : "✔ Mark Completed"}
        </button>
        <Link className="btn btn-small btn-outline" to={`/edit/${assignment.id}`}>
          ✎ Edit
        </Link>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(assignment)}>
          🗑 Delete
        </button>
      </div>
    </article>
  );
}

export default AssignmentCard;
