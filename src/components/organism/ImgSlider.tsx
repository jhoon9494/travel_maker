import { IMAGE_PREFIX } from 'constant/prefix';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { LeftBtn, RightBtn } from '../atoms/ArrowBtn';
import ImgIndicator from '../atoms/ImgIndicator';

function ImgSlider({ img }: { img: string[] }) {
  // 이미지를 좌우로 이동시키기 위한 state
  const [dist, setDist] = useState<number>(0);
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [imageWidth, SetImageWidth] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleLeftClick = () => {
    // 이미지 슬라이더 이동거리 관련 set함수
    setDist((currDist) => {
      if (currDist + imageWidth > 0) {
        return currDist;
      }

      return currDist + imageWidth;
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
      if (currDist - imageWidth <= -img.length * imageWidth) {
        return currDist;
      }

      return currDist - imageWidth;
    });
    // 선택된 이미지 인덱스 관련 set함수
    setImgIndex((currIndex) => {
      if (currIndex + 1 > img.length - 1) {
        return currIndex;
      }
      return currIndex + 1;
    });
  };

  const getImageWidth = debounce(() => {
    if (imgRef.current?.offsetWidth) {
      SetImageWidth(imgRef.current.offsetWidth);
      setDist(-1 * imgIndex * Number(imgRef.current?.offsetWidth));
    }
  }, 100);

  useEffect(() => {
    if (imgRef.current?.offsetWidth) SetImageWidth(imgRef.current.offsetWidth);
    window.addEventListener('resize', getImageWidth);
    return () => {
      window.removeEventListener('resize', getImageWidth);
    };
  }, [getImageWidth]);

  return (
    <ImgViewer ref={imgRef}>
      {imgIndex !== 0 && <LeftBtn onClick={handleLeftClick} />}
      <ImgContainer length={img.length} dist={dist}>
        {img.map((image, index) => {
          return (
            <Img
              length={img.length}
              src={`${IMAGE_PREFIX}${image}`}
              alt={`${index + 1}번째 그림`}
              key={`${image.slice(0, 5)}-${index + 1}-key`}
            />
          );
        })}
      </ImgContainer>
      {imgIndex !== img.length - 1 && <RightBtn onClick={handleRightClick} />}
      <ImgIndicator count={img.length} selectedIndex={imgIndex} />
    </ImgViewer>
  );
}

export default ImgSlider;

const ImgViewer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
`;

const ImgContainer = styled.div<{ length: number; dist: number }>`
  width: ${({ length }) => length * 100}%;
  display: flex;
  margin-left: ${({ dist }) => dist}px;
  transition: margin 0.3s ease;
  background-color: black;
`;

const Img = styled.img<{ length: number }>`
  width: ${({ length }) => 100 / length}%;
  object-fit: contain;
`;
