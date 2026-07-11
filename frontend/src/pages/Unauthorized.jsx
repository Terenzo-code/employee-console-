import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="panel">
      <h1>401 — not authorized</h1>
      <p className="subtitle">your account doesn't have the role this page requires.</p>
      <Link to="/employees">back to roster</Link>
    </div>
  );
}
