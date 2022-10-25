import { ReactNode, useState } from 'react';
import userContext from './userContext';

type ContextProviderProps = {
  children: ReactNode;
};

function ContextProvider({ children }: ContextProviderProps) {
  const setLoggedIn = (data: string) => {
    setUser((prevState) => ({ ...prevState, id: data }));
  };

  const initUserData = {
    id: localStorage.getItem('id'),
    setLoggedIn,
  };

  const [user, setUser] = useState(initUserData);
  return <userContext.Provider value={user}>{children}</userContext.Provider>;
}

export default ContextProvider;
