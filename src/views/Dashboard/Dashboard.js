import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';

import {
  Budget,
  TotalUsers,
  Weekly,
  Today,
  LatestSales,
  UsersByDevice,
  LatestProducts,
  LatestOrders
} from './components';
import { serverUrl } from '../../helpers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [data, setData] = React.useState({
    revenueMonthly: 0,
    revenueMonthlyChange: 0,
    totalUserMonthly: 0,
    totalUserMonthlyChange: 0,
    revenueWeekly: 0,
    revenueWeeklyChange: 0,
    revenueToday: 0
  });

  React.useEffect(() => {
    axios
      .get(serverUrl + 'purchase-summaries/data-thumbnails ')
      .then(res => setData({ ...res.data }))
      .catch(err => console.log(err.response));
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Budget data={data} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalUsers data={data} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Weekly data={data} />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Today data={data} />
        </Grid>
        <Grid item lg={12} md={18} xl={12} xs={24}>
          <LatestSales />
        </Grid>
        <Grid item lg={12} md={18} xl={12} xs={24}>
          <LatestOrders />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
