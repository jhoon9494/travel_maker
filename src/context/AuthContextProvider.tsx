import { ReactNode, createContext, Dispatch, useReducer, useMemo } from 'react';
import { initState, reducer } from './authReducer';

export const userContext = createContext<{
  state: { id: string };
  dispatch: Dispatch<{ type: string; payload?: string }>;
} | null>(null);

function ContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const value = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export default ContextProvider;
