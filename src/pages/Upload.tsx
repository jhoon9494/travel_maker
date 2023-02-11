import styled from 'styled-components';
import { useState, FormEvent, useEffect, useCallback, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackSpaceBtn from 'components/atoms/BackSpaceBtn';
import ImgPreviewerList from 'components/organism/ImgPreviewerList';
import ScoreInput from 'components/atoms/ScoreInput';
import CardList from 'components/organism/CardList';
import Confirm from 'components/atoms/Confirm';
import Alert from 'components/atoms/Alert';
import SubmitBtn from 'components/atoms/SubmitBtn';
import { GlobalColor } from 'styles/GlobalColor';
import { BiBulb } from 'react-icons/bi';
import axios from 'axios';
import userContext from 'context/userContext';
import Loading from '../components/atoms/Loading';

type PreviewImgType = {
  src: string;
  alt: string;
};

type TipsType = {
  placeName: string;
  tips: string;
};

function Upload() {
  const navigate = useNavigate();
  const loggedUser = useContext(userContext);
  const { id } = useParams();

  // 이미지 파일 및 미리보기 부분
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [previewImg, setPreviewImg] = useState<PreviewImgType | null>(null);
  const [previewImgs, setPreviewImgs] = useState<PreviewImgType[]>([]);

  // Confirm 부분
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState<boolean>(false);

  // Alert 부분
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');

  // 페이지 전환 부분
  const [page, setPage] = useState(1);

  // 본문 부분
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 여행 tips 부분
  const [placeName, setPlaceName] = useState('');
  const [tip, setTip] = useState('');
  const [tipsList, setTipsList] = useState<TipsType[]>([]);

  // 여행 추천 점수 부분
  const [recommend, setRecommend] = useState(0);
  const [emotion, setEmotion] = useState(0);
  const [revisit, setRevisit] = useState(0);

  // 여행 추천점수 안내 부분
  const [scoreHover, setScoreHover] = useState(false);

  // 해시태그 부분
  const [hashtag, setHashtag] = useState<string[]>([]);

  // 업로드 로딩
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const getEditData = useCallback(async () => {
    try {
      const res = await axios.get(`/api/post/detail/${id}`);
      const editData = res.data;
      const imgList: string[] = editData.postImg.trim().split(',').slice();
      // 마지막 index는 빈 값이라 제거해줌
      imgList.pop();

      setPreviewImg({
        src: `https://my-travel-maker.s3.amazonaws.com/Downloads/${imgList[0]}`,
        alt: `${editData.title}-thumbnailImage`,
      });
      setPreviewImgs(
        imgList.map((img, index) => ({
          src: `https://my-travel-maker.s3.amazonaws.com/Downloads/${img}`,
          alt: `${editData.title}-${index + 1}-image`,
        })),
      );
      setTipsList(
        editData.recommendRoutes.map((route: TipsType) => ({ placeName: route.placeName, tips: route.tips })),
      );

      setTitle(editData.title);
      setContent(editData.content);

      setRecommend(editData.figures.recommend);
      setEmotion(editData.figures.emotion);
      setRevisit(editData.figures.revisit);
    } catch (e: any) {
      console.error(e);
    }
  }, [id]);

  // 게시글 수정 시 데이터 불러오기
  useEffect(() => {
    if (id) {
      getEditData();
    }
  }, [getEditData, id]);

  // 파일업로드 첫번째 페이지에서 돌아가기 클릭 시 동작
  useEffect(() => {
    if (confirmResult) {
      navigate(-1);
    }
  }, [confirmResult, navigate]);

  const handleBackSpace = () => {
    if (page === 1) {
      setConfirmOpen(true);
    } else if (page === 2) {
      setPage(1);
    }
  };

  const handleNextStep = () => {
    setPage(2);
    // 해시태그 추출 부분
    content.split(/(#[^\s#]+)/g).forEach((str) => {
      if (str[0] === '#') {
        setHashtag((prev) => {
          // 중복된 해시태그 제거
          if (!prev.includes(str)) {
            return [...prev, str];
          }
          return [...prev];
        });
      }
    });
  };

  const handleTipSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 추천 여행지 장소명 중복검사
    if (tipsList.some((t) => t.placeName === placeName)) {
      setAlertText('이미 등록된 장소입니다. 다시 확인해주세요!');
      setPlaceName('');
      return setAlertOpen(true);
    }
    // 팁을 작성하지 않고 추가 클릭시 경고창 반환
    if (placeName === '' || tip === '') {
      setAlertText('팁을 작성한 후 추가해주세요!');
      return setAlertOpen(true);
    }
    setTipsList((prevList) => [...prevList, { placeName, tips: tip }]);
    setPlaceName('');
    return setTip('');
  };

  // 게시글 작성
  const handlePostWrite = async () => {
    if (title === '') {
      setAlertText('제목을 작성해주세요!');
      setAlertOpen(true);
      return;
    }
    if (content === '') {
      setAlertText('본문을 작성해주세요!');
      setAlertOpen(true);
      return;
    }

    if (imgFiles.length === 0) {
      setAlertText('이미지를 추가해주세요!');
      setAlertOpen(true);
      return;
    }
    setIsLoading(true);
    const jsonData = JSON.stringify({
      title,
      content,
      figures: {
        recommend,
        emotion,
        revisit,
      },
      hashtags: hashtag,
      recommendRoutes: tipsList,
    });

    const formData = new FormData();
    const postData = new Blob([jsonData], { type: 'application/json' });

    formData.append('post', postData);
    imgFiles.forEach((file) => {
      formData.append('images', file);
    });

    // blob url 제거하는 코드
    previewImgs.forEach((img) => {
      URL.revokeObjectURL(img.src);
    });

    try {
      await axios.post('api/post/write', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/${loggedUser.id}`, { replace: true });
    } catch (e: any) {
      setIsLoading(false);
      console.error(e);
    }
  };

  // 게시글 수정
  const handleEdit = async () => {
    if (title === '') {
      setAlertText('제목을 작성해주세요!');
      setAlertOpen(true);
      return;
    }
    if (content === '') {
      setAlertText('본문을 작성해주세요!');
      setAlertOpen(true);
      return;
    }

    if (previewImgs.length === 0) {
      setAlertText('이미지를 추가해주세요!');
      setAlertOpen(true);
      return;
    }
    setIsLoading(true);

    const postImg = previewImgs.map((img) =>
      img.src.replace('https://my-travel-maker.s3.amazonaws.com/Downloads/', ''),
    );

    const jsonData = JSON.stringify({
      title,
      content,
      figures: {
        recommend,
        emotion,
        revisit,
      },
      hashtags: hashtag,
      recommendRoutes: tipsList,
      postImg,
    });

    const formData = new FormData();
    const postData = new Blob([jsonData], { type: 'application/json' });

    formData.append('post', postData);
    if (imgFiles.length > 0) {
      imgFiles.forEach((file) => {
        formData.append('images', file);
      });
    } else {
      formData.append('images', 'null');
    }
    try {
      const res = await axios.post(`/api/post/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
      setIsLoading(false);
      navigate(`/${loggedUser.id}`, { replace: true });
    } catch (e: any) {
      setIsLoading(false);
      console.error(e);
    }
  };

  return (
    <Container>
      {isLoading ? (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      ) : (
        <>
          <BtnsContainer>
            <BackSpaceBtn onClick={handleBackSpace} />
            <span style={{ flexGrow: 1 }} />
            {/* eslint-disable-next-line */}
            <Button onClick={page === 1 ? handleNextStep : id ? handleEdit : handlePostWrite}>
              {page === 1 ? '다음' : '제출'}
            </Button>
          </BtnsContainer>

          {page === 1 ? (
            // 첫번째 페이지, 이미지 추가 및 본문 작성 영역
            <UploadContainer>
              <ImgPreviewer>
                {/* eslint-disable-next-line */}
                {isPreviewLoading ? (
                  <PreviewWrapper>
                    <Loading />
                  </PreviewWrapper>
                ) : previewImg ? (
                  <Img src={previewImg?.src} alt={previewImg?.alt} />
                ) : (
                  <PreviewWrapper>
                    <p>이미지를 추가해주세요</p>
                    <br />
                    <p>최대 10장까지 업로드 가능합니다.</p>
                  </PreviewWrapper>
                )}
                <ImgPreviewerList
                  setIsLoading={setIsPreviewLoading}
                  selectImg={setPreviewImg}
                  setImgFiles={setImgFiles}
                  setPreviewImgs={setPreviewImgs}
                  previewImgs={previewImgs}
                />
              </ImgPreviewer>
              <TextContainer>
                <Input
                  type="text"
                  placeholder="제목을 입력해주세요."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextArea
                  placeholder="본문을 작성해주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  height="400"
                />
              </TextContainer>
            </UploadContainer>
          ) : (
            // 두번째 페이지, 여행 추천 점수 및 팁 작성 영역
            <UploadContainer>
              <AddTipScoreContainer>
                <h3>여행 Tips</h3>
                <Form onSubmit={handleTipSubmit}>
                  <Input
                    type="text"
                    placeholder="추천 장소를 입력해주세요."
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                  />
                  <TextArea
                    placeholder="여행지의 꿀팁을 알려주세요."
                    value={tip}
                    onChange={(e) => {
                      if (e.target.value.length <= 100) {
                        setTip(e.target.value);
                      }
                    }}
                    height="200"
                  />
                  <CharacterRange>{tip.length}/100</CharacterRange>
                  <SubmitBtn value="추가하기" />
                </Form>
                <div style={{ marginTop: '20px', position: 'relative' }}>
                  <h3 style={{ display: 'flex', padding: '0 12px' }}>
                    여행 추천 점수
                    <BiBulb
                      style={{ marginLeft: '5px' }}
                      onMouseEnter={() => setScoreHover(true)}
                      onMouseLeave={() => setScoreHover(false)}
                    />
                  </h3>
                  <ScoreTip hover={scoreHover}>최소 0점에서 최대 100점까지 입력 가능</ScoreTip>
                  <ScoreContainer>
                    <ScoreInput id="recommend" value={recommend} setValue={setRecommend} text="추천도" />
                    <ScoreInput id="emotion" value={emotion} setValue={setEmotion} text="감성" />
                    <ScoreInput id="revisit" value={revisit} setValue={setRevisit} text="재방문" />
                  </ScoreContainer>
                </div>
              </AddTipScoreContainer>

              <TipsContainer>
                <CardList list={tipsList} setList={setTipsList} />
              </TipsContainer>
            </UploadContainer>
          )}
          {confirmOpen && (
            <Confirm
              text={`현재까지 작성하신 게시글이 삭제됩니다.\n\n돌아가시겠습니까?`}
              open={setConfirmOpen}
              setResult={setConfirmResult}
              yes="돌아가기"
              no="취소"
            />
          )}
          {alertOpen && <Alert text={alertText} open={setAlertOpen} />}
        </>
      )}
    </Container>
  );
}

export default Upload;

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
`;

const LoadingWrapper = styled.div`
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BtnsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  font-size: 16px;
  margin: 20px 50px 0 0;
  background-color: ${GlobalColor.mainColor};
  color: white;
  padding: 4px 12px;
  border-radius: 5px;

  :hover {
    background-color: ${GlobalColor.hoverColor};
  }
`;

const UploadContainer = styled.div`
  display: flex;
  margin: 0 20px;
  padding: 0 20px;

  @media screen and (max-width: 720px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  width: 100%;
  border: lightgray 1px solid;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;

  &::placeholder {
    font-size: 14px;
  }
`;

const ImgPreviewer = styled.div`
  flex: 2 2 0;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const PreviewWrapper = styled.div`
  max-width: 550px;
  aspect-ratio: 4 / 3;
  border: 1px solid lightgray;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999999;

  @media screen and (max-width: 720px) {
    max-width: 100%;
  }
`;

const Img = styled.img`
  max-width: 550px;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  margin-bottom: 10px;

  @media screen and (max-width: 720px) {
    max-width: 100%;
  }
`;

const TextContainer = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  margin: 20px 0 0 20px;

  @media screen and (max-width: 720px) {
    margin: 20px 0 0;
  }
`;

const TextArea = styled.textarea<{ height: string }>`
  width: 100%;
  height: ${({ height }) => height}px;
  margin: 10px 0;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 15px;
`;

const AddTipScoreContainer = styled.div`
  flex: 3 3 0;
  display: flex;
  flex-direction: column;
  margin: 20px 0 0;

  > h3 {
    padding: 12px;
  }
`;

const Form = styled.form`
  width: 100%;
  text-align: center;
  position: relative;
  padding: 0 10px;
  margin-bottom: 20px;

  > button {
    width: 100%;
    margin: 0;
    font-size: 18px;
  }
`;

const CharacterRange = styled.div`
  position: absolute;
  font-size: 14px;
  bottom: 70px;
  right: 25px;

  color: gray;
`;

const ScoreTip = styled.div<{ hover: boolean }>`
  position: absolute;
  top: -2px;
  left: 150px;
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 5px;
  background-color: lightgray;
  visibility: ${({ hover }) => (hover ? 'visible' : 'hidden')};
  opacity: ${({ hover }) => (hover ? '1' : '0')};
  transition: all 0.3s ease;
`;

const ScoreContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const TipsContainer = styled.div`
  flex: 2 2 0;
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
  border-radius: 5px;
  margin: 67px 0 20px;
  padding: 10px 0;

  @media screen and (max-width: 720px) {
    margin: 20px 10px;
  }
`;
