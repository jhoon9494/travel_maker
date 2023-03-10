import axios from 'axios';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import FollowBtn from 'components/atoms/FollowBtn';
import infiniteScroll from 'utils/InfiniteScroll';
import { IFollow } from 'interface/user.d';
import { userContext } from '../context/ContextProvider';
import BackSpaceBtn from '../components/atoms/BackSpaceBtn';
import UserImage from '../components/atoms/UserImage';

function FollowListPage() {
  const loggedUser = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userList, setUserList] = useState<IFollow[]>([]);
  const currPage = location.pathname.split('/')[2];

  // 무한스크롤 관련 코드
  const [pageCount, setPageCount] = useState(0);
  const lastUserRef = useRef<HTMLLIElement>(null);
  const rootRef = useRef<HTMLUListElement>(null);

  const followCheck = async (id: string) => {
    try {
      await axios.get(`/api/follow/check/${id}`);
      return false;
    } catch (e: any) {
      return true;
    }
  };

  const getData = useCallback(async () => {
    // FIXME 페이지카운트 숫자와 무관하게 같은 목록만 받아오고 있음. 수정 필요
    try {
      const API_URL = `/api/follow/${currPage === 'follow' ? 'following' : 'follower'}/${userId}`;
      const res = await axios.get(API_URL, { params: { page: pageCount } });
      const userListData = [...res.data].map(async (item) => {
        const followStatus = await followCheck(item.userId);
        return {
          userId: item.userId,
          profileImg: item.profileImg,
          followStatus,
        };
      });

      Promise.all(userListData).then((list) => {
        list.forEach((user) => {
          setUserList((prev) => [...prev, user]);
        });
      });
    } catch (e: any) {
      console.error(e);
    }
  }, [currPage, userId, pageCount]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    let io;
    if (lastUserRef.current) {
      io = new IntersectionObserver(infiniteScroll(setPageCount, rootRef.current));
      io.observe(lastUserRef.current);
    }
  }, [userList]);

  return (
    <Container>
      <BackSpaceBtn onClick={() => navigate(-1)} />
      <UserListContaier>
        {currPage === 'follow' ? <h2>팔로우</h2> : <h2>팔로워</h2>}
        <ul ref={rootRef}>
          {userList &&
            userList.map((user, index) => {
              if (index === userList.length - 1) {
                return (
                  <UserItem key={`${user.userId}-${index + 1}`} ref={lastUserRef}>
                    <UserLink to={`/${user.userId}`}>
                      <UserImage src={user.profileImg} alt={user.userId} name={user.userId} />
                    </UserLink>
                    {user.userId !== loggedUser.id && (
                      <FollowBtn followStatus={user.followStatus} userId={user.userId} />
                    )}
                  </UserItem>
                );
              }
              return (
                <UserItem key={`${user.userId}-${index + 1}`}>
                  <UserLink to={`/${user.userId}`}>
                    <UserImage src={user.profileImg} alt={user.userId} name={user.userId} />
                  </UserLink>
                  {user.userId !== loggedUser.id && <FollowBtn followStatus={user.followStatus} userId={user.userId} />}
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
  position: relative;
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

  > ul {
    height: 60vh;
    overflow: scroll;
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
