import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel,
  TablePagination
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import axios from 'axios';
import { serverUrl } from '../../../../helpers';
import { StatusBullet } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 800
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const statusColors = {
  success: 'success',
  pending: 'info',
  failure: 'danger'
};

const LatestOrders = props => {
  const { className, ...rest } = props;
  const [orders, setOrders] = React.useState([]);
  const [page, setPage] = useState(1);
  const classes = useStyles();

  React.useEffect(() => {
    let date = new Date().setMonth(new Date().getMonth() - 1);
    // new Date(date).get
    axios
      .get(serverUrl + 'purchase-histories', {
        params: {
          salesDate_gte: '2020-06-25',
          _sort: 'salesDate',
          _limit: 100
        }
      })
      .then(res => {
        console.log(res.data);
        setOrders([...res.data]);
      })
      .catch(err => console.log('Something went wrong'));
  }, []);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        // action={
        //   <Button color="primary" size="small" variant="outlined">
        //     Export Data
        //   </Button>
        // }
        title="Latest Orders"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order Ref</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Seller</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.slice((page - 1) * 10, page * 10).map(order => (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.buyerName}</TableCell>
                    <TableCell>{order.sellerName}</TableCell>
                    <TableCell>
                      {moment(order.createdA).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>${order.orderAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Pagination
          count={orders.length / 10}
          page={page}
          onChange={(e, val) => setPage(val)}
          color="primary"
        />
      </CardActions>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
