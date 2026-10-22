// Small helper functions for dates and dashboard statistics.

// Today's date as YYYY-MM-DD using the computer's local time.
export function todayIso() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function toDayNumber(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86400000;
}

// Days from today until the date (negative = already passed).
export function daysUntil(iso) {
  return Math.round(toDayNumber(iso) - toDayNumber(todayIso()));
}

// Overdue = still pending AND due date is before today.
export function isOverdue(assignment) {
  return assignment.status === "Pending" && daysUntil(assignment.dueDate) < 0;
}

export function formatDate(iso) {
  if (!iso) return "-";
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function dueLabel(assignment) {
  if (assignment.status === "Completed") return "Completed";
  const days = daysUntil(assignment.dueDate);
  if (days < 0) return `Overdue by ${-days} day${-days === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

export function sortByDueDate(list, direction = "asc") {
  const sorted = [...list].sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate) || a.id - b.id
  );
  return direction === "desc" ? sorted.reverse() : sorted;
}

// Every dashboard number is calculated here from the assignment list.
export function getStats(assignments) {
  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "Completed").length;
  const pendingList = assignments.filter((a) => a.status === "Pending");
  const overdue = assignments.filter(isOverdue).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const upcoming = sortByDueDate(
    pendingList.filter((a) => daysUntil(a.dueDate) >= 0)
  );
  const recent = [...assignments].sort(
    (a, b) => (b.createdAt || "").localeCompare(a.createdAt || "") || b.id - a.id
  );

  const pendingByPriority = { High: 0, Medium: 0, Low: 0 };
  pendingList.forEach((a) => {
    if (pendingByPriority[a.priority] !== undefined) pendingByPriority[a.priority] += 1;
  });

  return {
    total,
    completed,
    pending: pendingList.length,
    overdue,
    percent,
    upcoming,
    recent,
    pendingByPriority,
  };
}
