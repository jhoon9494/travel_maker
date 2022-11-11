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
import UserPage from 'pages/UserPage';
import ContextProvider from 'context/ContextProvider';
import FollowListPage from 'pages/FollowListPage';
import NotFound from 'pages/NotFound';

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <ContextProvider>
          <Routes>
            {/* 로그인 및 회원가입 */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 메인 페이지 */}
            <Route element={<Layout />}>
              <Route path="/main" element={<Home />} />

              {/* 게시글 페이지 */}
              <Route path="/detail/:id" element={<DetailPage />} />

              {/* 게시글 업로드 및 수정 */}
              <Route path="/upload" element={<Upload />} />
              <Route path="/edit/:id" element={<Upload />} />

              {/* 유저 및 해시태그 검색 관련 */}
              <Route path="/hashtag/:tag" element={<Hashtag />} />
              <Route path="/explore/:result" element={<Explore />} />

              {/* 유저 상세 페이지 */}
              <Route path="/:userId" element={<UserPage />} />
              <Route path="/:userId/follow" element={<FollowListPage />} />
              <Route path="/:userId/follower" element={<FollowListPage />} />

              {/* 마이페이지 */}
              <Route path="/mypage" element={<Mypage />}>
                <Route index element={<EditProfile />} />
                <Route path="editProfile" element={<EditProfile />} />
                <Route path="changePw" element={<ChangePw />} />
                <Route path="deleteAccount" element={<DeleteAccount />} />
              </Route>
            </Route>

            {/* Not Found 페이지 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
