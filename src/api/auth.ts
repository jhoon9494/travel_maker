import { API } from 'api';
import { ILogin, IRegister } from '../interface/auth.d';

export const login = async (data: ILogin) => {
  return await API({
    method: 'post',
    url: '/api/login',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const register = async (data: IRegister) => {
  return await API({
    method: 'post',
    url: '/api/register',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const idCheck = async (id: string) => {
  return await API({
    method: 'get',
    url: '/api/check',
    params: { id },
  });
};
