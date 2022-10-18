import styled from 'styled-components';

interface IProps {
  src: string;
  alt: string;
  name?: string;
}

function UserImage({ src, alt, name }: IProps) {
  return (
    <>
      <Img src={src} alt={alt} />
      {/* name은 선택사항 */}
      {name && <Name>{name}</Name>}
    </>
  );
}

const defaultProps = {
  name: '',
};

UserImage.defaultProps = defaultProps;

export default UserImage;

const Img = styled.img`
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background-color: gray;
`;

const Name = styled.div`
  margin-top: 14px;
  font-size: 16px;
`;
