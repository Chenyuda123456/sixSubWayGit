// eslint-disable-next-line no-unused-vars
var setConfigData = (function () {
  window.config = {
    // 电子发票时间
    electronicInvoice: 60,
    // 日志url
    logUrl: '',
    // fixStation: '苏州奥体中心,Hanqingqiao',
    // fixStation: '',

    // 公有云
    /*
    apiUrl: 'http://121.43.37.62:8897/aispeech', // 请求地址公
    mapUrl: 'supermap.poc.aispeech.com.cn', // 超图 公
    mapChildUrl: 'addressmatch-SuZhouMap', // 超图 公
    webURI: 'sds.suplus.com.cn:8901/subway', // 通话服务地址
    webInfo: 'https://sds.suplus.com.cn:8901/mmd/stationmssage', // 通话前传十条数据的地址
    satisfactionIp: '10.203.1.202',
*/

    // 胥口
    apiUrl: 'http://10.203.1.104:8897/aispeech', // 请求地址
    mapUrl: '10.203.1.204:8090', // 超图
    mapChildUrl: 'addressmatch-SuZhouMap', // 超图
    webURI: '10.203.1.202', // 胥口通话服务地址
    webInfo: 'https://10.203.1.202/app-api/stationmssage', // 胥口通话前传十条数据的地址
    satisfactionIp: '10.203.1.202',
    // 黄天荡
    /*
    apiUrl: 'http://10.202.1.127:8897/aispeech', // 请求地址私
    mapUrl: '10.202.1.127:8090', // 超图 私
    mapChildUrl: 'addressMatch-index', // 超图 私
    webURI: '10.202.1.140', // 通话服务地址
    webInfo: 'https://10.202.1.138/app-api/stationmssage', // 通话前传十条数据的地址
    satisfactionIp: '10.202.1.138',
*/

    needStationSearch: true,
    stationSearchUrl:
      'https://host.eyexpo.com.cn/tours/dongfangzhimen/index.html',
    isShowTicket: true, // 支持票卡业务
    isAndroid: false, // 安卓环境
    isSupportLang: false,
    isHuman: true,
    // 客服系统: https://10.202.1.138/#/kfzx   -> admin -- 123456
    // 公网客服系统: https://sds.suplus.com.cn:8901/subway/   -> subway -- 123456
    // 客服系统胥口: https://10.203.1.202/#/kfzx   -> 8001 -- 123456
    callPhone: '518', // 呼叫账号
    isCallVideo: true, // 是不是视频通话
    // 6号线 false
    // s1 true
    isCustomKeyboard: true // 是否使用js虚拟键盘
  };
  Object.freeze(window.config);
  return true;
})();
