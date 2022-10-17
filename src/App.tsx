import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { GlobalStyle } from 'styles/GlobalStyle';
import Layout from 'pages/Layout';
import Home from 'pages/Home';
import Login from 'pages/Login';
import Register from 'pages/Register';
import DetailPage from 'pages/DetailPage';
import Upload from 'pages/Upload';
import HashtagList from 'pages/HashtagList';

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/main" element={<Home />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/hashtag/:tag" element={<HashtagList />} />
            {/* TODO 404 Not Found 페이지 만들기 */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
