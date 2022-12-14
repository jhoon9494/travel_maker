import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import LazyImg from 'components/atoms/LazyImg';
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
  heart: number;
  userId: string;
  figures: FiguresType;
  postImg: string;
  hashtags: string[];
};

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [postList, setPostList] = useState<PostData[]>([]);

  // 무한 스크롤 관련 부분
  const lastIdxRef = useRef<HTMLDivElement>(null);

  const saveScrollYAndNavi = (pathName: string) => {
    // 상세 게시글페이지 이동 후 이전 게시글 목록 및 스크롤 위치 값을 유지하기 위해 세션스토리지를 이용
    sessionStorage.setItem('mainPageScrollY', String(window.scrollY));
    sessionStorage.setItem('postList', JSON.stringify(postList));
    navigate(pathName);
  };

  const getData = useCallback(async () => {
    try {
      // 유저 페이지, 해시태그 목록 페이지, 게시글 페이지 이동 후 뒤로가기를 눌렀을 때
      // api요청 없이 세션스토리지에 저장된 목록만 불러오기 위한 코드
      if (!sessionStorage.getItem('postList')) {
        const res = await axios.get('/api/post/list');
        const postData = res.data.map((data: PostData) => ({
          idx: data.idx,
          title: data.title,
          content: data.content,
          heart: data.heart,
          userId: data.userId,
          figures: data.figures,
          postImg: data.postImg.split(',')[0],
          hashtags: data.hashtags,
        }));
        setPostList((prevList) => [...prevList, ...postData]);
      } else {
        setPostList(JSON.parse(sessionStorage.getItem('postList') as string));
      }
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      // TODO 무한스크롤로 더이상 받아올 정보가 없는 경우에는 기존에 모아진 배열 그대로 다시 반환하면 될듯
      // 추가로 boxRef.current = null로 변경해서 옵저버 관찰 없애기
    }
  }, []);

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

  useEffect(() => {
    getData();
    // 스크롤 위치 복구
    window.scrollTo({ top: Number(sessionStorage.getItem('mainPageScrollY')) });
    sessionStorage.removeItem('mainPageScrollY');
    sessionStorage.removeItem('postList');
  }, [getData]);

  // postList가 갱신될 때마다 observer 설정
  useEffect(() => {
    let io;
    if (lastIdxRef.current) {
      io = new IntersectionObserver(intersectionObserver); // IntersectionObserver
      io.observe(lastIdxRef.current);
    }
  }, [postList, intersectionObserver]);

  return (
    <Wrapper>
      {/* eslint-disable */}
      {isLoading ? (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
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
              <Post ref={lastIdxRef} key={`${data.title}-${index + 1}-key`}>
                <ImgWrapper>
                  <LazyImg
                    src={data.postImg}
                    alt={`${data.title}-1번째 이미지`}
                    onClick={() => saveScrollYAndNavi(`/p/${data.idx}`)}
                  />
                </ImgWrapper>

                <PostText>
                  <H2Tag onClick={() => saveScrollYAndNavi(`/p/${data.idx}`)}>{data.title}</H2Tag>
                  <p onClick={() => saveScrollYAndNavi(`/${data.userId}`)}>{data.userId}</p>
                  <TagList>
                    {data.hashtags.map((tag) => {
                      const tagName = tag.split('#')[1];
                      return (
                        <li onClick={() => saveScrollYAndNavi(`/tag/${tagName}`)} key={`${tagName}`}>
                          {tag}
                        </li>
                      );
                    })}
                  </TagList>
                </PostText>
              </Post>
            );
          }
          return (
            <Post key={`${data.title}-${index + 1}-key`}>
              <ImgWrapper>
                <LazyImg
                  src={data.postImg}
                  alt={`${data.title}-1번째 이미지`}
                  onClick={() => saveScrollYAndNavi(`/p/${data.idx}`)}
                />
              </ImgWrapper>

              <PostText>
                <H2Tag onClick={() => saveScrollYAndNavi(`/p/${data.idx}`)}>{data.title}</H2Tag>
                <p onClick={() => saveScrollYAndNavi(`/${data.userId}`)}>{data.userId}</p>
                <TagList>
                  {data.hashtags.map((tag) => {
                    const tagName = tag.split('#')[1];
                    return (
                      <li onClick={() => saveScrollYAndNavi(`/tag/${tagName}`)} key={`${tagName}`}>
                        {tag}
                      </li>
                    );
                  })}
                </TagList>
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
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const LoadingWrapper = styled.div`
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyPost = styled.div`
  height: 80vh;
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

  @media screen and (max-width: 700px) {
    width: 600px;
    height: 225px;
  }

  @media screen and (max-width: 550px) {
    flex-direction: column;
    width: 500px;
    height: 600px;
  }
`;

const ImgWrapper = styled.div`
  flex: 2 2 0;
  cursor: pointer;

  > img {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 550px) {
    height: 80%;
    flex: none;
  }
`;

const PostText = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  padding: 25px;

  > p {
    flex: 1 1 0;
    cursor: pointer;
  }

  @media screen and (max-width: 550px) {
    flex: none;

    > p {
      flex: none;
    }
  }
`;

const H2Tag = styled.h2`
  cursor: pointer;
  flex-basis: 40px;
`;

const TagList = styled.ul`
  flex: 1 1 0;
  display: flex;
  flex-wrap: wrap;

  > li {
    margin-right: 8px;
    font-size: 18px;
    font-weight: bold;

    cursor: pointer;
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

  @media screen and (max-width: 700px) {
    left: 550px;
  }

  @media screen and (max-width: 550px) {
    left: 350px;
  }
`;
