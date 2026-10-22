import AssignmentCard from "./AssignmentCard";

function AssignmentList({
  assignments,
  onToggle,
  onDelete,
  emptyTitle = "No assignments found",
  emptyText = "Try changing your search or filters, or add a new assignment.",
  children,
}) {
  if (assignments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>{emptyTitle}</h3>
        <p>{emptyText}</p>
        {children}
      </div>
    );
  }

  return (
    <div className="assignment-grid">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default AssignmentList;
