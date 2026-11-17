import { useState } from "react";
import Button from "./Button";

function Form({ onAdd }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name || !role || !description) {
      alert("Please fill in all fields!");
      return;
    }

    onAdd({
      name,
      role,
      description
    });

    setName("");
    setRole("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit} className="form">

      <h2>Add a Developer</h2>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <textarea
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button text="Add Developer" type="submit" />

    </form>
  );
}

export default Form;