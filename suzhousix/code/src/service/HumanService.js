import instance from './ajax/ajaxConfig';

let url = window.config.satisfactionIp.includes('https')
  ? window.config.satisfactionIp
  : 'https://' + window.config.satisfactionIp;

let humanService = {};

humanService.sendSatisfaction = param => {
  return instance.ajax0(
    `${url}/app-api/conversation/satisfaction/`,
    'POST',
    param
  );
};
humanService.sendInfo = param => {
  return instance.ajax0(window.config.webInfo, 'POST', param);
};

humanService.getDN = param => {
  return instance.ajax0(`${window.config.apiUrl}/device/phone/get/${param}`);
};

export default humanService;
