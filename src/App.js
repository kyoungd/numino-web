import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import { chartjs } from './helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import { Provider } from 'react-redux';
import store from './store';

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

const options = {
  // you can also just use 'bottom center'
  position: 'bottom right',
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: 'scale'
};

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AlertProvider template={AlertTemplate} {...options}>
            <Router history={browserHistory}>
              <Routes />
            </Router>
          </AlertProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}
