import { Link } from 'react-router-dom';

export default function Missing() {
  return (
    <div className="panel">
      <h1>404 — not found</h1>
      <p className="subtitle">that route doesn't exist.</p>
      <Link to="/">back home</Link>
    </div>
  );
}
