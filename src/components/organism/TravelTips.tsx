import { ITravelTips } from 'interface/post.d';
import { useState, Fragment, MouseEvent } from 'react';
import styled from 'styled-components';
import { GlobalColor } from '../../styles/GlobalColor';

function TravelTips({ tips }: { tips: ITravelTips[] | undefined }) {
  const [currPlace, setCurrPlace] = useState('');
  const [containerLeftDist, setContainerLeftDist] = useState(0);
  const [tipsTopDist, setTipsTopDist] = useState(0);
  const [tipsLeftDist, setTipsLeftDist] = useState(0);
  return (
    <TravelTipsContainer
      onMouseEnter={(e: MouseEvent<HTMLElement>) => {
        setContainerLeftDist(e.currentTarget.getBoundingClientRect().left);
      }}
    >
      {tips?.map((tip, index) => {
        return (
          <Fragment key={`${tip.placeName}-key`}>
            <CheckPoint
              onMouseEnter={(e: MouseEvent<HTMLElement>) => {
                setCurrPlace(e.currentTarget.innerText);
                setTipsLeftDist(e.currentTarget.getBoundingClientRect().left);
                setTipsTopDist(e.currentTarget.offsetTop);
              }}
              onMouseLeave={() => {
                setCurrPlace('');
              }}
            >
              <CheckPointIcon src="/icons/finished-icon.jpeg" alt="checkpoint" />
              <PlaceName>{tip.placeName}</PlaceName>
              <TipsContainer
                hide={currPlace !== tip.placeName}
                leftDist={tipsLeftDist - containerLeftDist}
                topDist={tipsTopDist + 65}
              >
                {tip.tips ? tip.tips : '작성하신 꿀팁이 없어요 😭'}
              </TipsContainer>
            </CheckPoint>
            {index !== tips.length - 1 && <span>..........</span>}
          </Fragment>
        );
      })}
    </TravelTipsContainer>
  );
}

export default TravelTips;

const TravelTipsContainer = styled.ul`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px solid lightgray;
  margin: 20px 0 30px;
  padding: 10px 20px;

  overflow-y: hidden;
  overflow-x: scroll;
  ::-webkit-scrollbar {
    height: 6px; /*스크롤바의 너비*/
  }

  ::-webkit-scrollbar-thumb {
    background-color: lightgray; /*스크롤바의 색상*/
    border-radius: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent; /*스크롤바 트랙 색상*/
  }
`;

const CheckPoint = styled.li`
  display: flex;
  flex-direction: column;
  margin: 0 5px;
`;

const CheckPointIcon = styled.img`
  width: 35px;
  height: 35px;
  margin: 0 auto;
`;

const PlaceName = styled.span`
  text-align: center;
  margin-top: 5px;
  min-width: 60px;
`;

const TipsContainer = styled.div<{ hide: boolean; leftDist: number; topDist: number }>`
  position: absolute;
  overflow-wrap: break-word;
  width: 200px;
  padding: 10px;
  border-radius: 5px;
  top: ${({ topDist }) => topDist}px;
  left: ${({ leftDist }) => leftDist}px;
  background-color: ${GlobalColor.mainColor};
  opacity: ${({ hide }) => (hide ? 0 : 1)};
  visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')};
  transition: opacity 0.5s ease;
`;
