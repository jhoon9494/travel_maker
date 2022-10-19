import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const links = [
  {
    link: 'editProfile',
    text: '정보 수정',
  },
  {
    link: 'changePw',
    text: '비밀번호 변경',
  },
  {
    link: 'deleteAccount',
    text: '회원 탈퇴',
  },
];

const initUserData = {
  user_id: '',
  email: '',
  phone_number: '',
  user_img: '',
};

function Mypage() {
  const location = useLocation();
  const [currLinkIndex, setCurrLinkIndex] = useState<number>(0);
  const [userData, setUserData] = useState(initUserData);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get('http://localhost:3000/mock/userData.json');
      setUserData(res.data);
    };
    getData();
  }, []);

  useEffect(() => {
    setCurrLinkIndex(0);
    links.forEach(({ link }, index) => {
      if (location.pathname.includes(link)) {
        setCurrLinkIndex(index);
      }
    });
  }, [location]);

  return (
    <Wrapper>
      <Menubar>
        {links.map(({ link, text }, index) => {
          return (
            <Link to={link} key={`${link}-link`}>
              <Text active={index === currLinkIndex}>{text}</Text>
            </Link>
          );
        })}
      </Menubar>
      <Body>
        <Outlet context={userData} />
      </Body>
    </Wrapper>
  );
}

export default Mypage;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Menubar = styled.div`
  width: 60%;
  height: 50px;
  margin: 60px auto 0;
  display: flex;
  justify-content: space-around;
`;

const Body = styled.div`
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

const Text = styled.span<{ active: boolean }>`
  font-size: 20px;
  color: ${({ active }) => (active ? 'black' : '#979797')};
`;
