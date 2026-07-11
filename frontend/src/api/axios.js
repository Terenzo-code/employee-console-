import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';

// Plain instance: used for endpoints that don't need an existing access token
// (register, login, refresh). withCredentials lets the httpOnly refresh
// cookie travel with the request.
export default axios.create({
  baseURL: BASE_URL,
});

// Private instance: used for anything behind verifyJWT (the /employees API).
// A Bearer token is attached per-request by the useAxiosPrivate hook.
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
