import { useContext } from 'react';
import { userContext } from '../context/ContextProvider';

const useGetUser = () => {
  const value = useContext(userContext);

  if (!value?.state) throw new Error('Cannot find userContextProvider');
  if (!value?.dispatch) throw new Error('Cannot find userContextProvider');
  return { state: value.state, dispatch: value.dispatch };
};

export default useGetUser;
