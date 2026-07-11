import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';

const ROLE_LABEL = { 5150: 'ADMIN', 1984: 'EDITOR', 2001: 'USER' };

export default function Nav() {
  const { auth } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const loggedIn = Boolean(auth?.accessToken);
  const topRole = auth?.roles?.includes(5150) ? 5150
    : auth?.roles?.includes(1984) ? 1984
    : auth?.roles?.[0];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="topnav">
      <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
        employee-console<span className="cursor" />
      </Link>
      <nav>
        {loggedIn ? (
          <>
            <Link to="/employees">roster</Link>
            <span className="foot-note" style={{ margin: 0 }}>
              {auth.username} {topRole ? <span className={`badge ${topRole === 5150 ? 'amber' : ''}`}>{ROLE_LABEL[topRole]}</span> : null}
            </span>
            <button className="linklike" onClick={handleLogout}>logout</button>
          </>
        ) : (
          <>
            <Link to="/login">login</Link>
            <Link to="/register">register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
