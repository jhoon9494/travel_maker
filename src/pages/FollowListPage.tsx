import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import BackSpaceBtn from '../components/atoms/BackSpaceBtn';
import UserImage from '../components/atoms/UserImage';
import { GlobalColor } from '../styles/GlobalColor';

type FollowType = {
  user_id: string;
  user_img: string;
};

function FollowListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { userId } = useParams();
  const [userList, setUserList] = useState<FollowType[]>([]);
  const currPage = location.pathname.split('/')[2];

  const getData = useCallback(async () => {
    try {
      if (currPage === 'follow') {
        // follow 목록 불러오기
        const res = await axios.get('http://localhost:3000/mock/userPage.json');
        setUserList(res.data.follow);
      } else if (currPage === 'follower') {
        // follower 목록 불러오기
        const res = await axios.get('http://localhost:3000/mock/userPage.json');
        setUserList(res.data.follower);
      }
    } catch (e: any) {
      console.error(e);
    }
  }, [currPage]);

  const handleFollow = () => {
    console.log('api 요청하기');
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
                    <UserImage src={user.user_img} alt={user.user_id} name={user.user_id} />
                  </UserLink>

                  {/* TODO 이미 팔로우 중인 유저일 경우 버튼 변경 */}
                  <FollowBtn onClick={handleFollow}>팔로우</FollowBtn>
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
