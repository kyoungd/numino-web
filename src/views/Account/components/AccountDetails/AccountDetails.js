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
  const [groupId, setGroupId] = useState(0);

  const [addresses, setAddresses] = useState([]);

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (addresses.length === 0)
      axios
        .post(serverUrl + 'seller-addresses', {
          companyName,
          location: [
            {
              ...values,
              lng: 0,
              lat: 0,
              externalId: 0
            }
          ]
        })
        .then(res => {
          alert.show('Saved successfully', {
            type: 'success'
          });
          console.log(res.data);
        });
    else updateAddress();
  };

  const updateAddress = () => {
    let temp = [...addresses];
    if (page) {
      temp[page - 1] = { ...values };
      setAddresses([...temp]);
    } else {
      temp.push({
        ...values,
        lng: 0,
        lat: 0,
        externalId: 0
      });
    }

    axios
      .put(`${serverUrl}seller-addresses/${groupId}`, {
        companyName,
        location: [...temp]
      })
      .then(res => {
        setAddresses(res.data.location);
        setCompanyName(res.data.companyName);
        setGroupId(res.data.id);
        if (!page) setPage(res.data.location.length);
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
    if (addresses.length > 0 && page)
      setValues({
        ...addresses[page - 1]
      });
  }, [page, addresses]);

  useEffect(() => {
    axios.get(serverUrl + 'seller-addresses').then(res => {
      if (res.data.length > 0) {
        console.log(res.data);
        let temp = [];
        res.data[0].location.map(loc => {
          temp.push({
            name: loc.name,
            address1: loc.address1,
            city: loc.city,
            state: loc.state,
            postalCode: loc.postalCode,
            lng: loc.lng,
            lat: loc.lat,
            externalId: loc.externalId
          });
        });
        setAddresses([...temp]);
        setCompanyName(res.data[0].companyName);
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
              {addresses.length === 0 && (
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    margin="dense"
                    name="companyName"
                    onChange={e => setCompanyName(e.target.value)}
                    required
                    value={companyName}
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
              <Grid item md={12}>
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
              <Grid item md={12}>
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
            </Grid>
          </CardContent>
          <Divider />
          <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="primary" type="submit" variant="contained">
              Save Address
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
