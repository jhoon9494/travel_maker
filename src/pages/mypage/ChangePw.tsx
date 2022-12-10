import styled from 'styled-components';
import { useState, FormEvent, FormEventHandler, useContext } from 'react';
import ValidateInput from 'components/organism/ValidateInput';
import Input from 'components/atoms/Input';
import axios from 'axios';
import userContext from 'context/userContext';
import { validatePw } from '../../utils/validate';
import SubmitBtn from '../../components/atoms/SubmitBtn';

function ChangePw() {
  const loggedUser = useContext(userContext);
  const [currPw, setCurrPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // FIXME 비밀번호 변경 후 로그인하면 비밀번호 일치하지 않는다고 나옴
    try {
      const res = await axios.post(
        '/api/user/pass',
        {
          nowPassword: currPw,
          newPassword: newPw,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(res);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <div>{loggedUser.id}</div>
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
