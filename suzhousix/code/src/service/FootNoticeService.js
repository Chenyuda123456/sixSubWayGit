import instance from './ajax/ajaxConfig';

let noticeService = {};

noticeService.getNotice = station => {
  return instance.ajax0(
    `${window.config.apiUrl}/subway/api/station_notice/${station}/0`,
    'get'
  );
};

export default noticeService;
