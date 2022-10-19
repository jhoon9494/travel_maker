import styled from 'styled-components';
import { useState, FormEvent, FormEventHandler } from 'react';
import ValidateInput from 'components/organism/ValidateInput';
import Input from 'components/atoms/Input';
import { useOutletContext } from 'react-router-dom';
import { validatePw } from '../../utils/validate';
import SubmitBtn from '../../components/atoms/SubmitBtn';

interface UserDataProps {
  user_id: string;
  email: string;
  phone_number: string;
  user_img: string;
}

function ChangePw() {
  const userData = useOutletContext<UserDataProps>();
  const [currPw, setCurrPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO try catch 사용하여 api 요청한 뒤 결과에 맞게 확인창 팝업시켜주기
    console.log(currPw, newPw, confirmPw);
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <div>{userData.user_id}</div>
        <Input
          id="currPw"
          placeholder="현재 비밀번호"
          label="비밀번호"
          type="password"
          value={currPw}
          onChange={(e) => setCurrPw(e.target.value)}
        />
        <ValidateInput
          id="newPw"
          placeholder="변경할 비밀번호"
          label="변경할 비밀번호"
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          validateValue="8자 이상"
          validationCheck={validatePw(newPw)}
        />
        <ValidateInput
          id="confirmPw"
          placeholder="비밀번호 확인"
          label="비밀번호 확인"
          type="password"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          validateValue="비밀번호 동일"
          validationCheck={confirmPw.length >= 8 && newPw === confirmPw}
        />
        <SubmitBtn value="수정하기" />
      </Form>
    </Wrapper>
  );
}

export default ChangePw;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form<{ onSubmit: FormEventHandler<HTMLFormElement> }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0 40px;

  > button {
    margin-top: 30px;
  }

  > div:nth-child(2) {
    margin-bottom: 20px;
  }
`;
