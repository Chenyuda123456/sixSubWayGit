import instance from './ajax/ajaxConfig';
let url = window.config.apiUrl;

let navigationService = {};
const currentSite =
  (window?.bridge?.getCurrentInfo() &&
    JSON.parse(window?.bridge?.getCurrentInfo()).currentSite) ||
  '苏州奥体中心';
navigationService.getIcon = param => {
  return instance.ajax0(`${url}/icon/list?pageNo=1&pageSize=100`, 'GET', param);
};

navigationService.getSelfIcon = param => {
  return instance.ajax0(
    `${url}/subway/api/getQaListByStationName?stationName=${currentSite}&lineId=6`,
    'GET',
    param
  );
};

navigationService.getImg = param => {
  return instance.ajax0(
    `${url}/icon/poi/get?stationName=${currentSite}`,
    'GET',
    param
  );
};

export default navigationService;
