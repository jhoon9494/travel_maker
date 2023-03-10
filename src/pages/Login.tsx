import { useState, FormEvent, useContext } from 'react';
import styled from 'styled-components';
import Input from 'components/atoms/Input';
import SubmitBtn from 'components/atoms/SubmitBtn';
import { Link, useNavigate } from 'react-router-dom';
import { login } from 'api/auth';
import { userContext } from '../context/ContextProvider';

function Login() {
  const user = useContext(userContext);
  const navigate = useNavigate();
  const [id, setId] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const [idError, setIdError] = useState<boolean>(false);
  const [pwError, setPwError] = useState<boolean>(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIdError(false);
      setPwError(false);
      await login({ id, password: pw });
      if (user.setId) user.setId(id);
      localStorage.setItem('id', id);
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
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <ErrorMessage visible={idError}>가입된 유저가 아닙니다.</ErrorMessage>
        <Input
          id="password"
          placeholder="비밀번호"
          size="large"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
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
