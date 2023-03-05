import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BackSpaceBtn from 'components/atoms/BackSpaceBtn';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { IUserData } from 'interface/user.d';
import Loading from '../components/atoms/Loading';

function Explore() {
  const { result } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<IUserData[]>([]);
  const [hashtagData, setHashtagData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = useCallback(() => {
    setUserData([]);
    setHashtagData([]);

    Promise.allSettled([
      axios.get('/api/user', { params: { word: result, page: 0 } }),
      axios.get(`/api/post/tag/${result}`),
    ]).then((res) =>
      res.forEach((resData, index) => {
        // 유저 검색 부분
        if (index === 0) {
          if (resData.status === 'fulfilled') {
            resData.value.data.forEach((user: { userId: string; profileImg: string }) => {
              setUserData((prev) => [...prev, { userId: user.userId, profileImg: user.profileImg }]);
            });
          } else if (resData.reason.response.data.status === 500) {
            setUserData([]);
          }
        }
        // 해시태그 검색 부분
        if (index === 1) {
          if (resData.status === 'fulfilled') {
            resData.value.data.forEach((tag: string) => {
              setHashtagData((prev) => [...prev, tag]);
            });
          } else if (resData.reason.response.data.status === 500) {
            setHashtagData([]);
          }
        }
      }),
    );
    setIsLoading(false);
  }, [result]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Wrapper>
      <BackSpaceBtn onClick={() => navigate(-1)} />
      <ResultWrapper>
        <h3>유저 검색 결과 </h3>
        {isLoading ? (
          <Loading />
        ) : (
          <UserDataContainer>
            {userData.length !== 0 ? (
              userData.map((data, index) => {
                return (
                  <Link to={`/${data.userId}`} key={`${data.userId}-${index + 1}`}>
                    <UserData>
                      <img src={data.profileImg} alt="검색된 유저 이미지" />
                      <p>{data.userId}</p>
                    </UserData>
                  </Link>
                );
              })
            ) : (
              <p>검색 결과가 없습니다.</p>
            )}
          </UserDataContainer>
        )}
      </ResultWrapper>
      <ResultWrapper>
        <h3>태그 검색 결과</h3>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {hashtagData.length !== 0 ? (
              <TagData>
                {hashtagData.map((tag, index) => {
                  const tagName = tag.split('#')[1];
                  return (
                    <p key={`${tag}-${index + 1}`}>
                      <Link to={`/tag/${tagName}`}>{tag}</Link>
                    </p>
                  );
                })}
              </TagData>
            ) : (
              <p style={{ marginBottom: '20px' }}>검색 결과가 없습니다.</p>
            )}
          </div>
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

  > h3 {
    margin-bottom: 20px;
  }
`;

const UserDataContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 20px;
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
