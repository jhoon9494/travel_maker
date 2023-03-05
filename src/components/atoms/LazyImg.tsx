import { useRef, useState, MouseEventHandler, useEffect } from 'react';
import styled from 'styled-components';
import infiniteScroll from 'utils/InfiniteScroll';

const Img = styled.img``;

interface LazyImgProps {
  src: string;
  alt: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
}

export default function LazyImg({ src, alt, onClick }: LazyImgProps) {
  const [isLoad, setIsLoad] = useState(false);
  const inputRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let io;
    if (inputRef.current) {
      io = new IntersectionObserver(infiniteScroll(setIsLoad));
      io.observe(inputRef.current);
    }
  }, []);

  return (
    <Img
      ref={inputRef}
      src={isLoad ? `https://my-travel-maker.s3.amazonaws.com/Downloads/${src}` : '/icons/noImage.png'}
      alt={alt}
      onClick={onClick}
    />
  );
}

const defaultProps = {
  onClick: undefined,
};

LazyImg.defaultProps = defaultProps;
