import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import Score from 'components/atoms/ScoreBox';
import ImgSlider from 'components/organism/ImgSlider';
import HeartBtn from 'components/atoms/HeartBtn';
import Route from 'components/organism/Route';

const travelData: UserData = {
  img: [
    {
      src: 'https://cdn.univ20.com/wp-content/uploads/2017/01/a70b434bfba17779d89d9dec8b4f738c.png',
      alt: '국내 여행지 추천 10',
    },
    {
      src: 'https://post-phinf.pstatic.net/MjAxNzEyMDhfMjIx/MDAxNTEyNzM2ODk0NDc5.ze8UNf9PQAL2ootrveS5x6fWeIVt7BuiB_v1JDI31aAg.5hUGwzl7TLa_VTS9yzyjK7g2pqOGwvrRN59Kv3OxNhog.JPEG/pixabay_com_20171208_214027.jpg?type=w1200',
      alt: '부산',
    },
  ],
  recommendRoutes: [
    { placeName: '동대구역', tips: 'ktx 쾌적해요' },
    { placeName: '부산역', tips: '부산역에서 사진찍기' },
    { placeName: '해운대', tips: '바다는 역시 해운대' },
  ],
  title: '부산 여행',
  content: `가면 갈수록 매력이 넘치는 도시 부산은 서울에서 KTX를 타면 2시간 30분이면 도착할 수 있습니다.
  관광명소들을 지하철, 버스 등 대중교통을 차고 투어할 수 있도록 교통편이 편리하게 잘 되어있죠.

    1. 해운대 바다를 구경하고 달맞이 공원까지 산책하기
    2.더베이 101과 광안리 해변에서 야경 감상하기 
    3.남포동 시장의 다양한 볼거리 구경하기 
    4.영도 다리에서 멍하니 경치 감상하기

  이외에도 깡통시장, 국제시장, 자갈치 시장 등 다양한 먹거리를 즐길 수 있으니, 
  혼행이 처음이신 분들도 쉽게 다녀오실 수 있을거예요 :)`,

  hashTags: ['#부산', '#해운대', '#바다'],
  score: {
    recommend: 100,
    emotion: 100,
    revisit: 100,
  },
  heart: 20,
};

type ImgType = {
  src: string;
  alt: string;
};

type RoutesType = {
  placeName: string;
  tips: string;
};

type ScoreType = {
  recommend: number;
  emotion: number;
  revisit: number;
};

interface UserData {
  img: ImgType[];
  recommendRoutes: RoutesType[];
  title: string;
  content: string;
  hashTags: string[];
  score: ScoreType;
  heart: number;
}

function DetailPage() {
  const [data, setData] = useState<UserData>(travelData);
  const navigate = useNavigate();
  const handleBackSpace = () => {
    // TODO 상세페이지로 넘어오기 전 path를 저장하고 클릭시 해당 주소로 이동
    navigate('/login');
  };

  return (
    <Container>
      <BackSpace onClick={handleBackSpace}>
        <BiArrowBack />
        <span>돌아가기</span>
      </BackSpace>
      <DataContainer>
        <PostContainer>
          <ImgSlider img={data.img} />
          {/* TODO 좋아요 api 요청할 때 필요한 데이터 넘겨줘야하고 관련데이터 타입 정하기 */}
          <HeartBtn heartNum={data.heart} />
          {data.recommendRoutes.length !== 0 ? <Route routes={data.recommendRoutes} /> : null}
          <TextArea>{data.content}</TextArea>
        </PostContainer>

        <SideContainer>
          <p style={{ marginLeft: '5px', marginBottom: '10px' }}>user_id</p>
          <h2 style={{ marginLeft: '5px' }}>{data.title}</h2>
          <ScoreBox>
            <Score title="추천도" score={data.score.recommend} />
            <Score title="감성" score={data.score.emotion} />
            <Score title="재방문" score={data.score.revisit} />
          </ScoreBox>
        </SideContainer>
      </DataContainer>
    </Container>
  );
}

export default DetailPage;

const Container = styled.div`
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const BackSpace = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0 0 50px;

  cursor: pointer;
`;

const DataContainer = styled.div`
  display: flex;
  padding: 20px 50px 50px;
  width: 100%;
  height: 100%;
`;

const PostContainer = styled.div`
  width: 550px;
`;

const TextArea = styled.div`
  white-space: pre-wrap;
  padding: 10px;
`;

const SideContainer = styled.div`
  width: 285px;
  padding: 15px;
`;

const ScoreBox = styled.div`
  width: 100%;
  height: 85px;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
`;
