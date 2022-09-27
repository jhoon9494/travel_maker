import styled from 'styled-components';
import { useState, FormEvent } from 'react';
import BackSpaceBtn from 'components/atoms/BackSpaceBtn';
import ImgPreviewerList from 'components/organism/ImgPreviewerList';
import Input from 'components/atoms/Input';
import CardList from 'components/organism/CardList';

type PreviewImgType = {
  src: string;
  alt: string;
};

type TipsType = {
  placeName: string;
  tip: string;
};

function Upload() {
  // 이미지 파일 및 미리보기 부분
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [previewImg, setPreviewImg] = useState<PreviewImgType | null>(null);

  // 게시글 작성 후 제출 시 blob url를 제거하기 위한 코드
  const [clicked, setClicked] = useState(false);

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

  const handleTipSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tipsList.some((t) => t.placeName === placeName)) {
      return alert('이미 등록된 장소입니다. 다시 확인해주세요!');
    }
    if (placeName === '' || tip === '') {
      return alert('팁을 작성한 후 추가해주세요!');
    }
    setTipsList((prevList) => [...prevList, { placeName, tip }]);
    setPlaceName('');
    return setTip('');
  };

  const handleBackSpace = () => {
    // 제출했을 때 blob url를 제거하기 위해서 불리언 값을 보내고 되는지 확인해봤는데 잘 동작함. 제출할때 이런식으로 하면 될듯
    setClicked(true);
    // TODO 뒤로가기 전 게시글 삭제여부 물어보는 경고창 띄운 후 응답에 맞게 실행
    // 돌아갈 경우 작성하신 게시글이 삭제됩니다. 돌아가시겠습니까? 예 | 아니오
  };

  return (
    <Wrapper>
      <BackSpaceBtn onClick={handleBackSpace} />
      {/* 이미지 추가 및 본문 작성 영역 */}
      <div style={{ display: 'flex', paddingLeft: '50px' }}>
        <ImgPreviewer>
          {previewImg ? (
            <Img src={previewImg?.src} alt={previewImg?.alt} />
          ) : (
            <EmptyImg>
              {/* eslint-disable-next-line  */}
              {/* TODO 제출 시 이미지가 없을 경우 에러를 띄워서 글을 작성할 수 없다고 알리기 */}
              이미지를 추가해주세요
            </EmptyImg>
          )}
          <ImgPreviewerList selectImg={setPreviewImg} clicked={clicked} setImgFiles={setImgFiles} />
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
        {/* TODO 해시태그 컴포넌트 추가 */}
      </div>
      <div style={{ display: 'flex', paddingLeft: '50px' }}>
        {/* TODO 컴포넌트 분리해서 organism에 분류해두기 */}
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
            <input type="submit" value="추가하기" />
          </Form>
          <div style={{ marginTop: '20px' }}>
            <h3>여행 추천 점수</h3>
            <ScoreContainer>
              <ScoreItem>
                <Label htmlFor="recommend">추천도</Label>
                <input
                  id="recommend"
                  value={recommend}
                  type="number"
                  onChange={(e) => {
                    const score = Number(e.target.value);
                    if (score > 100 || score < 0) {
                      return;
                    }
                    setRecommend(e.target.value);
                  }}
                />
              </ScoreItem>
              <ScoreItem>
                <Label htmlFor="emotion">감성</Label>
                <input
                  id="emotion"
                  value={emotion}
                  type="number"
                  onChange={(e) => {
                    const score = Number(e.target.value);
                    if (score > 100 || score < 0) {
                      return;
                    }
                    setEmotion(e.target.value);
                  }}
                />
              </ScoreItem>
              <ScoreItem>
                <Label htmlFor="revisit">재방문</Label>
                <input
                  id="revisit"
                  value={revisit}
                  type="number"
                  onChange={(e) => {
                    const score = Number(e.target.value);
                    if (score > 100 || score < 0) {
                      return;
                    }
                    setRevisit(e.target.value);
                  }}
                />
              </ScoreItem>
            </ScoreContainer>
          </div>
        </AddTipScoreContainer>

        <TipsContainer>
          <CardList list={tipsList} setList={setTipsList} />
        </TipsContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button type="button">작성하기</button>
        <button type="button" onClick={handleBackSpace}>
          취소
        </button>
      </div>
    </Wrapper>
  );
}

export default Upload;

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
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
`;

const ScoreContainer = styled.div`
  display: flex;
  width: 400px;
  height: 100px;
  justify-content: center;
  align-items: center;
`;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  margin: 20px;

  > input {
    width: 100%;
    border: none;
    margin-top: 5px;
    text-align: center;
    font-size: 26px;
    font-weight: bold;

    :focus {
      outline: none;
    }
  }
`;

const Label = styled.label`
  cursor: pointer;
`;

const TipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 47px 0 20px 20px;
`;
