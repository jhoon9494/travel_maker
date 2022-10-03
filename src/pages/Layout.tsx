import { Outlet, useLocation } from 'react-router-dom';
import Navbar from 'components/organism/Navbar';
import styled from 'styled-components';

function Layout() {
  const location = useLocation();
  return (
    <Wrapper>
      {location.pathname !== '/login' && location.pathname !== '/register' ? <Navbar /> : <NonNavbar />}
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

const NonNavbar = styled.div`
  background-color: white;
  height: 65px;
`;

const Body = styled.div`
  height: calc(100vh - 65px);
  overflow-y: scroll;
`;
