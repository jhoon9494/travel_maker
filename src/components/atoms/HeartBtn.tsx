import axios from 'axios';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom';

interface IProps {
  heart: number;
  setStatus: Dispatch<SetStateAction<boolean | null>>;
}

function HeartBtn({ heart, setStatus }: IProps) {
  const [heartStatus, setHeartStatus] = useState<boolean>(false);
  const { id } = useParams();

  const getHeartStatus = useCallback(async () => {
    try {
      const res = await axios.get('/api/post/check/like', {
        params: {
          idx: id,
        },
      });
      if (res.data === 'OK') {
        setHeartStatus(false);
      }
    } catch (e: any) {
      // 이미 좋아요를 누른 게시글인 경우
      if (e.response.data.status === 403) {
        setHeartStatus(true);
      }
    }
  }, [id]);

  useEffect(() => {
    getHeartStatus();
  }, [getHeartStatus]);

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
