import styled from 'styled-components';
import { IScoreInput } from 'interface/atoms.d';

function ScoreInput({ id, value, setValue, text }: IScoreInput) {
  return (
    <ScoreItem>
      <Label htmlFor={id}>{text}</Label>
      <input
        id={id}
        value={value}
        type="number"
        onChange={(e) => {
          const score = Number(e.target.value);
          if (score >= 100) {
            setValue(100);
          } else if (score < 0) {
            setValue(0);
          } else {
            setValue(score);
          }
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
