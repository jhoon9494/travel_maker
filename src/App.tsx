import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { GlobalStyle } from 'styles/GlobalStyle';
import Layout from 'pages/Layout';
import Home from 'pages/Home';
import Login from 'pages/Login';
import Register from 'pages/Register';
import DetailPage from 'pages/DetailPage';
import Upload from 'pages/Upload';
import Hashtag from 'pages/Hashtag';
import Explore from 'pages/Explore';
import Mypage from 'pages/mypage';
import EditProfile from 'pages/mypage/EditProfile';
import ChangePw from 'pages/mypage/ChangePw';
import DeleteAccount from 'pages/mypage/DeleteAccount';

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/main" element={<Home />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/hashtag/:tag" element={<Hashtag />} />
            <Route path="/explore/:result" element={<Explore />} />
            <Route path="/mypage" element={<Mypage />}>
              <Route index element={<EditProfile />} />
              <Route path="editProfile" element={<EditProfile />} />
              <Route path="changePw" element={<ChangePw />} />
              <Route path="deleteAccount" element={<DeleteAccount />} />
            </Route>
            {/* TODO 404 Not Found 페이지 만들기 */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
