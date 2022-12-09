import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import UserImage from 'components/atoms/UserImage';
import { BiEdit } from 'react-icons/bi';
import PostBox from '../components/atoms/PostBox';
import userContext from '../context/userContext';
import { GlobalColor } from '../styles/GlobalColor';
import Loading from '../components/atoms/Loading';

interface PostDataProps {
  idx: string;
  postImg: string;
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
  const [isLoading, setIsLoading] = useState(false);

  const getData = useCallback(() => {
    Promise.allSettled([
      axios.get(`/api/post/user/list/${userId}`),
      axios.get(`/api/info/${userId}`),
      axios.get(`/api/follow/follower/${userId}`),
      axios.get(`/api/follow/following/${userId}`),
    ]).then((res) => {
      setIsLoading(false);
      res.forEach((resData, index) => {
        // 게시글 정보
        if (index === 0) {
          if (resData.status === 'fulfilled') {
            setPostData(resData.value.data);
          } else {
            // 게시글 전체 삭제 시 Null_value 반환되므로, postData에 빈 배열 삽입
            setPostData([]);
          }
        }

        // 유저 정보
        if (index === 1) {
          if (resData.status === 'fulfilled') {
            setUserImage(resData.value.data.profileImg);
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
    setIsLoading(true);
    getData();
  }, [getData, deletePostIndex]);

  const handleFollow = async () => {
    try {
      const res = await axios.get(`/api/follow/${userId}`, { withCredentials: true });
      console.log(res);
      if (res.data === 'OK') {
        // TODO 팔로우 혹은 유저정보만 불러오게 하는게 나을듯
        // TODO 유저정보랑 게시글정보 불러오는 함수 나누기
        getData();
      }
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
      <PostContainer isLoading={isLoading}>
        {isLoading ? (
          <Loading />
        ) : (
          postData?.map((data, index) => {
            return (
              <PostBox
                id={data.idx}
                img={data.postImg.split(',')[0]}
                key={`${data.idx}-${index + 1}`}
                edit={id === userId}
                setDeleteIndex={setDeletePostIndex}
              />
            );
          })
        )}
      </PostContainer>

      {userId === id && (
        <UploadBtn onClick={() => navigate('/u')}>
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

const PostContainer = styled.div<{ isLoading: boolean }>`
  flex-grow: 1;
  display: grid;
  grid-template-columns: ${({ isLoading }) => (isLoading ? '1fr' : 'repeat(3, 1fr)')};
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
