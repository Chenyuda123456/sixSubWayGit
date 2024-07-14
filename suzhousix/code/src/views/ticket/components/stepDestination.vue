<template>
  <div class="display-flex-center stepDestination">
    <div id="map"></div>
    <div class="list">
      <div class="list-t display-flex-between">
        <div
          v-en="{
            fontSize: '22px'
          }"
          class="list-t-l"
        >
          {{ $t('chooseoutsite') }}
        </div>
        <div
          v-en="{
            fontSize: '22px'
          }"
          class="list-t-r"
          v-html="$t('sayfirstthird')"
        ></div>
      </div>
      <div class="list-title display-flex-between">
        <div
          v-en="{
            fontSize: '22px'
          }"
          class="list-title-l"
        >
          {{ $t('destination') }}
        </div>
        <div
          v-en="{
            fontSize: '22px'
          }"
          class="list-title-r"
        >
          {{ $t('recommendsite') }}
        </div>
      </div>
      <div class="list-main">
        <div
          v-for="(item, index) in poiList"
          :key="index"
          class="item display-flex-between"
          @click="clickChange(item)"
        >
          <div class="item-l display-flex-center van-row--align-center">
            <span>{{ index + 1 }}</span>
          </div>
          <div class="item-c over-text">{{ item.NAME }}</div>
          <div
            v-if="item.arrivalSite && item.arrivalSite != 'undefined'"
            class="item-r over-text"
          >
            <div v-chStationToEn="item.arrivalSite">{{  item.arrivalSite}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs,
  watch
} from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { szmtr } from '@/components/line/szmtr.js';
const SuperMap = window.SuperMap;
const getDistanceStr = distance => {
  return distance && distance > 0
    ? distance > 1000
      ? (distance / 1000).toFixed(2) + 'km'
      : distance + 'm'
    : null;
};
export default {
  name: 'StepTwo',
  props: {
    destination: {
      type: String
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const data = reactive({
      noNLG: false,
      currentStation: window?.bridge?.getDefaultSite(), // 当前站点
      currentLocation: [],
      // currentKeywords: '拙政园', // 目的地
      map: '',
      mapUrl: `http://${window.config.mapUrl}/iserver/services/map-SuZhouShiDiTu/rest/maps/苏州市地图`,
      poiList: [],
      poiLayer: null,
      searchUrl: `http://${window.config.mapUrl}/iserver/services/data-SuZhouShiDiTu/rest/data`,
      origin: computed(() => store.getters.getOrigin),
      endName: computed(() => store.getters.getEndName),
      stationInfo: computed(() => store.getters.getTransitData),
      arrivalSite: computed(() => store.getters.getArrivalSite),
      destination: computed(() => store.getters.getDestination),
      count: computed(() => store.getters.getCount),
      payCode: computed(() => store.getters.getPayCode),
      endArrivalSite: computed(() => store.getters.endArrivalSite)
    });
    watch(
      () => props.destination,
      val => {
        findAroundPOI();
        if (
          window.bridge &&
          data.origin &&
          data.destination &&
          data.count &&
          !data.noNLG
        ) {
          window?.bridge?.generateNLG(
            'selectStation',
            data.origin,
            data.destination,
            Number(data.count),
            '',
            ''
          );
        }
      }
    );
    // 根据站点更新坐标
    const updateLngLat = () => {
      return new Promise(resolve => {
        const addressUrl = `http://${window.config.mapUrl}/iserver/services/${window.config.mapChildUrl}/restjsr/v1/address`;
        let addressMatchService =
          window.L.supermap.addressMatchService(addressUrl);
        let geoCodeParam = new SuperMap.GeoCodingParameter({
          address: data.currentStation + '(地铁站)'
        });
        addressMatchService.code(geoCodeParam, obj => {
          if (obj.result.length > 0) {
            data.currentLocation = [...Object.values(obj.result[0].location)];
            resolve();
          } else {
            console.error('更新站点坐标失败');
          }
        });
      });
    };
    // 查询目的地
    const findAroundPOI = async () => {
      data.poiLayer && data.poiLayer.remove();
      const result = await axios({
        method: 'get',
        url: `${window.config.apiUrl}/surround/searchFromLocalDB?destinationName=${props.destination}&stationName=${data.currentStation}`
      });
      const poiList = result.data.result;
      if (poiList?.length > 0) {
        data.poiList = poiList.map(item => {
          return {
            NAME: item.destinationName,
            SMX: item.latitude,
            SMY: item.longitude,
            distance: Number(item.distance),
            distance_str: getDistanceStr(Number(item.distance)),
            arrivalSite: item.stationName,
            exitPort: item.exitName,
            nearSubway: item.stationName
          };
        });
      } else {
        const point = new SuperMap.Geometry.Point(
          data.currentLocation[0],
          data.currentLocation[1]
        );
        const dataset = [
          '苏州市地图:餐饮服务',
          '苏州市地图:村庄点',
          '苏州市地图:道路附属设施',
          '苏州市地图:地名地址信息',
          '苏州市地图:风景名胜',
          '苏州市地图:公共设施',
          '苏州市地图:公交路线',
          '苏州市地图:公交站点',
          '苏州市地图:公司企业',
          '苏州市地图:购物服务',
          '苏州市地图:金融保险服务',
          '苏州市地图:科教文化服务',
          '苏州市地图:摩托车服务',
          '苏州市地图:汽车服务',
          '苏州市地图:汽车维修',
          '苏州市地图:汽车销售',
          '苏州市地图:区县面',
          '苏州市地图:区县政府',
          '苏州市地图:商务住宅',
          '苏州市地图:生活服务',
          '苏州市地图:体育休闲服务',
          '苏州市地图:铁路线',
          '苏州市地图:乡镇街道政府',
          '苏州市地图:医疗保健服务',
          '苏州市地图:政府机构及社会团体',
          '苏州市地图:住宿服务',
          '苏州市地图:城市次干道',
          '苏州市地图:城市快速路',
          '苏州市地图:城市支路',
          '苏州市地图:城市主干道',
          '苏州市地图:高速公路',
          '苏州市地图:国道',
          '苏州市地图:街坊路',
          '苏州市地图:立交桥',
          '苏州市地图:省道',
          '苏州市地图:县乡道',
          '苏州市地图:乡村路',
          '苏州市地图:湖泊、水库',
          '苏州市地图:湖泊、水库2',
          '苏州市地图:绿地',
          '苏州市地图:绿地2',
          '苏州市地图:双线河',
          '苏州市地图:双线河2',
          '苏州市地图:地铁出入口',
          '苏州市地图:交通设施服务',
          '苏州市地图:地铁线',
          '苏州市地图:地铁站点'
        ];
        var poiParam = new SuperMap.GetFeaturesByBufferParameters({
          datasetNames: dataset,
          bufferDistance: 80, //3KM 查poi才有此参数
          geometry: point,
          attributeFilter: `NAME like '${props.destination}%'`
        });
        window.L.supermap
          .featureService(data.searchUrl)
          .getFeaturesByBuffer(poiParam, function (serviceResult) {
            console.log(serviceResult.result.features);
            let result = serviceResult.result.features.features;
            let index = result.length - 1 > 10 ? 9 : result.length - 1;
            data.poiList = result
              .slice(0, index + 1)
              .map(item => {
                return item.properties;
              })
              .sort((a, b) => {
                return b.distance - a.distance;
              });
            data.poiList.forEach(async item => {
              let distanceResult = await getDistance(
                [item.SMX, item.SMY],
                [data.currentLocation[0], data.currentLocation[1]]
              );
              item.distance = distanceResult.distance;
              item.distance_str = distanceResult.distance_str;
              let nearSubway = await getNearSubway(item);
              item.arrivalSite = nearSubway.arrivalSite;
              item.exitPort = nearSubway.exitPort;
              item.walkDistance = nearSubway.walkDistance;
            });
            serviceResult.result.features.features =
              serviceResult.result.features.features.slice(0, index + 1);
            data.poiLayer = window.L.geoJSON(
              serviceResult.result.features,
              {}
            ).addTo(data.map);
            if (data.poiList.length) {
              let currentLocation = window.L.latLng(
                data.poiList[0].SMY,
                data.poiList[0].SMX
              );
              data.map.setView(currentLocation, 12);
            }
          });
      }
    };
    // 查询两地距离
    const getDistance = (start, end) => {
      return new Promise(resolve => {
        let polyLine = window.L.polyline([start.reverse(), end.reverse()], {
          color: 'red'
        });
        var measureParam = new SuperMap.MeasureParameters(polyLine);
        var measureService = new window.L.supermap.measureService(data.mapUrl);
        measureService.measureDistance(measureParam, function (serviceResult) {
          let result = {
            distance: null,
            distance_str: null
          };
          if (serviceResult.result.distance) {
            let distance = parseInt(serviceResult.result.distance);
            result.distance = distance;
            result.distance_str =
              distance && distance > 0
                ? distance > 1000
                  ? (distance / 1000).toFixed(2) + 'km'
                  : distance + 'm'
                : null;
          }
          resolve(result);
        });
      });
    };
    // 查询附近地铁站
    const getNearSubway = item => {
      let location = [item.SMX, item.SMY];
      // todo: 获取最近的出口，出口到目的地的距离
      var point = new window.SuperMap.Geometry.Point(location[0], location[1]);
      const dataset = ['苏州市地图:地铁出入口'];
      var bufferParam = new window.SuperMap.GetFeaturesByBufferParameters({
        orderBy: `SMX-${location[0]}+SMY-${location[1]}`,
        datasetNames: dataset,
        bufferDistance: 0.03,
        toIndex: 200,
        geometry: point
      });
      let exitportList;
      return new Promise(resolve => {
        window.L.supermap
          .featureService(data.searchUrl)
          .getFeaturesByBuffer(bufferParam, async serviceResult => {
            exitportList = serviceResult.result.features.features.map(item => {
              return item.properties;
            });
            let distance = 0;
            let distance_str = 0;
            let exitStation = '';
            for (let exit of exitportList) {
              let result = await getDistance(
                [exit.SMX, exit.SMY],
                [location[0], location[1]]
              );
              exit.distance = result.distance;
              exit.distance_str = result.distance_str;
              if (
                (distance === 0 && exit.distance > distance) ||
                (distance > 0 && exit.distance < distance)
              ) {
                distance = exit.distance;
                distance_str = exit.distance_str;
                exitStation = exit.NAME;
              }
            }
            resolve({
              arrivalSite: exitStation.split('地铁站')[0],
              exitPort: exitStation.split('地铁站')[1],
              walkDistance: distance_str
            });
          });
      });
    };
    // 地图初始化
    const amapInit = () => {
      data.map = window.L.map('map', {
        preferCanvas: true,
        crs: window.L.CRS.EPSG4326,
        center: JSON.parse(JSON.stringify(data.currentLocation)).reverse(),
        maxZoom: 18,
        zoom: 12,
        setView: true
      });
      window.L.supermap.tiledMapLayer(data.mapUrl).addTo(data.map);
      window.L.geoJSON(data.poiList, {}).addTo(data.map);
    };
    const onSelect = num => {
      if (data.poiList[num - 1]) {
        clickChange(data.poiList[num - 1]);
      }
    };
    const clickChange = el => {
      let isUseSubway = false;
      szmtr.line.forEach(item => {
        let res = item.station.some(i => {
          return i.name == el.arrivalSite;
        });
        if (res) isUseSubway = res;
      });
      if (!el.arrivalSite) {
        proxy.$subwayInfo.normalInfo(proxy.$t('nositearound'));
        return;
      } else if (el.arrivalSite === data.currentStation) {
        return proxy.$subwayInfo.normalInfo(proxy.$t('nowsite'));
      } else if (!isUseSubway) {
        return proxy.$subwayInfo.normalInfo(
          proxy.$t('TheSubwayStationIsNotOpenYet')
        );
      }
      store.commit('setTicketData', {
        destnLAL: [el.SMX, el.SMY], // 目的地经纬度
        arrivalSite: el.arrivalSite,
        destination: el.NAME, // 目的地名称
        straightDistance: el.walkDistance,
        exitPort: el.exitPort,
        price: 0
      });
      data.noNLG = true;
      // 渲染线路图
      emit('endSiteNameChange', el.arrivalSite);
      // 没有支付方式的跳转到stepSite界面
      // 内容播报：买票
      try {
        if (window.bridge) {
          window?.bridge?.generateNLG(
              'buyTickets',
              data.origin,
              data.endArrivalSite,
              parseInt(data.count),
              '',
              '',
              data.destination
          );
        }
      } catch (e) {
        console.error('内容播报：买票发生错误', e);
      }
      store.commit('setCurrentIndex', 2);
      window?.bridge?.trigggerGetPrice(el.arrivalSite);

    };
    onMounted(async () => {
      console.log('3.-组件挂载到页面之后执行-------onMounted');
      await updateLngLat();
      amapInit();
      findAroundPOI();
      window['onSelect'] = num => {
        onSelect(num);
      };
    });
    return {
      ...toRefs(data),
      clickChange
    };
  }
};
</script>
<style lang="scss" scoped>
.stepDestination {
  margin-top: 36px;
  text-align: center;
}

#map {
  width: 1080px;
  height: 758px;
  background: #ffffff;
  box-shadow: 0 0 32px 0 rgba(0, 0, 0, 0.12);
  border-radius: 30px;
}

