import { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import Input from 'components/atoms/Input';
import ValidateCheckBox from 'components/atoms/ValidateCheckBox';

interface ValidateInputProps {
  id: string;
  placeholder: string;
  type: string;
  validateValue: string;
  validationCheck: boolean;
  label?: string;
  size?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

function ValidateInput({
  id,
  placeholder,
  type,
  label,
  size,
  validateValue,
  validationCheck,
  value,
  onChange,
}: ValidateInputProps) {
  return (
    <Container>
      <Input
        id={id}
        placeholder={placeholder}
        type={type}
        size={size}
        label={label}
        value={value}
        onChange={onChange}
      />
      <ValidateCheckBox text={validateValue} check={validationCheck} />
    </Container>
  );
}

const defaultProps = {
  label: '',
  size: 'large',
};

ValidateInput.defaultProps = defaultProps;

export default ValidateInput;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
