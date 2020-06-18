export { default as chartjs } from './chartjs';
export { default as getInitials } from './getInitials';
export const serverUrl = 'https://strapi-first-app-1.herokuapp.com/';
export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
