
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const storageKey = `tasks_${user.id}`;

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Load tasks from LocalStorage
  const [tasks, setTasks] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Save tasks whenever they change
  useEffect(() => {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}, [tasks, storageKey]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) return;

    if (editingId) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? { ...task, title, description, priority }
            : task
        )
      );
      setEditingId(null);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setTasks((previous) => [...previous, newTask]);
    }

    setTitle("");
    setDescription("");
    setPriority("Medium");
  }

  function editTask(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
  }

  function deleteTask(id) {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  // Search and filter
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Pending" && !task.completed) ||
        (filter === "Completed" && task.completed) ||
        (filter === task.priority);

      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPriority("Medium");
  }

  return (
    <div className="dashboard">
      <header className="navbar">
        <h2>Task Manager</h2>

        <div>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main>
        <h1>My Tasks</h1>

        <section className="stats">
          <p>Total Tasks: {tasks.length}</p>
          <p>Completed: {completedCount}</p>
          <p>Pending: {tasks.length - completedCount}</p>
        </section>

        <section className="task-form">
          <h2>{editingId ? "Edit Task" : "Add New Task"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button type="submit">
              {editingId ? "Save Changes" : "Add Task"}
            </button>

            {editingId && (
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="task-controls">
          <input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </section>

        <section className="task-list">
          {filteredTasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            filteredTasks.map((task) => (
              <article className="task-card" key={task.id}>
                <div>
                  <h3
                    style={{
                      textDecoration: task.completed
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {task.title}
                  </h3>

                  <p>{task.description}</p>
                  <p>Priority: {task.priority}</p>
                  <p>
                    Status: {task.completed ? "Completed" : "Pending"}
                  </p>
                </div>

                <div className="task-actions">
                  <button onClick={() => toggleTask(task.id)}>
                    {task.completed ? "Undo" : "Complete"}
                  </button>

                  <button onClick={() => editTask(task)}>
                    Edit
                  </button>

                  <button onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
