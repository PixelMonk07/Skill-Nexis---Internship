import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ImageUpload from "../components/ImageUpload";

const emptyForm = { title: "", description: "", priority: "Medium", dueDate: "" };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    setLoading(true);
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    api.get("/tasks")
      .then((response) => {
        if (active) setTasks(response.data.tasks);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Unable to load tasks.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function startEdit(task) {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ""
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveTask(event) {
    event.preventDefault();
    setError("");
    const payload = {
      ...form,
      dueDate: form.dueDate || null
    };
    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, payload);
      } else {
        await api.post("/tasks", payload);
      }
      cancelEdit();
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save task.");
    }
  }

  async function toggleTask(task) {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task.");
    }
  }

  async function deleteTask(taskId) {
    try {
      await api.delete(`/tasks/${taskId}`);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task.");
    }
  }

  const completed = tasks.filter((task) => task.completed).length;

  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="app-brand"><div className="brand-mark small">T</div><span>Todo</span></div>
        <div className="user-area">
          <div className="avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</div>
          <span>{user?.name}</span>
          <button className="text-button" type="button" onClick={logout}>Log out</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="task-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">My tasks</p>
              <h1>Good day, {user?.name?.split(" ")[0] || "friend"}.</h1>
            </div>
            <div className="task-count"><strong>{completed}</strong><span>of {tasks.length} done</span></div>
          </div>

          {error && <div className="alert error" role="alert">{error}</div>}

          <form className="task-form" onSubmit={saveTask}>
            <input aria-label="Task title" value={form.title} required
              onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" />
            <textarea aria-label="Task description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add a note (optional)" />
            <div className="form-row">
              <select aria-label="Priority" value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
              <input aria-label="Due date" type="date" value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              <button className="primary-button" type="submit">{editingId ? "Save changes" : "Add task"}</button>
              {editingId && <button className="secondary-button" type="button" onClick={cancelEdit}>Cancel</button>}
            </div>
          </form>

          <h1>My Dashboard</h1>

          <ImageUpload />

          <div className="task-list" aria-live="polite">
            {loading ? <p className="empty-state">Loading tasks...</p> :
              tasks.length === 0 ? <p className="empty-state">No tasks yet. Add your first task above.</p> :
              tasks.map((task) => (
                <article className={`task-card ${task.completed ? "completed" : ""}`} key={task._id}>
                  <button className="check-button" type="button" aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                    onClick={() => toggleTask(task)}>{task.completed ? "✓" : ""}</button>
                  <div className="task-copy">
                    <h2>{task.title}</h2>
                    {task.description && <p>{task.description}</p>}
                    <div className="task-meta">
                      <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                      {task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button type="button" onClick={() => startEdit(task)}>Edit</button>
                    <button type="button" className="delete" onClick={() => deleteTask(task._id)}>Delete</button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}