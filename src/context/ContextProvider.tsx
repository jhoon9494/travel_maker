import { ReactNode, createContext, Dispatch, useReducer, useMemo } from 'react';

export const userContext = createContext<{
  state: { id: string };
  dispatch: Dispatch<{ type: string; payload?: string }>;
} | null>(null);

const initState = {
  id: sessionStorage.getItem('id') || '',
};

const reducer = (state: { id: string }, action: { type: string; payload?: string }) => {
  switch (action.type) {
    case 'signIn':
      if (action.payload) sessionStorage.setItem('id', action.payload);
      return { ...state, id: action.payload ? action.payload : '' };

    case 'signOut':
      sessionStorage.removeItem('id');
      return { ...state, id: '' };

    default:
      return state;
  }
};

function ContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const value = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export default ContextProvider;
