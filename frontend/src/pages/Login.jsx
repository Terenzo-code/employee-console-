import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/employees';

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await axios.post('/auth', JSON.stringify({ user, pwd }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const accessToken = response.data.accessToken;
      const decoded = jwtDecode(accessToken);
      setAuth({
        accessToken,
        username: decoded?.UserInfo?.username,
        roles: decoded?.UserInfo?.roles || [],
      });
      setUser('');
      setPwd('');
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) setError('No response from server — is the backend running?');
      else if (err.response.status === 400) setError('Username and password are required.');
      else if (err.response.status === 401) setError('Incorrect username or password.');
      else setError('Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel">
      <h1>log in</h1>
      <p className="subtitle">authenticate to reach the employee roster</p>
      {error && <div className="errline">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="user">username</label>
        <input id="user" type="text" autoComplete="off" value={user}
          onChange={(e) => setUser(e.target.value)} required />

        <label htmlFor="pwd">password</label>
        <input id="pwd" type="password" value={pwd}
          onChange={(e) => setPwd(e.target.value)} required />

        <button className="primary" type="submit" disabled={busy}>
          {busy ? 'signing in…' : 'log in'}
        </button>
      </form>
      <p className="foot-note">need an account? <Link to="/register">register</Link></p>
    </div>
  );
}
