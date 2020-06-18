// export { default } from './ForgotPassword';
import React, { Component } from 'react';
import ResetPassword from './ResetPassword';
import axios from 'axios';
import { serverUrl } from '../../helpers';
import queryString from 'query-string';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
class resetPasswordWrapper extends Component {
  state = {
    error: '',
    open: false
  };
  onReset = ({ password }) => {
    let params = queryString.parse(this.props.location.search);
    axios
      .post(serverUrl + 'auth/reset-password', {
        code: params.code,
        password: password,
        passwordConfirmation: password
      })
      .then(response => {
        // Handle success.
        this.props.history.push('/sign-in');
        console.log("Your user's password has been changed.");
      })
      .catch(error => {
        // Handle error.
        this.setState({
          error: error.response.data.message[0].messages[0].message,
          open: true
        });
        // console.log('An error occurred:', error.response);
      });
  };
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      open: false
    });
  };
  render() {
    // console.log(this.props);
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}>
          <Alert severity="error">{this.state.error}</Alert>
        </Snackbar>
        <ResetPassword onReset={this.onReset} />
      </div>
    );
  }
}

export default resetPasswordWrapper;
