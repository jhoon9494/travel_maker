import { IConfirm } from 'interface/atoms.d';
import { MouseEvent } from 'react';
import styled from 'styled-components';
import { GlobalColor } from '../../styles/GlobalColor';

function Confirm({ text, open, setResult, yes, no }: IConfirm) {
  return (
    <Outter onClick={() => open(false)}>
      <Inner onClick={(e: MouseEvent) => e.stopPropagation()}>
        <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{text}</div>
        <BtnsContainer>
          <Button onClick={() => setResult(true)}>{yes}</Button>
          <Button
            onClick={() => {
              setResult(false);
              open(false);
            }}
          >
            {no}
          </Button>
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
  z-index: 999;
  background-color: #8080809b;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Inner = styled.div`
  width: 400px;
  height: 230px;
  z-index: 1000;
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
