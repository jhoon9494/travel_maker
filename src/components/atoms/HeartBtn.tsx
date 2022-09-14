import { useState } from 'react';
import styled from 'styled-components';

interface IProps {
  heartNum: number;
}

function HeartBtn({ heartNum }: IProps) {
  const [heartStatus, setHeartStatus] = useState<boolean>(false);

  const handleClick = () => {
    // TODO 좋아요 관련 api 요청 후 좋아요수 상태 반영
    setHeartStatus((curr) => !curr);
  };
  return (
    <HeartContainer>
      {heartStatus ? (
        <ImgContainer src="/icons/color-heart.png" alt="heartImg" onClick={handleClick} />
      ) : (
        <ImgContainer src="/icons/empty-heart.png" alt="emptyHeartImg" onClick={handleClick} />
      )}
      <span>{heartNum}</span>
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
