import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

export default function TodoApp() {
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text, done: false }]);
    setText("");
  };

  const toggle = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>
        {todos.map((t) => (
          <li key={t.id} onClick={() => toggle(t.id)}
              style={{ textDecoration: t.done ? "line-through" : "none" }}>
            {t.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
