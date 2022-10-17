import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { GlobalColor } from '../../styles/GlobalColor';

interface IProps {
  text: string;
  close: Dispatch<SetStateAction<boolean>>;
  setResult: Dispatch<SetStateAction<boolean | null>>;
  yes: string;
  no: string;
}

function Confirm({ text, close, setResult, yes, no }: IProps) {
  return (
    <Outter onClick={() => close(false)}>
      <Inner>
        <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{text}</div>
        <BtnsContainer>
          <Button onClick={() => setResult(true)}>{yes}</Button>
          <Button onClick={() => setResult(null)}>{no}</Button>
        </BtnsContainer>
      </Inner>
    </Outter>
  );
}

export default Confirm;

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
`;

const Inner = styled.div`
  width: 500px;
  height: 300px;
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
  justify-content: space-between;

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
