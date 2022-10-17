import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { GoX } from 'react-icons/go';

interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function SideBar({ open, setOpen }: IProps) {
  return (
    <>
      {open && <Background />}
      <Container open={open}>
        <CloseBtn onClick={() => setOpen(false)}>
          <GoX />
        </CloseBtn>
        <LinkWrapper>
          {/* TODO 각 페이지 제작 후 link 및 api 연결시키기 */}
          <div>유저 아이디</div>
          <div>정보수정</div>
          <div>설정</div>
          <div>로그아웃</div>
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
  margin-top: 40px;
  text-align: center;
  //TODO Link로 바꿔줘야함
  > div {
    margin-bottom: 30px;
  }
`;