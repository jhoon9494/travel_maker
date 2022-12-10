import styled from 'styled-components';
import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { AiFillMinusCircle } from 'react-icons/ai';
import { GlobalColor } from '../../styles/GlobalColor';
import Alert from '../atoms/Alert';

type PreviewImgType = {
  src: string;
  alt: string;
};

interface IProps {
  selectImg: Dispatch<SetStateAction<PreviewImgType | null>>;
  setImgFiles: Dispatch<SetStateAction<File[]>>;
  previewImgs: PreviewImgType[];
  setPreviewImgs: Dispatch<SetStateAction<PreviewImgType[]>>;
}

function ImgPreviewer({ selectImg, previewImgs, setImgFiles, setPreviewImgs }: IProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  // 이미지 삭제를 위한 state
  const [currImg, setCurrImg] = useState<string>('');

  const loadImg = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const maxSize = 5 * 1024 * 1024;
    if (files) {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        if (file.size > maxSize) {
          setAlertOpen(true);
          break;
        }
        const previewFile = {
          src: URL.createObjectURL(file),
          alt: `${previewImgs.length}-${i + 1}-previewFile`,
        };

        if (i === 0) {
          selectImg(previewFile);
        }

        setImgFiles((prevList) => [...prevList, file]);
        setPreviewImgs((prevList) => [...prevList, previewFile]);
      }
    }
    // 동일한 파일을 업로드할 수 있도록 현재 선택된 value를 비워줌
    e.target.value = '';
  };

  const handleImgClick = (img: PreviewImgType) => {
    selectImg(img);
  };

  const handleDeleteImg = (index: number) => {
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
                <MinusBtn onClick={() => handleDeleteImg(index)} active={currImg === img.alt}>
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
      {alertOpen && <Alert text="첨부파일 사이즈는 5MB 이내로 등록 가능합니다." open={setAlertOpen} />}
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

  :hover {
    color: ${GlobalColor.hoverColor};
  }
`;

const MinusBtn = styled.div<{ active: boolean }>`
  font-size: 20px;
  color: #f74e4e;
  position: absolute;
  right: -5px;
  top: -5px;
  opacity: ${({ active }) => (active ? 1 : 0)};
  transition: opacity 0.2s ease;
`;
