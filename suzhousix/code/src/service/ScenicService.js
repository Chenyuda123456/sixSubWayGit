import instance from './ajax/ajaxConfig';
let url = window.config.apiUrl;

let scenicService = {};

scenicService.findCategory = () => {
  return instance.ajax0(`${url}/city/infos`);
};

scenicService.findDetail = poiName => {
  // return instance.ajax0(`${url}/city/details?poiName=${poiName}&poiId=${poiId}`)
  return instance.ajax0(`${url}/city/details?poiName=${poiName}`);
};

export default scenicService;
