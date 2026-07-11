import axios from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import useAuth from './useAuth';

// Calls GET /refresh, which reads the httpOnly "jwt" cookie set at login
// and, if it's still valid, hands back a fresh short-lived access token.
const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/refresh', { withCredentials: true });
    const accessToken = response.data.accessToken;
    const decoded = jwtDecode(accessToken);

    setAuth({
      accessToken,
      username: decoded?.UserInfo?.username,
      roles: decoded?.UserInfo?.roles || [],
    });

    return accessToken;
  };

  return refresh;
};

export default useRefreshToken;
