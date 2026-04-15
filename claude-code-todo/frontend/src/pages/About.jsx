import React from 'react';

export default function About() {
  return (
    <div className="page about-page">
      <h1>About TodoApp</h1>
      <p>
        TodoApp is a full-stack task management application built with React, Node.js, Express,
        and MongoDB.
      </p>
      <h2>Features</h2>
      <ul>
        <li>Secure user registration and login</li>
        <li>Personal todo lists per user</li>
        <li>Create, edit, complete, and delete tasks</li>
        <li>Session persistence across page reloads</li>
      </ul>
      <h2>Tech Stack</h2>
      <ul>
        <li><strong>Frontend:</strong> React + Vite</li>
        <li><strong>Backend:</strong> Node.js + Express</li>
        <li><strong>Database:</strong> MongoDB (Mongoose)</li>
        <li><strong>Auth:</strong> JWT + bcrypt</li>
      </ul>
    </div>
  );
}
