import styled, { css } from 'styled-components';

interface InputProps {
  id: string;
  placeholder: string;
  type: string;
  value?: string;
  size?: string;
}

function Input({ id, value, placeholder, size, type }: InputProps) {
  return (
    <Container size={size}>
      <Label htmlFor={id}>{value}</Label>
      <InputContainer id={id} placeholder={placeholder} type={type} />
    </Container>
  );
}

const defaultProps = {
  value: '',
  size: 'large',
};

Input.defaultProps = defaultProps;

export default Input;

const Container = styled.div<{ size: string | undefined }>`
  display: flex;
  flex-direction: column;
  margin: 5px 0 0;
  ${({ size }) =>
    size === 'large' &&
    css`
      width: 400px;
      height: 40px;
    `}
`;
const Label = styled.label``;

const InputContainer = styled.input`
  width: 100%;
  height: 100%;
  border: lightgray 1px solid;
  border-radius: 5px;
  padding-left: 15px;

  &::placeholder {
    font-size: 16px;
  }
`;
