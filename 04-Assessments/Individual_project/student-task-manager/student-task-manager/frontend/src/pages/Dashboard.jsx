import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { dueLabel, formatDate, getStats, isOverdue } from "../utils/helpers";

function MiniList({ items, emptyText, showDue }) {
  if (items.length === 0) {
    return <p className="muted-text">{emptyText}</p>;
  }

  return (
    <ul className="mini-list">
      {items.map((a) => (
        <li key={a.id} className="mini-item">
          <div className="mini-main">
            <p className="mini-title">{a.title}</p>
            <p className="mini-sub">
              {a.subject} · {showDue ? dueLabel(a) : `Added ${formatDate(a.createdAt)}`}
            </p>
          </div>
          {showDue ? (
            <span className={`badge priority-${a.priority.toLowerCase()}`}>{a.priority}</span>
          ) : (
            <span
              className={`badge ${
                isOverdue(a)
                  ? "status-overdue"
                  : a.status === "Completed"
                  ? "status-completed"
                  : "status-pending"
              }`}
            >
              {isOverdue(a) ? "Overdue" : a.status}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function Dashboard({ assignments }) {
  const stats = getStats(assignments);
  const maxPriority = Math.max(1, stats.pending);

  return (
    <div>
      {stats.overdue > 0 && (
        <div className="alert alert-danger">
          ⚠ You have {stats.overdue} overdue assignment{stats.overdue === 1 ? "" : "s"}.{" "}
          <Link to="/upcoming">See what is overdue</Link>
        </div>
      )}

      <section className="stats-grid">
        <StatCard title="Total Assignments" value={stats.total} icon="📚" color="purple" hint="All assignments" />
        <StatCard title="Pending" value={stats.pending} icon="⏳" color="blue" hint="Includes overdue" />
        <StatCard title="Completed" value={stats.completed} icon="✅" color="green" hint="Well done!" />
        <StatCard title="Overdue" value={stats.overdue} icon="🚨" color="red" hint="Past due date" />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <h3 className="panel-title">Completion Progress</h3>
          <div className="ring-wrap">
            <div className="ring" style={{ "--percent": stats.percent }}>
              <div className="ring-inner">
                <strong>{stats.percent}%</strong>
                <span>done</span>
              </div>
            </div>
            <p className="muted-text">
              {stats.completed} of {stats.total} assignments completed
            </p>
          </div>

          <h4 className="sub-title">Pending by priority</h4>
          {["High", "Medium", "Low"].map((priority) => (
            <div className="bar-row" key={priority}>
              <span className="bar-label">{priority}</span>
              <div className="bar-track">
                <div
                  className={`bar-fill fill-${priority.toLowerCase()}`}
                  style={{ width: `${(stats.pendingByPriority[priority] / maxPriority) * 100}%` }}
                ></div>
              </div>
              <span className="bar-count">{stats.pendingByPriority[priority]}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3 className="panel-title">Upcoming Deadlines</h3>
            <Link to="/upcoming" className="link-small">
              View all →
            </Link>
          </div>
          <MiniList
            items={stats.upcoming.slice(0, 5)}
            emptyText="No upcoming deadlines. You are all caught up!"
            showDue
          />
        </div>
      </section>

      <section className="panel recent-panel">
        <div className="panel-head">
          <h3 className="panel-title">Recently Added</h3>
          <Link to="/assignments" className="link-small">
            View all →
          </Link>
        </div>
        <MiniList
          items={stats.recent.slice(0, 5)}
          emptyText="No assignments yet. Click “Add Assignment” to create your first one."
          showDue={false}
        />
      </section>
    </div>
  );
}

export default Dashboard;
