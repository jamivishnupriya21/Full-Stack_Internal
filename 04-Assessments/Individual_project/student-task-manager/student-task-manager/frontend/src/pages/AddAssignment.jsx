import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AssignmentForm from "../components/AssignmentForm";
import { getAssignment } from "../services/api";

const defaultSubjects = [
  "Full Stack Development",
  "DBMS",
  "Python",
  "Operating Systems",
  "Computer Networks",
  "Machine Learning",
];

// One page for both "add" (/add) and "edit" (/edit/:id).
function AddAssignment({ assignments, onSave }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  // In edit mode, fetch that one assignment from the backend.
  useEffect(() => {
    if (!isEdit) {
      setExisting(null);
      setLoading(false);
      setLoadError("");
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    getAssignment(id)
      .then((data) => {
        if (!cancelled) {
          setExisting(data);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const subjectOptions = [...new Set([...defaultSubjects, ...assignments.map((a) => a.subject)])].sort();

  async function handleSubmit(values) {
    setSaving(true);
    setServerErrors({});
    try {
      await onSave(values, isEdit ? id : null);
      navigate("/assignments");
    } catch (error) {
      setServerErrors(error.fieldErrors || {});
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="center-state">
        <div className="spinner"></div>
        <p>Loading assignment...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="center-state error-box">
        <div className="empty-icon">⚠️</div>
        <h3>Could not open this assignment</h3>
        <p>{loadError}</p>
        <Link to="/assignments" className="btn btn-primary">
          Back to assignments
        </Link>
      </div>
    );
  }

  return (
    <div className="form-page">
      <AssignmentForm
        key={id || "new"}
        initialValues={existing}
        subjectOptions={subjectOptions}
        onSubmit={handleSubmit}
        saving={saving}
        serverErrors={serverErrors}
        submitLabel={isEdit ? "Save Changes" : "Add Assignment"}
      />
    </div>
  );
}

export default AddAssignment;
