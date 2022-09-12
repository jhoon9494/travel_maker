import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Input from 'components/atoms/Input';
import { GiHamburgerMenu } from 'react-icons/gi';

function Navbar() {
  const [search, setSearch] = useState<string>('');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // TODO axios 사용하여 검색 api 요청하기
      console.log(search);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <Container>
      <Link to="/">
        <Logo src="/logo/logo.png" alt="logo" />
      </Link>
      <form onSubmit={handleSearch}>
        <Input
          id="search"
          placeholder="검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          size="medium"
        />
      </form>
      <MenuBtn>
        <HamburgerMenu />
      </MenuBtn>
    </Container>
  );
}

export default Navbar;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 65px;
  background-color: white;

  > form {
    flex-grow: 1;
    margin-left: 160px;
  }
`;

const Logo = styled.img`
  width: 164px;
  height: 30px;
  margin: 16px;
`;

const MenuBtn = styled.button`
  margin-right: 50px;
`;

const HamburgerMenu = styled(GiHamburgerMenu)`
  width: 35px;
  height: 35px;
`;
