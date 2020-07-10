export { default as chartjs } from './chartjs';
export { default as getInitials } from './getInitials';
export const serverUrl = 'http://localhost:1337/';
export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
