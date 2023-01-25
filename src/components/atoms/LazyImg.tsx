import { useCallback, useRef, useState, MouseEventHandler, useEffect } from 'react';
import styled from 'styled-components';

const Img = styled.img``;

interface LazyImgProps {
  src: string;
  alt: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
}

export default function LazyImg({ src, alt, onClick }: LazyImgProps) {
  const [isLoad, setIsLoad] = useState(false);
  const inputRef = useRef<HTMLImageElement>(null);

  const lazyLoadObserver = useCallback((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach((entry) => {
      // 관찰대상 entry가 화면에 보여지는 경우 실행
      if (entry.isIntersecting) {
        observer.unobserve(entry.target); // entry 관찰 해제
        setIsLoad(true);
      }
    });
  }, []);

  useEffect(() => {
    let io;
    if (inputRef.current) {
      io = new IntersectionObserver(lazyLoadObserver);
      io.observe(inputRef.current);
    }
  }, [lazyLoadObserver]);

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
