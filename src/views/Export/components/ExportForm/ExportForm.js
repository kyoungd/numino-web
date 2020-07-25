import 'date-fns';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  LinearProgress,
  CardHeader,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';

import axios from 'axios';
import { serverUrl } from 'helpers';

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
  }
}));

const AccountProfile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    startDate: '',
    endDate: '',
    format: '',
    email: '',
    limit: 0
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    axios
      .post(serverUrl + 'purchase-histories/export', {
        params: {
          salesDate_gte: values.startDate,
          _sort: 'salesDate',
          salesDate_lt: values.endDate,
          _limit: values.limit ? values.limit : 0
          // email: values.email
        }
      })
      .then(res => {
        console.log(res.data);
      });
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form autoComplete="off" onSubmit={onSubmit}>
        <CardHeader
          subheader="Data will be sent to your mail"
          title="Export Data"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xl={6}>
              <TextField
                // id="date"
                label="Start Date"
                type="date"
                name="startDate"
                defaultValue="2017-05-24"
                className={classes.textField}
                fullWidth
                value={values.startDate}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item md={12} xl={6}>
              <TextField
                // id="date"
                label="End Date"
                type="date"
                name="endDate"
                defaultValue="2017-05-24"
                className={classes.textField}
                fullWidth
                required
                value={values.endDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item md={6} xl={3}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel id="demo-simple-select-label">Format</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="format"
                  fullWidth
                  value={values.format}
                  onChange={handleChange}>
                  <MenuItem value={'json'}>JSON</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xl={9}>
              <TextField
                fullWidth
                label="Limit"
                margin="dense"
                name="limit"
                onChange={handleChange}
                // required
                type="number"
                value={values.limit}
                required
                // variant="outlined"
              />
              {/* <TextField
                fullWidth
                label="Email"
                margin="dense"
                name="email"
                onChange={handleChange}
                // required
                type="email"
                value={values.email}
                required
                // variant="outlined"
              /> */}
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button color="primary" type="submit" variant="contained">
            Export
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default AccountProfile;
