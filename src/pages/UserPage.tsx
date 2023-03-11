import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BiEdit } from 'react-icons/bi';
import { getUserData } from 'api/user';
import { IPostImg } from 'interface/post.d';
import FollowBtn from 'components/atoms/FollowBtn';
import UserImage from 'components/atoms/UserImage';
import { userContext } from '../context/ContextProvider';
import PostBox from '../components/organism/PostBox';
import Loading from '../components/atoms/Loading';

function UserPage() {
  const { id: loggedUser } = useContext(userContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState<IPostImg[]>([]);
  const [userImage, setUserImage] = useState<string>('');
  const [followerNumber, setFollowerNumber] = useState(0);
  const [followingNumber, setFollowingNumber] = useState(0);
  const [deletePostIndex, setDeletePostIndex] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState<boolean>(false);
  const [followText, setFollowText] = useState<string | null>('');

  useEffect(() => {
    getUserData(userId)
      .then((res) => {
        if (!res.userData.isFind) {
          navigate('/*', { replace: true });
        } else {
          setPostData(res.postData);
          setUserImage(res.userData.userImage);
          setFollowerNumber(res.userData.follower);
          setFollowingNumber(res.userData.following);
          if (res.userData.isFollow) {
            setFollowStatus(true);
          } else {
            setFollowStatus(false);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [navigate, userId]);

  useEffect(() => {
    if (deletePostIndex !== '') {
      setPostData((prev) => prev.filter((item) => item.idx !== deletePostIndex));
    }
  }, [deletePostIndex]);

  useEffect(() => {
    if (followText === '해제하기') setFollowerNumber((curr) => curr - 1);
    else if (followText === '팔로우') setFollowerNumber((curr) => curr + 1);
  }, [followText]);

  return (
    <Container>
      <UserContainer>
        <UserImage src={userImage} alt={`${userId}-이미지`} />
        <UserInfo>
          <h2>
            {userId}
            {loggedUser !== userId && (
              <FollowBtn setText={setFollowText} followStatus={followStatus} userId={userId as string} />
            )}
          </h2>

          <div>
            <InfoWrapper>게시물 {postData?.length}</InfoWrapper>
            <InfoWrapper>
              <Link to={`/${userId}/follower`}>팔로워 </Link>
              {followerNumber}
            </InfoWrapper>
            <InfoWrapper>
              <Link to={`/${userId}/follow`}>팔로우 </Link>
              {followingNumber}
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
                img={data.postImg}
                key={`${data.idx}-${index + 1}`}
                edit={loggedUser === userId}
                setDeleteIndex={setDeletePostIndex}
              />
            );
          })
        )}
      </PostContainer>

      {userId === loggedUser && (
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
  justify-content: center;
  align-items: center;

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
  gap: 10px;
`;

const InfoWrapper = styled.span`
  margin-right: 20px;
  font-size: 18px;
`;

const PostContainer = styled.div<{ isLoading: boolean }>`
  display: grid;
  grid-template-columns: ${({ isLoading }) => (isLoading ? '1fr' : 'repeat(3, minmax(auto, 250px))')};
  grid-gap: 15px;
  margin: 20px 0 30px;
  justify-content: center;
  padding: 0 10px;

  > div {
    width: 100%;
    aspect-ratio: 1 / 1;

    ${({ isLoading }) =>
      isLoading &&
      css`
        height: 500px;
      `}
  }

  @media screen and (max-width: 720px) {
    grid-template-columns: ${({ isLoading }) => (isLoading ? '1fr' : 'repeat(auto-fill, minmax(auto, 200px))')};
    grid-gap: 5px;
  }
`;

const UploadBtn = styled.button`
  display: block;
  width: 935px;
  margin: 0 auto;
  position: fixed;
  bottom: 13vh;
  left: 700px;
  right: 0;

  width: 50px;
  height: 50px;

  > svg {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 900px) {
    left: 550px;
  }

  @media screen and (max-width: 770px) {
    left: 450px;
  }

  @media screen and (max-width: 600px) {
    left: 350px;
  }
`;
