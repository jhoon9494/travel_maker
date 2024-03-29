import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Alert from 'components/atoms/Alert';
import { deleteUser } from 'api/user';
import Input from '../../components/atoms/Input';

function DeleteAccount() {
  const navigate = useNavigate();
  const [isOk, setIsOk] = useState<boolean>(false);
  const [pw, setPw] = useState<string>('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');

  const handleIsOk = () => {
    setIsOk((curr) => !curr);
  };

  const handleSubmit = async () => {
    try {
      await deleteUser(pw);
      navigate('/', { replace: true });
    } catch (e: any) {
      if (e.response.data.status === 401) {
        setAlertText('비밀번호를 다시 확인해주세요.');
        setAlertOpen(true);
      }
    }
  };

  return (
    <Wrapper>
      <WarningBox>
        {!isOk ? (
          <>
            <p>탈퇴 후 사진 및 데이터를 복구할 수 없습니다.</p>
            <p>탈퇴 하시겠습니까?</p>
            <DeleteButton onClick={handleIsOk}>탈퇴하기</DeleteButton>
          </>
        ) : (
          <>
            <p>회원 탈퇴를 위해서 비밀번호를 입력해주세요.</p>
            <Input
              id="userPassword"
              name="pw"
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
      {alertOpen && <Alert text={alertText} open={setAlertOpen} />}
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
