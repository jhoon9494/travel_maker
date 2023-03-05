import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import LazyImg from 'components/atoms/LazyImg';
import { getAllPost } from 'api/post';
import { AxiosError } from 'axios';
import Loading from '../../components/atoms/Loading';
import { IPostData } from './home.d';

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [postList, setPostList] = useState<IPostData[]>([]);

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
        const res = await getAllPost(pageCount);
        const postData = res.data.map((data: IPostData) => ({
          idx: data.idx,
          title: data.title,
          content: data.content,
          heart: data.heart,
          userId: data.userId,
          figures: data.figures,
          postImg: data.postImg.split(',')[0],
          hashtags: data.hashtags.slice(0, 4),
        }));
        setPostList((prevList) => [...prevList, ...postData]);
      } else {
        setPostList(JSON.parse(sessionStorage.getItem('postList') as string));
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [pageCount]);

  const intersectionObserver = useCallback((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach((entry) => {
      // 관찰대상 entry가 화면에 보여지는 경우 실행
      if (entry.isIntersecting) {
        observer.unobserve(entry.target); // entry 관찰 해제
        if (setPageCount) setPageCount((curr) => curr + 1);
      }
    });
  }, []);

  useEffect(() => {
    getData();

    // 스크롤 위치 복구
    setTimeout(() => {
      window.scrollTo({ top: Number(sessionStorage.getItem('mainPageScrollY')) });
      sessionStorage.removeItem('mainPageScrollY');
      sessionStorage.removeItem('postList');
    }, 0);
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
                  <h2>
                    <span onClick={() => saveScrollYAndNavi(`/p/${data.idx}`)}>{data.title}</span>
                  </h2>
                  <div>
                    <span onClick={() => saveScrollYAndNavi(`/${data.userId}`)}>{data.userId}</span>
                  </div>
                  <ul>
                    {data.hashtags.map((tag) => {
                      const tagName = tag.split('#')[1];
                      return (
                        <li key={`${tagName}`}>
                          <span onClick={() => saveScrollYAndNavi(`/tag/${tagName}`)}>{tag}</span>
                        </li>
                      );
                    })}
                  </ul>
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
                <h2>
                  <span onClick={() => saveScrollYAndNavi(`/p/${data.idx}`)}>{data.title}</span>
                </h2>
                <div>
                  <span onClick={() => saveScrollYAndNavi(`/${data.userId}`)}>{data.userId}</span>
                </div>
                <ul>
                  {data.hashtags.map((tag) => {
                    const tagName = tag.split('#')[1];
                    return (
                      <li key={`${tagName}`}>
                        <span onClick={() => saveScrollYAndNavi(`/tag/${tagName}`)}>{tag}</span>
                      </li>
                    );
                  })}
                </ul>
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
  display: grid;
  grid-template-columns: repeat(1, minmax(500px, 900px));
  background-color: white;
  justify-content: center;
  align-items: center;
  margin: 0 30px;
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
  width: 100%;
  aspect-ratio: 21 / 9;
  margin: 15px auto;
  padding: 15px;
  background-color: #f1f1f1da;
  border-radius: 5px;
  box-shadow: 7px 7px 20px #cbcbcb;

  @media screen and (max-width: 720px) {
    flex-direction: column;
    aspect-ratio: 1 / 1;
  }

  :hover {
    transform: scale(1.05);
    transition: all ease 0.3s;
  }
`;

const ImgWrapper = styled.div`
  cursor: pointer;
  width: 55%;
  height: 100%;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    border: 1px lightgray solid;
  }

  @media screen and (max-width: 720px) {
    width: 100%;
    height: 65%;
  }
`;

const PostText = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  padding: 25px;

  span {
    cursor: pointer;
  }

  /* 제목 */
  > h2 {
    flex-basis: 40px;
  }

  /* 작성자 */
  > div {
    flex: 2 2 0;
  }

  /* 해시태그 */
  > ul {
    flex: 1 1 0;
    display: flex;
    flex-wrap: wrap;

    > li {
      margin-right: 8px;
      font-size: 18px;
      font-weight: bold;
    }
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
