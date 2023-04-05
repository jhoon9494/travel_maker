import styled from 'styled-components';
import Input from 'components/atoms/Input';
import ValidateCheckBox from 'components/atoms/ValidateCheckBox';
import { IValidateInput } from 'interface/organism.d';

function ValidateInput({
  id,
  placeholder,
  type,
  label,
  size,
  validateValue,
  validationCheck,
  value,
  name,
  onChange,
}: IValidateInput) {
  return (
    <Container>
      <Input
        id={id}
        placeholder={placeholder}
        type={type}
        size={size}
        label={label}
        value={value}
        name={name}
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
