import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function NotFound() {
  const navigate = useNavigate();
  return (
    <Container>
      <img src="/logo/logo.png" alt="로고" />
      <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
      <button type="button" onClick={() => navigate('/main')}>
        돌아가기
      </button>
    </Container>
  );
}

export default NotFound;

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > img {
    width: 250px;
    margin-bottom: 30px;
  }

  > p {
    margin-bottom: 40px;
  }

  > button {
    font-size: 16px;
  }
`;
