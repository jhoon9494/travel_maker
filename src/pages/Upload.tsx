import styled from 'styled-components';
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackSpaceBtn from 'components/atoms/BackSpaceBtn';
import ImgPreviewerList from 'components/organism/ImgPreviewerList';
import Input from 'components/atoms/Input';
import ScoreInput from 'components/atoms/ScoreInput';
import CardList from 'components/organism/CardList';
import Confirm from 'components/atoms/Confirm';
import Alert from 'components/atoms/Alert';
import SubmitBtn from 'components/atoms/SubmitBtn';
import { GlobalColor } from 'styles/GlobalColor';
import { BiBulb } from 'react-icons/bi';

type PreviewImgType = {
  src: string;
  alt: string;
};

type TipsType = {
  placeName: string;
  tip: string;
};

function Upload() {
  const navigate = useNavigate();
  // TODO 수정하기로 들어온 경우 useParams id값으로 게시글 인식해서 기존 작성된 게시글 정보를 api 요청해서 가져온 후 각 업로드 set함수에 반영하기

  // 이미지 파일 및 미리보기 부분
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [previewImg, setPreviewImg] = useState<PreviewImgType | null>(null);
  const [previewImgs, setPreviewImgs] = useState<PreviewImgType[]>([]);

  // Confirm 부분
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState<boolean | null>(null);

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
  const [recommend, setRecommend] = useState<string>('0');
  const [emotion, setEmotion] = useState<string>('0');
  const [revisit, setRevisit] = useState<string>('0');

  // 여행 추천점수 안내 부분
  const [scoreHover, setScoreHover] = useState(false);

  // 해시태그 부분
  const [hashtag, setHashtag] = useState<string[]>([]);

  useEffect(() => {
    // 파일업로드 첫번째 페이지에서 돌아가기 클릭 시 동작
    if (confirmResult) {
      navigate(-1);
    }
  }, [confirmResult, navigate]);

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
    setTipsList((prevList) => [...prevList, { placeName, tip }]);
    setPlaceName('');
    return setTip('');
  };

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
        setHashtag((prev) => [...prev, str]);
      }
    });
  };

  const handleWrite = () => {
    if (imgFiles.length === 0) {
      setAlertText('이미지를 추가하여 작성해주세요!');
      return setAlertOpen(true);
    }
    // blob url 제거하는 코드
    previewImgs.forEach((img) => {
      URL.revokeObjectURL(img.src);
    });

    // TODO API 요청하는 코드 작성하기.
    return console.log(content, hashtag);
  };

  return (
    <Wrapper>
      <BtnsContainer>
        <BackSpaceBtn onClick={handleBackSpace} />
        <span style={{ flexGrow: 1 }} />
        {page === 1 ? (
          <Button type="button" onClick={handleNextStep}>
            다음
          </Button>
        ) : (
          <Button type="button" onClick={handleWrite}>
            제출
          </Button>
        )}
      </BtnsContainer>

      {page === 1 ? (
        <div style={{ display: 'flex', paddingLeft: '50px' }}>
          {/* 이미지 추가 및 본문 작성 영역 */}
          <ImgPreviewer>
            {previewImg ? (
              <Img src={previewImg?.src} alt={previewImg?.alt} />
            ) : (
              <EmptyImg>이미지를 추가해주세요</EmptyImg>
            )}
            <ImgPreviewerList
              selectImg={setPreviewImg}
              setImgFiles={setImgFiles}
              setPreviewImgs={setPreviewImgs}
              previewImgs={previewImgs}
            />
          </ImgPreviewer>
          <TextContainer>
            <Input
              id="title"
              type="text"
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="medium"
            />
            <TextArea
              placeholder="본문을 작성해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              width="245"
              height="200"
            />
          </TextContainer>
        </div>
      ) : (
        <div style={{ display: 'flex', paddingLeft: '50px' }}>
          {/* 여행 추천 점수 및 팁 작성 영역 */}
          <AddTipScoreContainer>
            <h3>여행 Tips</h3>
            <Form onSubmit={handleTipSubmit}>
              <Input
                id="placeName"
                type="text"
                placeholder="추천 장소를 입력해주세요."
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
              />
              <TextArea
                placeholder="여행지의 꿀팁을 알려주세요."
                value={tip}
                onChange={(e) => setTip(e.target.value)}
                width="400"
                height="100"
              />
              <SubmitBtn value="추가하기" />
            </Form>
            <div style={{ marginTop: '20px', position: 'relative' }}>
              <h3 style={{ display: 'flex' }}>
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
        </div>
      )}
      {confirmOpen && (
        <Confirm
          text={`현재까지 작성하신 게시글이 삭제됩니다.\n돌아가시겠습니까?`}
          close={setConfirmOpen}
          setResult={setConfirmResult}
          yes="돌아가기"
          no="취소"
        />
      )}
      {alertOpen && <Alert text={alertText} open={setAlertOpen} />}
    </Wrapper>
  );
}

export default Upload;

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
`;

const BtnsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  font-size: 16px;
  margin: 20px 70px 0 0;
  background-color: ${GlobalColor.mainColor};
  color: white;
  padding: 4px 12px;
  border-radius: 5px;

  :hover {
    background-color: ${GlobalColor.hoverColor};
  }
`;

const ImgPreviewer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const EmptyImg = styled.div`
  width: 550px;
  height: 390px;
  border: 1px solid lightgray;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999999;
`;

const Img = styled.img`
  width: 550px;
  height: 390px;
  margin-bottom: 10px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 0 0 20px;
`;

const TextArea = styled.textarea<{ width: string; height: string }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  margin: 10px 0;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 15px;
`;

const AddTipScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const Form = styled.form`
  width: 400px;
  text-align: center;

  > button {
    margin: 0;
    font-size: 16px;
  }
`;

const ScoreTip = styled.div<{ hover: boolean }>`
  position: absolute;
  top: -2px;
  right: 20px;
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
  width: 400px;
  height: 100px;
  justify-content: center;
  align-items: center;
`;

const TipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 47px 0 20px 20px;
`;
