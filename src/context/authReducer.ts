export const initState = {
  id: sessionStorage.getItem('id') || '',
};

export const reducer = (state: { id: string }, action: { type: string; payload?: string }) => {
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
