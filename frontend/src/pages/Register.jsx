import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOk('');
    if (!user || !pwd) {
      setError('Username and password are required.');
      return;
    }
    setBusy(true);
    try {
      await axios.post('/register', JSON.stringify({ user, pwd }), {
        headers: { 'Content-Type': 'application/json' },
      });
      setOk('Account created. Redirecting to login...');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      if (!err?.response) setError('No response from server — is the backend running?');
      else if (err.response.status === 409) setError('That username is already taken.');
      else if (err.response.status === 400) setError('Username and password are required.');
      else setError('Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel">
      <h1>create account</h1>
      <p className="subtitle">register a new user on the employee console</p>
      {error && <div className="errline">{error}</div>}
      {ok && <div className="okline">{ok}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="user">username</label>
        <input id="user" type="text" autoComplete="off" value={user}
          onChange={(e) => setUser(e.target.value)} required />

        <label htmlFor="pwd">password</label>
        <input id="pwd" type="password" value={pwd}
          onChange={(e) => setPwd(e.target.value)} required />

        <button className="primary" type="submit" disabled={busy}>
          {busy ? 'creating…' : 'create account'}
        </button>
      </form>
      <p className="foot-note">already have an account? <Link to="/login">log in</Link></p>
    </div>
  );
}
