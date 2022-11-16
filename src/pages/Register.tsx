import { FormEvent, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import ValidateInput from 'components/organism/ValidateInput';
import SubmitBtn from 'components/atoms/SubmitBtn';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateId, validateEmail, validatePhone, validatePw } from '../utils/validate';
import { GlobalColor } from '../styles/GlobalColor';
import userContext from '../context/userContext';

function Register() {
  const [id, setId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const [confirmPw, setConfirmPw] = useState<string>('');
  const [checkId, setCheckId] = useState(false);
  const navigate = useNavigate();
  const { setLoggedIn } = useContext(userContext);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateId(id) && validateEmail(email) && validatePhone(phone) && validatePw(pw) && pw === confirmPw) {
      try {
        const res = await axios.post(
          'http://localhost:8888/api/register',
          {
            id,
            password: pw,
            email,
            phone_number: phone,
            profile_img: '/icons/default_profile.svg',
          },
          { withCredentials: true },
        );
        if (res.data === 'OK') {
          setLoggedIn(id);
          localStorage.setItem('id', id);
          navigate('/main');
        }
      } catch (e: any) {
        console.error(e);
      }
    } else {
      // TODO 유효성 검사 통과한 경우에만 api 호출하도록 하며, 통과 못한 경우 alert창 띄우기
      console.log('항목을 입력하세요');
    }
  };

  const handleIdCheck = async () => {
    if (validateId(id)) {
      try {
        const res = await axios.get('http://localhost:8888/api/check', { params: { id } });
        console.log(res);
      } catch (e: any) {
        console.log(e);
        // FIXME 중복된 아이디 없는 경우에도 500번 코드 뱉으며 catch 단에서 잡힘.
        if (e.response.data.status === 500) {
          setCheckId(true);
        } else {
          // TODO 중복된 아이디 있을 경우 alert 띄우기
        }
      }
    }
  };

  useEffect(() => {
    setCheckId(false);
  }, [id]);

  return (
    <Container>
      <Link to="/">
        <Logo src="/icons/logo.png" alt="logo" />
      </Link>
      <form onSubmit={handleRegister}>
        <IdWrapper>
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
          <CheckBtn onClick={handleIdCheck} type="button" disabled={checkId}>
            {checkId ? '사용가능' : '중복확인'}
          </CheckBtn>
        </IdWrapper>

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
