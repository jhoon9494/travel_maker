import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import Input from 'components/atoms/Input';
import SubmitBtn from 'components/atoms/SubmitBtn';
import { Link, useNavigate } from 'react-router-dom';
import { login } from 'api/auth';
import useAuth from 'hooks/useAuth';
import useInput from 'hooks/useInput';

function Login() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [loginData, onChange] = useInput({ id: '', pw: '' });
  const [idError, setIdError] = useState<boolean>(false);
  const [pwError, setPwError] = useState<boolean>(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIdError(false);
      setPwError(false);
      await login({ id: loginData.id, password: loginData.pw });
      dispatch({ type: 'signIn', payload: loginData.id });

      navigate('/main');
    } catch (e: any) {
      if (e.response.data.code === 'USER_NOT_FOUND') {
        setIdError(true);
      }
      if (e.response.data.code === 'INVALID_PASSWORD') {
        setPwError(true);
      }
    }
  };
  return (
    <Container>
      <Logo src="/icons/logo.png" alt="logo" />
      <form onSubmit={handleLogin}>
        <Input
          id="id"
          placeholder="아이디"
          size="large"
          type="text"
          value={loginData.id}
          name="id"
          onChange={onChange}
        />
        <ErrorMessage visible={idError}>가입된 유저가 아닙니다.</ErrorMessage>
        <Input
          id="password"
          placeholder="비밀번호"
          size="large"
          type="password"
          value={loginData.pw}
          name="pw"
          onChange={onChange}
        />
        <ErrorMessage visible={pwError}>비밀번호를 다시 확인해주세요.</ErrorMessage>
        <SubmitBtn value="로그인" />
      </form>
      <LinkContainer>
        <Link to="/sign">회원가입</Link>
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

const ErrorMessage = styled.div<{ visible: boolean }>`
  width: 400px;
  color: #ff2f2f;
  font-size: 12px;
  padding-left: 5px;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;
