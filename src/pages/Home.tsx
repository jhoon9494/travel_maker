import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import Loading from '../components/atoms/Loading';

type FiguresType = {
  recommend: number;
  revisit: number;
  emotion: number;
};

type PostData = {
  idx: string;
  title: string;
  content: string;
  like: number;
  userId: string;
  figures: FiguresType;
  postImg: string[];
  hashtags: string[];
};

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // TODO 데이터 몇개씩 뿌려줄 예정????
  const [postList, setPostList] = useState<PostData[]>([]);

  // 무한 스크롤 관련 부분
  const boxRef = useRef<HTMLDivElement>(null);

  const getData = useCallback(async () => {
    try {
      const res = await axios.get('/api/post/list');
      setPostList((prevList) => [...prevList, ...res.data]);
    } catch (e: any) {
      // TODO 무한스크롤로 더이상 받아올 정보가 없는 경우에는 기존에 모아진 배열 그대로 다시 반환하면 될듯
      // 추가로 boxRef.current = null로 변경해서 옵저버 관찰 없애기
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, [getData]);

  const intersectionObserver = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        // 관찰대상 entry가 화면에 보여지는 경우 실행
        if (entry.isIntersecting) {
          observer.unobserve(entry.target); // entry 관찰 해제
          getData(); // 데이터 가져오기
        }
      });
    },
    [getData],
  );

  // postList가 갱신될 때마다 observer 설정
  useEffect(() => {
    let io;
    if (boxRef.current) {
      io = new IntersectionObserver(intersectionObserver); // IntersectionObserver
      io.observe(boxRef.current);
    }
  }, [postList, intersectionObserver]);

  return (
    <Wrapper>
      {/* eslint-disable */}
      {isLoading ? (
        <Loading />
      ) : postList.length === 0 ? (
        <EmptyPost>
          <h2>표시할 게시글이 없습니다.</h2>
          <h2>다른 유저를 팔로우 해주세요!</h2>
        </EmptyPost>
      ) : (
        postList.map((data, index) => {
          // 마지막 게시글을 담고 있는 컴포넌트에 무한스크롤을 적용시키기 위해 ref를 담아줌
          if (postList.length - 1 === index) {
            return (
              <div ref={boxRef} key={`${data.title}-${index + 1}-key`}>
                <Post>
                  <Img
                    src={data.postImg?.[0]}
                    alt={`${data.title}-1번째 이미지`}
                    onClick={() => navigate(`/p/${data.idx}`)}
                  />
                  <PostText>
                    <H2Tag onClick={() => navigate(`/p/${data.idx}`)}>{data.title}</H2Tag>
                    <p>
                      <Link to={`/${data.userId}`}>{data.userId}</Link>
                    </p>
                  </PostText>
                </Post>
              </div>
            );
          }
          return (
            <Post key={`${data.title}-${index + 1}-key`}>
              <Img
                src={data.postImg?.[0]}
                alt={`${data.title}-1번째 이미지`}
                onClick={() => navigate(`/p/${data.idx}`)}
              />
              <PostText>
                <H2Tag onClick={() => navigate(`/p/${data.idx}`)}>{data.title}</H2Tag>
                <p>
                  <Link to={`/${data.userId}`}>{data.userId}</Link>
                </p>
              </PostText>
            </Post>
          );
        })
      )}
      <UploadBtn onClick={() => navigate('/u')}>
        <BiEdit />
      </UploadBtn>
    </Wrapper>
  );
}

export default Home;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  min-height: 100%;
  justify-content: center;
  align-items: center;
`;

const EmptyPost = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  color: gray;

  > h2 {
    margin-bottom: 50px;
  }
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
