import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import LazyImg from 'components/atoms/LazyImg';
import { getAllPost } from 'api/post';
import { AxiosError } from 'axios';
import infiniteScroll from 'utils/InfiniteScroll';
import { formatPostData } from 'utils/formatter';
import useNavi from 'hooks/useNavi';
import Loading from '../components/atoms/Loading';
import { IPostData } from '../interface/post.d';

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [postList, setPostList] = useState<IPostData[]>([]);
  const lastIdxRef = useRef<HTMLDivElement>(null);
  const { onMovePage, savedPostList } = useNavi(postList, sessionStorage);

  const getData = useCallback(
    async (saveData?: string) => {
      try {
        if (!saveData) {
          const res = await getAllPost(pageCount);
          const postData = formatPostData(res.data);
          setPostList((prevList) => [...prevList, ...postData]);
        } else {
          setPostList(JSON.parse(saveData));
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error);
          throw error;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [pageCount],
  );

  useEffect(() => {
    getData(savedPostList || undefined);
  }, [getData, savedPostList]);

  useEffect(() => {
    let io;
    if (lastIdxRef.current) {
      io = new IntersectionObserver(infiniteScroll(setPageCount));
      io.observe(lastIdxRef.current);
    }
  }, [postList]);

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
                    onClick={() => onMovePage(`/p/${data.idx}`)}
                  />
                </ImgWrapper>

                <PostText>
                  <h2>
                    <span onClick={() => onMovePage(`/p/${data.idx}`)}>{data.title}</span>
                  </h2>
                  <div>
                    <span onClick={() => onMovePage(`/${data.userId}`)}>{data.userId}</span>
                  </div>
                  <ul>
                    {data.hashtags?.map((tag) => {
                      const tagName = tag.split('#')[1];
                      return (
                        <li key={`${tagName}`}>
                          <span onClick={() => onMovePage(`/tag/${tagName}`)}>{tag}</span>
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
                  onClick={() => onMovePage(`/p/${data.idx}`)}
                />
              </ImgWrapper>

              <PostText>
                <h2>
                  <span onClick={() => onMovePage(`/p/${data.idx}`)}>{data.title}</span>
                </h2>
                <div>
                  <span onClick={() => onMovePage(`/${data.userId}`)}>{data.userId}</span>
                </div>
                <ul>
                  {data.hashtags?.map((tag) => {
                    const tagName = tag.split('#')[1];
                    return (
                      <li key={`${tagName}`}>
                        <span onClick={() => onMovePage(`/tag/${tagName}`)}>{tag}</span>
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
