import axios from 'axios';

const instance = axios.create({
  baseURL: window.config.apiUrl
});
export const getTimeList = (stationName, date) => {
  return instance({
    method: 'get',
    url: `/subway/api/shift_info/${stationName}/${date}`
  });
};

export const getLineTimeList = line => {
  return instance({
    method: 'get',
    url: `/subway/api/se_time/${line}`
  });
};
