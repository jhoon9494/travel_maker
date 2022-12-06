import styled from 'styled-components';
import { Dispatch, SetStateAction, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoX } from 'react-icons/go';
import axios from 'axios';
import userContext from '../../context/userContext';

interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function SideBar({ open, setOpen }: IProps) {
  const { id, setLoggedIn } = useContext(userContext);
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await axios.get('/api/logout');
      localStorage.removeItem('id');
      setLoggedIn('');
      navigate('/', { replace: true });
    } catch (e: any) {
      console.error(e);
    }
  };
  return (
    <>
      {open && <Background onClick={() => setOpen(false)} />}
      <Container open={open}>
        <CloseBtn onClick={() => setOpen(false)}>
          <GoX />
        </CloseBtn>
        <LinkWrapper>
          <Link to={`/${id}`}>{id}</Link>
          <Link to="/user">정보수정</Link>
          <button type="button">설정</button>
          <button type="button" onClick={handleLogOut}>
            로그아웃
          </button>
        </LinkWrapper>
      </Container>
    </>
  );
}

export default SideBar;
const Background = styled.div`
  background-color: #00000080;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
`;

const Container = styled.div<{ open: boolean }>`
  width: ${({ open }) => (open ? 300 : 200)}px;
  height: 100vh;
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  opacity: ${({ open }) => (open ? '1' : '0')};
  background-color: white;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const CloseBtn = styled.button`
  width: 20px;
  height: 20px;
  font-size: 20px;
`;

const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;

  > button,
  a {
    margin-bottom: 30px;
    font-size: 16px;
  }
`;
