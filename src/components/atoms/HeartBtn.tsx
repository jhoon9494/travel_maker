import axios from 'axios';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';

type TravelTips = {
  placeName: string;
  tips: string;
};

type FiguresType = {
  recommend: number;
  emotion: number;
  revisit: number;
};

interface PostData {
  id: string;
  post_img: string[];
  recommendRoutes: TravelTips[] | [];
  title: string;
  content: string;
  hashTags: string[];
  figures: FiguresType;
  like: number;
}

interface IProps {
  like: number;
  setLike: Dispatch<SetStateAction<PostData>>;
}

function HeartBtn({ like, setLike }: IProps) {
  // TODO 내가 좋아요 누른 상태인지 체크하여 boolean 초기값 설정해주기
  const [heartStatus, setHeartStatus] = useState<boolean>(false);
  const { id } = useParams();

  const debounceLike = useMemo(() => {
    return debounce(async (status) => {
      setHeartStatus(status);
      if (status) {
        await axios.get(`http://localhost:8888/api/post/like?idx=${id}&like=${like + 1}`, { withCredentials: true });
        setLike((prev) => ({ ...prev, like: like + 1 }));
      } else {
        await axios.get(`http://localhost:8888/api/post/like?idx=${id}&like=${like - 1}`, { withCredentials: true });
        setLike((prev) => ({ ...prev, like: like - 1 }));
      }
    }, 100);
  }, [setHeartStatus, id, like, setLike]);

  return (
    <HeartContainer>
      {heartStatus ? (
        <ImgContainer src="/icons/color-heart.png" alt="heartImg" onClick={() => debounceLike(false)} />
      ) : (
        <ImgContainer src="/icons/empty-heart.png" alt="emptyHeartImg" onClick={() => debounceLike(true)} />
      )}
      <span>{like}</span>
    </HeartContainer>
  );
}

export default HeartBtn;

const HeartContainer = styled.div`
  height: 40px;
  display: flex;
  align-items: center;

  > span {
    margin-left: 10px;
    font-size: 20px;
  }
`;

const ImgContainer = styled.img`
  width: 40px;
  height: 100%;
`;
