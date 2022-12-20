import { useState } from 'react';
import styled from 'styled-components';
import { LeftBtn, RightBtn } from '../atoms/ArrowBtn';
import ImgIndicator from '../atoms/ImgIndicator';

interface IProps {
  img: string[];
}

function ImgSlider({ img }: IProps) {
  // 이미지를 좌우로 이동시키기 위한 state
  const [dist, setDist] = useState<number>(0);
  const [imgIndex, setImgIndex] = useState<number>(0);

  const handleLeftClick = () => {
    // 이미지 슬라이더 이동거리 관련 set함수
    setDist((currDist) => {
      if (currDist + 550 > 0) {
        return currDist;
      }
      return currDist + 550;
    });
    // 선택된 이미지 인덱스 관련 set함수
    setImgIndex((currIndex) => {
      if (currIndex - 1 < 0) {
        return currIndex;
      }
      return currIndex - 1;
    });
  };

  const handleRightClick = () => {
    // 이미지 슬라이더 이동거리 관련 set함수
    setDist((currDist) => {
      if (currDist - 550 <= -img.length * 550) {
        return currDist;
      }
      return currDist - 550;
    });
    // 선택된 이미지 인덱스 관련 set함수
    setImgIndex((currIndex) => {
      if (currIndex + 1 > img.length - 1) {
        return currIndex;
      }
      return currIndex + 1;
    });
  };

  return (
    <ImgViewer>
      {imgIndex !== 0 && <LeftBtn onClick={handleLeftClick} />}
      <ImgContainer length={img.length} dist={dist}>
        {img.map((image, index) => {
          return <Img src={image} alt={`${index + 1}번째 그림`} key={`${image.slice(0, 5)}-${index + 1}-key`} />;
        })}
      </ImgContainer>
      {imgIndex !== img.length - 1 && <RightBtn onClick={handleRightClick} />}
      <ImgIndicator count={img.length} selectedIndex={imgIndex} />
    </ImgViewer>
  );
}

export default ImgSlider;

const ImgViewer = styled.div`
  width: 550px;
  height: 390px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
`;

const ImgContainer = styled.div<{ length: number; dist: number }>`
  width: ${({ length }) => length * 550}px;
  height: 390px;
  display: flex;
  margin-left: ${({ dist }) => dist}px;
  transition: all 0.3s ease;
`;

const Img = styled.img`
  min-width: 550px;
  height: 390px;
`;
