import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const { auth } = useAuth();
  const loggedIn = Boolean(auth?.accessToken);
  return (
    <div className="panel">
      <h1>employee console</h1>
      <p className="subtitle">
        A small internal tool for managing the employee roster, backed by
        the Node/Express/MongoDB API in this repo.
      </p>
      {loggedIn ? (
        <p className="foot-note">
          signed in as {auth.username}. <Link to="/employees">open the roster →</Link>
        </p>
      ) : (
        <p className="foot-note">
          <Link to="/login">log in</Link> or <Link to="/register">create an account</Link> to continue.
        </p>
      )}
    </div>
  );
}
