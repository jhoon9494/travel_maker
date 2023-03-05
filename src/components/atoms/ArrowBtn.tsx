import { IClick } from 'interface/atoms.d';
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';
import styled from 'styled-components';

export function RightBtn({ onClick }: IClick) {
  return (
    <CustomRightBtn onClick={onClick}>
      <HiArrowCircleRight style={{ color: 'white' }} />
    </CustomRightBtn>
  );
}

export function LeftBtn({ onClick }: IClick) {
  return (
    <CustomLeftBtn onClick={onClick}>
      <HiArrowCircleLeft style={{ color: 'white' }} />
    </CustomLeftBtn>
  );
}

const CustomRightBtn = styled.div`
  position: absolute;
  top: 50%;
  right: 5px;
  font-size: 26px;
  cursor: pointer;
`;

const CustomLeftBtn = styled.div`
  position: absolute;
  top: 50%;
  left: 5px;
  font-size: 26px;
  cursor: pointer;
`;
