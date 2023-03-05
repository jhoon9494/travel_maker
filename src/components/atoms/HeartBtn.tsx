import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { getHeart, like, unlike } from 'api/post';
import { IHeartBtn } from '../../interface/atoms.d';

function HeartBtn({ heart, getData }: IHeartBtn) {
  const [heartStatus, setHeartStatus] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { id } = useParams();

  const getHeartStatus = useCallback(async () => {
    try {
      await getHeart(id as string);
      setHeartStatus(false);
    } catch (e: any) {
      // 이미 좋아요를 누른 게시글인 경우
      if (e.response.data.status === 403) {
        setHeartStatus(true);
      }
    }
  }, [id]);

  const handlelike = useCallback(async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        if (heartStatus) {
          await unlike(id as string);
          setHeartStatus(false);
        } else {
          await like(id as string);
          setHeartStatus(true);
        }
        getData();
      } catch (e: any) {
        console.error(e);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [id, getData, isProcessing, heartStatus]);

  useEffect(() => {
    getHeartStatus();
  }, [getHeartStatus]);

  return (
    <HeartContainer>
      <ImgContainer
        src={heartStatus ? '/icons/color-heart.png' : '/icons/empty-heart.png'}
        alt={heartStatus ? 'heartImg' : 'emptyHeartImg'}
        onClick={handlelike}
      />
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
