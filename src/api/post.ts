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
