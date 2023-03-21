import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from 'components/organism/Navbar';
import styled from 'styled-components';
import Alert from 'components/atoms/Alert';
import useAuth from 'hooks/useAuth';

function Layout() {
  const [alert, setAlert] = useState(false);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    if (!state.id) {
      setAlert(true);
      setOpen(true);
    }
  }, [state]);

  useEffect(() => {
    if (!open) {
      navigate('/', { replace: true });
    }
  }, [open, navigate]);

  return (
    <Wrapper>
      <Navbar />
      <Body>{state.id && <Outlet />}</Body>
      {alert && <Alert text={`로그인한 유저만 이용 가능합니다. \n\n로그인 후 이용해주세요`} open={setOpen} />}
    </Wrapper>
  );
}

export default Layout;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  position: relative;
  top: 65px;

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
