import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRefreshToken from '../hooks/useRefreshToken';

// On a hard refresh the accessToken in memory is gone, but the httpOnly
// refresh cookie might still be valid. This tries a silent /refresh once
// before deciding the user is logged out.
export default function PersistLogin() {
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    auth?.accessToken ? setLoading(false) : verify();

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="content">
        <span className="loading">checking session</span>
      </div>
    );
  }

  return <Outlet />;
}
