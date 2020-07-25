import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Pagination from '@material-ui/lab/Pagination';

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  IconButton
} from '@material-ui/core';

import { AddCircle } from '@material-ui/icons';
import axios from 'axios';
import { serverUrl } from 'helpers';

const useStyles = makeStyles(() => ({
  root: {}
}));

const defaultVal = {
  name: '',
  address1: '',
  city: '',
  state: '',
  postalCode: ''
};

const AccountDetails = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    name: '',
    address1: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const [companyName, setCompanyName] = useState('');
  const [page, setPage] = useState(1);

  const [addresses, setAddresses] = useState([]);

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    console.log(values);
    if (page) updateAddress();
    else
      axios
        .post(serverUrl + 'seller-addresses', {
          companyName,
          location: [
            ...addresses,
            {
              ...values,
              lng: 0,
              lat: 0,
              externalId: 0
            }
          ]
        })
        .then(res => {
          console.log(res.data);
        });
  };

  const updateAddress = () => {
    let temp = [...addresses];
    temp[page - 1] = { ...values };
    setAddresses([...temp]);

    axios
      .put(`${serverUrl}seller-addresses/${page - 1}`, {
        companyName,
        location: [...temp]
      })
      .then(res => {
        setAddresses(res.data.location);
        setCompanyName(res.data.companyName);
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    if (addresses.length > 0 && page)
      setValues({
        ...addresses[page - 1]
      });
  }, [page, addresses]);

  useEffect(() => {
    axios.get(serverUrl + 'seller-addresses').then(res => {
      setAddresses(res.data[0].location);
      setCompanyName(res.data[0].companyName);
    });
  }, []);

  const deleteAddress = () => {
    //  setBanks();
  };

  return (
    <>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form autoComplete="off" onSubmit={onSubmit}>
          <CardHeader
            subheader="The information can be edited"
            title="Addresses"
            action={
              <IconButton
                aria-label="add address"
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
              <Grid item md={8}>
                <TextField
                  fullWidth
                  label="Address"
                  margin="dense"
                  name="address1"
                  onChange={handleChange}
                  required
                  value={values.address1}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  margin="dense"
                  name="postalCode"
                  onChange={handleChange}
                  required
                  type="number"
                  value={values.postalCode}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="City"
                  margin="dense"
                  name="city"
                  onChange={handleChange}
                  type="text"
                  required
                  value={values.city}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="State"
                  margin="dense"
                  name="state"
                  onChange={handleChange}
                  required
                  value={values.state}
                  variant="outlined"
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
              Save Address
            </Button>
            <Button
              style={{ backgroundColor: '#901c1c', color: 'white' }}
              variant="contained"
              onClick={deleteAddress}>
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
            count={addresses.length}
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

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
