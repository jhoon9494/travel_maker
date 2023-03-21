import { ILazyImg } from 'interface/atoms.d';
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import infiniteScroll from 'utils/InfiniteScroll';
import { IMAGE_PREFIX } from 'constant/prefix';

const Img = styled.img``;

export default function LazyImg({ src, alt, onClick }: ILazyImg) {
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
    <Img ref={inputRef} src={isLoad ? `${IMAGE_PREFIX}${src}` : '/icons/noImage.png'} alt={alt} onClick={onClick} />
  );
}

const defaultProps = {
  onClick: undefined,
};

LazyImg.defaultProps = defaultProps;
