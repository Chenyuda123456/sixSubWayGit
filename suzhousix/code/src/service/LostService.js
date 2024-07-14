import instance from './ajax/ajaxConfig';
let url = window.config.apiUrl;

let lostService = {};

lostService.findLost = param => {
  return instance.ajax0(`${url}/lost/search`, 'POST', param);
};

export default lostService;
