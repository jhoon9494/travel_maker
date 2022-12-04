import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BsThreeDots } from 'react-icons/bs';
import { useCallback, useEffect, useState, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import Confirm from './Confirm';

interface IProps {
  id: string;
  img: string;
  edit?: boolean;
  setDeleteIndex?: Dispatch<SetStateAction<string>>;
}

function PostBox({ id, img, edit, setDeleteIndex }: IProps) {
  const [editBox, setEditBox] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const deletePost = useCallback(async () => {
    try {
      const res = await axios.get(`/api/post/${id}`);
      // 게시글 삭제되었을 경우 게시글 목록을 새로 받아오기 위한 부분
      if (res.data === 'OK' && setDeleteIndex) {
        setDeleteIndex(id);
      }
    } catch (e: any) {
      console.error(e);
    }
  }, [setDeleteIndex, id]);

  useEffect(() => {
    if (confirmResult) {
      deletePost();
    }
  }, [confirmResult, deletePost]);

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
          open={setConfirmOpen}
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
  setDeleteIndex: undefined,
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
  border: 1px solid lightgray;
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
