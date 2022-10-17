import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import BackSpaceBtn from 'components/atoms/BackSpaceBtn';
import axios from 'axios';

type TagDataType = {
  img: string;
  id: string;
};

function Hashtag() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [hashtagData, setHashtagData] = useState<TagDataType[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get('http://localhost:3000/mock/tagList.json');
        setHashtagData(res.data);
      } catch (e: any) {
        console.log(e);
      }
    }
    getData();
  }, []);

  return (
    <Wrapper>
      <BackSpaceBtn onClick={() => navigate(-1)} />
      <ResultWrapper>
        <h3>#{tag}</h3>
        <p>게시글 수 : {hashtagData.length.toLocaleString()}개</p>

        {hashtagData.length !== 0 ? (
          <DataContainer>
            {hashtagData.map((data, index) => {
              return (
                <Link to={`/detail/${data.id}`} key={`${data.id}-${index + 1}`}>
                  <Img src={data.img} alt="이미지" />
                </Link>
              );
            })}
          </DataContainer>
        ) : (
          <NoResult>해시태그와 연관된 게시글이 없습니다.</NoResult>
        )}
      </ResultWrapper>
    </Wrapper>
  );
}

export default Hashtag;

const Wrapper = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ResultWrapper = styled.div`
  padding: 20px 50px 50px;

  > h3 {
    margin: 0 0 10px 15px;
  }

  > p {
    margin: 0 0 30px 15px;
  }
`;

const DataContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  > a {
    margin: 0 20px 20px;
  }
`;

const Img = styled.img`
  width: 200px;
  height: 200px;
`;

const NoResult = styled.div`
  margin-left: 15px;
`;
