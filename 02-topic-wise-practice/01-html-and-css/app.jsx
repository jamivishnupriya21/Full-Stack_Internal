import { useState, useEffect } from "react";

function App() {
  const [form, setForm] = useState({
    code: "",
    course: "",
    student: ""
  });

  const [registrations, setRegistrations] = useState([]);

  const loadRegistrations = () => {
    fetch("http://localhost:5000/register")
      .then(res => res.json())
      .then(data => setRegistrations(data));
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const register = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(() => {
        setForm({
          code: "",
          course: "",
          student: ""
        });
        loadRegistrations();
      });
  };

  return (
    <div>
      <h1>Course Registration</h1>

      <form onSubmit={register}>
        <input
          placeholder="Course Code"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
        />

        <input
          placeholder="Course Name"
          value={form.course}
          onChange={(e) =>
            setForm({ ...form, course: e.target.value })
          }
        />

        <input
          placeholder="Student Name"
          value={form.student}
          onChange={(e) =>
            setForm({ ...form, student: e.target.value })
          }
        />

        <button type="submit">Register</button>
      </form>

      <h2>Registered Courses</h2>

      {registrations.map((r, i) => (
        <p key={i}>
          {r.code} - {r.course} - {r.student}
        </p>
      ))}
    </div>
  );
}

export default App;