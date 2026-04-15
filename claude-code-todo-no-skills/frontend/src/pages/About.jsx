export default function About() {
  const containerStyle = {
    maxWidth: '600px',
    margin: '60px auto',
    padding: '0 24px',
    color: '#1e293b',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>About TodoApp</h1>
      <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '16px' }}>
        TodoApp is a full-stack task management application built with React and Node.js. It
        provides secure user authentication and persistent task storage so you can manage your
        todos from anywhere.
      </p>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Tech Stack</h2>
      <ul style={{ color: '#475569', lineHeight: '2' }}>
        <li>Frontend: React 18 + Vite</li>
        <li>Backend: Node.js + Express</li>
        <li>Database: MongoDB + Mongoose</li>
        <li>Auth: JWT (JSON Web Tokens) + bcrypt</li>
      </ul>
      <h2 style={{ fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>Features</h2>
      <ul style={{ color: '#475569', lineHeight: '2' }}>
        <li>Secure registration and login</li>
        <li>Session persistence across page reloads</li>
        <li>Create, read, update, and delete todos</li>
        <li>Toggle task completion</li>
        <li>Per-user data isolation</li>
      </ul>
    </div>
  );
}
