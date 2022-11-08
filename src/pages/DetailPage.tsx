import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ScoreBox from 'components/atoms/ScoreBox';
import BackSpaceBtn from 'components/atoms/BackSpaceBtn';
import ImgSlider from 'components/organism/ImgSlider';
import HeartBtn from 'components/atoms/HeartBtn';
import TravelTips from 'components/organism/TravelTips';
import axios from 'axios';

type TravelTips = {
  placeName: string;
  tips: string;
};

type FiguresType = {
  recommend: number;
  emotion: number;
  revisit: number;
};

interface PostData {
  id: string;
  post_img: string[];
  recommendRoutes: TravelTips[] | [];
  title: string;
  content: string;
  hashTags: string[];
  figures: FiguresType;
  like: number;
}

const initialSet: PostData = {
  id: '',
  post_img: [],
  recommendRoutes: [],
  title: '',
  content: '',
  hashTags: [],
  figures: {
    recommend: 0,
    emotion: 0,
    revisit: 0,
  },
  like: 0,
};

// 게시글의 본문 및 해시태그 생성 함수
function createContent(content: string) {
  return content.split(/(#[^\s#]+)/g).map((str, index) => {
    if (str[0] === '#') {
      const hashtag = str.split('#')[1];
      return (
        <Link to={`/hashtag/${hashtag}`} key={`${index + 1}-hashtag`}>
          {str}
        </Link>
      );
    }
    return str;
  });
}

function DetailPage() {
  const [data, setData] = useState<PostData>(initialSet);
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8888/api/post/detail/${id}`, { withCredentials: true });
      setData(res.data);
    } catch (e: any) {
      // TODO 게시글 아이디로 api 요청하고, 요청결과가 없으면(혹은 에러발생 시) not found 페이지로 리다이렉트 시켜주기
      console.error(e);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData, data.like]);

  // TODO 게시글 수정 및 삭제 버튼 만들기
  return (
    <Wrapper>
      <BackSpaceBtn onClick={() => navigate(-1)} />
      <DataContainer>
        <PostContainer>
          {/* <ImgSlider img={data.post_img} /> */}
          {/* TODO 내가 좋아요 누른상태인지 체크하기 */}
          <HeartBtn like={data.like} setLike={setData} />
          {/* {data.recommendRoutes.length !== 0 ? (
            <TravelTips tips={data.recommendRoutes} />
          ) : (
            <div style={{ height: '40px' }} />
          )} */}
          <TextArea>{createContent(data.content)}</TextArea>
        </PostContainer>

        <SideContainer>
          {/* TODO 유저 아이디 클릭시 해당 유저페이지로 이동 */}
          <p style={{ marginLeft: '5px', marginBottom: '10px' }}>userId</p>
          <h2 style={{ marginLeft: '5px' }}>{data.title}</h2>
          <ScoreContainer>
            <ScoreBox title="추천도" score={data.figures.recommend} />
            <ScoreBox title="감성" score={data.figures.emotion} />
            <ScoreBox title="재방문" score={data.figures.revisit} />
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
`;

const PostContainer = styled.div`
  width: 550px;
  /* 여행 추천 경로의 팁을 띄우기 위해 포지션 지정 */
  position: relative;
`;

const TextArea = styled.div`
  white-space: pre-wrap;
  padding: 10px;
`;

const SideContainer = styled.div`
  width: 285px;
  padding: 15px;
`;

const ScoreContainer = styled.div`
  width: 100%;
  height: 85px;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
`;
