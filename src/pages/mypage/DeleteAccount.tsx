import axios from 'axios';
import { useState } from 'react';
import styled from 'styled-components';
import Input from '../../components/atoms/Input';

function DeleteAccount() {
  const [isOk, setIsOk] = useState<boolean>(false);
  const [pw, setPw] = useState<string>('');

  const handleIsOk = () => {
    setIsOk((curr) => !curr);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        '/api/sign-out',
        {
          password: pw,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <Wrapper>
      <WarningBox>
        {!isOk ? (
          <>
            <p>탈퇴 후 복구할 수 없습니다.</p>
            <p>탈퇴 하시겠습니까?</p>
            <DeleteButton onClick={handleIsOk}>탈퇴하기</DeleteButton>
          </>
        ) : (
          <>
            <p>회원 탈퇴를 위해서 비밀번호를 입력해주세요.</p>
            <Input
              id="userPassword"
              placeholder="비밀번호를 입력해주세요"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <BtnContainer>
              <CancelButton onClick={handleIsOk}>취소하기</CancelButton>
              <DeleteButton onClick={handleSubmit}>탈퇴하기</DeleteButton>
            </BtnContainer>
          </>
        )}
      </WarningBox>
    </Wrapper>
  );
}

export default DeleteAccount;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const WarningBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  padding: 63px 44px;

  > p {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  margin-top: 30px;
`;

const DeleteButton = styled.button`
  background-color: #ff4b4b;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  margin-top: 10px;
`;

const CancelButton = styled.button`
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px 15px;
  margin-top: 10px;
  margin-right: 30px;
`;
