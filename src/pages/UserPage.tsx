import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import UserImage from 'components/atoms/UserImage';
import { BiEdit } from 'react-icons/bi';
import FollowBtn from 'components/atoms/FollowBtn';
import { IPostImg } from 'interface/post.d';
import PostBox from '../components/organism/PostBox';
import { userContext } from '../context/ContextProvider';
import Loading from '../components/atoms/Loading';

function UserPage() {
  const { id } = useContext(userContext);
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

  const getInitData = useCallback(() => {
    Promise.allSettled([
      axios.get(`/api/post/user/list/${userId}`),
      axios.get(`/api/info/${userId}`),
      axios.get(`/api/follow/check/${userId}`),
    ]).then((res) => {
      res.forEach((resData, index) => {
        // 게시글 정보
        if (index === 0) {
          if (resData.status === 'fulfilled') {
            resData.value.data.forEach((data: { idx: string; postImg: string }) => {
              setPostData((prev) => [
                ...prev,
                {
                  idx: data.idx,
                  postImg: data.postImg.split(',').filter((src) => src.length !== 0)[0],
                },
              ]);
            });
          } else if (resData.reason.response.status === 500) {
            setPostData([]);
          }
        }

        // 유저 정보
        if (index === 1) {
          if (resData.status === 'fulfilled') {
            setUserImage(resData.value.data.profileImg);
            setFollowerNumber(resData.value.data.follower);
            setFollowingNumber(resData.value.data.following);
          } else if (resData.reason.response.status === 404) {
            navigate('/*', { replace: true });
          }
        }

        // 팔로우 상황
        if (index === 2) {
          if (resData.status === 'fulfilled') {
            // 팔로우하지 않은 상태
            setFollowStatus(false);
          } else if (resData.reason.response.status === 403) {
            // 이미 팔로우 중인 상태
            setFollowStatus(true);
          }
        }
      });
      setIsLoading(false);
    });
  }, [userId, navigate]);

  useEffect(() => {
    getInitData();
  }, [getInitData]);

  useEffect(() => {
    if (deletePostIndex !== '') {
      setPostData((prev) => prev.filter((item) => item.idx !== deletePostIndex));
    }
  }, [deletePostIndex]);

  // 팔로우, 언팔로우 시 유저 팔로워 증감 상태
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
            {id !== userId && (
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
