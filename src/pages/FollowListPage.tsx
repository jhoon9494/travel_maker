import axios from 'axios';
import userContext from 'context/userContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import BackSpaceBtn from '../components/atoms/BackSpaceBtn';
import UserImage from '../components/atoms/UserImage';
import { GlobalColor } from '../styles/GlobalColor';

type FollowType = {
  user_id: string;
  profile_img: string;
};

function FollowListPage() {
  const loggedUser = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userList, setUserList] = useState<FollowType[]>([]);
  const currPage = location.pathname.split('/')[2];

  const getData = useCallback(async () => {
    // TODO 팔로우 팔로워 목록 페이지네이션 버튼? 무한스크롤?
    try {
      if (currPage === 'follow') {
        const res = await axios.get(`/api/follow/following/${userId}`);
        setUserList(res.data);
      } else if (currPage === 'follower') {
        const res = await axios.get(`/api/follow/follower/${userId}`);
        setUserList(res.data);
      }
    } catch (e: any) {
      console.error(e);
    }
  }, [currPage, userId]);

  const handleFollow = async (id: string) => {
    // TODO 이미 팔로우 중인 상대라면?
    // TODO 팔로우 버튼을 눌렀다면 어떻게 해제하기로 변화를 줄것인지?
    try {
      const res = await axios.get(`/api/follow/${id}`);
      console.log(res);
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Container>
      <BackSpaceBtn onClick={() => navigate(-1)} />
      <UserListContaier>
        {currPage === 'follow' ? <h2>팔로우</h2> : <h2>팔로워</h2>}
        <ul>
          {userList &&
            userList.map((user, index) => {
              return (
                <UserItem key={`${user.user_id}-${index + 1}`}>
                  <UserLink to={`/${user.user_id}`}>
                    <UserImage src={user.profile_img} alt={user.user_id} name={user.user_id} />
                  </UserLink>

                  {/* TODO 이미 팔로우 중인 유저일 경우 버튼 변경 */}
                  {user.user_id !== loggedUser.id && (
                    <FollowBtn onClick={() => handleFollow(user.user_id)}>팔로우</FollowBtn>
                  )}
                </UserItem>
              );
            })}
        </ul>
      </UserListContaier>
    </Container>
  );
}

export default FollowListPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserListContaier = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  margin: 40px auto 0;

  > h2 {
    padding: 0 0 10px 10px;
    border-bottom: 2px solid lightgray;
  }
`;

const UserItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px;
`;

const UserLink = styled(Link)`
  display: flex;
  align-items: center;

  > div {
    margin: 0;
    margin-left: 15px;
  }
`;

const FollowBtn = styled.button`
  width: 85px;
  height: 35px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  background-color: ${GlobalColor.mainColor};
`;
