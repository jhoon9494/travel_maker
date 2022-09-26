import styled from 'styled-components';
import { useState } from 'react';
import BackSpaceBtn from 'components/atoms/BackSpaceBtn';
import ImgPreviewerList from 'components/atoms/ImgPreviewerList';
import Input from 'components/atoms/Input';

type PreviewImgType = {
  src: string;
  alt: string;
};

function Upload() {
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [previewImg, setPreviewImg] = useState<PreviewImgType | null>(null);
  const [clicked, setClicked] = useState(false);
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  // };

  const handleBackSpace = () => {
    // 제출했을 때 blob url를 제거하기 위해서 불리언 값을 보내고 되는지 확인해봤는데 잘 동작함. 제출할때 이런식으로 하면 될듯
    setClicked(true);
    // TODO 뒤로가기 전 게시글 삭제여부 물어보는 경고창 띄운 후 응답에 맞게 실행
    // 돌아갈 경우 작성하신 게시글이 삭제됩니다. 돌아가시겠습니까? 예 | 아니오
  };

  // TODO 여행 추천 tips의 장소명 중복 검사 프론트에서 자체적으로 실시해서 전달

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
              {/* TODO 이미지가 없을 경우 에러를 띄워서 글을 작성할 수 없다고 알리기 */}
              이미지를 추가해주세요
            </EmptyImg>
          )}
          <ImgPreviewerList selectImg={setPreviewImg} clicked={clicked} setImgFiles={setImgFiles} />
        </ImgPreviewer>
        <TextContainer>
          <Input
            id="header"
            type="text"
            placeholder="제목을 입력해주세요."
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            size="medium"
          />
          <TextArea placeholder="본문을 작성해주세요." value={body} onChange={(e) => setBody(e.target.value)} />
        </TextContainer>
        {/* TODO 해시태그 컴포넌트 추가 */}
      </div>
      {/* 여행 팁, 점수 작성 영역 */}
      <div style={{ display: 'flex', paddingLeft: '50px' }}>여행 팁 및 점수 작성 영역</div>
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

const TextArea = styled.textarea`
  width: 245px;
  height: 200px;
  margin: 10px 0;
  border: 1px solid lightgray;
  padding: 15px;
`;
