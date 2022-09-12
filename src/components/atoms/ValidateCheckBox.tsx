import { AiOutlineCheck } from 'react-icons/ai';
import styled from 'styled-components';

interface checkBoxProps {
  text: string;
  check: boolean;
}

function ValidateCheckBox({ text, check }: checkBoxProps) {
  return (
    <Container check={check}>
      <AiOutlineCheck />
      <span>{text}</span>
    </Container>
  );
}

export default ValidateCheckBox;

const Container = styled.div<{ check: boolean }>`
  display: flex;
  margin-top: 2px;

  > span {
    margin-top: 2px;
    font-size: 12px;
    color: ${({ check }) => (check ? 'black' : '#a4a4a4')};
  }
  > svg {
    color: ${({ check }) => (check ? '#51cf66' : '#a4a4a4')};
  }
`;
