import { ReactNode, useContext, useState, useMemo } from 'react';
import userContext from './userContext';

type ContextProviderProps = {
  children: ReactNode;
};

function ContextProvider({ children }: ContextProviderProps) {
  const { id } = useContext(userContext);
  const [user, setUser] = useState(id);

  const loggedUser = useMemo(() => {
    return { id: user, setLoggedIn: setUser };
  }, [user]);

  return <userContext.Provider value={loggedUser}>{children}</userContext.Provider>;
}

export default ContextProvider;
