import styled from 'styled-components';
import { GlobalColor } from '../../styles/GlobalColor';

interface ButtonProps {
  value: string;
}

export default function SubmitBtn({ value }: ButtonProps) {
  return <ButtonContainer>{value}</ButtonContainer>;
}

const ButtonContainer = styled.button`
  width: 400px;
  height: 45px;
  margin: 17px 0;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 5px;
  background-color: ${GlobalColor.mainColor};
`;
