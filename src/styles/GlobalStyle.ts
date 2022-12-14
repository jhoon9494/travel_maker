import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
/* other styles */
* {
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans KR', sans-serif;
}
body {
  width: 935px;
  margin: 0 auto;
  font-family: 'Noto Sans KR', sans-serif;
  position: relative;

  @media screen and (max-width: 700px){
    width: 700px   
  }

  @media screen and (max-width: 550px){
    width: 550px   
  }
}
*, :after, :before {
    box-sizing: border-box;
}
a {
  color: inherit;
  text-decoration: none;
  &:hover,
  &:focus {
    cursor: pointer;
  }
}
button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}
ul,
ol {
  list-style: none;
}
input::placeholder,textarea::placeholder {
  color: #999999;
  
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

`;
