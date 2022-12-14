import styled from 'styled-components';
import { useState, FormEvent, FormEventHandler, useContext, useEffect, useCallback } from 'react';
import ValidateInput from 'components/organism/ValidateInput';
import Input from 'components/atoms/Input';
import axios from 'axios';
import userContext from 'context/userContext';
import { useNavigate } from 'react-router-dom';
import Confirm from 'components/atoms/Confirm';
import Alert from 'components/atoms/Alert';
import { validatePw } from '../../utils/validate';
import SubmitBtn from '../../components/atoms/SubmitBtn';

function ChangePw() {
  const navigate = useNavigate();
  const loggedUser = useContext(userContext);
  const [currPw, setCurrPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState<boolean | null>(null);
  const [alertOpen, setAlertpOpen] = useState(false);

  const submitFn = useCallback(async () => {
    if (validatePw(newPw) && newPw === confirmPw) {
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
        if (res.data === 'OK') {
          navigate('/user', { replace: true });
        }
      } catch (error: any) {
        setConfirmResult(null);
        setConfirmOpen(false);
        if (error.response.data.status === 401) {
          setAlertpOpen(true);
        }
      }
    }
  }, [confirmPw, currPw, newPw, navigate]);

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
        <div>{loggedUser.id}</div>
        <Input
          id="currPw"
          placeholder="?????? ????????????"
          label="????????????"
          type="password"
          value={currPw}
          onChange={(e) => setCurrPw(e.target.value)}
        />
        <ValidateInput
          id="newPw"
          placeholder="????????? ????????????"
          label="????????? ????????????"
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          validateValue="8??? ??????"
          validationCheck={validatePw(newPw)}
        />
        <ValidateInput
          id="confirmPw"
          placeholder="???????????? ??????"
          label="???????????? ??????"
          type="password"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          validateValue="???????????? ??????"
          validationCheck={confirmPw.length >= 8 && newPw === confirmPw}
        />
        <SubmitBtn value="????????????" />
      </Form>
      {alertOpen && <Alert text="??????????????? ?????? ???????????????." open={setAlertpOpen} />}
      {confirmOpen && (
        <Confirm
          text="??????????????? ?????????????????????????"
          yes="????????????"
          no="??????"
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
