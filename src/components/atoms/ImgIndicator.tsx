import styled from 'styled-components';
import { GlobalColor } from '../../styles/GlobalColor';

interface Iprops {
  count: number;
  selectedIndex: number;
}

function ImgIndicator({ count, selectedIndex }: Iprops) {
  return (
    <Container>
      {Array(count)
        .fill(0)
        .map((n, i) => {
          return <Icon key={`${i + 1}-icon`} active={i === selectedIndex} />;
        })}
    </Container>
  );
}

export default ImgIndicator;

const Container = styled.div`
  display: flex;
  height: 4px;
  padding: 0 10px;
  position: absolute;
  bottom: 10px;
  right: 50%;
  transform: translate(50%, 50%);
`;

const Icon = styled.div<{ active: boolean }>`
  width: 15px;
  height: 100%;
  margin: 0 3px;
  background-color: ${({ active }) => (active ? GlobalColor.mainColor : 'white')};
`;
