import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useAlert } from 'react-alert';
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
import { map } from 'underscore';

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
  const alert = useAlert();

  const classes = useStyles();

  const [values, setValues] = useState({ ...defaultVal });

  const [displayName, setDisplayName] = useState('');
  const [page, setPage] = useState(1);
  const [banks, setBanks] = useState([]);
  const [groupId, setGroupId] = useState(0);

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
    if (banks.length === 0) {
      axios
        .post(serverUrl + 'bank-accounts', {
          displayName,
          bank: [
            {
              ...values,
              externalId: 'muriel-1100'
            }
          ]
        })
        .then(res => {
          console.log(res.data);
          setBanks({
            ...res.data
          });
          alert.show('Saved successfully', {
            type: 'success'
          });
        });
    } else updateAddress();
  };

  const updateAddress = () => {
    let temp = [...banks];
    if (page) {
      temp[page - 1] = { ...values };
      setBanks([...temp]);
    } else {
      temp.push({
        ...values,
        externalId: 'muriel-1100'
      });
    }
    axios
      .put(`${serverUrl}bank-accounts/${groupId}`, {
        displayName,
        bank: [...temp]
      })
      .then(res => {
        setBanks(res.data.bank);
        setDisplayName(res.data.displayName);
        setGroupId(res.data.id);
        if (!page) setPage(res.data.bank.length);
        alert.show('Saved successfully', {
          type: 'success'
        });
      })
      .catch(err => {
        alert.show('Something went wrong', {
          type: 'error'
        });
        console.log(err.response);
      });
  };

  useEffect(() => {
    axios.get(serverUrl + 'bank-accounts').then(res => {
      if (res.data.length > 0) {
        let temp = [];
        res.data[0].bank.map(bank => {
          temp.push({
            name: bank.name,
            accountNumber: bank.accountNumber,
            routingNumber: bank.routingNumber,
            isActiveAccount: bank.isActiveAccount,
            isValidAccount: bank.isValidAccount,
            externalId: bank.externalId
          });
        });
        setDisplayName(res.data[0].displayName);
        setBanks([...temp]);
        setGroupId(res.data[0].id);
      }
    });
  }, []);

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
              {banks.length === 0 && (
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    label="Display Name"
                    margin="dense"
                    name="displayName"
                    onChange={e => setDisplayName(e.target.value)}
                    required
                    value={displayName}
                    variant="outlined"
                  />
                </Grid>
              )}
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
          <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="primary" type="submit" variant="contained">
              Save Bank
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
