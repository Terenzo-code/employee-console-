import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

const ROLES = { ADMIN: 5150, EDITOR: 1984, USER: 2001 };

export default function Employees() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newFirst, setNewFirst] = useState('');
  const [newLast, setNewLast] = useState('');
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast] = useState('');

  const canWrite = auth?.roles?.some((r) => [ROLES.ADMIN, ROLES.EDITOR].includes(r));
  const canDelete = auth?.roles?.includes(ROLES.ADMIN);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axiosPrivate.get('/employees');
        if (!mounted) return;
        setEmployees(res.status === 204 ? [] : res.data);
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setError('Could not load the roster. Check that the backend and database are running.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newFirst || !newLast) return;
    setAdding(true);
    setError('');
    try {
      const res = await axiosPrivate.post('/employees', { firstname: newFirst, lastname: newLast });
      setEmployees((prev) => [...prev, res.data]);
      setNewFirst('');
      setNewLast('');
    } catch (err) {
      console.error(err);
      setError('Could not add that employee.');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (emp) => {
    setEditingId(emp._id);
    setEditFirst(emp.firstname);
    setEditLast(emp.lastname);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id) => {
    try {
      const res = await axiosPrivate.put('/employees', { id, firstname: editFirst, lastname: editLast });
      setEmployees((prev) => prev.map((emp) => (emp._id === id ? res.data : emp)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError('Could not save that change.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete('/employees', { data: { id } });
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error(err);
      setError('Could not delete that employee.');
    }
  };

  return (
    <div className="panel wide">
      <h1>roster</h1>
      <p className="subtitle">
        {canDelete ? 'admin access — full control' : canWrite ? 'editor access — can add and update' : 'read-only access'}
      </p>

      {error && <div className="errline">{error}</div>}

      {canWrite && (
        <form className="toolbar" onSubmit={handleAdd}>
          <div className="field">
            <label htmlFor="newFirst">first name</label>
            <input id="newFirst" type="text" value={newFirst} onChange={(e) => setNewFirst(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="newLast">last name</label>
            <input id="newLast" type="text" value={newLast} onChange={(e) => setNewLast(e.target.value)} />
          </div>
          <button className="primary" style={{ marginTop: 0, width: 'auto', padding: '10px 16px' }} type="submit" disabled={adding}>
            {adding ? 'adding…' : 'add employee'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="loading">loading roster</p>
      ) : employees.length === 0 ? (
        <div className="empty-state">
          <div className="glyph">∅</div>
          <div>no employees yet{canWrite ? ' — add the first one above' : ''}.</div>
        </div>
      ) : (
        <table className="roster">
          <thead>
            <tr>
              <th>first name</th>
              <th>last name</th>
              {(canWrite || canDelete) && <th style={{ width: 160 }}>actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                {editingId === emp._id ? (
                  <>
                    <td><input type="text" value={editFirst} onChange={(e) => setEditFirst(e.target.value)} /></td>
                    <td><input type="text" value={editLast} onChange={(e) => setEditLast(e.target.value)} /></td>
                    <td className="row-actions">
                      <button className="ghost" onClick={() => saveEdit(emp._id)}>save</button>
                      <button className="ghost" onClick={cancelEdit}>cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{emp.firstname}</td>
                    <td>{emp.lastname}</td>
                    {(canWrite || canDelete) && (
                      <td className="row-actions">
                        {canWrite && <button className="ghost" onClick={() => startEdit(emp)}>edit</button>}
                        {canDelete && <button className="danger" onClick={() => handleDelete(emp._id)}>delete</button>}
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
