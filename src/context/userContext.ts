import { createContext } from 'react';

const userContext = createContext({
  id: localStorage.getItem('id'),
  setLoggedIn: (data: string) => {},
});

export default userContext;
