import { useState } from "react";
import { Link } from "react-router-dom";

const emptyValues = {
  title: "",
  subject: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  status: "Pending",
};

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  else if (values.title.trim().length > 100) errors.title = "Title must be 100 characters or less.";

  if (!values.subject.trim()) errors.subject = "Subject is required.";
  if (!values.dueDate) errors.dueDate = "Due date is required.";
  if (values.description.length > 500) {
    errors.description = "Description must be 500 characters or less.";
  }
  return errors;
}

function AssignmentForm({ initialValues, subjectOptions, onSubmit, saving, serverErrors, submitLabel }) {
  // Copy only the fields the form uses (ignores id and createdAt).
  const [values, setValues] = useState({
    title: initialValues?.title ?? emptyValues.title,
    subject: initialValues?.subject ?? emptyValues.subject,
    description: initialValues?.description ?? emptyValues.description,
    dueDate: initialValues?.dueDate ?? emptyValues.dueDate,
    priority: initialValues?.priority ?? emptyValues.priority,
    status: initialValues?.status ?? emptyValues.status,
  });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const foundErrors = validate(values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return; // block invalid submit

    onSubmit({
      title: values.title.trim(),
      subject: values.subject.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate,
      priority: values.priority,
      status: values.status,
    });
  }

  // Show a field message from the browser check first, then from the server.
  const messageFor = (field) => errors[field] || (serverErrors && serverErrors[field]) || "";

  return (
    <form className="panel form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="title">Assignment Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          placeholder="e.g. Build REST API with Express"
          className={messageFor("title") ? "input-error" : ""}
        />
        {messageFor("title") && <p className="error-text">{messageFor("title")}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            id="subject"
            name="subject"
            type="text"
            list="subject-list"
            value={values.subject}
            onChange={handleChange}
            placeholder="Choose or type a subject"
            className={messageFor("subject") ? "input-error" : ""}
          />
          <datalist id="subject-list">
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject} />
            ))}
          </datalist>
          {messageFor("subject") && <p className="error-text">{messageFor("subject")}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date *</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={handleChange}
            className={messageFor("dueDate") ? "input-error" : ""}
          />
          {messageFor("dueDate") && <p className="error-text">{messageFor("dueDate")}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={values.priority} onChange={handleChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {messageFor("priority") && <p className="error-text">{messageFor("priority")}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={values.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          {messageFor("status") && <p className="error-text">{messageFor("status")}</p>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={values.description}
          onChange={handleChange}
          placeholder="Add notes or instructions (optional)"
          className={messageFor("description") ? "input-error" : ""}
        />
        {messageFor("description") && <p className="error-text">{messageFor("description")}</p>}
      </div>

      <div className="form-actions">
        <Link to="/assignments" className="btn btn-outline">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default AssignmentForm;
