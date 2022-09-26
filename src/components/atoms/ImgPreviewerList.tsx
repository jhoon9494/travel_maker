import styled from 'styled-components';
import { useState, ChangeEvent, Dispatch, SetStateAction, MouseEvent, MouseEventHandler, useEffect } from 'react';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { AiFillMinusCircle } from 'react-icons/ai';
import { GlobalColor } from '../../styles/GlobalColor';

type PreviewImgType = {
  src: string;
  alt: string;
};

interface IProps {
  selectImg: Dispatch<SetStateAction<PreviewImgType | null>>;
  setImgFiles: Dispatch<SetStateAction<File[]>>;
  clicked: boolean;
}

function ImgPreviewer({ selectImg, clicked, setImgFiles }: IProps) {
  // 이미지 삭제를 위한 state
  const [currImg, setCurrImg] = useState<string>('');

  const [previewImgs, setPreviewImgs] = useState<PreviewImgType[]>([]);

  const loadImg = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      Array.from(files).forEach((file, index) => {
        const previewFile = {
          src: URL.createObjectURL(file),
          alt: `${previewImgs.length}-${index + 1}-previewFile`,
        };
        setImgFiles((prevList) => [...prevList, file]);
        setPreviewImgs((prevList) => [...prevList, previewFile]);

        if (index === 0) {
          selectImg(previewFile);
        }
      });
    }
  };
  const handleImgClick = (img: PreviewImgType) => {
    selectImg(img);
  };
  // TODO 제출했을 때 blob url를 제거하기 위해서 불리언 값을 보내고 되는지 확인해봤는데 잘 동작함. 제출할때 이런식으로 하면 될듯
  if (clicked) {
    previewImgs.forEach((img) => {
      URL.revokeObjectURL(img.src);
    });
  }
  const handleDeleteImg = (index: number) => {
    // FIXME setPreviewImgs로 splice를 실행할 경우 set함수가 두 번 실행되어 의도대로 동작하지 않음.
    // 깊은 복사를 통해 임시로 동작하도록 만들어두었으나, 더 좋은 방법이 있다면 해당 방법으로 수정 필요.
    const newPreviewImgs = JSON.parse(JSON.stringify(previewImgs));
    newPreviewImgs.splice(index, 1);
    setPreviewImgs(newPreviewImgs);

    // DB에 전달할 이미지 파일 목록 수정하는 함수
    setImgFiles((prevList) => {
      prevList.splice(index, 1);
      return prevList;
    });

    setCurrImg('');

    // 이미지가 삭제됨에 따라 배열 내부의 인덱스가 변경되므로 현재 선택된 이미지를 변경시키는 코드
    if (newPreviewImgs.length === 0) {
      selectImg(null);
    } else if (index === newPreviewImgs.length) {
      selectImg(newPreviewImgs[index - 1]);
    } else {
      selectImg(newPreviewImgs[index]);
    }
  };

  return (
    <Wrapper>
      <ImgWrapper>
        {previewImgs &&
          previewImgs.map((img, index) => {
            return (
              <ImgBox
                onMouseEnter={() => {
                  setCurrImg(img.alt);
                }}
                onMouseLeave={() => {
                  setCurrImg('');
                }}
                key={`${img.alt}-${index + 1}`}
              >
                <Img src={img.src} alt={img.alt} onClick={() => handleImgClick(img)} />
                <MinusBtn onClick={() => handleDeleteImg(index)} hide={currImg === img.alt}>
                  <AiFillMinusCircle />
                </MinusBtn>
              </ImgBox>
            );
          })}
      </ImgWrapper>
      <AddImg>
        <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
          <PlusBtn />
          <input id="fileUpload" style={{ display: 'none' }} multiple type="file" accept="image/*" onChange={loadImg} />
        </label>
      </AddImg>
    </Wrapper>
  );
}

export default ImgPreviewer;

const Wrapper = styled.div`
  width: 550px;
  height: 100px;
  border: 1px solid lightgray;
  display: flex;
`;

const ImgWrapper = styled.div`
  width: 480px;
  display: flex;
  align-items: center;
  padding: 0 5px;
  overflow-y: hidden;
  overflow-x: scroll;
`;

const ImgBox = styled.div`
  width: 100px;
  height: 80px;
  margin: 5px;
  cursor: pointer;
  position: relative;
`;

const Img = styled.img`
  width: 100px;
  height: 80px;
`;

const AddImg = styled.div`
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlusBtn = styled(BsFillPlusCircleFill)`
  font-size: 48px;
  color: ${GlobalColor.mainColor};
`;

const MinusBtn = styled.div<{ hide: boolean }>`
  font-size: 20px;
  color: #f74e4e;
  position: absolute;
  right: -5px;
  top: -5px;
  opacity: ${({ hide }) => (hide ? 1 : 0)};
  transition: opacity 0.2s ease;
`;
