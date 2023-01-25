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
  const [pageCount, setPageCount] = useState(0);

  const getData = useCallback(async () => {
    try {
      const res = await axios.get('/api/post/tag', { params: { word: tag, page: pageCount } });
      res.data.forEach((data: { postImg: string; idx: string }) => {
        const postImg = data.postImg.split(',')[0];
        const { idx } = data;
        setHashtagData((prev) => [...prev, { postImg, idx }]);
      });
      setIsLoading(false);
    } catch (e: any) {
      if (pageCount === 0 && e.response.data.status === 500) {
        setHashtagData([]);
      }
    }
  }, [tag, pageCount]);

  useEffect(() => {
    getData();
  }, [getData, pageCount]);

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
                if ((index > 0 && index % 8 === 0) || index === hashtagData.length - 1) {
                  return (
                    <PostBox
                      isRef
                      setPageCount={setPageCount}
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
  grid-template-columns: repeat(3, minmax(auto, 250px));
  justify-content: center;
  grid-gap: 15px;
  margin-top: 20px;
  margin-bottom: 30px;
  padding: 0 20px;

  > div {
    width: 100%;
    aspect-ratio: 1 / 1;
  }

  @media screen and (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(auto, 200px));
    grid-gap: 10px;
  }
`;

const NoResult = styled.p`
  width: 100%;
  margin-left: 15px;
`;
