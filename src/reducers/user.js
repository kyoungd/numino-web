import { LOGOUT, AUTH_SUCCESS } from '../actions/types';
import axios from 'axios';

const initialState = {
  email: localStorage.getItem('email') ? localStorage.getItem('email') : '',
  token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
};

// axios.defaults.headers.common['authorization'] = localStorage.getItem('token');

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('token', action.payload.token);
      // axios.defaults.headers.common['authorization'] = action.payload.token;
      return {
        ...state,
        ...action.payload
      };
    case LOGOUT:
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      // axios.defaults.headers.common['authorization'] = '';

      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
