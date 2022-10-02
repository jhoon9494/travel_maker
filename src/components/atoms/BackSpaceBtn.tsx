import { BiArrowBack } from 'react-icons/bi';
import styled from 'styled-components';

interface IProps {
  onClick: () => void;
}

function BackSpaceBtn({ onClick }: IProps) {
  return (
    <BackSpace onClick={onClick}>
      <BiArrowBack />
      <span>돌아가기</span>
    </BackSpace>
  );
}

export default BackSpaceBtn;

const BackSpace = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 50px;
  width: 80px;

  cursor: pointer;

  > span {
    margin-left: 5px;
  }
`;
