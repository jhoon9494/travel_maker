import styled, { keyframes } from 'styled-components';
import { GlobalColor } from '../../styles/GlobalColor';

function Loading() {
  return (
    <Container>
      <DotWrapper>
        <Dot delay={0} />
        <Dot delay={0.2} />
        <Dot delay={0.4} />
      </DotWrapper>
      <span>loading</span>
    </Container>
  );
}

export default Loading;

const dotFade = keyframes`
  0% {
    background-color: #e3f1ff;
    transform: scale(60%);
  }
  50% {
    background-color: #c3e0ff;
    transform: scale(80%);
  }
  100% {
    background-color: ${GlobalColor.mainColor};
    transform: scale(100%);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > span {
    margin-top: 20px;
  }
`;

const DotWrapper = styled.div`
  display: flex;
  width: 120px;
  justify-content: space-around;
`;

const Dot = styled.span<{ delay: number }>`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  animation: ${dotFade} 1s infinite linear alternate;
  animation-delay: ${(props) => props.delay}s;
`;
