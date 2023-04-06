export const initState = {
  id: sessionStorage.getItem('id') || '',
};
interface State {
  id: string;
}

type Action = { type: 'signIn'; payload: string } | { type: 'signOut' };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'signIn': {
      sessionStorage.setItem('id', action.payload);
      return { ...state, id: action.payload };
    }

    case 'signOut': {
      sessionStorage.removeItem('id');
      return { ...state, id: '' };
    }

    default:
      return state;
  }
};
