import { MouseEventHandler } from 'react';
import styled from 'styled-components';
import { GlobalColor } from '../../styles/GlobalColor';

interface ButtonProps {
  value: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function ConfirmBtn({ value, onClick }: ButtonProps) {
  return <ButtonContainer onClick={onClick}>{value}</ButtonContainer>;
}

const ButtonContainer = styled.button`
  width: 400px;
  height: 60px;
  margin: 17px 0;
  color: white;
  font-size: 24px;
  font-weight: bold;
  border-radius: 5px;
  background-color: ${GlobalColor.mainColor};
`;
