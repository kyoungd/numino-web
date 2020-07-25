// export { default } from './SignIn';
import React, { Component } from 'react';
import SignIn from './SignIn';
import axios from 'axios';
import { setUser } from '../../actions/user';
import { serverUrl } from '../../helpers';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
class SigninWrapper extends Component {
  state = {
    error: '',
    open: false
  };

  onSignin = ({ email, password }) => {
    axios
      .post(serverUrl + 'auth/local', {
        identifier: email,
        password
      })
      .then(response => {
        // Handle success.
        // console.log('Well done!');
        // console.log('User profile', response.data.user);
        // console.log('User token', response.data.jwt);
        this.props.setUser({
          email: response.data.user.email,
          token: response.data.jwt
        });
        this.props.history.push('/');
      })
      .catch(error => {
        // Handle error.
        console.log(error.response);
        this.setState({
          error: 'Something went wrong',
          // error: error.response.data.message[0].messages[0].message,
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
        <SignIn onSignin={this.onSignin} />
      </div>
    );
  }
}

export default connect(null, { setUser })(SigninWrapper);
