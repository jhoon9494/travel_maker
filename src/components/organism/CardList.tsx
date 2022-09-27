import Card from 'components/atoms/Card';
import styled from 'styled-components';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type TipsType = {
  placeName: string;
  tip: string;
};

interface IProps {
  list: TipsType[];
  setList: Dispatch<SetStateAction<TipsType[]>>;
}

function CardList({ list, setList }: IProps) {
  // 선택된 tip card를 지우기 위한 state
  // number 타입이 아닌 [string, number] 타입으로 받는 이유
  // number 타입으로만 받을 경우
  // -> 삭제하고자 하는 card의 인덱스 값이 동일한 경우 deletePlace의 상태가 변경되지 않은 것이므로 정상적으로 삭제가 되지 않음.
  // 상태를 변경시키기 위해 인덱스 뿐만아니라 삭제하고자하는 placeName까지 같이 받아올 경우 상태가 변경된 것이므로 정상적으로 삭제됨.
  const [deletePlace, setDeletePlace] = useState<[string, number | null]>(['', null]);

  useEffect(() => {
    if (typeof deletePlace[1] === 'number') {
      setList((prevList) => {
        const newArray = JSON.parse(JSON.stringify(prevList));
        newArray.splice(deletePlace[1], 1);
        return newArray;
      });
    }
    // Lint를 무시하지 않을 경우 list의 값을 dependency에 넣어줘야하며, 그렇게 되면 무한루프가 발생함.
    // eslint-disable-next-line
  }, [deletePlace]);

  return (
    <Container empty={list.length === 0}>
      {list.length > 0 ? (
        list.map(({ placeName, tip }, index) => {
          return (
            <Card
              placeName={placeName}
              tip={tip}
              setPlace={setDeletePlace}
              index={index}
              key={`${placeName}-${index + 1}-key`}
            />
          );
        })
      ) : (
        <div>팁을 작성해주세요 😃</div>
      )}
    </Container>
  );
}

export default CardList;

const Container = styled.div<{ empty: boolean }>`
  height: 400px;
  width: 400px;
  border-radius: 5px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: ${({ empty }) => (empty ? 'center' : '')};
  align-items: center;
`;
