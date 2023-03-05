import styled from 'styled-components';
import { HiX } from 'react-icons/hi';
import { ICard } from 'interface/atoms.d';

function Card({ placeName, tips, setPlace }: ICard) {
  return (
    <Container>
      <h3>{placeName}</h3>
      <p>{tips}</p>
      <CloseBtn onClick={() => setPlace(placeName)}>
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
  background-color: #99ccff47;
  box-shadow: 3px 3px 15px #cbcbcb;
  position: relative;

  > h3 {
    border-bottom: 1px solid #cbcbcb;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }
`;

const CustomMark = styled(HiX)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const CloseBtn = styled.div`
  cursor: pointer;
`;
