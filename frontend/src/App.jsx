import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/tasks"
      );

      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        { title }
      );

      setTasks((prev) => [
        ...prev,
        response.data,
      ]);

      setTitle("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to add task");
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
        />

        <button type="submit">
          Add Task
        </button>
      </form>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">
            No tasks yet. Add your first task.
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="task-card"
            >
              {task.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;