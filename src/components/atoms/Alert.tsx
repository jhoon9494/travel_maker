import { Dispatch, SetStateAction, MouseEvent } from 'react';
import styled from 'styled-components';
import { GlobalColor } from '../../styles/GlobalColor';

interface IProps {
  text: string;
  open: Dispatch<SetStateAction<boolean>>;
}

function Alert({ text, open }: IProps) {
  return (
    <Outter onClick={() => open(false)}>
      <Inner onClick={(e: MouseEvent) => e.stopPropagation()}>
        <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{text}</div>
        <BtnsContainer>
          <Button onClick={() => open(false)}>확인</Button>
        </BtnsContainer>
      </Inner>
    </Outter>
  );
}

export default Alert;

const Outter = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #8080809b;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Inner = styled.div`
  width: 350px;
  height: 200px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BtnsContainer = styled.div`
  width: 170px;
  margin-top: 30px;
  display: flex;
  justify-content: center;

  > button:first-child {
    background-color: ${GlobalColor.mainColor};
    color: white;
    border: none;
  }
`;

const Button = styled.button`
  font-size: 16px;
  padding: 4px 12px;
  border-radius: 5px;
  border: 1px solid black;
`;
