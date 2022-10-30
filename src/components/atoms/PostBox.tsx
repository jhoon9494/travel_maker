import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface IProps {
  id: string;
  img: string;
}

function PostBox({ id, img }: IProps) {
  return (
    <Link to={`/detail/${id}`}>
      <Img src={img} alt={`${id}-썸네일`} />
    </Link>
  );
}

export default PostBox;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;
