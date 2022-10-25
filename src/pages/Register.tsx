import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import ValidateInput from 'components/organism/ValidateInput';
import SubmitBtn from 'components/atoms/SubmitBtn';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateId, validateEmail, validatePhone, validatePw } from '../utils/validate';

function Register() {
  const [id, setId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const [confirmPw, setConfirmPw] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await axios.post('http://localhost:8888/api/register', {
        id,
        password: pw,
        email,
        phone_number: phone,
      });
      if (res.data === 'OK') {
        navigate('/main');
      }
    } catch (e: any) {
      console.error(e);
    }
  };
  return (
    <Container>
      <Link to="/login">
        <Logo src="/logo/logo.png" alt="logo" />
      </Link>
      <form onSubmit={handleRegister}>
        {/* TODO 아이디 중복조회 API 요청 버튼 만들기 */}
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
            const phoneNumber: string[] = [];
            phoneNumber.push(e.target.value);
            if (e.target.value.length === 3 || e.target.value.length === 8) {
              if (e.target.value.length > phone.length) {
                phoneNumber.push('-');
              }
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
