<template>
  <menu-container
    :title="type === 'mapSearch' ? $t('PlanJourney') : $t('siteAround')"
  >
    <div class="around-col-wrapper display-flex-between">
      <div id="map"></div>
      <div
        v-show="currentMapInfo === 1 && false"
        id="busMap"
        class="p-[10px] xl:p-[30px]"
      >
        <div class="bg-white busMap-wrap">
          <div class="mb-[46px]">
            <div class="flex items-center">
              <img class="w-[40px] h-[40px]" src="@/assets/icon_bus.png" />
              <div class="ml-[8px] text-[30px] text-[#333] font-bold">
                353路
              </div>
            </div>
            <div class="grid xl:grid-cols-2 grid-cols-1 ml-[48px]">
              <div>
                <div class="flex items-center my-[24px]">
                  <img class="w-[26px]" src="@/assets/threeArrow.png" />
                  <div class="xl:text-[26px] text-[22px] ml-[8px]">
                    开往 <a class="text-[#4587EF]">公交三路新村首末站</a> 方向
                  </div>
                </div>
                <div class="text-[#999] xl:text-[26px] text-[22px] ml-[38px]">
                  距离 <a class="text-[#4587EF]">2站</a>
                </div>
              </div>
              <div>
                <div class="flex items-center my-[24px]">
                  <img class="w-[26px]" src="@/assets/threeArrow.png" />
                  <div class="xl:text-[26px] text-[22px] ml-[8px]">
                    开往 <a class="text-[#4587EF]">公交一路新村首末站</a> 方向
                  </div>
                </div>
                <div class="text-[#999] xl:text-[26px] text-[22px] ml-[38px]">
                  距离 <a class="text-[#4587EF]">2站</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="map-info">
        <!--  S 信息框 周边 公交  -->
        <map-info-box
          v-if="!isWalkLineBox"
          :top-info="
            currentKeywords
              ? [$t('chooseDestination'), $t('busInfo')]
              : [$t('siteAround'), $t('busInfo')]
          "
          @buttonClick="mapInfoBoxTopClick"
        >
          <template v-if="currentKeywords" #topInfo>
            <div class="map-info-wrapper-title display-flex-between-center">
              <div class="map-info-wrapper-title-left">
                {{ $t('destination') }}
              </div>
              <div
                v-if="type === 'mapSearch'"
                class="map-info-wrapper-title-right"
              >
                {{ $t('recommendsite') }}
              </div>
              <div v-else class="map-info-wrapper-title-right">
                {{ $t('distance') }}
              </div>
            </div>
          </template>
          <div class="map-info-wrapper">
            <!--  S 信息框 周边 -->
            <div v-show="currentMapInfo === 0">
              <div
                v-for="(p, index) in poiList"
                :key="index"
                class="box-around-item"
                @click="onSelect(index + 1)"
              >
                <!-- 没有序号的版本 -->
                <div
                  v-if="!currentKeywords"
                  class="display-flex-between-center box-around-item-no-index"
                >
                  <div>
                    <div class="box-item-title over-text">
                      {{ p.NAME }}
                    </div>
                    <div class="box-item-distance">
                      <span class="distance-left-font">
                        距{{ p.exitPort
                        }}<span style="color: #4587ef">{{
                          p.distance_str
                        }}</span>
                      </span>
                    </div>
                  </div>
                  <div class="box-item-title-exitPort over-text">
                    {{ p.exitPort }}
                  </div>
                </div>
                <!-- 有序号的版本 -->
                <div
                  v-else
                  class="display-flex-between-center box-around-item-index"
                >
                  <div
                    class="icon-around-index-bg f16 color-white display-flex-center box-around-item-index-num mr20"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="item-info-title over-text f24">
                    {{ p.NAME }}
                  </div>
                  <div
                    v-if="type === 'mapSearch'"
                    class="box-item-index-distance box-item-index-distance-bold over-text"
                  >
                    <div v-if="p.arrivalSite && p.arrivalSite != 'undefined'">
                      <div v-chStationToEn="p.arrivalSite">{{ p.arrivalSite }}</div>
                    </div>
                  </div>
                  <div
                    v-else
                    class="box-item-index-distance f20 display-flex-end over-text"
                  >
                    {{ p.distance_str }}
                  </div>
                </div>
              </div>
            </div>
            <!--  E 信息框 周边 -->
            <!--  S 信息框 公交 ui上没有 暂时不显示-->
            <div
              v-show="currentMapInfo === 1"
              class="box-item-bus-wrapper bg-white pb-[28px]"
            >
              <!--              <template v-if="busList && busList.length > 0">-->
              <!--                <div-->
              <!--                  v-for="(p, index) in busList"-->
              <!--                  :key="index"-->
              <!--                  class="box-item-bus"-->
              <!--                >-->
              <!--                  {{ p.LINENUM }}-->
              <!--                </div>-->
              <!--              </template>-->
              <div
                v-for="(item, index) of busList"
                :key="index"
                class="item px-[20px] py-[28px]"
              >
                <div class="text-[#333] xl:text-[26px] text-[22px]">
                  {{ item.destinationName
                  }}<a class="text-[#4587EF]">{{ item.exitName }}</a>
                  <div class="flex flex-wrap">
                    <div
                      v-for="(per, ind) of item.destinationNameBus"
                      :key="ind"
                      class="mr-[8px] px-[8px] py-[6px] text-[#fff] text-[20px] bg-[#66A1FF] rounded-[6px] leading-[20px] mt-[16px]"
                    >
                      {{ per }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--  E 信息框 公交 -->
          </div>
        </map-info-box>
        <!--  E 信息框 周边 公交  -->
        <!--  S 信息框 线路规划  -->
        <map-info-box v-if="isWalkLineBox" :top-info="[$t('recommendPath')]">
          <div class="map-info-wrapper">
            <div
              class="map-info-line-start-end"
              style="background-color: #fffffe"
            >
              <a-row class="line-walk-wrapper">
                <div class="line-tail-walk"></div>
                <a-col :span="2">
                  <i class="line-icon-circle-start"></i>
                </a-col>
                <a-col class="display-flex-center line-name-wrapper">
                  <span class="color-gray f24 lh1">{{ walkInfo.from }}</span>
                </a-col>
              </a-row>
              <!--  E 起点  -->
            </div>
            <!-- S 中间步行 -->
            <div style="background-color: #f1f1f1">
              <a-row class="line-walk-wrapper">
                <div class="line-tail-walk"></div>
                <a-col :span="2" class="display-flex-col-around">
                  <i class="line-icon-walk"></i>
                </a-col>
                <!--                <div class="line-tail-walk"></div>-->
                <a-col class="line-walk-content">
                  <!--                  {{ $t('walk') }}-->
                  <!--                  <span-->
                  <!--                    class="color-distance"-->
                  <!--                    v-if="walkInfo.distance && walkInfo.distance < 1000"-->
                  <!--                  >-->
                  <!--                    {{ $tc('xmeters', { x: walkInfo.distance }) }}-->
                  <!--                  </span>-->
                  <!--                  <span class="color-distance" v-else>-->
                  <!--                    {{ (walkInfo.distance / 1000).toFixed(1) }}km-->
                  <!--                  </span>-->
                  <span class="color-distance">
                    {{ walkInfo.distance_str }}
                  </span>
                </a-col>
              </a-row>
            </div>
            <!-- E 中间步行 -->
            <!--  S 终点  -->
            <div
              class="map-info-line-start-end"
              style="background-color: #fffffe"
            >
              <a-row class="line-walk-wrapper bg-color-white">
                <a-col :span="2">
                  <i class="line-icon-circle-end"></i>
                </a-col>
                <a-col class="display-flex-center line-name-wrapper">
                  <span class="color-gray f24 lh1">
                    {{ walkInfo.to.slice(0, 13) }}
                  </span>
                </a-col>
              </a-row>
            </div>
            <!--  E 终点  -->
          </div>
        </map-info-box>
        <!--  E 信息框 线路规划  -->
      </div>
    </div>
  </menu-container>
</template>

<script>
import MapInfoBox from '@/components/MapInfoBox.vue';
import Protocol from '@/mixins/protocol.ts';
import POILIST from './poi';
import axios from 'axios';
const SuperMap = window.SuperMap;
import { szmtr } from '@/components/line/szmtr.js';
const getDistanceStr = distance => {
  return distance && distance > 0
    ? distance > 1000
      ? (distance / 1000).toFixed(2) + 'km'
      : distance + 'm'
    : null;
};
export default {
  name: 'AroundAuto',
  components: {
    MapInfoBox
  },
  props: {},
  data() {
    return {
      loadFindAroundPOI: false,
      titel: [],
      map: null,
      isWidthScreen: true,
      isWalkLineBox: false, // 是否显示线路规划信息框
      currentMapInfo: 0, // 当前信息框选择的mapInfo,0-周边，1-公交
      currentStation:
        window.config?.fixStation?.split(',')[0] ||
        window?.bridge?.getDefaultSite?.() ||
        '东方之门', // 当前站点
      lnglat: '', // 当前站点坐标
      currentKeywords: '', // 当前poi关键字
      poiShowMax: 15, // POI 最多显示数量
      isNear: true, // 是否是周边 true-周边查询nearbySearch，false-mapSearch
      amap: null,
      poiList: [],
      markList: [],
      walkInfo: {
        from: '',
        distance_str: '',
        to: ''
      },
      busList: [], // 公交数据(name, location)
      type: '',
      currentLocation: [],
      exitList: [],
      searchUrl: `http://${window.config.mapUrl}/iserver/services/data-SuZhouShiDiTu/rest/data`,
      poiLayer: null,
      isFirstLoad: true,
      resultLayer: null,
      siteChangeFn: null,
      onShortcut: null,
      mapUrl: `http://${window.config.mapUrl}/iserver/services/map-SuZhouShiDiTu/rest/maps/苏州市地图`,
      isTryApi: false
    };
  },
  watch: {
    currentStation: {
      immediate: true, // 第一次绑定值是否触发handler
      handler(value) {
        if (value) {
          this.currentStation = value;
          this.updateLngLat();
        }
      }
    }
  },
  async mounted() {
    const { firstLoad, onSiteChanged, onShortcut } = Protocol();
    firstLoad(['onSiteChanged', onShortcut]);
    this.onShortcut = onShortcut;
    this.siteChangeFn = onSiteChanged;
    this.$nextTick(async () => {
      // test
      // let startpoint = new SuperMap.Geometry.Point(120.622375, 31.313455)
      // let endpoint = new SuperMap.Geometry.Point(120.67994, 31.318033)
      if (window.bridge && window?.bridge?.getSiteLocation) {
        let arr = window?.bridge?.getSiteLocation()?.split(',');
        this.currentLocation.push(arr[0]);
        this.currentLocation.push(arr[1]);
      }
      let isRouterSearch = false;
      await this.updateLngLat();
      this.amapInit();
      if (this.$route.query && !window.$.isEmptyObject(this.$route.query)) {
        console.log(
          `wl-周边查询界面--> mounted其他界面跳转 $route.query=`,
          this.$route.query
        );
        // 测试 “附近的肯德基” departSite = '东方之门' poiType = '肯德基' type = 'nearbySearch' 其他为空字符串
        // 测试 "附近的肯德基店" departSite = '东方之门' destination = '肯德基' type = 'nearbySearch' 其他为空字符串
        // 客户端错误过滤(有"undefined" 这种非法传过来)
        this.checkErrorParam(this.$route.query);
        if (this.$route.query.departSite) {
          this.currentStation = this.$route.query.departSite;
        }
        if (
          this.$route.query.poiType ||
          this.$route.query.destination ||
          this.$route.query.arrivalSite
        ) {
          isRouterSearch = true;
          this.onSiteChanged(
            this.$route.query.type,
            this.$route.query.departSite,
            this.$route.query.arrivalSite,
            this.$route.query.destination,
            '',
            '',
            '',
            this.$route.query.poiType
          );
        }
      }
      console.log('isRouterSearch', isRouterSearch);
      if (!isRouterSearch) {
        try {
          this.findAroundPOI();
          this.findAroundBus();
        } catch (e) {
          console.error('默认的周边信息（带地铁出口）初始化失败', e);
        }
      }
      // 选择监听
      window['onSelect'] = num => {
        if (this.$route.name == 'menunearby') {
          this.onSelect(num);
        }
      };
      // 语音监听
      window['onSiteChanged'] = (
        type,
        departSite,
        arrivalSite,
        destination,
        exitPort,
        distance,
        walkingTime,
        poiType
      ) => {
        this.onSiteChanged(
          type,
          departSite,
          arrivalSite,
          destination,
          exitPort,
          distance,
          walkingTime,
          poiType
        );
      };
      // 语音监听
      window['onShortcut'] = words => {
        if (words === '周边查询' && this.type === 'mapSearch') {
          this.type = '';
          this.isNear = true;
          this.currentKeywords = '';
          this.currentStation = window?.bridge?.getDefaultSite();
          let arr = window?.bridge?.getSiteLocation()?.split(',');
          this.currentLocation.push(arr[0]);
          this.currentLocation.push(arr[1]);
          try {
            this.$nextTick(() => {
              this.findAroundPOI();
              this.findAroundBus();
            });
          } catch (e) {
            console.error('默认的周边信息（带地铁出口）初始化失败', e);
          }
        } else {
          this.onShortcut(words);
        }
      };
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    mapInfoBoxTopClick(index) {
      this.currentMapInfo = index;
    },
    speech() {
      let type = '';
      let name = '';
      if (this.type) {
        if (this.type === 'mapSearch') {
          if (this.poiList && this.poiList.length) {
            type = 'chooseEnd';
            name = '';
          } else {
            type = 'noSuitableLine';
            name = '';
          }
        } else if (this.type === 'nearbySearch') {
          if (this.poiList && this.poiList.length) {
            type = 'selectPoi';
            name = this.currentKeywords;
          } else {
            type = 'noSuitableLine';
            name = '';
          }
        }
      } else {
        if (this.poiList && this.poiList.length) {
          type = 'nearbySearch';
          name = this.currentKeywords;
        } else {
          type = 'noSurroundingInformation';
          name = '';
        }
      }
      if (window.bridge) {
        window?.bridge?.generateNLG(type, '', '', 0, '', name);
      }
    },
    // 查询周边周边公交
    async findAroundBus() {
      console.log(
        'findAroundBus-findAroundBus-findAroundBus-findAroundBus-findAroundBus'
      );
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      /*    const that = this;
      const point = new SuperMap.Geometry.Point(
        this.currentLocation[0],
        this.currentLocation[1]
      );
      // 附近站点
      const busParam = new SuperMap.GetFeaturesByBufferParameters({
        datasetNames: ['苏州市地图:公交站点'],
        bufferDistance: 0.01, //3KM
        geometry: point
      });
      window.L.supermap
        .featureService(that.searchUrl)
        .getFeaturesByBuffer(busParam, function (serviceResult) {
          let result = serviceResult.result.features.features.map(i => {
            return i.properties;
          });
          let obj = {};
          that.busList = result.reduce(function (prev, current) {
            obj[current.LINENUM]
              ? ''
              : (obj[current.LINENUM] = true && prev.push(current));
            return prev;
          }, []);
        });*/
      let site = window?.bridge?.getDefaultSite?.();
      const defaultAroundInfoBus = await axios({
        method: 'get',
        url: `${window.config.apiUrl}/surround/around_poi/${
          site || '苏州奥体中心'
        }/bus`
      });
      const res = Array.isArray(defaultAroundInfoBus.data.data)
        ? defaultAroundInfoBus.data.data
        : [];
      res.map(item => {
        let destinationNameArr = item.destinationName?.split('\n') || [];
        // console.log(destinationNameArr);
        destinationNameArr.some(per => {
          this.busList.push({
            exitName: item.exitName,
            destinationName: per.split('：')?.[0],
            destinationNameBus: per.split('：')?.[1]?.split('、') || []
          });
        });
      });
    },
    // 查询周边POI
    async findAroundPOI(isTryApi = false) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let that = this;
      this.loadFindAroundPOI = true;
      this.poiLayer && this.poiLayer.remove();
      const result = await axios({
        method: 'get',
        url: `${window.config.apiUrl}/surround/searchFromLocalDB?destinationName=${this.currentKeywords}&stationName=${this.currentStation}`
      });
      const poiList = result?.data?.result;
      if (isTryApi && poiList?.length > 0) {
        this.isTryApi = true;
        // 暂时数据不全，无法测试
        const arr = poiList.map(item => {
          return {
            NAME: item.destinationName,
            SMX: item.longitude,
            SMY: item.latitude,
            distance: item.distance,
            distance_str:
              item.distance > 1000
                ? item.distance / 1000 + 'km'
                : item.distance + 'm',
            arrivalSite: item.stationName,
            exitPort: item.exitName,
            nearSubway: item.stationName
          };
        });
        that.poiList = arr.sort((a, b) => {
          return a.distance - b.distance;
        });
        console.log('that.poiList', that.poiList);
        this.$nextTick(() => {
          this.resultLayer = window.L.featureGroup().addTo(this.map);
          console.log(this.resultLayer);
          var latlng = window.L.latLng(
            that.currentLocation[1],
            that.currentLocation[0]
          );
          that.poiList.forEach(item => {
            const marker = window.L.marker([item.SMY, item.SMX]);
            this.resultLayer.addLayer(marker);
          });
          this.map.setView(latlng, 12);
        });
      } else {
        this.isTryApi = false;
        const point = new SuperMap.Geometry.Point(
          this.currentLocation[0],
          this.currentLocation[1]
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
        // todo: 附近poi使用指定dataset,distance,destination 使用dataset
        let list = POILIST[that.currentKeywords] || [];
        const currentDataset = list.map(item => {
          return `苏州市地图:${item}`;
        });
        const currentDistance = 0.03;
        var poiParam = new SuperMap.GetFeaturesByBufferParameters({
          datasetNames:
            that.isNear && list?.length > 0 ? currentDataset : dataset,
          bufferDistance: that.isNear ? currentDistance : 80, //3KM 查poi才有此参数
          geometry: point,
          attributeFilter: `NAME like '${that.currentKeywords}%'`
        });
        this.isFirstLoad = false;
        window.L.supermap
          .featureService(that.searchUrl)
          .getFeaturesByBuffer(poiParam, async function (serviceResult) {
            let result = serviceResult.result.features.features;
            const maxSize = 10;
            let index =
              result?.length - 1 > maxSize ? maxSize - 1 : result?.length - 1;
            that.poiList = result.slice(0, index + 1).map(item => {
              return item.properties;
            });
            console.log('that.poiList 637', that.poiList);
            // 语音播报
            that.speech();
            let arr = await Promise.all(
              that.poiList.map(async item => {
                let distanceResult = await that.getDistance(
                  [item.SMX, item.SMY],
                  [that.currentLocation[0], that.currentLocation[1]]
                );
                item.distance = distanceResult.distance;
                item.distance_str = distanceResult.distance_str;
                let nearSubway = await that.getNearSubway(item);
                item.exitPort = nearSubway.exitPort;
                item.arrivalSite = nearSubway.arrivalSite;
                item.walkDistance = nearSubway.walkDistance;
                return item;
              })
            );
            that.poiList = arr.sort((a, b) => {
              return a.distance - b.distance;
            });
            serviceResult.result.features.features =
              serviceResult.result.features.features.slice(0, index + 1);
            if (that.loadFindAroundPOI) {
              that.poiLayer = window.L.geoJSON(
                serviceResult.result.features,
                {}
              ).addTo(that.map);
              if (that.poiList?.length) {
                let currentLocation = window.L.latLng(
                  that.poiList[0].SMY,
                  that.poiList[0].SMX
                );
                that.map.setView(currentLocation, 12);
              }
            }
          });
      }
    },
    // 地图初始化
    amapInit() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let that = this;
      this.map = window.L.map('map', {
        preferCanvas: true,
        crs: window.L.CRS.EPSG4326,
        center: JSON.parse(JSON.stringify(that.currentLocation)).reverse(),
        maxZoom: 18,
        zoom: 12,
        setView: true
      });
      window.L.supermap.tiledMapLayer(that.mapUrl).addTo(this.map);
      window.L.geoJSON(this.poiList, {}).addTo(this.map);
      setTimeout(() => {
        var latlng = window.L.latLng(
          that.currentLocation[1],
          that.currentLocation[0]
        );
        this.map.setView(window.L.latLng(latlng), 10);
      });
    },

    getDistance(start, end) {
      return new Promise(resolve => {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let that = this;
        var polyLine = window.L.polyline([start.reverse(), end.reverse()], {
          color: 'red'
        });
        var measureParam = new SuperMap.MeasureParameters(polyLine);
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

    // 查询附近地铁站 & 距离
    getNearSubway(item) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let that = this;
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
          .featureService(that.searchUrl)
          .getFeaturesByBuffer(bufferParam, async serviceResult => {
            exitportList = serviceResult.result.features.features.map(item => {
              return item.properties;
            });
            // distance = exit.distance;
            // distance_str = exit.distance_str;
            // exitStation = exit.NAME;
            let arr = await Promise.all(
              exitportList.map(async exit => {
                let result = await that.getDistance(
                  [exit.SMX, exit.SMY],
                  [location[0], location[1]]
                );
                exit.distance = result.distance;
                exit.distance_str = result.distance_str;
                return exit;
              })
            );
            if (that.type !== 'mapSearch') {
              arr = arr.filter(exit => {
                if (that.isNear && exit.NAME.includes(that.currentStation)) {
                  return exit;
                } else if (!that.isNear) {
                  return exit;
                }
              });
            }
            arr = arr.sort((a, b) => {
              return a.distance - b.distance;
            });
            resolve({
              arrivalSite: arr?.[0]?.NAME?.split('地铁站')[0],
              exitPort: arr?.[0]?.NAME?.split('地铁站')[1],
              walkDistance: arr?.[0]?.distance_str
            });
          });
      });
    },

    // 语音监听调用方法
    async onSiteChanged(
      type,
      departSite,
      arrivalSite,
      destination,
      exitPort,
      distance,
      walkingTime,
      poiType
    ) {
      console.log(
        `wl-周边查询界面-method onSiteChanged ->,type=${type}, departSite=${departSite}, arrivalSite=${arrivalSite},destination=${destination}, exitPort=${exitPort}, distance=${distance}, walkingTime=${walkingTime}, poiType=${poiType}`
      );
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let that = this;
      this.resultLayer && this.resultLayer.remove();
      this.poiLayer && this.poiLayer.remove();
      this.type = type;
      if (departSite) {
        that.currentStation = departSite;
        await that.updateLngLat();
      }
      // 周边查询就poiType参数有用
      if (type === 'nearbySearch') {
        that.isNear = true;
        if (poiType || destination) {
          that.currentKeywords = poiType || destination; // 说建设银行从几号口出，结果poiType为空，destination倒是有
          await that.handleNearbySearch();
        }
        return;
      }
      if (type === 'mapSearch') {
        that.isNear = false;
        if (arrivalSite || destination) {
          that.currentKeywords = arrivalSite || destination;
          await that.handleMapSearch();
        }
        return;
      }
      this.siteChangeFn(
        type,
        departSite,
        arrivalSite,
        destination,
        exitPort,
        distance,
        walkingTime,
        poiType
      );
    },

    // 处理语音1：周边查询逻辑
    async handleNearbySearch() {
      this.isWalkLineBox = false;
      await this.findAroundBus();
      await this.findAroundPOI(true);
    },

    // 处理语音2：地图查找
    async handleMapSearch() {
      this.isWalkLineBox = false;
      await this.findAroundBus();
      await this.findAroundPOI();
    },

    // 绘制步行线路
    addWalkPath(start, end) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let that = this;
      this.loadFindAroundPOI = false;
      this.resultLayer = window.L.featureGroup().addTo(that.map);
      var latlng = window.L.latLng(
        that.currentLocation[1],
        that.currentLocation[0]
      );
      this.map.setView(latlng, 12);
      const polyLine = window.L.polyline([start, end], { color: 'red' });
      const marker1 = window.L.marker(start)
        .bindTooltip('起点', {
          offset: window.L.point([0, -10]),
          direction: 'top',
          permanent: true
        })
        .openTooltip();
      const marker2 = window.L.marker(end)
        .bindTooltip('终点', {
          offset: window.L.point([0, -10]),
          direction: 'top',
          permanent: true
        })
        .openTooltip();
      this.resultLayer.addLayer(polyLine);
      this.resultLayer.addLayer(marker1);
      this.resultLayer.addLayer(marker2);
    },

    // 根据站点更新坐标
    updateLngLat() {
      return new Promise(resolve => {
        const addressUrl = `http://${window.config.mapUrl}/iserver/services/${window.config.mapChildUrl}/restjsr/v1/address`;
        let addressMatchService =
          window.L.supermap.addressMatchService(addressUrl);
        let geoCodeParam = new SuperMap.GeoCodingParameter({
          address: this.currentStation + '(地铁站)'
        });
        addressMatchService.code(geoCodeParam, obj => {
          if (obj.result?.length > 0) {
            let arr = obj.result.filter(item => {
              return item.address.includes(this.currentStation);
            });
            if (arr.length) {
              this.currentLocation = [...Object.values(arr[0].location)];
            } else {
              this.$subwayInfo.normalInfo('未搜到站点坐标！');
            }
            resolve();
          } else {
            console.error('更新站点坐标失败');
          }
        });
      });
    },

    // 语音选择周边
    onSelect(num) {
      this.chooseMapInfo(num - 1);
    },

    // 语音选择第几个(绘制步行导航数据)
    chooseMapInfo(index) {
      let isUseSubway = false;
      szmtr.line.forEach(item => {
        let res = item.station.some(i => {
          return i.name == this.poiList[index].arrivalSite;
        });
        if (res) isUseSubway = res;
      });
      if (index >= this.poiList?.length || !this.poiList[index].arrivalSite) {
        return this.$subwayInfo.normalInfo(this.$t('nositearound'));
      } else if (
        !this.isNear &&
        this.currentStation === this.poiList[index].arrivalSite
      ) {
        return this.$subwayInfo.normalInfo(this.$t('nowsite'));
      } else if (!this.isNear && !isUseSubway) {
        return this.$subwayInfo.normalInfo(
          this.$t('TheSubwayStationIsNotOpenYet')
        );
      }
      this.loadFindAroundPOI = false;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let that = this;
      let isNear = this.isNear;
      let name = this.poiList[index].NAME;
      let location = [this.poiList[index].SMX, this.poiList[index].SMY];
      // 1,通知客户端(如果是目的地会自动再调用type=line再跳转到换乘查询，如果是周边就没必要，因为会再次调用导致异常)
      window?.bridge?.generateNLG('planningrouteforyou');
      console.log('isNear', isNear);
      if (!isNear && window.bridge && this.poiList[index].arrivalSite) {
        this.$router.push({
          name: 'menuchange',
          query: {
            type: 'line',
            departSite: this.currentStation,
            arrivalSite: this.poiList[index].arrivalSite,
            destination: this.poiList[index].NAME,
            exitPort: this.poiList[index].exitPort,
            distance: this.poiList[index].walkDistance
          }
        });
      } else if (!isNear) {
        this.$subwayInfo.normalInfo('暂无无地铁站！');
      }
      if (isNear) {
        // 2,绘制步行线路
        // if (this.isTryApi) {
        //   // 添加NLG播报
        //   window?.bridge?.generateNLG(
        //     'localSurroundingInformation',
        //     '',
        //     '',
        //     null,
        //     null,
        //     null,
        //     this.poiList[index].NAME,
        //     this.poiList[index].exitPort,
        //     this.poiList[index].distance
        //   );
        // } else {
        //
        // }
        that.isWalkLineBox = true;
        that.walkInfo.from = that.currentStation;
        that.walkInfo.to = name;
        this.walkInfo.distance_str = this.poiList[index].distance_str;
        this.poiLayer && this.poiLayer.remove();
        this.addWalkPath(
          [this.currentLocation[1], this.currentLocation[0]],
          [Number(location[1]), Number(location[0])]
        );
      }
    },

    // 传递的参数居然有"undefined" 导致异常
    checkErrorParam(obj) {
      for (let key in obj) {
        if (obj[key] === 'undefined' || obj[key] === 'null') {
          obj[key] = '';
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../styles/common';
@import '../../../styles/mixins';
@import '../../menu/subpages/menumap';

#map {
  width: 1280px;
  height: 650px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  overflow: hidden;
}

#busMap {
  width: 1281px;
  height: 652px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  overflow: auto;
  position: absolute;
  z-index: 99999;
  left: 30px;
  top: -1px;
}

.around-col-wrapper {
  padding: 0px 30px;
  position: relative;
  // 地图信息框
  .map-info {
    .map-info-wrapper-title {
      width: 100%;
      line-height: 56px;
      background: #e1ebff;
      border-radius: 10px 10px 0px 0px;
      font-size: 22px;
      font-weight: 400;
      color: #333333;

      .map-info-wrapper-title-left {
        text-indent: 70px;
      }

      .map-info-wrapper-title-right {
        margin-right: 26px;
      }
    }

    .map-info-wrapper {
      // 地图信息框 title
      .box-around-item {
        overflow: hidden;
        background: #ffffff;
      }

      // 没有序号
      .box-around-item-no-index {
        margin: 0 24px;
        height: 100px;
        border-bottom: 1px solid $--subway-color-bg-grey2;

        & > div:first-child {
          width: 70%;
        }

        .box-item-title {
          line-height: 30px;
          font-size: 28px;
          color: #333333;
          overflow: hidden;
        }

        .box-item-title-exitPort {
          flex: 1;
          text-align: center;
          height: 26px;
          font-size: 26px;
          font-weight: 500;
          color: #4587ef;
          line-height: 26px;
        }

        .box-item-distance {
          font-size: 20px;
          font-weight: 400;
          color: $--subway-color-blue1;
          margin-top: 10px;

          .distance-left-font {
            color: rgba(51, 51, 51, 0.6);
            margin-right: 6px;
          }
        }
      }

      // 有序号
      .box-around-item-index {
        overflow: hidden;
        background: #ffffff;
        margin: 0 24px;
        height: 80px;
        border-bottom: 1px solid $--subway-color-bg-grey2;

        .item-info-title {
          height: 38px;
          overflow: hidden;
          padding-right: 10px;
          flex: 1;
        }

        .box-item-index-distance {
          color: rgba(51, 51, 51, 0.6);
          width: 100px;
          color: #333333;
        }

        .box-item-index-distance-bold {
          width: 120px;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }
      }

      // 线路规划 time
      .top-time-info {
        padding: 10px 0 0 20px;
      }

      // 推荐线路 起点终点
      .map-info-line-start-end {
        padding: 16px 0;
        border-radius: 6px;
        color: #333333;
        font-size: 24px;
      }
    }
  }

  // 地图信息框组件
  :deep(.nav-info-box .info) {
    background-color: #fffffe;
  }

  // 地图图层
  .gaode-map-row {
    width: 1240px;
    height: 680px;
    border-radius: 5px;
  }

  .gaode-map-col {
    width: 968px;
    height: 1070px;
    border-radius: 5px;
  }

  .gaode-map {
    position: absolute;
    top: 30px;
    left: 30px;
    border-radius: 5px;
  }

  :deep(.amap-copyright) {
    display: block !important;
    visibility: inherit !important;
  }

  :deep .amap-touch-toolbar {
    visibility: inherit !important;
  }

  :deep .amap-scalecontrol {
    visibility: inherit !important;
  }
}

@media screen and (max-width: 1180px) {
  #busMap {
    height: auto;
    width: 480px;
    max-height: 684px;
    background: #f1f1f1;
    box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    overflow: auto;
    position: absolute;
    z-index: 99999;
    left: 438px;
    top: 104px;
    .busMap-wrap {
      padding: 20px;
    }
  }

  .around-col-wrapper {
    padding: 0;
    position: relative;

    #map {
      height: 1058px;
    }
  }
  .map-info {
    position: absolute;
    z-index: 999;
  }
}
</style>
<style>
.leaflet-control-container .leaflet-top {
  top: auto;
  bottom: 20px;
}
.leaflet-right {
  display: none;
}
</style>
