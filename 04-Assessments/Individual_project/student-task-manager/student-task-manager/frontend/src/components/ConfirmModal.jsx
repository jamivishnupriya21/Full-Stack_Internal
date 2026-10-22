function ConfirmModal({ assignment, busy, onConfirm, onCancel }) {
  if (!assignment) return null;

  return (
    <div className="modal-backdrop" onClick={busy ? undefined : onCancel}>
      <div className="modal" onClick={(event) => event.stopPropagation()} role="dialog">
        <div className="modal-icon">🗑</div>
        <h3>Delete this assignment?</h3>
        <p>
          <strong>{assignment.title}</strong> will be removed permanently. This cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-danger-solid" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
