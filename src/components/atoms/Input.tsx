import styled, { css } from 'styled-components';
import { ChangeEventHandler } from 'react';

interface InputProps {
  id: string;
  placeholder?: string;
  type: string;
  label?: string;
  size?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

function Input({ id, label, placeholder, size, type, value, onChange }: InputProps) {
  return (
    <Container>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputContainer id={id} placeholder={placeholder} type={type} sz={size} value={value} onChange={onChange} />
    </Container>
  );
}

const defaultProps = {
  label: '',
  size: 'large',
  placeholder: '',
};

Input.defaultProps = defaultProps;

export default Input;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0 0;
`;
const Label = styled.label`
  margin-bottom: 10px;
`;

const InputContainer = styled.input<{ sz: string | undefined }>`
  ${({ sz }) =>
    sz === 'large' &&
    css`
      width: 400px;
      height: 40px;
    `}

  ${({ sz }) =>
    sz === 'medium' &&
    css`
      width: 245px;
      height: 40px;
    `}
  
  border: lightgray 1px solid;
  border-radius: 5px;
  padding-left: 15px;
  font-size: 16px;

  &::placeholder {
    font-size: 16px;
  }

  @media screen and (max-width: 720px) {
    ${({ sz }) =>
      sz === 'medium' &&
      css`
        width: 200px;
        height: 40px;
      `}
  }
`;
