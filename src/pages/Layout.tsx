import { Outlet } from 'react-router-dom';
import Navbar from 'components/organism/Navbar';
import styled from 'styled-components';

function Layout() {
  return (
    <Wrapper>
      <Navbar />
      <Body>
        <Outlet />
      </Body>
    </Wrapper>
  );
}

export default Layout;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  height: calc(100vh - 65px);
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 7px; /*스크롤바의 너비*/
  }

  ::-webkit-scrollbar-thumb {
    background-color: lightgray; /*스크롤바의 색상*/
    border-radius: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent; /*스크롤바 트랙 색상*/
  }
`;
