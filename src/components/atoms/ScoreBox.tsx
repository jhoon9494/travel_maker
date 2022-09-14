import styled from 'styled-components';

interface IProps {
  title: string;
  score: number;
}

function ScoreBox({ title, score }: IProps) {
  return (
    <Box>
      <Title>{title}</Title>
      <Score>{score}</Score>
    </Box>
  );
}

export default ScoreBox;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.p`
  font-size: 14px;
  margin-bottom: 5px;
`;

const Score = styled.p`
  font-size: 28px;
  font-weight: bold;
`;
