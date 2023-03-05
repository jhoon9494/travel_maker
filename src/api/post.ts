import { API } from 'api';

export const getAllPost = async (pageCount: number) => {
  return await API({
    method: 'get',
    url: '/api/post/list',
    params: {
      page: pageCount,
    },
  });
};

export const getPost = async (id: string) => {
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
