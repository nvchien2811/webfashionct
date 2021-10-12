import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './page/App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import {BrowserRouter as Router} from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
