import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BsThreeDots } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import Confirm from './Confirm';

interface IProps {
  id: string;
  img: string;
  edit?: boolean;
}

function PostBox({ id, img, edit }: IProps) {
  const [editBox, setEditBox] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO 삭제 api 요청하기
    if (confirmResult) {
      console.log('삭제요청하기');
    }
  }, [confirmResult]);

  return (
    <Container>
      <Link to={`/detail/${id}`}>
        <Img src={img} alt={`${id}-썸네일`} />
      </Link>
      {edit && (
        <EditBtn onClick={() => setEditBox((prev) => !prev)}>
          <BsThreeDots />
        </EditBtn>
      )}
      <EditContainer active={editBox}>
        <button type="button" onClick={() => navigate(`/edit/${id}`)}>
          수정
        </button>
        <button
          type="button"
          onClick={() => {
            setConfirmOpen(true);
            setEditBox(false);
          }}
        >
          삭제
        </button>
      </EditContainer>
      {confirmOpen && (
        <Confirm
          text="게시글을 삭제하시겠습니까?"
          close={setConfirmOpen}
          setResult={setConfirmResult}
          yes="삭제하기"
          no="취소"
        />
      )}
    </Container>
  );
}

const defaultProps = {
  edit: false,
};

PostBox.defaultProps = defaultProps;

export default PostBox;

const Container = styled.div`
  position: relative;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

const EditBtn = styled.button`
  position: absolute;
  font-size: 24px;
  top: 5px;
  right: 10px;
`;

const EditContainer = styled.div<{ active: boolean }>`
  position: absolute;
  top: 25px;
  right: 10px;
  background-color: white;
  border-radius: 5px;
  width: ${({ active }) => (active ? 60 : 30)}px;
  height: ${({ active }) => (active ? 60 : 30)}px;
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  opacity: ${({ active }) => (active ? 1 : 0)};
  transition: all 0.2s ease;

  > button {
    width: 100%;
    height: 50%;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  > button:first-child {
    border-bottom: 1px solid lightgray;
  }
`;
