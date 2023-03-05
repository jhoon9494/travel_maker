import axios from 'axios';

export const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  withCredentials: true,
});
