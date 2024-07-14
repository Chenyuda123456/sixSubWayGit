import axios from 'axios';

const instance = axios.create({
  baseURL: window.config.apiUrl
});
export const noticeService = {
  getNotice: (stationName, type, { pageNo = 1, pageSize = 20 }) => {
    return instance({
      method: 'get',
      url: `/subway/api/station_notice/${stationName}/${type}?pageNo=${pageNo}&pageSize=${pageSize}`
    });
  }
};

export const noticeServiceFoot = {
  getNotice: stationName => {
    return instance({
      method: 'get',
      url: `/subway/api/scroll_notice/${stationName}`
    });
  }
};
