import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BackSpaceBtn from 'components/atoms/BackSpaceBtn';
import { useEffect, useState } from 'react';
import axios from 'axios';

type SearchDataType = {
  img: string;
  name: string;
};

type TagDataType = {
  tag: string;
};

function Explore() {
  const [searchData, setSearchData] = useState<SearchDataType[]>([]);
  const [hashtagData, setHashtagData] = useState<TagDataType[]>([]);
  const { result } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      try {
        // TODO result 값을 가지고 api 요청
        const resUser = await axios.get('http://localhost:3000/mock/searchData.json');
        const resTag = await axios.get('http://localhost:3000/mock/searchTag.json');
        setSearchData(resUser.data);
        setHashtagData(resTag.data);
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
        <h3>유저 검색 결과 </h3>
        <UserDataContainer>
          {searchData.length !== 0 ? (
            searchData.map((data, index) => {
              return (
                <Link to={`/${data.name}`} key={`${data.name}-${index + 1}`}>
                  <UserData>
                    <img src={data.img} alt="검색된 유저 이미지" />
                    <p>{data.name}</p>
                  </UserData>
                </Link>
              );
            })
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </UserDataContainer>
      </ResultWrapper>
      <ResultWrapper>
        <h3>태그 검색 결과</h3>
        {hashtagData.length !== 0 ? (
          <TagData>
            {hashtagData.map((data, index) => {
              return (
                <p key={`${data.tag}-${index + 1}`}>
                  <Link to={`/hashtag/${data.tag}`}>#{data.tag}</Link>
                </p>
              );
            })}
          </TagData>
        ) : (
          <p style={{ margin: '20px 0' }}>검색 결과가 없습니다.</p>
        )}
      </ResultWrapper>
    </Wrapper>
  );
}

export default Explore;

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const ResultWrapper = styled.div`
  padding: 20px 50px 50px;
`;

const UserDataContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 20px 0;
`;

const UserData = styled.div`
  width: 100px;
  height: 120px;
  text-align: center;
  margin: 0 20px 20px 0;

  > img {
    width: 100%;
    height: 80%;
    border-radius: 50%;
  }

  > p {
    width: 100%;
    height: 20%;
  }
`;

const TagData = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px;

  > p {
    margin: 0 5px 5px 0;
  }
`;
