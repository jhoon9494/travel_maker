import styled from 'styled-components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type FiguresType = {
  recommend: number;
  revisit: number;
  emotion: number;
};

type PostData = {
  id: string;
  title: string;
  content: string;
  like: number;
  user_id: string;
  figures: FiguresType;
  post_img: string[];
  // 해시태그는 아직 미정
};

function Home() {
  const navigate = useNavigate();
  // TODO 데이터는 무한스크롤로 받아오기
  // TODO 데이터 로딩 시 필요한 스피너 제작하기
  const [postList, setPostList] = useState<PostData[]>([]);

  useEffect(() => {
    async function getData() {
      const res = await axios.get('http://localhost:3000/mock/travelData.json');
      const postData = res.data;
      setPostList(postData);
    }
    getData();
  }, []);

  const handleMoveContent = (postId: string) => {
    navigate(`/detail/${postId}`);
  };

  return (
    <Wrapper>
      {postList.map((data, index) => {
        return (
          <Post key={`${data.title}-${index + 1}-key`}>
            <Img src={data.post_img[0]} alt={`${data.title}-1번째 이미지`} onClick={() => handleMoveContent(data.id)} />
            <PostText>
              <H2Tag onClick={() => handleMoveContent(data.id)}>{data.title}</H2Tag>
              {/* TODO userId 클릭 시 해당 유저페이지로 이동  */}
              <p>{data.user_id}</p>
            </PostText>
          </Post>
        );
      })}
    </Wrapper>
  );
}

export default Home;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const Post = styled.div`
  display: flex;
  width: 800px;
  height: 300px;
  margin: 30px 60px;
`;

const Img = styled.img`
  width: 370px;
  height: 300px;
  cursor: pointer;
`;

const PostText = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
`;

const H2Tag = styled.h2`
  margin-bottom: 15px;
  cursor: pointer;
`;
