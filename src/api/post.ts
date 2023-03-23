import { API } from 'api';
import { AxiosResponse } from 'axios';
import { IPostData } from 'interface/post';

export const getAllPost = async (pageCount: number): Promise<AxiosResponse<IPostData[], any>> => {
  return await API({
    method: 'get',
    url: '/api/post/list',
    params: {
      page: pageCount,
    },
  });
};

export const getPost = async (id: string): Promise<AxiosResponse<IPostData, any>> => {
  return await API({
    method: 'get',
    url: `/api/post/detail/${id}`,
  });
};

export const getHeart = async (id: string) => {
  return await API({
    method: 'get',
    url: '/api/post/check/like',
    params: {
      idx: id,
    },
  });
};

export const unlike = async (id: string) => {
  return await API({
    method: 'get',
    url: '/api/post/unlike',
    params: {
      idx: id,
    },
  });
};

export const like = async (id: string) => {
  return await API({
    method: 'get',
    url: '/api/post/like',
    params: {
      idx: id,
    },
  });
};
