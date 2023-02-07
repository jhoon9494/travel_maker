import { createContext } from 'react';

const userContext = createContext({
  id: localStorage.getItem('id'),
  // eslint-disable-next-line
  setLoggedIn: (data: string) => {},
});

export default userContext;
