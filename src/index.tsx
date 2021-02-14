import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const strictMode = false;


const ReactApp =
  strictMode ?
    <React.StrictMode><App/></React.StrictMode> :
    <App/>;


ReactDOM.render(
  ReactApp,
  document.getElementById('root')
);