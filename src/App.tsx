import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { GlobalStyle } from 'styles/GlobalStyle';
import Home from 'pages/Home';
import Login from 'pages/Login';
import Register from 'pages/Register';

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
