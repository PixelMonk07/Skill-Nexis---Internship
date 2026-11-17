import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import Form from "./components/Form";

import "./App.css";

function App() {

  // Initial developer data
  const [developers, setDevelopers] = useState([
    {
      id: 1,
      name: "Niloy",
      role: "Full Stack Developer",
      description: "Learning React and building real-world projects."
    },
    {
      id: 2,
      name: "Rahul",
      role: "Backend Developer",
      description: "Working with Node.js and databases."
    },
    {
      id: 3,
      name: "Priya",
      role: "UI Designer",
      description: "Designing attractive user interfaces."
    }
  ]);

  // Add a new developer
  function addDeveloper(newDeveloper) {

    const developer = {
      ...newDeveloper,
      id: Date.now()
    };

    setDevelopers((previousDevelopers) => [
      ...previousDevelopers,
      developer
    ]);
  }

  return (
    <div className="app">

      {/* Header Component */}
      <Header
        title="DevCard Dashboard"
        subtitle="A collection of developers"
      />

      <main className="container">

        {/* Form Component */}
        <Form onAdd={addDeveloper} />

        {/* Dynamic Card Rendering */}
        <h2 className="section-title">
          Developer Profiles
        </h2>

        <div className="card-container">

          {developers.map((developer) => (
            <Card
              key={developer.id}
              name={developer.name}
              role={developer.role}
              description={developer.description}
            />
          ))}

        </div>

      </main>

      {/* Footer Component */}
      <Footer
        year={2026}
        author="Niloy Pal"
      />

    </div>
  );
}

export default App;