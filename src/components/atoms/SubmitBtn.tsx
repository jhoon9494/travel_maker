import styled from 'styled-components';
import { GlobalColor } from '../../styles/GlobalColor';

export default function SubmitBtn({ value, isDisabled }: { value: string; isDisabled?: boolean }) {
  return <ButtonContainer disabled={isDisabled}>{value}</ButtonContainer>;
}

SubmitBtn.defaultProps = {
  isDisabled: false,
};

const ButtonContainer = styled.button`
  width: 400px;
  height: 45px;
  margin: 17px 0;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 5px;
  background-color: ${GlobalColor.mainColor};

  :disabled {
    cursor: not-allowed;
  }
`;
