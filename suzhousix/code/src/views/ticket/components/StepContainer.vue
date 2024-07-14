<template>
  <div class="wrapper">
    <div class="wrapper-left map-box">
      <div id="map" style="height: 100%"></div>
      <!-- S 换乘路线 -->
      <!-- <map-info-box
        v-if="routeData"
        ref="mapInfoBox"
        :is-ticket="true"
        :isPrompt="true"
        :topInfo="title"
        class="map-content-dialog"
        @buttonClick="changeLineType"
      >
        <a-row class="line-container">
          <a-row
            align="middle"
            class="line-point-box"
            style="width: 100%"
            type="flex"
          >
            <a-col style="display: flex; align-content: center">
              <span class="f22 color-white start-station">
                {{ routeData.paths[0].sName }}
              </span>
            </a-col>
            <a-col :span="4" class="text-center">
              <i class="icon icon-line-arrow"></i>
            </a-col>
            <a-col style="display: flex; align-items: center">
              <span class="f26 color-white terminal-station">
                {{ routeData.paths[routeData.paths.length - 1].sName }}
              </span>
            </a-col>
          </a-row>
          <a-row style="width: 100%">
            <a-col :span="8" class="mt10">
              <i class="icon icon-station"></i>
              <span class="line-text">
                共{{ $tc('xsites', { n: routeData.snum }) }}
              </span>
            </a-col>
            <a-col :span="8" class="mt10">
              <i class="icon icon-station"></i>
              <span class="line-text">
                换{{ $tc('xtimes', { n: routeData.paths.length - 2 }) }}
              </span>
            </a-col>
            <a-col :span="8" class="mt10">
              <i class="icon icon-time"></i>
              <span class="line-text">
                约{{ $tc('xminutes', { n: routeData.time }) }}
              </span>
            </a-col>
          </a-row>
        </a-row>
        <div class="mt8">
          <template v-for="(path, index) in routeData.paths" :key="index">
            <a-row class="line-container">
              <div
                v-if="
                  routeData.destination &&
                  routeData.destination !== 'undefined' &&
                  index === routeData.paths.length - 1
                "
                class="line-tail-walk"
              ></div>
              <div
                v-if="index > 0"
                :class="[
                  'line-tail-head',
                  'line-name-bg-' + routeData.paths[index - 1].sIndex
                ]"
              ></div>
              <div
                v-if="index < routeData.paths.length - 1"
                :class="['line-tail', 'line-name-bg-' + path.sIndex]"
              ></div>
              <a-row
                align="middle"
                class="mt10 h40"
                style="width: 100%"
                type="flex"
              >
                <a-col :span="2">
                  <i
                    :class="[
                      index === 0
                        ? 'line-icon-circle-start'
                        : index === routeData.paths.length - 1
                        ? 'line-icon-circle-end'
                        : 'line-icon-transfer'
                    ]"
                  ></i>
                </a-col>
                <a-col class="display-flex-center line-name-wrapper">
                  <span class="color-gray f24 lh1">{{ path.sName }}</span>
                  <span
                    v-if="index < routeData.paths.length - 1"
                    :class="['line-mark-name', 'line-name-bg-' + path.sIndex]"
                  >
                    {{ path.sLine }}
                  </span>
                  <span
                    v-if="
                      index === routeData.paths.length - 1 &&
                      routeData.exitPort &&
                      routeData.exitPort !== 'undefined'
                    "
                    class="color-gray f24 lh1"
                  >
                    ({{ routeData.exitPort }})
                  </span>
                </a-col>
              </a-row>
              <template v-if="index < routeData.paths.length - 1">
                <a-row
                  align="middle"
                  class="mt10"
                  style="width: 100%"
                  type="flex"
                >
                  <a-col :span="2">
                    <i
                      :class="[
                        'line-icon-station',
                        'line-name-bg-' + path.sIndex
                      ]"
                    ></i>
                  </a-col>
                  <a-col class="f18 color-gray">
                    <i18n path="taketodirection">
                      <span
                        :class="'line-name-color-' + path.sIndex"
                        place="lineIndex"
                      >
                        {{ path.sLine }}
                      </span>
                      <span class="color-direction" place="direction">
                        {{ path.sPath }}
                      </span>
                    </i18n>
                  </a-col>
                </a-row>
                <a-row style="width: 100%">
                  <a-col :span="2"></a-col>
                  <a-col class="display-flex-center mr40">
                    <i class="line-mark-first mr10">{{ $t('firstSite') }}</i>
                    <span class="f16">{{ path.sStart }}</span>
                  </a-col>
                  <a-col class="display-flex-center">
                    <i class="line-mark-end mr10">{{ $t('endSite') }}</i>
                    <span class="f16">{{ path.sEnd }}</span>
                  </a-col>
                </a-row>
              </template>
            </a-row>
            <a-row
              v-if="path.stations && path.stations.length > 0"
              class="line-transfer-container"
              justify="space-between"
              style="width: 100%"
              type="flex"
            >
              <div
                :class="['line-tail-transfer', 'line-name-bg-' + path.sIndex]"
              ></div>
              <a-col :span="2" class="display-flex-col-around pl4">
                <i
                  v-for="station in path.stations"
                  v-show="path.stationsShow"
                  :key="station.id"
                  :class="[
                    'line-icon-site',
                    'line-site-bordercolor-' + path.sIndex
                  ]"
                  style="display: block"
                ></i>
              </a-col>
              <a-col :span="20">
                <div v-show="!path.stationsShow" class="stationsLength">
                  {{ $tc('xsites', { n: path.stations.length }) }}
                </div>
                <ul v-show="path.stationsShow" style="padding-top: 3px">
                  <li
                    v-for="station in path.stations"
                    :key="station.id"
                    class="transfer-site"
                  >
                    {{ station.name }}
                  </li>
                </ul>
              </a-col>
              <a-col :span="2">
                <i
                  :class="path.stationsShow ? 'rotate' : ''"
                  class="icon line-icon-arrow-down"
                  @click="stationsShowFn(path.stationsShow, index)"
                ></i>
              </a-col>
            </a-row>
          </template>
        </div>
        <a-row
          v-if="
            routeData.straightDistance &&
            routeData.straightDistance !== 'undefined'
          "
          class="line-walk-wrapper"
        >
          <div class="line-tail-walk"></div>
          <a-col :span="2" class="display-flex-col-around">
            <i class="line-icon-walk"></i>
          </a-col>
          <a-col class="line-walk-content">
            {{ $t('walk') }}
            <span class="color-distance">
              {{ routeData.straightDistance }}
            </span>
          </a-col>
        </a-row>
        <a-row
          v-if="routeData.destination && routeData.destination !== 'undefined'"
          class="line-container"
        >
          <div class="line-tail-walk-head"></div>
          <a-row align="middle" class="mt10" style="width: 100%" type="flex">
            <a-col :span="2">
              <i class="line-icon-circle-end"></i>
            </a-col>
            <a-col class="display-flex-center line-name-wrapper">
              <span class="color-gray f24 lh1">
                {{ routeData.destination }}
              </span>
            </a-col>
          </a-row>
        </a-row>
      </map-info-box> -->
    </div>
    <div class="wrapper-right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import axios from 'axios';
