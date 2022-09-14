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
  return (
    <RoutesContainer>
      {routes?.map((route, index) => {
        return (
          <Fragment key={`${route.placeName}-key`}>
            <CheckPoint>
              <CheckPointIcon src="/icons/finished-icon.jpeg" alt="checkpoint" />
              <PlaceName
                onMouseEnter={(e: MouseEvent<HTMLSpanElement>) => {
                  setCurrPlace(e.currentTarget.innerText);
                }}
                onMouseLeave={() => {
                  setCurrPlace('');
                }}
              >
                {route.placeName}
              </PlaceName>
              <TipsContainer hide={currPlace !== route.placeName}>{route.tips}</TipsContainer>
            </CheckPoint>
            {index !== routes.length - 1 && <span>..........</span>}
          </Fragment>
        );
      })}
    </RoutesContainer>
  );
}

export default Route;

const RoutesContainer = styled.div`
  width: 550px;
  height: 100px;
  border-radius: 5px;
  background-color: ${GlobalColor.mainColor};
  margin: 36px 0;
  display: flex;
  align-items: center;
  padding: 10px 20px;
`;

const CheckPoint = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  margin: 0 5px;
`;

const CheckPointIcon = styled.img`
  width: 35px;
  height: 35px;
  margin: 0 auto;
`;

const PlaceName = styled.span`
  margin-top: 5px;
`;

const TipsContainer = styled.div<{ hide: boolean }>`
  position: absolute;
  width: 200px;
  padding: 10px;
  border-radius: 5px;
  top: 63px;
  background-color: lightblue;
  opacity: ${({ hide }) => (hide ? 0 : 1)};
  visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')};
  transition: all 0.3s ease;
`;
