import { LOGOUT, AUTH_SUCCESS } from './types';

export const setUser = payload => (dispatch, getState) =>
  dispatch({
    type: AUTH_SUCCESS,
    payload
  });

export const signOut = () => dispatch => {
  return dispatch({
    type: LOGOUT,
    payload: { email: '', token: '' }
  });
};
