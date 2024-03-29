import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ScoreBox from 'components/atoms/ScoreBox';
import BackSpaceBtn from 'components/atoms/BackSpaceBtn';
import ImgSlider from 'components/organism/ImgSlider';
import HeartBtn from 'components/atoms/HeartBtn';
import TravelTips from 'components/organism/TravelTips';
import { getPost } from 'api/post';
import { generateImgList, generateContent } from 'utils/generator';
import { IPostData } from '../interface/post.d';

function DetailPage() {
  const [data, setData] = useState<IPostData>();
  const [imgList, setImgList] = useState<string[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = useCallback(async () => {
    try {
      const res = await getPost(id as string);
      setData(res.data);
      setImgList(generateImgList(res.data));
    } catch (e: any) {
      if (e.response.data.status === 500) {
        navigate('/*', { replace: true });
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Wrapper>
      <BackSpaceBtn onClick={() => navigate(-1)} />
      <DataContainer>
        <PostContainer>
          <ImgSlider img={imgList} />
          <HeartBtn heart={data?.heart} getData={getData} />
          {data?.recommendRoutes?.length !== 0 ? (
            <TravelTips tips={data?.recommendRoutes} />
          ) : (
            <div style={{ height: '40px' }} />
          )}
          <TextArea>{generateContent(data?.content)}</TextArea>
        </PostContainer>

        <SideContainer>
          <p>
            <Link to={`/${data?.userId}`}>{data?.userId}</Link>
          </p>
          <h2>{data?.title}</h2>
          <ScoreContainer>
            <ScoreBox title="추천도" score={data?.figures.recommend} />
            <ScoreBox title="감성" score={data?.figures.emotion} />
            <ScoreBox title="재방문" score={data?.figures.revisit} />
          </ScoreContainer>
        </SideContainer>
      </DataContainer>
    </Wrapper>
  );
}

export default DetailPage;

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const DataContainer = styled.div`
  display: flex;
  padding: 20px 50px 50px;
  width: 100%;

  @media screen and (max-width: 720px) {
    flex-direction: column;
  }
`;

const PostContainer = styled.div`
  flex: 2 2 0;
  /* 여행 추천 경로의 팁을 띄우기 위해 포지션 지정 */
  position: relative;
`;

const TextArea = styled.div`
  white-space: pre-wrap;
  padding: 10px;
`;

const SideContainer = styled.div`
  flex: 1 1 0;
  padding: 15px;

  @media screen and (max-width: 720px) {
    margin-top: 30px;
    padding: 0;
    max-width: 450px;
  }

  > p {
    margin: 0 0 10px 5px;
  }

  > h2 {
    margin-left: 5px;
  }
`;

const ScoreContainer = styled.div`
  width: 100%;
  height: 85px;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;

  @media screen and (max-width: 720px) {
    margin-left: 5px;
    justify-content: flex-start;
    gap: 30px;
  }
`;
