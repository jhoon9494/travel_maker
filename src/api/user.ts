import { AxiosResponse } from 'axios';
import { IPostImg } from 'interface/post';
import { API } from './index';
import { IRegister } from '../interface/auth.d';

export const getUserData = async (userId?: string) => {
  let postData: IPostImg[] = [];
  const userData = {
    isFind: false,
    isFollow: false,
    userImage: '',
    follower: 0,
    following: 0,
  };

  const res = await Promise.allSettled([
    API.get(`/api/post/user/list/${userId}`),
    getProfileData(userId),
    API.get(`/api/follow/check/${userId}`),
  ]);
  res.forEach((resData, index) => {
    // 게시글 정보
    if (index === 0) {
      if (resData.status === 'fulfilled') {
        resData.value.data.forEach((data: { idx: string; postImg: string }) => {
          postData.push({
            idx: data.idx,
            postImg: data.postImg.split(',').filter((src) => src.length !== 0)[0],
          });
        });
      } else if (resData.reason.response.status === 500) {
        postData = [];
      }
    }
    // 유저 정보
    if (index === 1) {
      if (resData.status === 'fulfilled') {
        userData.isFind = true;
        userData.userImage = resData.value.data.profileImg;
        userData.follower = resData.value.data.follower;
        userData.following = resData.value.data.following;
      } else if (resData.reason.response.status === 404) {
        userData.isFind = false;
      }
    }
    // 팔로우 상황
    if (index === 2) {
      if (resData.status === 'fulfilled') {
        userData.isFollow = false;
      } else if (resData.reason.response.status === 403) {
        userData.isFollow = true;
      }
    }
  });

  return { postData, userData };
};

export const getProfileData = async (userId?: string): Promise<AxiosResponse<IRegister, any>> => {
  return await API({
    method: 'get',
    url: `/api/info/${userId}`,
  });
};

export const editProfile = async (formData: FormData) => {
  return await API({
    method: 'post',
    url: '/api/user',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteUser = async (password: string) => {
  return await API({
    method: 'post',
    url: '/api/sign-out',
    data: { password },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const changePassword = async (currPw: string, newPw: string) => {
  return await API({
    method: 'post',
    url: '/api/user/pass',
    data: { nowPassword: currPw, newPassword: newPw },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
