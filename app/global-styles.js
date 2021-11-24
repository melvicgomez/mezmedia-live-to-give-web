import { createGlobalStyle } from 'styled-components';
import { Colors } from 'theme/colors';
import NotoSansBold from './fonts/NotoSans-Bold.ttf';
import NotoSansSemiBold from './fonts/NotoSans-SemiBold.ttf';
import NotoSansRegular from './fonts/NotoSans-Regular.ttf';
import NotoSansMedium from './fonts/NotoSans-Medium.ttf';
import 'antd/dist/antd.css';

// const zero = 0;
// const tiny = 5;
// const small = 10;
// const regular = 15;
// const medium = 20;
// const large = 30;

const GlobalStyle = createGlobalStyle`

  @font-face {
    font-family: 'NotoSans-Bold';
    src:  url(${NotoSansBold}) format('truetype');
  }

  @font-face {
    font-family: 'NotoSans-Medium';
    src: url(${NotoSansMedium}) format('truetype');
  }

  @font-face {
    font-family: 'NotoSans-Regular';
    src: url(${NotoSansRegular}) format('truetype');
  }

  @font-face {
    font-family: 'NotoSans-SemiBold';
    src: url(${NotoSansSemiBold}) format('truetype');
  }

  ${'' /* * {
    font-family: NotoSans-Regular, sans-serif ;
  } */}

  html,
  body {
    background-color: ${Colors.background};
    height: 100%;
    width: 100%;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #343434;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: NotoSans-Regular, sans-serif;
    line-height: 1.5em;
    margin-bottom: 0px;
  }

  strong {
    font-family: NotoSans-Bold, sans-serif;
  }
  
  ::-webkit-scrollbar {
    width: 15px;
    background-color: #00000030
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #FFFFFF40; 
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #FFFFFF60; 
  }

  .ant-modal-mask {
    z-index: 999999 !important;
  }

  .ant-modal-wrap {
    z-index: 999999 !important;
  }

  .h1 {
    font-family: NotoSans-Bold !important;
    font-weight:bold;
    font-size: 28px;
  }

  .h2 {
    font-family: NotoSans-Bold !important;
    font-weight:bold;
    font-size: 24px;
  }

  .h3 {
    font-family: NotoSans-Bold !important;
    font-weight:bold;
    font-size: 16px;
  }

  .body {
    font-family: NotoSans-Regular !important;
    font-size: 15px;
  }

  .bodyBold {
    font-family: NotoSans-Bold !important;
    font-weight:bold;
    font-size: 15px;
  }

  .bodyLink {
    font-family: NotoSans-Regular !important;
    font-size: 15px;
    text-decoration: underline;
  }

  .caption {
    font-family: NotoSans-Regular !important;
    font-size: 13px;
  }

  .captionBold {
    font-family: NotoSans-Bold !important;
    font-weight:bold;
    font-size: 13px;
  }

  .captionLink {
    font-family: NotoSans-Regular !important;
    font-size: 13px;
    text-decoration: underline;
  }

  .anchor-link{
    text-decoration: underline;
    color: white !important;
    :hover, :active{
      text-decoration: underline;
      color: white !important;
    }
    :hover{
      opacity: 0.8;
    }
  }

  .cyan-text{
    color: ${Colors.cyan};
  }
  .grapefruit-text{
    color: ${Colors.grapefruit};
  }
  .digitalBlue-text{
    color: ${Colors.digitalBlue};
  }
  .darkBlue-text{
    color: ${Colors.darkBlue};
  }
  .white-text{
    color: ${Colors.pureWhite};
  }
  .orange-text{
    color: ${Colors.warning};
  }
  .green-text{
    color: ${Colors.positive};
  }
  .darkGrey-text{
    color: ${Colors.darkGrey};
  }
  .mediumGray-text{
    color: ${Colors.mediumGray};
  }
  .error-text{
    color: ${Colors.red};
  }
  .delete-text{
    color: ${Colors.error};
  }


  .text-input {
    color: ${Colors.white};
    border: 2px solid;
    border-color: ${Colors.white};
    background: ${Colors.textInput};
    box-sizing: border-box;
    border-radius: 16px;
    height: 48px;

    ::placeholder {
      color: ${Colors.white};
      opacity: 0.5;
    }

    &.has-error{
      border-color: ${Colors.error};
    }
  }

  .center{
    text-align: center;
  }
  .left{
    text-align: left;
  }
  .right{
    text-align: right;
  }

  .italic{
    font-style: italic;
  }
  
  #users-table-to-xls{
    display: none;
    visibility:hidden;
  }

  .divider {
    border-bottom: 1px solid white;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .divider:last-child {
    border-bottom: 0px solid white;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

export default GlobalStyle;
