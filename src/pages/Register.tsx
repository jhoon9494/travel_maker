import { FormEvent, useState, useEffect } from 'react';
import styled from 'styled-components';
import ValidateInput from 'components/organism/ValidateInput';
import SubmitBtn from 'components/atoms/SubmitBtn';
import { Link, useNavigate } from 'react-router-dom';
import { register, idCheck } from 'api/auth';
import Alert from 'components/atoms/Alert';
import useAuth from 'hooks/useAuth';
import useInput from 'hooks/useInput';
import { validateId, validateEmail, validatePhone, validatePw } from '../utils/validate';
import { GlobalColor } from '../styles/GlobalColor';

function Register() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [registerData, onChange] = useInput({ id: '', email: '', phone: '', pw: '', confirmPw: '' });
  const [checkId, setCheckId] = useState(false);

  // Alert 부분
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const signUpData = {
      id: registerData.id,
      password: registerData.pw,
      email: registerData.email,
      phoneNumber: registerData.phone,
      profileImg: '/icons/default_profile.svg',
    };

    if (
      validateId(registerData.id) &&
      checkId &&
      validateEmail(registerData.email) &&
      validatePhone(registerData.phone) &&
      validatePw(registerData.pw) &&
      registerData.pw === registerData.confirmPw
    ) {
      try {
        await register(signUpData);
        dispatch({ type: 'signIn', payload: registerData.id });
        navigate('/main');
      } catch (e: any) {
        console.error(e);
      }
    } else if (!checkId) {
      setAlertOpen(true);
      setAlertText('아이디가 중복되었는지 확인해주세요');
    } else if (
      !validateId(registerData.id) ||
      validateEmail(registerData.email) ||
      validatePhone(registerData.phone) ||
      validatePw(registerData.pw) ||
      registerData.pw === registerData.confirmPw
    ) {
      setAlertOpen(true);
      setAlertText('입력한 내용을 다시 확인해주세요');
    }
  };

  const handleIdCheck = async () => {
    if (validateId(registerData.id)) {
      try {
        await idCheck(registerData.id);
        setCheckId(true);
      } catch (e: any) {
        if (e.response.data.code === 'ID_EXISTS') {
          setAlertOpen(true);
          setAlertText('이미 존재하는 아이디입니다.\n\n다른 아이디를 입력해주세요.');
        }
      }
    }
  };

  useEffect(() => {
    setCheckId(false);
  }, [registerData.id]);

  return (
    <Container>
      <Link to="/">
        <Logo src="/icons/logo.png" alt="logo" />
      </Link>
      <form onSubmit={handleRegister}>
        <IdWrapper>
          <ValidateInput
            id="id"
            name="id"
            label="아이디"
            placeholder="아이디"
            type="text"
            size="large"
            value={registerData.id}
            onChange={onChange}
            validateValue="6자 이상 · 12자 이내"
            validationCheck={validateId(registerData.id)}
          />
          <CheckBtn onClick={handleIdCheck} type="button" disabled={checkId}>
            {checkId ? '사용가능' : '중복확인'}
          </CheckBtn>
        </IdWrapper>

        <ValidateInput
          id="email"
          name="email"
          label="이메일"
          placeholder="이메일"
          type="email"
          size="large"
          value={registerData.email}
          onChange={onChange}
          validateValue="@ 포함"
          validationCheck={validateEmail(registerData.email)}
        />
        <ValidateInput
          id="phone"
          name="phone"
          label="휴대전화"
          placeholder="휴대전화"
          type="tel"
          size="large"
          value={registerData.phone}
          onChange={onChange}
          validateValue="(-) 포함"
          validationCheck={validatePhone(registerData.phone)}
        />
        <ValidateInput
          id="password"
          name="pw"
          label="비밀번호"
          placeholder="비밀번호"
          type="password"
          size="large"
          value={registerData.pw}
          onChange={onChange}
          validateValue="8자 이상"
          validationCheck={validatePw(registerData.pw)}
        />
        <ValidateInput
          id="confirmPw"
          name="confirmPw"
          label="비밀번호 확인"
          placeholder="비밀번호 확인"
          type="password"
          size="large"
          value={registerData.confirmPw}
          onChange={onChange}
          validateValue="비밀번호와 동일"
          validationCheck={registerData.confirmPw.length >= 8 && registerData.pw === registerData.confirmPw}
        />
        <SubmitBtn value="가입하기" />
      </form>
      {alertOpen && <Alert text={alertText} open={setAlertOpen} />}
    </Container>
  );
}

export default Register;

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

const IdWrapper = styled.div`
  display: flex;
  position: relative;
`;

const CheckBtn = styled.button`
  position: absolute;
  top: 40%;
  right: 13px;

  padding: 6px 12px;
  border-radius: 5px;
  background-color: ${GlobalColor.mainColor};
  color: white;

  &:disabled {
    cursor: not-allowed;
  }
`;
