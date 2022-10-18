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
        list.map(({ placeName, tip }, index) => {
          return (
            <Card placeName={placeName} tip={tip} setPlace={setDeletePlace} key={`${placeName}-${index + 1}-key`} />
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
