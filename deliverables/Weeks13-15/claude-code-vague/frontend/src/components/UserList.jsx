export default function UserList({ users }) {
  if (users.length === 0) {
    return <p className="empty-state">No users found.</p>;
  }

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Role</th>
          <th>Registered</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.username}</td>
            <td>
              <span className={`role-badge role-${u.role}`}>{u.role}</span>
            </td>
            <td>{new Date(u.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
