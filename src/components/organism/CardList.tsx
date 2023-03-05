import Card from 'components/atoms/Card';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { ICardList } from 'interface/organism.d';

function CardList({ list, setList }: ICardList) {
  // 선택된 tip card를 지우기 위한 state
  const [deletePlace, setDeletePlace] = useState('');

  useEffect(() => {
    if (deletePlace !== '') {
      setList((prevList) => {
        const newArray = JSON.parse(JSON.stringify(prevList));
        newArray.splice(
          prevList.findIndex(({ placeName }) => placeName === deletePlace),
          1,
        );
        return newArray;
      });
      setDeletePlace('');
    }
  }, [deletePlace, setList]);

  return (
    <Container empty={list.length === 0}>
      {list.length > 0 ? (
        list.map(({ placeName, tips }, index) => {
          return (
            <Card placeName={placeName} tips={tips} setPlace={setDeletePlace} key={`${placeName}-${index + 1}-key`} />
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
  width: 100%;
  border-radius: 5px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: ${({ empty }) => (empty ? 'center' : '')};
  align-items: center;
`;
