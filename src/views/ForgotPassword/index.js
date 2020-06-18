// export { default } from './ForgotPassword';
import React, { Component } from 'react';
import ForgotPassword from './ForgotPassword';
import axios from 'axios';
import { serverUrl } from '../../helpers';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
class forgotPasswordWrapper extends Component {
  state = {
    error: '',
    open: false
  };
  onForgot = ({ email }) => {
    axios
      .post(serverUrl + 'auth/forgot-password', {
        email
      })
      .then(response => {
        // Handle success.
        console.log('Your user received an email');
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
        <ForgotPassword onForgot={this.onForgot} />
      </div>
    );
  }
}

export default forgotPasswordWrapper;