.list {
  box-sizing: border-box;
  margin-left: 30px;
  width: 750px;
  height: 758px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  padding: 10px 30px 30px;

  .list-t {
    line-height: 90px;

    .list-t-l {
      font-size: 30px;
      font-weight: 500;
      color: #4868c1;
    }

    .list-t-r {
      font-size: 24px;
      font-weight: 400;
      color: #4868c1;
      padding-right: 14px;
    }
  }

  .list-title {
    width: 690px;
    background: #edf4ff;
    margin: auto;
    font-size: 26px;
    font-weight: 400;
    color: #333333;
    line-height: 70px;

    .list-title-l {
      margin-left: 100px;
    }

    .list-title-r {
      width: 200px;
      margin-right: 25px;
    }
  }

  .list-main {
    height: 556px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 12px;
      background: #ffffff;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      background: #ffffff;
    }

    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.2);
    }

    .item {
      line-height: 110px;
      border-bottom: 1px solid #e4e4e4;

      .item-l {
        width: 100px;

        span {
          width: 28px;
          height: 28px;
          background: #5687fc;
          font-size: 20px;
          font-weight: 500;
          color: #ffffff;
          line-height: 28px;
          border-radius: 50%;
        }
      }

      .item-c {
        font-size: 30px;
        font-weight: 500;
        color: #333333;
        flex: 1;
        text-align: left;
        padding-right: 20px;
      }

      .item-r {
        width: 200px;
        margin-right: 25px;
        font-size: 30px;
        font-weight: bold;
        color: #333333;
      }
    }
  }
}
@media screen and (max-width: 1180px) {
  .stepDestination {
    display: block;
  }
  #map {
    width: 1020px;
    margin: auto;
    height: 824px;
  }

  .list {
    box-sizing: border-box;
    margin: 20px auto 0;
    width: 1020px;
    height: 530px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    padding: 10px 30px 30px;

    .list-t {
      line-height: 90px;

      .list-t-l {
        font-size: 30px;
        font-weight: 500;
        color: #4868c1;
      }

      .list-t-r {
        font-size: 24px;
        font-weight: 400;
        color: #4868c1;
        padding-right: 14px;
      }
    }

    .list-title {
      width: 968px;
      background: #edf4ff;
      margin: auto;
      font-size: 26px;
      font-weight: 400;
      color: #333333;
      line-height: 70px;

      .list-title-l {
        margin-left: 100px;
      }

      .list-title-r {
        width: 200px;
        margin-right: 25px;
      }
    }

    .list-main {
      height: 330px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 12px;
        background: #ffffff;
      }

      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track {
        background: #ffffff;
      }

      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.2);
      }

      .item {
        line-height: 65px;
        border-bottom: 1px solid #e4e4e4;

        .item-l {
          width: 100px;

          span {
            width: 28px;
            height: 28px;
            background: #5687fc;
            font-size: 20px;
            font-weight: 500;
            color: #ffffff;
            line-height: 28px;
            border-radius: 50%;
          }
        }

        .item-c {
          font-size: 26px;
          font-weight: 500;
          color: #333333;
          flex: 1;
          text-align: left;
          padding-right: 20px;
        }

        .item-r {
          width: 200px;
          margin-right: 25px;
          font-size: 26px;
          font-weight: bold;
          color: #333333;
        }
      }
    }
  }
}
</style>
