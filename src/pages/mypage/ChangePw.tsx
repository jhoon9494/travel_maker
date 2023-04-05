import styled from 'styled-components';
import { useState, FormEvent, FormEventHandler, useEffect, useCallback } from 'react';
import ValidateInput from 'components/organism/ValidateInput';
import Input from 'components/atoms/Input';
import { useNavigate } from 'react-router-dom';
import Confirm from 'components/atoms/Confirm';
import Alert from 'components/atoms/Alert';
import useAuth from 'hooks/useAuth';
import { changePassword } from 'api/user';
import useInput from 'hooks/useInput';
import { validatePw } from '../../utils/validate';
import SubmitBtn from '../../components/atoms/SubmitBtn';

function ChangePw() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [passwordData, onChange] = useInput({ currPw: '', newPw: '', confirm: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState<boolean>(false);
  const [alertOpen, setAlertpOpen] = useState(false);

  const submitFn = useCallback(async () => {
    if (validatePw(passwordData.newPw) && passwordData.newPw === passwordData.confirm) {
      try {
        await changePassword(passwordData.currPw, passwordData.newPw);
        navigate('/user', { replace: true });
      } catch (error: any) {
        setConfirmResult(false);
        setConfirmOpen(false);
        if (error.response.data.status === 401) {
          setAlertpOpen(true);
        }
      }
    }
  }, [passwordData, navigate]);

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  useEffect(() => {
    if (confirmResult) {
      submitFn();
    }
  }, [confirmResult, submitFn]);

  return (
    <Wrapper>
      <Form onSubmit={handleConfirm}>
        <div>{state.id}</div>
        <Input
          id="currPw"
          name="currPw"
          placeholder="현재 비밀번호"
          label="비밀번호"
          type="password"
          value={passwordData.currPw}
          onChange={onChange}
        />
        <ValidateInput
          id="newPw"
          name="newPw"
          placeholder="변경할 비밀번호"
          label="변경할 비밀번호"
          type="password"
          value={passwordData.newPw}
          onChange={onChange}
          validateValue="8자 이상"
          validationCheck={validatePw(passwordData.newPw)}
        />
        <ValidateInput
          id="confirmPw"
          name="confirm"
          placeholder="비밀번호 확인"
          label="비밀번호 확인"
          type="password"
          value={passwordData.confirm}
          onChange={onChange}
          validateValue="비밀번호 동일"
          validationCheck={passwordData.confirm.length >= 8 && passwordData.newPw === passwordData.confirm}
        />
        <SubmitBtn value="변경하기" />
      </Form>
      {alertOpen && <Alert text="비밀번호를 다시 확인해세요." open={setAlertpOpen} />}
      {confirmOpen && (
        <Confirm
          text="비밀번호를 변경하시겠습니까?"
          yes="변경하기"
          no="취소"
          open={setConfirmOpen}
          setResult={setConfirmResult}
        />
      )}
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
