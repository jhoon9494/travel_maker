import { Outlet, useLocation } from 'react-router-dom';
import Navbar from 'components/organism/Navbar';
import styled from 'styled-components';

function Layout() {
  const location = useLocation();
  return (
    <Container>
      {location.pathname !== '/login' && location.pathname !== '/register' && <Navbar />}
      <Outlet />
    </Container>
  );
}

export default Layout;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
