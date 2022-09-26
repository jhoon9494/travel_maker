import { Outlet, useLocation } from 'react-router-dom';
import Navbar from 'components/organism/Navbar';
import styled from 'styled-components';

function Layout() {
  const location = useLocation();
  return (
    <Wrapper>
      {location.pathname !== '/login' && location.pathname !== '/register' && <Navbar />}
      <Outlet />
    </Wrapper>
  );
}

export default Layout;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
