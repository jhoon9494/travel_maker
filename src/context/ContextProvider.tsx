import { ReactNode, useState, createContext, Dispatch, SetStateAction, useMemo } from 'react';

export const userContext = createContext<{
  id: string | null;
  setId: Dispatch<SetStateAction<string | null>> | null;
}>({
  id: null,
  setId: null,
});

type ContextProviderProps = {
  children: ReactNode;
};

function ContextProvider({ children }: ContextProviderProps) {
  const [id, setId] = useState(localStorage.getItem('id'));

  const loggedUser = useMemo(() => {
    return { id, setId };
  }, [id]);

  return <userContext.Provider value={loggedUser}>{children}</userContext.Provider>;
}

export default ContextProvider;
