import { Link } from "react-router-dom";
import AssignmentList from "../components/AssignmentList";
import { daysUntil, sortByDueDate } from "../utils/helpers";

function Section({ title, hint, items, onToggle, onDelete }) {
  if (items.length === 0) return null;

  return (
    <section className="deadline-section">
      <div className="section-head">
        <h3>{title}</h3>
        <span className="count-pill">{items.length}</span>
        <p>{hint}</p>
      </div>
      <AssignmentList assignments={items} onToggle={onToggle} onDelete={onDelete} />
    </section>
  );
}

function UpcomingDeadlines({ assignments, onToggle, onDelete }) {
  const pending = sortByDueDate(assignments.filter((a) => a.status === "Pending"));

  const overdue = pending.filter((a) => daysUntil(a.dueDate) < 0);
  const thisWeek = pending.filter((a) => daysUntil(a.dueDate) >= 0 && daysUntil(a.dueDate) <= 7);
  const later = pending.filter((a) => daysUntil(a.dueDate) > 7);

  if (pending.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎉</div>
        <h3>You are all caught up!</h3>
        <p>There are no pending assignments right now.</p>
        <Link to="/add" className="btn btn-primary">
          + Add Assignment
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Section title="Overdue" hint="Past the due date, finish these first" items={overdue} onToggle={onToggle} onDelete={onDelete} />
      <Section title="Due in the next 7 days" hint="Including today" items={thisWeek} onToggle={onToggle} onDelete={onDelete} />
      <Section title="Later" hint="More than a week away" items={later} onToggle={onToggle} onDelete={onDelete} />
    </div>
  );
}

export default UpcomingDeadlines;
