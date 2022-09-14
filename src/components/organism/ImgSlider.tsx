import styled from 'styled-components';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

type ImgType = {
  src: string;
  alt: string;
};

interface IProps {
  img: ImgType[];
}

function ImgSlider({ img }: IProps) {
  return (
    <ImgViewer>
      <ImgContainer length={img.length}>
        {img.map((image) => {
          return <Img src={image.src} alt={image.alt} key={`${image.alt}-key`} />;
        })}
      </ImgContainer>
    </ImgViewer>
  );
}

export default ImgSlider;

const ImgViewer = styled.div`
  width: 550px;
  height: 390px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ImgContainer = styled.div<{ length: number }>`
  width: ${({ length }) => length * 550}px;
  height: 390px;
  display: flex;
`;

const Img = styled.img`
  width: 550px;
  height: 390px;
`;
