import axios from 'axios';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom';

interface IProps {
  heart: number;
  setStatus: Dispatch<SetStateAction<boolean | null>>;
}

function HeartBtn({ heart, setStatus }: IProps) {
  // TODO 내가 좋아요 누른 상태인지 체크하여 boolean 초기값 설정해주기
  const [heartStatus, setHeartStatus] = useState<boolean>(false);
  const { id } = useParams();

  const handlelike = useCallback(async () => {
    try {
      const res = await axios.get('/api/post/unlike', {
        params: {
          idx: id,
        },
      });
      if (res.data === 'OK') {
        setStatus(false);
      }
    } catch (e: any) {
      console.log(e);
    }
    setHeartStatus(false);
  }, [id, setStatus]);

  const handleUnlike = useCallback(async () => {
    try {
      const res = await axios.get('/api/post/like', {
        params: {
          idx: id,
        },
      });
      if (res.data === 'OK') {
        setStatus(true);
      }
    } catch (e: any) {
      console.log(e.response.data.message);
    }
    setHeartStatus(true);
  }, [id, setStatus]);

  const debounceLike = debounce(handlelike, 100);
  const debounceUnlike = debounce(handleUnlike, 100);

  return (
    <HeartContainer>
      {heartStatus ? (
        <ImgContainer src="/icons/color-heart.png" alt="heartImg" onClick={debounceLike} />
      ) : (
        <ImgContainer src="/icons/empty-heart.png" alt="emptyHeartImg" onClick={debounceUnlike} />
      )}
      <span>{heart}</span>
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
