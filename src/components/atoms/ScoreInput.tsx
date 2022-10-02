import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
  id: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  text: string;
}

function ScoreInput({ id, value, setValue, text }: IProps) {
  return (
    <ScoreItem>
      <Label htmlFor={id}>{text}</Label>
      <input
        id={id}
        value={value}
        type="number"
        onChange={(e) => {
          const score = Number(e.target.value);
          if (score > 100 || score < 0) {
            return;
          }
          setValue(e.target.value);
        }}
      />
    </ScoreItem>
  );
}

export default ScoreInput;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  margin: 20px;

  > input {
    width: 100%;
    border: none;
    margin-top: 5px;
    text-align: center;
    font-size: 26px;
    font-weight: bold;

    :focus {
      outline: none;
    }
  }
`;

const Label = styled.label`
  cursor: pointer;
`;
