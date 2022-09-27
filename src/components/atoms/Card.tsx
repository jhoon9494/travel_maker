import styled from 'styled-components';
import { HiX } from 'react-icons/hi';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
  placeName: string;
  tip: string;
  index: number;
  setPlace: Dispatch<SetStateAction<[string, number | null]>>;
}

function Card({ placeName, tip, index, setPlace }: IProps) {
  const deleteCard = () => {
    setPlace([placeName, index]);
  };

  return (
    <Container>
      <h3>{placeName}</h3>
      <p>{tip}</p>
      <CloseBtn onClick={deleteCard}>
        <CustomMark />
      </CloseBtn>
    </Container>
  );
}

export default Card;

const Container = styled.div`
  width: 95%;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid lightgray;
  position: relative;
`;

const CustomMark = styled(HiX)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const CloseBtn = styled.div`
  cursor: pointer;
`;
