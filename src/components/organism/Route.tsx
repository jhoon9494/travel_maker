import { useState, Fragment, MouseEvent } from 'react';
import styled from 'styled-components';
import { GlobalColor } from '../../styles/GlobalColor';

type RoutesType = {
  placeName: string;
  tips: string;
};

interface IProps {
  routes: RoutesType[] | undefined;
}

function Route({ routes }: IProps) {
  const [currPlace, setCurrPlace] = useState<string>('');
  const [containerLeftDist, setContainerLeftDist] = useState<number>(0);
  const [tipsLeftDist, setTipsLeftDist] = useState<number>(0);
  return (
    <RoutesContainer
      onMouseEnter={(e: MouseEvent<HTMLElement>) => {
        setContainerLeftDist(e.currentTarget.getBoundingClientRect().left);
      }}
    >
      {routes?.map((route, index) => {
        return (
          <Fragment key={`${route.placeName}-key`}>
            <CheckPoint
              onMouseEnter={(e: MouseEvent<HTMLElement>) => {
                setCurrPlace(e.currentTarget.innerText);
                setTipsLeftDist(e.currentTarget.getBoundingClientRect().left);
              }}
              onMouseLeave={() => {
                setCurrPlace('');
              }}
            >
              <CheckPointIcon src="/icons/finished-icon.jpeg" alt="checkpoint" />
              <PlaceName>{route.placeName}</PlaceName>
              <TipsContainer hide={currPlace !== route.placeName} leftDist={tipsLeftDist - containerLeftDist}>
                {route.tips ? route.tips : '작성하신 꿀팁이 없어요 😭'}
              </TipsContainer>
            </CheckPoint>
            {index !== routes.length - 1 && <span>..........</span>}
          </Fragment>
        );
      })}
    </RoutesContainer>
  );
}

export default Route;

const RoutesContainer = styled.ul`
  width: 550px;
  height: 100px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px solid lightgray;
  margin: 20px 0 30px;
  padding: 10px 20px;

  overflow-y: hidden;
  overflow-x: scroll;
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
  margin-top: 5px;
  min-width: 60px;
`;

const TipsContainer = styled.div<{ hide: boolean; leftDist: number }>`
  position: absolute;
  width: 200px;
  padding: 10px;
  border-radius: 5px;
  top: 64.5%;
  left: ${({ leftDist }) => leftDist}px;
  background-color: ${GlobalColor.mainColor};
  opacity: ${({ hide }) => (hide ? 0 : 1)};
  visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')};
  transition: opacity 0.5s ease;
`;
