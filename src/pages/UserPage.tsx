import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import UserImage from 'components/atoms/UserImage';
import { BiEdit } from 'react-icons/bi';
import PostBox from '../components/atoms/PostBox';
import userContext from '../userContext';
import { GlobalColor } from '../styles/GlobalColor';

type PostType = {
  id: string;
  post_img: string;
};

interface postDataProps {
  user_id: string;
  user_img: string;
  follower: number;
  follow: number;
  post: PostType[];
}

function UserPage() {
  const { id } = useContext(userContext);
  const navigate = useNavigate();
  const [postData, setPostData] = useState<postDataProps>();
  // TODO 유저아이디를 받아서 api 요청한 다음 응답 결과가 없으면 해당 유저 없습니다 페이지 띄우고, 있다면 해당 유저 아이디 입력하기
  // 받아올 정보 => 유저아이디, 팔로우 ,팔로워, 게시글리스트[썸네일(보통 리스트의 0번째), 게시글 인덱스번호] 정도만 있으면 충분할 것 같다.
  // context에 가지고있는 유저 아이디와 파라미터로 받은 유저아이디가 동일한 경우 게시글이나 유저정보 수정할 수 있도록 하면 될거같은데??
  const { userId } = useParams();

  const getData = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/mock/userPage.json');
      setPostData(res.data);
    } catch (e: any) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleFollow = () => {
    // TODO 팔로우 api 요청
    console.log('팔로우 하기');
  };

  return (
    <Container>
      <UserContainer>
        <UserImage src={postData?.user_img} alt={`${postData?.user_id}-이미지`} />
        <UserInfo>
          <h2>
            {postData?.user_id}
            <FollowBtn onClick={handleFollow}>팔로우</FollowBtn>
          </h2>

          <div>
            <InfoWrapper>게시물 {postData?.post.length}</InfoWrapper>
            {/* TODO 팔로우 팔로워 클릭시 누가 팔로우하고있는지 알려줄것인지??? */}
            <InfoWrapper>팔로워 {postData?.follower.toLocaleString()}</InfoWrapper>
            <InfoWrapper>팔로우 {postData?.follow.toLocaleString()}</InfoWrapper>
          </div>
        </UserInfo>
      </UserContainer>
      <PostContainer>
        {postData?.post.map((data, index) => {
          return <PostBox id={data.id} img={data.post_img} key={`${data.id}-${index + 1}`} edit={id === userId} />;
        })}
      </PostContainer>

      {userId === id && (
        <UploadBtn onClick={() => navigate('/upload')}>
          <BiEdit />
        </UploadBtn>
      )}
    </Container>
  );
}

export default UserPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserContainer = styled.div`
  display: flex;
  min-height: 230px;
  border-bottom: 1px solid lightgray;
  padding: 60px 100px;

  > img {
    width: 120px;
    height: 120px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px 0 20px 80px;
`;

const FollowBtn = styled.button`
  width: 80px;
  height: 40px;
  margin-left: 25px;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  background-color: ${GlobalColor.mainColor};
`;

const InfoWrapper = styled.span`
  margin-right: 20px;
  font-size: 18px;
`;

const PostContainer = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  grid-gap: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
  padding: 0 20px;

  > div {
    min-width: 250px;
    min-height: 250px;
  }
`;

const UploadBtn = styled.button`
  position: absolute;
  bottom: 90px;
  right: 30px;

  width: 50px;
  height: 50px;

  > svg {
    width: 100%;
    height: 100%;
  }
`;
