import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Input from 'components/atoms/Input';
import SideBar from 'components/organism/SideBar';
import { GiHamburgerMenu } from 'react-icons/gi';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  // 검색 부분
  const [search, setSearch] = useState<string>('');

  // 햄버거바 부분
  const [sideOpen, setSideOpen] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search[0] === '#') {
      navigate(`/explore/${search.split('#')[1]}`);
    } else {
      navigate(`/explore/${search}`);
    }

    setSearch('');
  };

  // 페이지 전환 시 햄버거바를 닫음
  useEffect(() => {
    setSideOpen(false);
  }, [location]);

  return (
    <Container>
      <Link to="/main">
        <Logo src="/icons/logo.png" alt="logo" />
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
      <MenuBtn onClick={() => setSideOpen(true)}>
        <HamburgerIcon />
      </MenuBtn>
      <SideBar open={sideOpen} setOpen={setSideOpen} />
    </Container>
  );
}

export default Navbar;

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 65px;
  background-color: white;
  position: relative;

  > form {
    margin: 0 auto;
  }

  > a {
    position: absolute;
  }
`;

const Logo = styled.img`
  width: 164px;
  height: 30px;
  margin: 16px;
`;

const MenuBtn = styled.button`
  position: absolute;
  right: 20px;
`;

const HamburgerIcon = styled(GiHamburgerMenu)`
  width: 35px;
  height: 35px;
`;
