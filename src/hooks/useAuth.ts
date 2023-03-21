import { useContext } from 'react';
import { userContext } from '../context/AuthContextProvider';

const useAuth = () => {
  const value = useContext(userContext);

  if (!value?.state) throw new Error('Cannot find userContextProvider');
  if (!value?.dispatch) throw new Error('Cannot find userContextProvider');
  return { state: value.state, dispatch: value.dispatch };
};

export default useAuth;
