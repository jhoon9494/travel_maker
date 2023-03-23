import { useEffect } from 'react';
import { IPostData } from 'interface/post';
import { useNavigate } from 'react-router-dom';

const useNavi = (postList: IPostData[], storage: Storage) => {
  const navigate = useNavigate();

  const onMovePage = (pathName: string) => {
    storage.setItem('mainPageScrollY', String(window.scrollY));
    storage.setItem('postList', JSON.stringify(postList));
    navigate(pathName);
  };

  const savedPostList = storage.getItem('postList');
  const savedScrollY = storage.getItem('mainPageScrollY');

  useEffect(() => {
    if (savedPostList) {
      setTimeout(() => {
        window.scrollTo({ top: Number(savedScrollY) });
        storage.removeItem('mainPageScrollY');
        storage.removeItem('postList');
      }, 0);
    }
  }, [savedPostList, savedScrollY, storage]);

  return { onMovePage, savedPostList };
};

export default useNavi;
