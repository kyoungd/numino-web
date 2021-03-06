import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { ExportForm } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Account = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4} justify="center">
        <Grid item lg={6} md={6} xl={6} xs={12}>
          <ExportForm />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
