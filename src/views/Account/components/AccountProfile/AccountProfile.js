import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import Pagination from '@material-ui/lab/Pagination';

import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  CardHeader,
  Grid,
  TextField,
  Switch
} from '@material-ui/core';
import axios from 'axios';
import { serverUrl } from 'helpers';
import { AddCircle } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  },
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

const defaultVal = {
  name: '',
  accountNumber: '',
  routingNumber: '',
  isActiveAccount: false,
  isValidAccount: false
};

const AccountProfile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({ ...defaultVal });

  const [displayName, setDisplayName] = useState('');
  const [page, setPage] = useState(1);
  const [banks, setBanks] = useState([]);

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    if (banks.length > 0 && page)
      setValues({
        ...banks[page - 1]
      });
  }, [page, banks]);

  const onSubmit = e => {
    e.preventDefault();
    if (page) updateAddress();
    else
      axios
        .post(serverUrl + 'bank-accounts', {
          displayName,
          bank: [
            ...banks,
            {
              ...values
            }
          ]
        })
        .then(res => {
          console.log(res.data);
        });
  };

  const updateAddress = () => {
    let temp = [...banks];
    temp[page - 1] = { ...values };
    setBanks([...temp]);

    axios
      .put(`${serverUrl}bank-accounts/${page - 1}`, {
        displayName,
        Bank: [...temp]
      })
      .then(res => {
        setBanks(res.data.bank);
        setDisplayName(res.data.displayName);
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    axios.get(serverUrl + 'bank-accounts').then(res => {
      setDisplayName(res.data[0].displayName);
      setBanks([...res.data[0].bank]);
    });
  }, []);

  const deleteBank = () => {
    //  setBanks();
  };

  return (
    <>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" onSubmit={onSubmit}>
          <CardHeader
            subheader="The information can be edited"
            title="Bank Account"
            action={
              <IconButton
                aria-label="add bank"
                onClick={() => {
                  setValues({ ...defaultVal });
                  setPage(0);
                }}>
                <AddCircle />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  label="Name"
                  margin="dense"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Account Number"
                  margin="dense"
                  name="accountNumber"
                  onChange={handleChange}
                  required
                  value={values.accountNumber}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Routing Number"
                  margin="dense"
                  name="routingNumber"
                  onChange={handleChange}
                  required
                  value={values.routingNumber}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12} className={classes.centered}>
                <Typography variant="body1">Is Active Account?</Typography>
                <Switch
                  checked={values.isActiveAccount}
                  onChange={e =>
                    setValues({
                      ...values,
                      isActiveAccount: e.target.checked
                    })
                  }
                  name="isActiveAccount"
                />
              </Grid>
              <Grid item md={6} xs={12} className={classes.centered}>
                <Typography variant="body1">Is Valid Account?</Typography>
                <Switch
                  checked={values.isValidAccount}
                  onChange={e =>
                    setValues({
                      ...values,
                      isValidAccount: e.target.checked
                    })
                  }
                  name="isValidAccount"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
            <Button color="primary" type="submit" variant="contained">
              Save Bank
            </Button>
            <Button
              style={{ backgroundColor: '#901c1c', color: 'white' }}
              variant="contained"
              onClick={deleteBank}>
              Delete
            </Button>
          </CardActions>
          <Divider />
        </form>
      </Card>
      {page ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            margin: '15px 0'
          }}>
          <Pagination
            count={banks.length}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default AccountProfile;
