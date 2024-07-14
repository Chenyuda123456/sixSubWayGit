import { ElMessage } from 'element-plus';
import { h } from 'vue';

let subwayInfo = {};
subwayInfo.buyTicket = (countStr, endStationStr, duration = 3000) => {
  let info = [
    h('span', null, '为您购买'),
    h('span', { style: 'color: #3D76FF' }, countStr)
  ];
  if (endStationStr) {
    endStationStr = endStationStr.replace('地铁站', '');
    info.push(
      h('span', null, '去'),
      h('span', { style: 'color: #3D76FF' }, endStationStr),
      h('span', null, '的')
    );
  }
  info.push(h('span', null, '票'));
  ElMessage({
    message: h('p', null, info),
    iconClass: '1',
    customClass: 'subway-message icon-tipfix',
    duration: duration // 停留3s
  });
};
subwayInfo.buyTicketNetwork = (info, duration = 3000) => {
  ElMessage({
    message: info,
    iconClass: 'icon-network-warn',
    customClass: 'subway-buy-ticket-network-message',
    duration: duration
  });
};
subwayInfo.normalInfo = (info, duration = 3000) => {
  ElMessage({
    message: info,
    iconClass: '1',
    customClass: 'subway-buy-ticket-network-message',
    duration: duration
  });
};

export default subwayInfo;
