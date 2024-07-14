import instance from './ajax/ajaxConfig';
let url = 'https://restapi.amap.com/v3';
let aroundUrl = window.config.apiUrl;
let key = 'e6b8252ff9ed8fa3f1e267990994b647';
let aroundService = {};

// 查询默认周边(带地铁出口)
aroundService.defaultStationAround = station => {
  // 东方之门 月亮湾
  return instance.ajax0(
    `${aroundUrl}/surround/around_poi/${station}/arround`,
    'get'
  );
};

// 1，查找站点坐标
aroundService.findStationPosition = keywords => {
  return instance.ajax0(
    `${url}/place/text?key=${key}&citylimit=true&city=苏州&children=1&offset=10&page=1&extensions=all&keywords=${keywords}`,
    'get'
  );
};

// 关键字搜索
aroundService.findPlace = keywords => {
  return instance.ajax0(
    `${url}/place/text?key=${key}&keywords=${keywords}&city=苏州&offset=20&page=1`
  );
};

// 查找周边 -> 地点
aroundService.findAroundPOIList = (position, keywords) => {
  return instance.ajax0(
    `${url}/place/around?key=${key}&city=苏州&keywords=${keywords}&radius=3000&page=1&offset=20&location=${position}`
  );
};

// 查找周边 -> 地铁站附近的公交
aroundService.getAroundBusList = location => {
  // location格式 "120.111111,120.333333"
  // types: 150500  交通设施服务  地铁站  地铁站
  // 150700 公交
  return instance.ajax0(
    `${url}/place/around?key=${key}&city=苏州&types=150700&radius=2000&page=1&offset=20&location=${location}`
  );
};
// 查找周边 -> 坐标附近的地铁站
aroundService.getAroundSubwayList = location => {
  // types: 150500  交通设施服务  地铁站  地铁站
  return instance.ajax0(
    `${url}/place/around?key=${key}&city=苏州&types=150500&radius=1500&page=1&offset=20&location=${location}`
  );
};

// 获取步行距离
aroundService.getWalkDistance = (origin, destination) => {
  return instance.ajax0(
    `${url}/direction/walking?key=${key}&city=苏州&strategy=0&nightflag=0&origin=${origin}&destination=${destination}`
  );
};
// getWalkData (origin ,destination) {
//   return service.get(`/direction/walking?key=e6b8252ff9ed8fa3f1e267990994b647&city=苏州&strategy=0&nightflag=0&origin=${origin}&destination=${destination}`)
//       .then(res => {
//         return res
//       }).catch(error => {
//         console.log(error)
//       })
// }
export default aroundService;
