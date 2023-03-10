import { ISetState } from '../interface/utils.d';

const infiniteScroll = (setState: ISetState) => {
  return function intersectionObserver(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach((entry) => {
      // 관찰대상 entry가 화면에 보여지는 경우 실행
      if (entry.isIntersecting) {
        observer.unobserve(entry.target); // entry 관찰 해제
        if (setState)
          setState((curr: number | boolean) => {
            if (typeof curr === 'number') {
              return curr + 1;
            }
            return true;
          });
      }
    });
  };
};

export default infiniteScroll;
