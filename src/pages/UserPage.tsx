import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import UserImage from 'components/atoms/UserImage';
import { BiEdit } from 'react-icons/bi';
import PostBox from '../components/atoms/PostBox';
import userContext from '../context/userContext';
import { GlobalColor } from '../styles/GlobalColor';

interface PostDataProps {
  id: string;
  post_img: string;
}

function UserPage() {
  const { id } = useContext(userContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState<PostDataProps[]>([]);
  const [userImage, setUserImage] = useState<string>('');
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [deletePostIndex, setDeletePostIndex] = useState<string>('');

  const getData = useCallback(() => {
    Promise.allSettled([
      axios.get(`http://localhost:8888/api/post/user/list/${userId}`, {
        withCredentials: true,
      }),
      // TODO 특정 유저의 정보도 받아올 수 있어야 함.....
      axios.get('http://localhost:8888/api/info', { withCredentials: true }),
      axios.get(`http://localhost:8888/api/follow/follower/${userId}`),
      axios.get(`http://localhost:8888/api/follow/following/${userId}`),
    ]).then((res) => {
      res.forEach((resData, index) => {
        // 게시글 정보
        if (index === 0) {
          if (resData.status === 'fulfilled') {
            setPostData(resData.value.data);
          }
        }

        // 유저 정보
        if (index === 1) {
          if (resData.status === 'fulfilled') {
            setUserImage(resData.value.data.profile_img);
          } else {
            navigate('/*', { replace: true });
          }
        }

        // 팔로워 정보
        if (index === 2) {
          if (resData.status === 'fulfilled') {
            setFollowerList(resData.value.data);
          }
        }

        // 팔로잉 정보
        if (index === 3) {
          if (resData.status === 'fulfilled') {
            setFollowingList(resData.value.data);
          }
        }
      });
    });
  }, [userId, navigate]);

  useEffect(() => {
    getData();
  }, [getData, deletePostIndex]);

  const handleFollow = async () => {
    try {
      const res = await axios.get(`http://localhost:8888/api/follow/${userId}`, { withCredentials: true });
      console.log(res);
      // TODO res.data == ok인 경우 유저 정보를 다시 한번 더 불러와서 갱신시켜주면 어떨지?
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <Container>
      <UserContainer>
        <UserImage src={userImage} alt={`${userId}-이미지`} />
        <UserInfo>
          <h2>
            {userId}
            {id !== userId && <FollowBtn onClick={handleFollow}>팔로우</FollowBtn>}
          </h2>

          <div>
            <InfoWrapper>게시물 {postData?.length}</InfoWrapper>
            <InfoWrapper>
              <Link to={`/${userId}/follower`}>팔로워 </Link>
              {followerList.length.toLocaleString()}
            </InfoWrapper>
            <InfoWrapper>
              <Link to={`/${userId}/follow`}>팔로우 </Link>
              {followingList.length.toLocaleString()}
            </InfoWrapper>
          </div>
        </UserInfo>
      </UserContainer>
      <PostContainer>
        {postData?.map((data, index) => {
          return (
            <PostBox
              id={data.id}
              img={data.post_img}
              key={`${data.id}-${index + 1}`}
              edit={id === userId}
              setDeleteIndex={setDeletePostIndex}
            />
          );
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
  margin: 20px 0 20px 60px;
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
