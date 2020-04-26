import uuid from 'uuid/v1';

export default [
  {
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    seller: {
      name: '420 Somewhere'
    },
    createdAt: 1555016400000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: 'CDD1048',
    amount: 25.1,
    customer: {
      name: 'Cao Yu'
    },
    seller: {
      name: '420 Somewhere'
    },
    createdAt: 1555016400000,
    status: 'success'
  },
  {
    id: uuid(),
    ref: 'CDD1047',
    amount: 10.99,
    customer: {
      name: 'Alexa Richardson'
    },
    seller: {
      name: 'Love Shack'
    },
    createdAt: 1554930000000,
    status: 'success'
  },
  {
    id: uuid(),
    ref: 'CDD1046',
    amount: 96.43,
    customer: {
      name: 'Anje Keizer'
    },
    seller: {
      name: '420 Pop'
    },
    createdAt: 1554757200000,
    status: 'failure'
  },
  {
    id: uuid(),
    ref: 'CDD1045',
    amount: 32.54,
    customer: {
      name: 'Clarke Gillebert'
    },
    seller: {
      name: '420 Pop'
    },
    createdAt: 1554670800000,
    status: 'success'
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    seller: {
      name: '420 Somewhere'
    },
    createdAt: 1554670800000,
    status: 'success'
  }
];
