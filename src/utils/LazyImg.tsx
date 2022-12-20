import { useCallback, useRef, useState, MouseEventHandler, useEffect } from 'react';
import styled from 'styled-components';

const Img = styled.img`
  min-width: 370px;
  height: 300px;
  cursor: pointer;
  background-color: gray;
`;

interface LazyImgProps {
  src: string;
  alt: string;
  onClick: MouseEventHandler<HTMLImageElement> | undefined;
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

  // eslint-disable-next-line
  // return <>{isLoad ? <Img ref={inputRef} src={src} alt={alt} onClick={onClick} /> : <NoImage />}</>;
  return <Img ref={inputRef} src={isLoad ? src : '/icons/noImage.png'} alt={alt} onClick={onClick} />;
}
