// export { default } from './SignUp';
import React, { Component } from 'react';
import SignUp from './SignUp';
import axios from 'axios';
import { setUser } from '../../actions/user';
import { serverUrl } from '../../helpers';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SignupWrapper extends Component {
  state = {
    error: '',
    open: false
  };
  onSignup = ({ username, email, password }) => {
    console.log(serverUrl);
    axios
      .post(serverUrl + 'auth/local/register', {
        username,
        email,
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
        axios
          .post(serverUrl + `auth/send-email-confirmation`, {
            email: response.data.user.email
          })
          .then(response => {
            // Handle success.
            console.log('Your user received an email');
          })
          .catch(error => {
            // Handle error.
            console.error('An error occured:', error.response);
          });

        this.props.history.push('/');
      })
      .catch(error => {
        // Handle error.
        this.setState({
          error: error.response.data.message[0].messages[0].message,
          open: true
        });
        // console.log(
        //   'An error occurred:',
        //   error.response.data.message[0].messages[0].message
        // );
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
        <SignUp onSignup={this.onSignup} />
      </div>
    );
  }
}

export default connect(null, { setUser })(SignupWrapper);
