import axios from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
  const { setAuth } = useAuth();

  return async () => {
    setAuth({});
    try {
      await axios.get('/logout', { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
  };
};

export default useLogout;
