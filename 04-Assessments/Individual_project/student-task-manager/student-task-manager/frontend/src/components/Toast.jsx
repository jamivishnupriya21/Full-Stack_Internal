function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`} role="status">
      <span className="toast-icon">{toast.type === "success" ? "✔" : "⚠"}</span>
      <p>{toast.message}</p>
      <button onClick={onClose} aria-label="Close message">
        ×
      </button>
    </div>
  );
}

export default Toast;