import LMap from '@/components/line';
// import MapInfoBox from '@/components/MapInfoBox.vue';
import { mapGetters } from 'vuex';

export default {
  // components: { MapInfoBox },
  props: {
    endSiteName: {
      type: String,
      default: () => {
        return '';
      }
    }
  },
  data() {
    return {
      lineMap: null,
      boxMarker: null,
      startMarker: null,
      endMarker: null,
      routeData: null,
      routeDataList: [],
      pathData: null,
      pathDataList: [],
      type: 0,
      isFirstLoad: true
    };
  },
  computed: {
    title() {
      return [
        this.$t('leastTransfer'),
        this.$t('leastTime'),
        this.$t('distancefirst')
      ];
    },
    startSiteName() {
      return window?.bridge?.getDefaultSite();
    },
    ...mapGetters({
      price: 'getPrice',
      origin: 'getOrigin',
      endName: 'getEndName',
      stationInfo: 'getTransitData',
      arrivalSite: 'getArrivalSite',
      destination: 'getDestination',
      count: 'getCount',
      endArrivalSite: 'endArrivalSite',
      exitPort: 'getExitport'
    })
  },
  watch: {
    type: {
      handler: function (val) {
        if (val >= 0) {
          this.routeData = this.routeDataList[val];
          this.pathData = this.pathDataList[val];
          this.lineMap.showPath(this.pathData);
          // TODO: 更新票价
          let ticket = this.$store.getters['getTicketData'];
          ticket = Object.assign(ticket, {
            price: Number(this.routeData.ticket)
          });
          this.$store.commit('setTicketData', ticket);
        }
      }
    },
    endSiteName: {
      handler: async function (val) {
        if (val && val !== 'undefined' && this.startSiteName) {
          setTimeout(async () => {
            let startName = this.startSiteName;
            let startSiteId =
              this.lineMap.lineData.getStationByName(startName).id;
            let endSiteId = this.lineMap.lineData.getStationByName(val).id;
            this.searchPath({ startSiteId, endSiteId });
          });
        } else {
          this.init();
          this.routeData = null;
        }
      },
      immediate: false
    }
    // '$i18n.locale': {
    //   handler: function (val) {
    //     if (val && !this.isFirstLoad) {
    //       // 重新初始化地图
    //       this.init();
    //       this.$nextTick(() => {
    //         if (this.store.startSiteId && this.store.endSiteId) {
    //           this.updateMarkerData({
    //             departSite: this.store.departSite,
    //             arrivalSite: this.store.arrivalSite
    //           });
    //           this.searchPath(this.store);
    //         }
    //       });
    //     }
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.lineMap = new LMap.Path('map', {
          isShowNav: false,
          isNeedClick: false,
          zoom: 4,
          language:
            window.localStorage.getItem('lang') === 'en' ? 'English' : 'Chinese'
        });
        this.isFirstLoad = false;
        if (this.arrivalSite) {
          this.setStartInfo();
          setTimeout(async () => {
            let startName = this.startSiteName;
            let startSiteId =
              this.lineMap.lineData.getStationByName(startName).id;
            let endSiteId = this.lineMap.lineData.getStationByName(
              this.arrivalSite
            ).id;
            this.searchPath({
              startSiteId,
              endSiteId,
              destination: this.destination
            });
          }, 300);
        }
      });
    },
    getDistance(start, end) {
      return new Promise(resolve => {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        var polyLine = window.L.polyline([start.reverse(), end.reverse()], {
          color: 'red'
        });
        var measureParam = new window.SuperMap.MeasureParameters(polyLine);
        var measureService = new window.L.supermap.measureService(that.mapUrl);
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
    },
    getStationId(id) {
      let result = id.replace('s', '');
      if (result.indexOf('_') > -1) {
        result = result.split('_')[1];
      }
      return result;
    },
    // 获取线路数据
    getPathInfo({ startSiteId = '', endSiteId = '' }) {
      const ipUrl = window.config.apiUrl;
      return axios({
        method: 'get',
        url: `${ipUrl}/subway/api/planningTrip?startStation=${startSiteId}&endStation=${endSiteId}`,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then(res => {
        return res.data;
      });
    },
    changeLineType(type) {
      this.type = type;
    },
    async getLnglat(address) {
      const addressUrl = `http://${window.config.mapUrl}/iserver/services/${window.config.mapUrl}/restjsr/v1/address`;
      let addressMatchService =
        window.L.supermap.addressMatchService(addressUrl);
      let geoCodeParam = new window.SuperMap.GeoCodingParameter({
        address
      });
      await addressMatchService.code(geoCodeParam, obj => {
        if (obj.result.length > 0) {
          return [...Object.values(obj.result[0].location)];
        } else {
          console.error('更新站点坐标失败');
        }
      });
    },
    // 渲染线路
    async searchPath({ startSiteId, endSiteId, destination }) {
      // 默认关闭弹窗
      // 清空数组
      this.routeDataList.splice(0);
      this.pathDataList.splice(0);
      if (endSiteId && startSiteId) {
        // 获取线路数据
        let res = await this.getPathInfo({
          startSiteId: this.getStationId(startSiteId),
          endSiteId: this.getStationId(endSiteId)
        });
        let lineData = res.result;
        // 获取画线数据
        lineData.forEach(line => {
          let pathData = this.lineMap.lineData.getDrawData(line);
          this.pathDataList.push(pathData);
        });
        this.pathData = this.pathDataList[1];
        this.updateMarkerData({
          departSite: this.pathData.line[0].station[0],
          arrivalSite:
            this.pathData.line[this.pathData.line.length - 1].station[
              this.pathData.line[this.pathData.line.length - 1].station.length -
                1
            ]
        });
        this.lineMap.showPath(this.pathData);
        // for (const line of lineData) {
        //   let routeData = {
        //     distance: line.road, // 线路距离
        //     snum: line.snum, // 站点数量
        //     ticket: line.ticket, // 乘车票价
        //     time: line.time, // 乘车时间
        //     paths: line.paths, // 站点信息
        //     straightDistance: null, // 步行距离
        //     destination: destination, // 目的地名称
        //     exitPort: null
        //   };
        //   if (destination) {
        //     routeData.straightDistance =
        //       this.$store.getters['getTicketData']('straightDistance');
        //     routeData.exitPort =
        //       this.$store.getters['getTicketData']('exitPort');
        //   }
        //   let transferSites = this.lineMap.lineData.getTranferStations(line);
        //   transferSites.forEach(item => {
        //     item.station.splice(0, 1);
        //   });
        //   // 获取中间站点
        //   routeData.paths.forEach((path, index) => {
        //     path.stationsShow = false;
        //     if (index < routeData.paths.length - 1) {
        //       path.stations = transferSites[index].station;
        //     }
        //     if (path.sLine === '1号线') {
        //       path.sIndex = 1;
        //     }
        //     if (path.sLine === '2号线') {
        //       path.sIndex = 2;
        //     }
        //     if (path.sLine === '3号线') {
        //       path.sIndex = 3;
        //     }
        //     if (path.sLine === '4号线' || path.sLine === '4号线支线') {
        //       path.sIndex = 4;
        //     }
        //     if (path.sLine === '5号线') {
        //       path.sIndex = 5;
        //     }
        //     if (path.sEnd && path.sEnd.indexOf('#') !== -1) {
        //       path.sEnd = path.sEnd.slice(0, 5);
        //     }
        //   });
        //   this.routeDataList.push(routeData);
        // }
        // this.routeData = this.routeDataList[2]; // 默认展示第一条
        // let ticket = this.$store.getters['getTicketData'];
        // ticket = Object.assign(ticket, {
        //   price: Number(this.routeData.ticket)
        // });
        // this.$nextTick(() => {
        //   this.$refs.mapInfoBox && this.$refs.mapInfoBox.showInfo(); // 数据加载完成后展开弹出层
        // });
      }
    },
    // 更新换乘站点信息
    updateMarkerData({ departSite, arrivalSite }) {
      this.startMarker && this.startMarker.remove();
      this.boxMarker && this.boxMarker.remove();
      this.endMarker && this.endMarker.remove();
      let startSiteId = departSite;
      let startPosition = this.lineMap.getStationPoi({
        id: startSiteId
      });
      let startSite = $(`#s${startSiteId}`) || $(`#i${startSiteId}`);
      this.startMarker = new LMap.Marker({
        mapId: 'map',
        markerId: 'logoStart',
        content:
          window.localStorage.getItem('lang') === 'en'
            ? '<div class="btn-set start-en"></div> '
            : '<div class="btn-set start-cn"></div>',
        position: startPosition,
        siteCoord: [
          startSite.attr('cx') || startSite.attr('x'),
          startSite.attr('cy') || startSite.attr('y')
        ]
      });
      let endSiteId = arrivalSite;
      let endPosition = this.lineMap.getStationPoi({
        id: endSiteId
      });
      let endSite = $(`#s${endSiteId}`) || $(`#i${endSiteId}`);
      this.endMarker = new LMap.Marker({
        mapId: 'map',
        markerId: 'logoEnd',
        content:
          window.localStorage.getItem('lang') === 'en'
            ? '<div class="btn-set end-en"></div> '
            : '<div class="btn-set end-cn"></div>',
        position: endPosition,
        siteCoord: [
          endSite.attr('cx') || endSite.attr('x'),
          endSite.attr('cy') || endSite.attr('y')
        ]
      });
      return {
        startSiteId: this.getStationId(startSiteId),
        endSiteId: this.getStationId(endSiteId)
      };
    },
    stationsShowFn(val, index) {
      console.log(this.routeData);
      this.routeData.paths[index].stationsShow = !val;
      console.log(val, index);
    },
    // 7，设置起始站点与坐标(从客户端获取)
    setStartInfo() {
      this.startSiteId = this.lineMap.lineData.getStationByName(
        this.startSiteName
      ).id;
      if (!this.startSiteId) {
        console.error(`起始站：“”，查询id失败 “this.startSiteId”`);
        return;
      }
      this.startPosition = this.lineMap.getStationPoi({ id: this.startSiteId });
      console.log(
        `设置起始站点信息成功startSiteId=${this.startSiteId},startPosition=${this.startPosition}`
      );
    }
  }
};
</script>
<style lang="scss" scoped>
@import './SubwayComp.scss';

.line-start {
  display: inline-block;
  background: #81c661;
  border-radius: 5px;
  width: 140px;
  line-height: 40px;
  text-align: center;
}

.line-end {
  display: inline-block;
  background: #f1584c;
  border-radius: 5px;
  width: 140px;
  line-height: 40px;
  text-align: center;
}

.rotate {
  transform: rotate(180deg);
}

.stationsLength {
  color: #609bf8;
  font-size: 18px;
}

.line-float {
  position: absolute;
  top: 100px;
  right: 10px;
  z-index: 1;
}

.line-cost {
  width: 100px;
  box-shadow: 0 5px 10px 5px #bfb9b959;

  &-header {
    height: 44px;
    line-height: 44px;
    background: #7cabf4;
    border-radius: 10px 10px 0 0;
  }

  &-item {
    height: 44px;
    line-height: 44px;
    border: 1px solid #c9c9c9;
    background: #fff;

    &:last-child {
      border-radius: 0 0 10px 10px;
    }

    &-in {
      &:last-child {
        border-radius: 0 0 10px 10px;
      }
    }

    &.active {
      background: #e5efff;
      border: 1px solid #c9c9c9;
      border-radius: 0;
      color: #6699ff;
    }
  }
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36px 30px 0;

  &-left {
    width: 1080px;
    height: 758px;
  }

  &-right {
    width: 750px;
  }
}

.map-box {
  width: 1080px;
  height: 758px;
  box-shadow: 0px 0px 32px 0px rgba(0, 0, 0, 0.12);
  border-radius: 30px;
  overflow: hidden;
  #map {
    width: 1080px;
    height: 100%;
  }
}

.start-station {
  width: 144px !important;
  border-radius: 4px;
  line-height: 40px;
  text-align: center;
  background: #81c661;
  font-size: 20px;
}

.terminal-station {
  width: 142px !important;
  border-radius: 4px;
  line-height: 40px;
  text-align: center;
  background: #f1584c;
  font-size: 20px;
}
@media screen and (max-width: 1080px) {
  .wrapper {
    display: block;
    justify-content: space-between;
    align-items: center;
    padding: 36px 30px 0;

    &-left {
      width: auto;
      height: 628px;
    }

    &-right {
      width: auto;
    }
  }
  .map-box {
    width: auto;
    height: 628px;
    box-shadow: 0px 0px 32px 0px rgba(0, 0, 0, 0.12);
    border-radius: 30px;
    overflow: hidden;
    #map {
      width: 1080px;
      height: 100%;
    }
  }

  .start-station {
    width: 144px !important;
    border-radius: 4px;
    line-height: 40px;
    text-align: center;
    background: #81c661;
    font-size: 20px;
  }

  .terminal-station {
    width: 142px !important;
    border-radius: 4px;
    line-height: 40px;
    text-align: center;
    background: #f1584c;
    font-size: 20px;
  }
}
</style>
