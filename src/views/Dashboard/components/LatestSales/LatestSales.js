import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import palette from 'theme/palette';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  Select,
  MenuItem
} from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';

import { serverUrl } from '../../../../helpers';
import { options } from './chart';
import { forEach } from 'underscore';

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestSales = props => {
  const { className, ...rest } = props;
  const [data, setData] = React.useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [chartData, setChartData] = React.useState([]);
  const [days, setDays] = React.useState('daily');
  const classes = useStyles();

  const mapToChart = () => {
    let labels = [];
    let datasets = [
      {
        label: 'Revenue',
        backgroundColor: palette.primary.main,
        data: []
      }
    ];

    let array = [...data[days]];

    if (days === 'daily') {
      array.map((element, index) => {
        labels.push(moment(element.salesDate).format('D MMM'));
        datasets[0].data.push(element.amount);
      });
    } else if (days === 'weekly') {
      array.map((element, index) => {
        labels.push(moment(element.salesDate).format('D MMM'));
        datasets[0].data.push(element.amount);
      });
    } else if (days === 'monthly') {
      array.map((element, index) => {
        labels.push(moment(element.salesDate).format('D MMM'));
        datasets[0].data.push(element.amount);
      });
    }
    setChartData({
      labels,
      datasets
    });
  };

  const dataOfDate = (startDate, endDate, dataList) => {
    let revenue = 0;
    dataList.map(item => {
      if (new Date(startDate) <= new Date(item.salesDate) <= new Date(endDate))
        revenue += item.revenue;
    });
    return revenue;
  };

  React.useEffect(() => {
    mapToChart();
  }, [data, days]);

  React.useEffect(() => {
    axios
      .get(serverUrl + 'purchase-summaries/data-latest-sales')
      .then(res => {
        console.log(res.data);
        setData({ ...res.data });
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        action={
          <Select
            labelId="days-select"
            id="days"
            variant="outlined"
            value={days}
            onChange={e => setDays(e.target.value)}>
            <MenuItem value={'daily'}>Last 7 days</MenuItem>
            <MenuItem value={'weekly'}>Last 7 weeks</MenuItem>
            <MenuItem value={'monthly'}>Last 7 months </MenuItem>
          </Select>
        }
        title="Latest Sales"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
      <Divider />
      {/* <CardActions className={classes.actions}>
        <Button color="primary" size="small" variant="text">
          Overview <ArrowRightIcon />
        </Button>
      </CardActions> */}
    </Card>
  );
};

LatestSales.propTypes = {
  className: PropTypes.string
};

export default LatestSales;
