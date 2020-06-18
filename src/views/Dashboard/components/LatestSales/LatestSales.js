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
  const [data, setData] = React.useState([]);
  const [chartData, setChartData] = React.useState([]);
  const [days, setDays] = React.useState('daily');
  const classes = useStyles();

  const mapToChart = () => {
    let array = [...data];
    let labels = [];
    let datasets = [
      {
        label: 'Revenue',
        backgroundColor: palette.primary.main,
        data: []
      }
    ];
    if (days === 'daily') {
      array.reverse();
      array = array.splice(0, 7);
      array.reverse();
      array.map((element, index) => {
        labels.push(moment(element.salesDate).format('D MMM'));
        datasets[0].data.push(element.revenue);
      });
    } else if (days === 'weekly') {
      array.reverse();

      var lastStart = moment()
        .subtract(0, 'weeks')
        .startOf('week')
        .format('YYYY-MM-DD');
      var cutter;

      for (var j = 0; j < 7; j++) {
        if (lastStart === array[j].salesDate) {
          cutter = j;
        }
      }
      var firstWeek = array.splice(0, cutter + 1);
      var dataSet = new Array();
      var temp = 0;
      firstWeek.map((element, index) => {
        temp += element.revenue;
      });
      dataSet.push(temp);
      temp = 0;
      for (var x = 0; x < 6; x++) {
        for (var y = 0; y < 7; y++) {
          temp += array[x + y].revenue;
        }
        dataSet.push(temp);
        temp = 0;
      }

      for (var i = 6; i > -1; i--) {
        var y =
          i == 0
            ? 'Today'
            : moment()
                .subtract(i, 'weeks')
                .endOf('week')
                .format('ddd D, MM');
        labels.push(
          moment()
            .subtract(i, 'weeks')
            .startOf('week')
            .format('ddd D, MM') +
            ' - ' +
            y
        );
        datasets[0].data.push(dataSet[i]);
      }
      // labels.push(
      //   moment()
      //     .subtract(index, 'weeks')
      //     .startOf('week')
      //     .format('ddd D, MM') +
      //     ' - ' +
      //     moment()
      //       .subtract(index, 'weeks')
      //       .endOf('week')
      //       .format('ddd D, MM')
      // );
    } else if (days === 'monthly') {
      array.reverse();
      // array = array.splice(0, 7);
      var temp = array[0].salesDate.split('-')[1];
      var temp2 = 0;
      var temp3 = 0;
      // console.log(temp);
      var dataSet = new Array();

      for (var i = 0; i < array.length; i++) {
        if (temp == array[i].salesDate.split('-')[1]) {
          temp2 += array[i].revenue;
          if (i == array.length - 1) {
            dataSet.push(temp2);
          }
        } else {
          console.log(temp);
          dataSet.push(temp2);
          temp2 = array[i].revenue;
          temp = array[i].salesDate.split('-')[1];
          temp3++;
          if (temp3 == 7) {
            break;
          }
        }
      }
      console.log(dataSet);
      for (var i = 6; i > -1; i--) {
        labels.push(
          moment()
            .subtract(i, 'month')
            .format('MMMM')
        );
        datasets[0].data.push(dataSet[i] ? dataSet[i] : 0);
      }
      // array.map((element, index) => {

      // });
      // labels.push(
      //   moment()
      //     .subtract(index, 'month')
      //     .format('MMMM')
      // );
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
      .get(serverUrl + 'data-latest-sales')
      .then(res => setData([...res.data]))
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
