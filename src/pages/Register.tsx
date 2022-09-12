import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import ValidateInput from 'components/organism/ValidateInput';
import SubmitBtn from 'components/atoms/SubmitBtn';
import { Link } from 'react-router-dom';
import { validateId, validateEmail, validatePhone, validatePw } from '../utils/validate';

function Register() {
  const [id, setId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const [confirmPw, setConfirmPw] = useState<string>('');

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // TODO axios 사용하여 로그인 api 요청하기
      const userData = {
        id,
        email,
        phone,
        pw,
      };
      console.log(userData);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <Container>
      <Link to="/login">
        <Logo src="/logo/logo.png" alt="logo" />
      </Link>
      <form onSubmit={handleRegister}>
        <ValidateInput
          id="id"
          label="아이디"
          placeholder="아이디"
          type="text"
          size="large"
          value={id}
          onChange={(e) => setId(e.target.value)}
          validateValue="6자 이상 · 12자 이내"
          validationCheck={validateId(id)}
        />
        <ValidateInput
          id="email"
          label="이메일"
          placeholder="이메일"
          type="email"
          size="large"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          validateValue="@ 포함"
          validationCheck={validateEmail(email)}
        />
        <ValidateInput
          id="phone"
          label="휴대전화"
          placeholder="휴대전화"
          type="tel"
          size="large"
          value={phone}
          onChange={(e) => {
            // 하이픈 자동입력
            // TODO 불필요하면 제거
            const phoneNumber: string[] = [];
            phoneNumber.push(e.target.value);
            if (
              (e.target.value.length === 3 && e.target.value.length > phone.length) ||
              (e.target.value.length === 8 && e.target.value.length > phone.length)
            ) {
              phoneNumber.push('-');
            }
            setPhone(phoneNumber.join(''));
          }}
          validateValue="(-) 없이"
          validationCheck={validatePhone(phone)}
        />
        <ValidateInput
          id="password"
          label="비밀번호"
          placeholder="비밀번호"
          type="password"
          size="large"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          validateValue="8자 이상"
          validationCheck={validatePw(pw)}
        />
        <ValidateInput
          id="confirmPw"
          label="비밀번호 확인"
          placeholder="비밀번호 확인"
          type="password"
          size="large"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          validateValue="비밀번호와 동일"
          validationCheck={confirmPw.length >= 8 && pw === confirmPw}
        />
        <SubmitBtn value="가입하기" />
      </form>
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
