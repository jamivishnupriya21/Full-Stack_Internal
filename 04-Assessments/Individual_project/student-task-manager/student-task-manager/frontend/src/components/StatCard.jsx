function StatCard({ title, value, icon, color, hint }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-${color}`}>{icon}</div>
      <div>
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
        {hint && <p className="stat-hint">{hint}</p>}
      </div>
    </div>
  );
}

export default StatCard;
