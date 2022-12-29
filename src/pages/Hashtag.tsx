import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BackSpaceBtn from 'components/atoms/BackSpaceBtn';
import axios from 'axios';
import PostBox from '../components/atoms/PostBox';
import Loading from '../components/atoms/Loading';

type TagDataType = {
  postImg: string;
  idx: string;
};

function Hashtag() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [hashtagData, setHashtagData] = useState<TagDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScroll, setIsScroll] = useState(false);

  const getData = useCallback(async () => {
    try {
      const res = await axios.get('/api/post/tag', { params: { word: tag } });
      res.data.forEach((data: { postImg: string; idx: string }) => {
        const postImg = data.postImg.split(',')[0];
        const { idx } = data;
        setHashtagData((prev) => [...prev, { postImg, idx }]);
      });
      setIsLoading(false);
      // postbox 마지막 인덱스가 관찰되면 isScroll 상태가 변경되어 getData 함수가 실행되고,
      // 정상적으로 getData 함수가 실행되었다면 다시 마지막 인덱스를 관찰대상으로 지정하게 되므로, isScroll값을 false로 되돌려 줌.
      // setIsScroll(false);
    } catch (e: any) {
      if (e.response.data.status === 500) {
        setHashtagData([]);
      }
      setIsLoading(false);
    }
  }, [tag]);

  useEffect(() => {
    getData();
  }, [getData, isScroll]);

  return (
    <Wrapper>
      <BackSpaceBtn onClick={() => navigate(-1)} />
      <ResultWrapper>
        <h3>#{tag}</h3>
        <p>게시글 수 : {hashtagData.length.toLocaleString()}개</p>
        {isLoading ? (
          <Loading />
        ) : (
          <DataContainer>
            {hashtagData.length !== 0 ? (
              hashtagData.map((data, index) => {
                if (index === hashtagData.length - 1) {
                  return (
                    <PostBox
                      isRef
                      setIsScroll={setIsScroll}
                      id={data.idx}
                      img={data.postImg}
                      key={`${data.idx}-${index + 1}`}
                    />
                  );
                }
                return <PostBox id={data.idx} img={data.postImg} key={`${data.idx}-${index + 1}`} />;
              })
            ) : (
              <NoResult>해시태그와 연관된 게시글이 없습니다.</NoResult>
            )}
          </DataContainer>
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  grid-gap: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
  padding: 0 20px;

  > div {
    width: 250px;
    height: 250px;
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);

    > div {
      width: 270px;
    }
  }

  @media screen and (max-width: 550px) {
    grid-template-columns: 1fr;

    > div {
      width: 400px;
      height: 350px;
    }
  }
`;

const NoResult = styled.p`
  width: 100%;
  margin-left: 15px;
`;
