import styled from 'styled-components';
import Input from 'components/atoms/Input';
import ConfirmBtn from 'components/atoms/ConfirmBtn';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (): void => {
    navigate('/');
  };
  return (
    <Container>
      <Logo src="/logo/logo.png" alt="logo" />
      <Input id="id" placeholder="아이디" size="large" type="text" />
      <Input id="password" placeholder="비밀번호" size="large" type="password" />
      <ConfirmBtn value="로그인" onClick={handleLogin} />
      <LinkContainer>
        <Link to="/register">회원가입</Link>
        <Link to="#findId">아이디 찾기</Link>
        <Link to="#findPW">비밀번호 찾기</Link>
      </LinkContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  width: 250px;
  margin-bottom: 55px;
`;

const LinkContainer = styled.div`
  width: 400px;
  display: flex;
  justify-content: space-around;
`;
