<template>
  <menu-container
    :title="isNear ? $t('aroundsearch') : $t('chooseDestination')"
  >
    <div class="around-col-wrapper">
      <div class="map-info">
        <!--  S 信息框 周边 公交  -->
        <map-info-box
          v-if="!isWalkLineBox"
          :top-info="[$t('around'), $t('bus')]"
          @buttonClick="mapInfoBoxTopClick"
        >
          <div class="map-info-wrapper">
            <!--  S 信息框 周边 -->
            <div v-show="currentMapInfo === 0">
              <div
                v-for="(p, index) in poiList"
                v-show="index < poiShowMax"
                :key="index"
                class="box-around-item"
                @click="onSelect(index + 1)"
              >
                <!-- 没有序号的版本 -->
                <div v-if="p.exitName">
                  <div class="box-item-title">
                    {{ p.name || p.destinationName }}
                  </div>
                  <div class="box-item-distance">
                    <span class="distance-left-font">
                      距{{ !!p.exitName ? p.exitName : '离' }}
                    </span>
                    {{
                      p.distance > 1000
                        ? (p.distance / 1000).toFixed(1)
                        : p.distance
                    }}
                    <span v-if="!p.exitName">
                      {{ p.distance > 1000 ? '公里' : '米' }}
                    </span>
                  </div>
                </div>
                <!-- 有序号的版本 -->
                <div
                  v-else
                  class="display-flex-start box-around-item-index mt20"
                >
                  <div
                    class="icon-around-index-bg f16 color-white display-flex-center mt6 mr20 ml20"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="box-item-index-info-wrapper f24">
                    <div class="item-info-title">
                      {{ p.name || p.destinationName }}
                    </div>
                    <div class="item-info-address f18">{{ p.address }}</div>
                  </div>
                  <div
                    class="box-item-index-distance f18 display-flex-end mt6 pr10"
                  >
                    {{
                      p.distance > 1000
                        ? (p.distance / 1000).toFixed(1)
                        : p.distance
                    }}
                    <span v-if="!p.exitName">
                      {{ p.distance > 1000 ? 'km' : 'm' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!--  E 信息框 周边 -->
            <!--  S 信息框 公交 -->
            <div v-show="currentMapInfo === 1" class="box-item-bus-wrapper">
              <!--@click="busLineClick(p)"-->

              <div v-for="p in busList" :key="p.name" class="box-item-bus">
                {{ p.name }}
              </div>
            </div>
            <!--  E 信息框 公交 -->
          </div>
        </map-info-box>
        <!--  E 信息框 周边 公交  -->
        <!--  S 信息框 线路规划  -->
        <map-info-box v-if="isWalkLineBox" :top-info="[$t('recommendPath')]">
          <div class="map-info-wrapper">
            <!--          <a-row class="top-time-info" style="background-color: #F1F1F1;">-->
            <!--            约步行{{ Math.ceil(walkInfo.time / 60) }}分钟-->
            <!--          </a-row>-->
            <!--  S 起点  -->
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
                <a-col class="line-walk-content">
                  {{ $t('walk') }}
                  <span
                    v-if="walkInfo.distance && walkInfo.distance < 1000"
                    class="color-distance"
                  >
                    {{ $t('xmeters', { n: walkInfo.distance }) }}
                  </span>
                  <span v-else class="color-distance">
                    {{ (walkInfo.distance / 1000).toFixed(1) }}km
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

      <div
        id="gaodeMap"
        :class="
          $isWidthScreen
            ? 'gaode-map-row gaode-map'
            : 'gaode-map-col gaode-map '
        "
      ></div>
    </div>
  </menu-container>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import MapInfoBox from '@/components/MapInfoBox';
import MenuContainer from '@/components/layouts/MenuContainer';
import parse from '@/utils/parseData';
import aroundService from '@/service/AroundService';
import protocol from '@/mixins/protocol';
export default {
  name: 'AroundAuto',
  components: {
    MapInfoBox,
    MenuContainer
  },
  mixins: [protocol],
  props: {},
  data() {
    return {
      isWidthScreen: true,
      isWalkLineBox: false, // 是否显示线路规划信息框
      currentMapInfo: 0, // 当前信息框选择的mapInfo,0-周边，1-公交
      currentStation: window?.bridge?.getDefaultSite?.() || '东方之门', // 当前站点
      lnglat: '', // 当前站点坐标
      currentKeywords: '', // 当前poi关键字
      poiShowMax: 15, // POI 最多显示数量
      isNear: true, // 是否是周边 true-周边查询nearbySearch，false-mapSearch
      amap: null,
      poiList: [],
      markList: [],
      walkInfo: {
        from: '',
        distance: '',
        time: '', // 秒
        to: ''
      },
      busList: [], // 公交数据(name, location)
      type: ''
    };
  },
  computed: {
    currentSite() {
      return this.$i18n.locale === 'en'
        ? window?.bridge?.getSiteEnName()
        : window?.bridge?.getDefaultSite();
    }
  },
  watch: {
    currentStation: {
      immediate: true, // 第一次绑定值是否触发handler
      handler(value) {
        if (value) {
          console.log(
            `wl-周边-监听到站点变化，现在查询站点：${value}的经纬数据`
          );
          this.currentStation = value;
          this.updateLngLat();
        }
      }
    }
  },
  created() {},
  async mounted() {
    /**
     * 第一次进入界面调用默认的ip站点周边（带出站口），以后则调用高德逻辑（无出站口）
     * todo 待添加动态的当前站点
     */
    let that = this;
    // 0,获取当前站点的坐标和站名  获取当前站点数据(从路由获取，或者是语音调用)
    // window?.bridge?.getDefaultSite(); 获取当前站点  window?.bridge?.getSiteLocation(); 获取当前站点经纬度
    if (window.bridge && !!window?.bridge?.getDefaultSite()) {
      that.currentStation = this.currentSite;
    }
    // 1, 其他界面跳转
    let isRouterSearch = false;
    if (this.$route.params && !$.isEmptyObject(this.$route.params)) {
      console.log(
        `wl-周边查询界面--> mounted其他界面跳转 $route.params=`,
        this.$route.params
      );
      // 测试 “附近的肯德基” departSite = '东方之门' poiType = '肯德基' type = 'nearbySearch' 其他为空字符串
      // 测试 "附近的肯德基店" departSite = '东方之门' destination = '肯德基' type = 'nearbySearch' 其他为空字符串
      // 客户端错误过滤(有"undefined" 这种非法传过来)
      this.checkErrorParam(this.$route.params);
      if (this.$route.params.departSite) {
        that.currentStation = this.$route.params.departSite;
      }
      if (
        this.$route.params.poiType ||
        this.$route.params.destination ||
        this.$route.params.arrivalSite
      ) {
        isRouterSearch = true;
        that.onSiteChanged(
          this.$route.params.type,
          this.$route.params.departSite,
          this.$route.params.arrivalSite,
          this.$route.params.destination,
          '',
          '',
          '',
          this.$route.params.poiType
        );
      }
    }

    // 2，获取当前站点坐标
    await that.updateLngLat();
    if (!isRouterSearch) {
      // 3，获取默认的周边信息（带地铁出口）东方之门站 查询 传 “东方之门”
      try {
        let stationName =
          that.currentStation[that.currentStation.length - 1] === '站'
            ? that.currentStation.slice(0, that.currentStation.length - 1)
            : that.currentStation;
        console.log('wl-周边-获取默认的周边信息（带地铁出口）前', stationName);
        let defaultAroundInfo = await aroundService.defaultStationAround(
          stationName
        );
        that.poiList = Array.isArray(defaultAroundInfo.data)
          ? defaultAroundInfo.data
          : [];
        // 4，界面初始化调用
        this.findAroundBus();
        this.amapInit(that.lnglat, 18, defaultAroundInfo.data, true);
      } catch (e) {
        console.error('默认的周边信息（带地铁出口）初始化失败', e);
      }
    }
    // >>>>>>>>>>>>> S 以下是语音逻辑<<<<<<<<<<<<
    // 语音监听选择第几个
    window['onSelect'] = num => {
      console.log('语音第几个', num);
      this.onSelect(num);
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
      console.log(`wl-周边-我是mounted onSiteChanged ->,type=${type}, departSite=${departSite}, arrivalSite=${arrivalSite},
          destination=${destination}, exitPort=${exitPort}, distance=${distance}, walkingTime=${walkingTime}, poiType=${poiType}`);
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
    // >>>>>>>>>>>>> E 以下是语音逻辑<<<<<<<<<<<<
  },
  methods: {
    // 0，返回
    goBack() {
      this.$router.go(-1);
    },
    // 1，高德地图初始化
    amapInit(center, zoom, markList) {
      // mark 需要name location
      let that = this;
      AMapLoader.load({
        key: '01be2d512109a87c064b55ea56406d6f',
        version: '2.0',
        plugins: ['AMap.ToolBar', 'AMap.Scale'],
        AMapUI: {
          version: '1.1',
          plugins: [] //插件列表
        },
        Loca: {
          version: '2.0.0'
        }
      })
        .then(AMap => {
          that.amap = new AMap.Map('gaodeMap', {
            zoom: zoom,
            center: center,
            viewMode: '3D'
          });
          // 标记点初始化
          let markLen =
            markList.length > that.poiShowMax
              ? that.poiShowMax
              : markList.length;
          for (let i = 0; i < markLen; i++) {
            let temp = new AMap.Marker({
              title: markList[i].name,
              content: `<div style="position: relative;">
                                <div style="color: white; position: absolute; margin-left: ${
                                  i >= 9 ? 2 : 6
                                }px; z-index: 999">${i + 1}</div>
                                <img src="http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png" style="position: absolute" />
                            </div>`,
              position:
                typeof markList[i].location === 'string'
                  ? markList[i].location.split(',')
                  : markList[i].location
            });
            that.markList.push(temp);
            that.amap.add(temp);
          }
          AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
            that.amap.addControl(new AMap.ToolBar());
            that.amap.addControl(new AMap.Scale());
          });
          that.amap.setFitView();
        })
        .catch(e => {
          console.error('地图初始化失败', e);
        });
      //语音播报
      console.log(this.$router);
      console.log(this.$route);
      let type = 'chooseEnd';
      let name = '';
      if (this.type) {
        if (this.type === 'mapSearch') {
          type = 'chooseEnd';
          name = '';
        } else if (this.type === 'nearbySearch') {
          type = 'selectPoi';
          name = this.currentKeywords;
        }
      } else {
        type = 'nearbySearch';
      }
      if (window.bridge) {
        window?.bridge?.generateNLG(type, '', '', 0, '', name);
      }
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
      let that = this;
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
      }
      if (type === 'mapSearch') {
        that.isNear = false;
        if (arrivalSite || destination) {
          that.currentKeywords = arrivalSite || destination;
          await that.handleMapSearch();
        }
      }
      let params = {
        type,
        departSite,
        arrivalSite,
        destination,
        exitPort,
        distance,
        walkingTime,
        poiType
      };
      if (type === 'line') {
        that.$router.push({
          name: 'menuchange',
          params
        });
      }
      if (type === 'lastTrain') {
        that.$router.push({
          name: 'menufirsttrain',
          params
        });
      }
      if (type === 'price') {
        that.$router.push({
          name: 'menuticket',
          params
        });
      }
      if (type === 'time') {
        that.$router.push({
          name: 'menutime',
          params
        });
      }
    },
    // 处理语音1：周边查询逻辑
    async handleNearbySearch() {
      let that = this;
      that.isWalkLineBox = false;
      // 1, 获取公交数据
      await that.findAroundBus();
      // 2, 周边POI查询
      await that.findAroundPOI();
      // 3, 地图初始化
      that.amapInit(that.lnglat, 18, that.poiList);
    },
    // 处理语音2：地图查找
    async handleMapSearch() {
      let that = this;
      that.isWalkLineBox = false;
      // 1, 获取公交数据
      await this.findAroundBus();
      // 2, 周边POI查询
      await this.mapSearchPOI();
      // 3, 地图初始化
      that.amapInit(that.lnglat, 18, that.poiList);
    },
    // 查询周边周边公交
    async findAroundBus() {
      // console.log('wl-周边-公交数据获取前', this.lnglat)
      let busData = await aroundService.getAroundBusList(this.lnglat);
      console.log('wl-周边-公交数据获取完毕...', busData);
      this.busList = parse.parseBusList(busData.pois);
    },
    // 查询周边POI
    async findAroundPOI() {
      let that = this;
      let poiData = (poiData = await aroundService.findAroundPOIList(
        that.lnglat,
        that.currentKeywords
      ));
      if (!(poiData.pois && poiData.pois.length > 0)) {
        console.error('没有找到周边POI');
      }
      console.log(
        `wl-周边-查询POI ${that.currentKeywords} 搜索完毕...`,
        poiData.pois
      );
      that.poiList = poiData.pois;
    },
    // mapSearch POI
    async mapSearchPOI() {
      let poiData = await aroundService.findPlace(this.currentKeywords);
      if (!(poiData.pois && poiData.pois.length > 0)) {
        console.error(
          `根据关键字“${this.currentKeywords}” 没有找到 mapSearch POI poiData=`,
          poiData
        );
      }
      let len =
        poiData.pois.length > this.poiShowMax
          ? this.poiShowMax
          : poiData.pois.length;
      // 添加距离
      for (let i = 0; i < len; i++) {
        poiData.pois[i].distance = await this.getWalkDistance(
          this.lnglat,
          poiData.pois[i].location.split(',')
        );
      }
      console.log('mapSearch POI搜索完毕...', poiData.pois);
      this.poiList = poiData.pois;
    },
    // 5，添加步行导航数据
    addWalkPath(pathFrom, pathTo) {
      let that = this;
      AMapLoader.load({
        key: '01be2d512109a87c064b55ea56406d6f',
        version: '2.0',
        plugins: ['AMap.Walking', 'AMap.ToolBar', 'AMap.Scale'],
        AMapUI: {
          version: '1.1',
          plugins: [] //插件列表
        },
        Loca: {
          version: '2.0.0'
        }
      })
        .then(AMap => {
          that.amap = new AMap.Map('gaodeMap', {
            zoom: 18,
            center: this.lnglat,
            viewMode: '3D'
          });
          that.walk = new AMap.Walking({
            map: that.amap
          });
          that.walk.search(pathFrom, pathTo, function (status, result) {
            if (status === 'complete') {
              console.log('步行数据绘制完毕', result);
              that.walkInfo.distance = Number(result.routes[0].distance);
              that.walkInfo.time = result.routes[0].time;
            } else {
              console.error('步行数据绘制失败', result);
            }
          });
          AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
            that.amap.addControl(new AMap.ToolBar());
            that.amap.addControl(new AMap.Scale());
          });
        })
        .catch(e => {
          console.error('地图步行数据初始化失败', e);
        });
    },
    // 4，信息框周边公交点击
    mapInfoBoxTopClick(index) {
      this.currentMapInfo = index;
    },

    // 公交具体线路点击后聚焦
    busLineClick(item) {
      this.amapInit(item.location, 18, [item]);
    },
    // 查询两个坐标之间的步行距离
    async getWalkDistance(origin, destination) {
      let res = await aroundService.getWalkDistance(origin, destination);
      return res.route.paths[0].distance;
    },

    async updateLngLat() {
      let that = this;
      if (!that.currentStation) {
        console.error('更新站点坐标失败，站点为空');
        return;
      }
      let stationData = await aroundService.findStationPosition(
        that.currentStation + '地铁站'
      );
      let center = parse.parseStationPosition(stationData.pois);
      if (!center) {
        console.error('更新站点坐标失败');
      }
      that.lnglat = center;
    },
    // 语音选择周边
    onSelect(num) {
      this.chooseMapInfo(num - 1);
    },

    // 语音选择第几个(绘制步行导航数据)
    chooseMapInfo(index) {
      if (index > this.poiList.length) {
        console.error('不存在的选项!');
      }
      let that = this;
      let isNear = this.isNear;
      let name = this.poiList[index].name;
      let location = this.poiList[index].location;
      location = location.split(',');
      console.log(
        `周边col-传递消息给客户端 --> isNaer: ${isNear}, name=${name}, lon=${location[0]}, lat=${location[1]}`
      );
      // 1,通知客户端(如果是目的地会自动再调用type=line再跳转到换乘查询，如果是周边就没必要，因为会再次调用导致异常)
      if (!isNear && window.bridge) {
        window?.bridge?.selectDestination(
          isNear,
          name,
          location[0],
          location[1]
        );
      }
      if (isNear) {
        // 2,绘制步行线路
        that.isWalkLineBox = true;
        that.walkInfo.from = that.currentStation;
        that.walkInfo.to = name;
        this.addWalkPath(this.lnglat, location);
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
@import '../../../scss/common';
@import '../../../scss/mixins';
@import '../../menu/subpages/menumap';
.around-col-wrapper {
  position: relative;
  width: 968px;
  height: 1058px;
  // 地图信息框
  .map-info {
    position: absolute;
    left: 0;
    top: -10px;
    z-index: 9999;
    .map-info-wrapper {
      // 地图信息框 title
      .box-around-item {
        height: 100px;
        overflow: hidden;
        background: #ffffff;
        border-bottom: 1px solid $--subway-color-bg-grey2;
        .box-item-title {
          height: 30px;
          font-size: 24px;
          color: #333333;
          margin-top: 20px;
          margin-left: 20px;
          overflow: hidden;
        }

        .box-item-distance {
          font-size: 18px;
          font-weight: 400;
          color: $--subway-color-blue1;
          margin-top: 10px;
          margin-left: 20px;

          .distance-left-font {
            color: rgba(51, 51, 51, 0.6);
            margin-right: 6px;
          }
        }
      }
      // 有序号
      .box-around-item-index {
        height: 100px;
        overflow: hidden;
        background: #ffffff;
        border-bottom: 1px solid $--subway-color-bg-grey2;
        .box-item-index-info-wrapper {
          height: 80px;
          width: 240px;
          overflow: hidden;
          .item-info-title {
            height: 38px;
            overflow: hidden;
          }
          .item-info-address {
            height: 30px;
            color: rgba(51, 51, 51, 0.6);
            overflow: hidden;
          }
        }
        .box-item-index-address {
          color: rgba(51, 51, 51, 0.6);
        }

        .box-item-index-distance {
          width: 65px;
          color: #333333;
        }
      }

      // 地图信息框 bus
      .box-item-bus-wrapper {
        @include flexStyle(flex-start, flex-start);
        flex-wrap: wrap;
        background-color: #fffffe;
        padding: 10px 0 10px 10px;
        .box-item-bus {
          @include flexStyle();
          height: 36px;
          margin: 10px 5px 0 5px;
          padding: 8px 3px;
          background: #ecf2ff;
          font-weight: 400;
          border-radius: 6px;
          cursor: pointer;
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
</style>
