<template>
  <div class="map-box display-flex-between">
    <div id="map" style="height: 100%"></div>
    <!-- S 换乘路线 -->
    <map-info-box
      v-show="data.routeData"
      ref="mapInfoBoxRef"
      :is-prompt="true"
      :top-info="title"
      class="map-content-dialog"
      @buttonClick="changeLineType"
    >
      <div v-if="data.routeData">
        <!-- / 路线信息 -->
        <a-row class="line-container">
          <a-row
            align="middle"
            class="line-point-box"
            justify="center"
            style="width: 100%"
            type="flex"
          >
            <a-col style="display: flex; align-content: center">
              <span
                v-chStationToEn="data.routeData.paths[0].sName"
                v-en="{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  lineHeight: $pxToRem(22),
                  minHeight: $pxToRem(48),
                  wordBreak: 'break-word',
                  boxSizing: 'border-box',
                  padding: $pxToRem(10)
                }"
                class="f22 color-white start-station"
              >
                {{ data.routeData.paths[0].sName }}
              </span>
            </a-col>
            <a-col :span="3" class="text-center">
              <i class="icon icon-line-menuChange-arrow"></i>
            </a-col>
            <a-col style="display: flex; align-items: center">
              <span
                v-chStationToEn="
                  data.routeData.paths[data.routeData.paths.length - 1].sName
                "
                v-en="{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  lineHeight: $pxToRem(22),
                  minHeight: $pxToRem(48),
                  wordBreak: 'break-word',
                  boxSizing: 'border-box',
                  padding: $pxToRem(10)
                }"
                class="f22 color-white terminal-station"
              >
                {{
                  data.routeData.paths[data.routeData.paths.length - 1].sName
                }}
              </span>
            </a-col>
          </a-row>
          <a-row style="width: 100%">
            <a-col :span="12" class="mt10">
              <i class="icon icon-station"></i>
              <span class="line-text">
                {{ $t('transferTotal') }}
                {{ $t('xsites', { n: data.routeData.snum }) }}
              </span>
            </a-col>
            <a-col :span="12" class="mt10">
              <i class="icon icon-station"></i>
              <span class="line-text">
                {{ $t('transferChange') }}
                {{ $t('xtimes', { n: data.routeData.paths.length - 2 }) }}
              </span>
            </a-col>
            <a-col :span="24" class="mt10">
              <i class="icon icon-time"></i>
              <span class="line-text">
                {{ $t('transferAbout') }}
                {{ $t('xminutes', { n: data.routeData.time }) }}
              </span>
            </a-col>
            <!--          <a-col :span="8" class="mt10">
                        <i class="icon icon-station"></i>
                        <span class="line-text">
                          {{$t('xsites', { n: routeData.snum }) }}
                        </span>
                      </a-col>
                      <a-col :span="8" class="mt10">
                        <i class="icon icon-money"></i>
                        <span class="line-text">
                          {{$t('price', { val: routeData.ticket }) }}
                        </span>
                      </a-col>
                      <a-col :span="8" class="mt10">
                        <i class="icon icon-lchange"></i>
                        <span class="line-text">
                          {{$t('xtimes', { n: routeData.paths.length - 2 }) }}
                        </span>
                      </a-col>
                      <a-col :span="16" class="mt10">
                        <i class="icon icon-distance"></i>
                        <span class="line-text">
                          {{
                           $t('xmiles', {
                              n: Number(routeData.distance / 1000).toFixed(1)
                            })
                          }}
                        </span>
                      </a-col>-->
          </a-row>
        </a-row>
        <!-- / 经过站点信息 -->
        <div class="mt8">
          <template v-for="(path, index) in data.routeData.paths" :key="index">
            <!-- / 站点信息 -->
            <a-row class="line-container">
              <!-- / S 换乘线 -->
              <!-- / 末站需要步行 -->
              <div
                v-if="
                  data.routeData.destination &&
                  data.routeData.destination !== 'undefined' &&
                  index === data.routeData.paths.length - 1
                "
                class="line-tail-walk"
              ></div>
              <div
                v-if="index > 0"
                :class="[
                  'line-tail-head',
                  'line-name-bg-' + data.routeData.paths[index - 1].sIndex
                ]"
              ></div>
              <div
                v-if="index < data.routeData.paths.length - 1"
                :class="['line-tail', 'line-name-bg-' + path.sIndex]"
              ></div>
              <!-- / E 换乘线 -->
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
                        : index === data.routeData.paths.length - 1
                        ? 'line-icon-circle-end'
                        : 'line-icon-transfer'
                    ]"
                  ></i>
                </a-col>
                <a-col class="display-flex-center line-name-wrapper">
                  <span
                    v-chStationToEn="path.sName"
                    class="color-gray f24 lh1"
                    >{{ path.sName }}</span
                  >&nbsp;
                  <span
                    v-if="index < data.routeData.paths.length - 1"
                    v-chLineToEn="path.sLine"
                    :class="['line-mark-name', 'line-name-bg-' + path.sIndex]"
                  >
                    {{ path.sLine }}
                  </span>
                  <span
                    v-if="
                      index === data.routeData.paths.length - 1 &&
                      data.routeData.exitPort &&
                      data.routeData.exitPort !== 'undefined'
                    "
                    class="color-gray f24 lh1"
                  >
                    ({{ data.routeData.exitPort }})
                  </span>
                </a-col>
              </a-row>
              <template v-if="index < data.routeData.paths.length - 1">
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
                  <a-col :span="22" class="f18 color-gray">
                    <div tag="div" path="taketodirection">
                      {{ $t('changeTake') }}
                      <span
                        v-chLineToEn="path.sLine"
                        :class="'line-name-color-' + path.sIndex"
                        place="lineIndex"
                      >
                        {{ path.sLine }}
                      </span>
                      {{ $t('changeTo') }}&nbsp;
                      <!--class="color-direction"-->
                      <span
                        v-chStationToEn="path.sPath"
                        :class="'line-name-color-' + path.sIndex"
                        place="direction"
                      >
                        {{ path.sPath }}
                      </span>
                      {{ $t('changeDirection') }}
                    </div>
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
            <!-- / 换乘站点信息 -->
            <a-row
              v-if="path.stations && path.stations.length > 0"
              class="line-transfer-container"
              justify="space-between"
              style="width: 100%"
              type="flex"
            >
              <!-- 判断换乘站大于0 -->
              <!-- <a-col :span="2"></a-col> -->
              <!-- <a-col :span="20">
              <span class="f18 line-name-color-1">4站</span>
            </a-col> -->
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
                  {{ $t('xsites', { n: path.stations.length + 1 }) }}
                </div>
                <ul v-show="path.stationsShow" style="padding-top: 3px">
                  <li
                    v-for="station in path.stations"
                    :key="station.id"
                    v-chStationToEn="station.name"
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
        <!--/ 步行-->
        <a-row
          v-if="
            data.routeData.walkDistance &&
            data.routeData.walkDistance !== 'undefined'
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
              {{ data.routeData.walkDistance }}
            </span>
          </a-col>
        </a-row>
        <!-- / 终点 -->
        <a-row
          v-if="
            data.routeData.destination &&
            data.routeData.destination !== 'undefined'
          "
          class="line-container"
        >
          <div class="line-tail-walk-head"></div>
          <a-row align="middle" class="mt10" style="width: 100%" type="flex">
            <a-col :span="2">
              <i class="line-icon-circle-end"></i>
            </a-col>
            <a-col class="display-flex-center line-name-wrapper">
              <span class="color-gray f24 lh1">
                {{ data.routeData.destination }}
              </span>
            </a-col>
          </a-row>
        </a-row>
      </div>
    </map-info-box>
    <!-- E 换乘路线 -->
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import $ from 'jquery';
import axios from 'axios';
import LMap from '@/components/line';
import MapInfoBox from '@/components/MapInfoBox.vue';
import {
  reactive,
  computed,
  watch,
  onMounted,
  nextTick,
  ref,
  getCurrentInstance
} from 'vue';
import Protocol from '@/mixins/protocol.ts';
import { useRoute, useRouter } from 'vue-router';
const $route = useRoute();
const $router = useRouter();
const { t } = useI18n();
const { proxy } = getCurrentInstance();
const mapInfoBoxRef = ref();
const data = reactive({
  lineMap: null,
  boxMarker: null,
  startMarker: null,
  endMarker: null,
  routeData: null,
  routeDataList: [],
  pathData: null,
  pathDataList: [],
  type: 0,
  store: {},
  isFirstLoad: true,
  siteChangeFn: null
});
const title = computed(() => {
  return [t('leastTransfer'), t('leastTime'), t('distancefirst')];
});
const currentSite = computed(() => {
  return window?.bridge?.getSiteEnName();
});
onMounted(() => {
  const { firstLoad } = Protocol();
  firstLoad(['onRoute']);
  nextTick(() => {
    init();
  });
});

const init = () => {
  data.isFirstLoad = false;
  data.lineMap = new LMap.Path('map', {
    zoom: 4,
    isNeedClick: true,
    language:
      window.localStorage.getItem('lang') === 'en' ? 'English' : 'Chinese'
  });
  let startSiteId = '';
  let endSiteId = '';
  // 绑定站点点击事件
  data.lineMap.event.on('clickStation', async e => {
    // 点击站点获取站点位置
    // 新增自定义图标
    console.log(e);
    let { position, id, siteCoord, name } = e;
    data.boxMarker && data.boxMarker.remove();
    const startbtnVal = t('setStart');
    const endbtnVal = t('setEnd');
    data.boxMarker = new LMap.Marker({
      mapId: 'map',
      markerId: 'stationButtonBox',
      content:
        '<div class="station-button-wrapper"><div class="station-button-box" >' +
        '<button class="staton-button button-start" id="startBtn">' +
        startbtnVal +
        '</button>' +
        '<button class="staton-button button-end" id="endBtn">' +
        endbtnVal +
        '</button>' +
        '<i class="station-box-arrow"></i>' +
        '</div></div>',
      position,
      siteCoord
    });
    $('#startBtn').on('click', () => {
      data.boxMarker && data.boxMarker.remove();
      data.startMarker && data.startMarker.remove();
      data.startMarker = new LMap.Marker({
        mapId: 'map',
        markerId: 'logoStart',
        content:
          window.localStorage.getItem('lang') === 'en'
            ? '<div class="btn-set start-en"></div> '
            : '<div class="btn-set start-cn"></div>',
        position,
        siteCoord
      });
      startSiteId = id;
      data.store.departSite = name;
      searchPath({ startSiteId, endSiteId });
    });
    $('#endBtn').on('click', () => {
      data.boxMarker && data.boxMarker.remove();
      data.endMarker && data.endMarker.remove();
      data.endMarker = new LMap.Marker({
        mapId: 'map',
        markerId: 'logoEnd',
        content:
          window.localStorage.getItem('lang') === 'en'
            ? '<div class="btn-set end-en"></div> '
            : '<div class="btn-set end-cn"></div>',
        position,
        siteCoord
      });
      endSiteId = id;
      data.store.arrivalSite = name;
      searchPath({ startSiteId, endSiteId });
    });
  });
  data.lineMap.event.on('clickLineName', () => {
    data.store = {};
    // 关闭弹窗
    nextTick(() => {
      data.boxMarker && data.boxMarker.remove();
      data.endMarker && data.endMarker.remove();
      startSiteId = '';
      endSiteId = '';
      mapInfoBoxRef.value && mapInfoBoxRef.value.hideInfo(); // 关闭弹窗
    });
  });
  window['onRoute'] = json => {
    onRoute(json);
  };
  if ($route.query && !$.isEmptyObject($route.query)) {
    if (!$route.query.departSite) {
      $route.query.departSite = window?.bridge?.getDefaultSite();
    }
    onRoute($route.query);
  } else {
    // 初始化起始站点
    onRoute({ departSite: window?.bridge?.getDefaultSite() });
    if (window.bridge) {
      window?.bridge?.generateNLG('sayStation');
    }
  }
};

const onRoute = async ({
  tag,
  departSite,
  arrivalSite,
  distance,
  destination,
  exitPort
}) => {
  if (arrivalSite === currentSite.value) {
    proxy.$subwayInfo.normalInfo(t('nowsite'));
    return;
  }
  if (departSite) {
    departSite = proxy.$enStationToCn(departSite);
    data.store.startSiteId =
      data.lineMap.lineData.getStationByName(departSite).id;
    data.store.departSite = departSite;
  }

  if (arrivalSite) {
    arrivalSite = proxy.$enStationToCn(arrivalSite);
    data.store.endSiteId =
      data.lineMap.lineData.getStationByName(arrivalSite).id;
    data.store.arrivalSite = arrivalSite;
  }

  if (data.store.arrivalSite && data.store.departSite) {
    searchPath({
      startSiteId: data.store.startSiteId,
      endSiteId: data.store.endSiteId,
      distance,
      destination,
      exitPort,
      tag
    });
  }
};
const getStationId = id => {
  let result = id.replace('s', '');
  result = result.replace('i', '');
  if (result.indexOf('_') > -1) {
    result = result.split('_')[1];
  }
  return result;
};
// 获取线路数据
const getPathInfo = ({ startSiteId = '', endSiteId = '' }) => {
  // const ipUrl = 'http://121.43.37.62:8894/'
  // return axios({
  //   method: 'get',
  //   url: `${ipUrl}admin/getStationInfo.do?ss=${startSiteId}&es=${endSiteId}`,
  //   headers: {
  //     'Content-Type': 'application/json;charset=UTF-8', //将表单数据传递转化为form-data类型
  //   },
  // }).then((res) => {
  //   return res.data
  // })
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
};
const changeLineType = type => {
  data.type = type;
  data.routeData = data.routeDataList[type];
  data.pathData = data.pathDataList[type];
  data.lineMap.showPath(data.pathData);
};
// 渲染线路
const searchPath = async ({
  tag,
  startSiteId,
  endSiteId,
  distance,
  destination,
  exitPort
}) => {
  console.log(startSiteId);
  console.log(endSiteId);
  data.store.startSiteId = startSiteId ? startSiteId : data.store.startSiteId;
  data.store.endSiteId = endSiteId ? endSiteId : data.store.endSiteId;
  data.store.distance = distance;
  data.store.destination = destination;
  data.store.exitPort = exitPort;
  // 默认关闭弹窗
  // 清空数组
  data.routeDataList.splice(0);
  data.pathDataList.splice(0);
  if (endSiteId && startSiteId) {
    // 获取线路数据
    let res = await getPathInfo({
      startSiteId: getStationId(startSiteId),
      endSiteId: getStationId(endSiteId)
    });
    let lineData = res.result;
    // 获取画线数据
    lineData.forEach(line => {
      console.log(line);
      let pathData = data.lineMap.lineData.getDrawData(line);
      data.pathDataList.push(pathData);
    });
    data.pathData = data.pathDataList[0];
    console.log('data.pathData', data.pathData);
    updateMarkerData({
      departSite: data.pathData.line[0].station[0],
      arrivalSite:
        data.pathData.line[data.pathData.line.length - 1].station[
          data.pathData.line[data.pathData.line.length - 1].station.length - 1
        ]
    });
    data.lineMap.showPath(data.pathData);
    // 计算经过站点数据
    lineData.forEach(line => {
      let transferSites = data.lineMap.lineData.getTranferStations(line);
      // const keySitesName = line.paths.map((item) => {
      //   return item.sName
      // })
      console.log('line', line);
      let routeData = {
        distance: line.road, // 线路距离
        snum: line.snum, // 站点数量
        ticket: line.ticket, // 乘车票价
        time: line.time, // 乘车时间
        paths: line.paths, // 站点信息
        walkDistance: distance, // 步行距离
        destination: destination, // 目的地名称
        exitPort
      };
      // let transferSites = this.lineMap.lineData.getTranferStations(line)
      // // 获取首末班车，站点，方向，几号线
      // routeData.paths.forEach((p) => {
      //   let pathInfo = this.lineMap.lineData.getSiteById(
      //     p.sId,
      //     p.lineId,
      //     p.directionId
      //   )
      //   Object.assign(p, pathInfo)
      // })
      // console.log(routeData)
      // const keySitesName = line.paths.map((item) => {
      //   return item.sName
      // })
      transferSites.forEach(item => {
        item.station.splice(0, 1);
      });
      // 获取中间站点
      routeData.paths.forEach((path, index) => {
        path.stationsShow = false;
        if (index < routeData.paths.length - 1) {
          path.stations = transferSites[index].station;
          path.stations.pop();
        }
        path?.stations?.forEach(item => {
          item.name = item.name.replace('/', '');
        });
        if (path.sLine === '1号线') {
          path.sIndex = 1;
        }
        if (path.sLine === '2号线') {
          path.sIndex = 2;
        }
        if (path.sLine === '3号线') {
          path.sIndex = 3;
        }
        if (path.sLine === '4号线' || path.sLine === '4号线支线') {
          path.sIndex = 4;
        }
        if (path.sLine === '5号线') {
          path.sIndex = 5;
        }
        if (path.sLine === '6号线') {
          path.sIndex = 6;
        }
        if (path.sLine === '11号线') {
          path.sIndex = 11;
        }
        if (path.sEnd && path.sEnd.indexOf('#') !== -1) {
          path.sEnd = path.sEnd.slice(0, 5);
        }
      });
      console.log('routeData', routeData);
      data.routeDataList.push(routeData);
    });
    nextTick(() => {
      mapInfoBoxRef.value && mapInfoBoxRef.value.showInfo(); // 数据加载完成后展开弹出层
      if (tag == '换乘少') {
        mapInfoBoxRef?.value?.btnClick(0);
      } else if (tag == '用时少') {
        mapInfoBoxRef?.value?.btnClick(1);
      } else if (tag == '距离短') {
        mapInfoBoxRef?.value?.btnClick(2);
      } else {
        mapInfoBoxRef?.value?.btnClick(1);
      }
    });
  }
};
// 更新换乘站点信息
const updateMarkerData = ({ departSite, arrivalSite }) => {
  data.startMarker && data.startMarker.remove();
  data.boxMarker && data.boxMarker.remove();
  data.endMarker && data.endMarker.remove();
  let startSiteId = departSite;
  let startPosition = data.lineMap.getStationPoi({
    id: startSiteId
  });
  let startSite = $(`#s${startSiteId}`) || $(`#i${startSiteId}`);
  data.startMarker = new LMap.Marker({
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
  let endPosition = data.lineMap.getStationPoi({
    id: endSiteId
  });
  let endSite = $(`#s${endSiteId}`) || $(`#i${endSiteId}`);
  data.endMarker = new LMap.Marker({
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
    startSiteId: getStationId(startSiteId),
    endSiteId: getStationId(endSiteId)
  };
};

const stationsShowFn = (val, index) => {
  data.routeData.paths[index].stationsShow = !val;
};
</script>
<style lang="scss">
@import './menumap.scss';

.rotate {
  transform: rotate(180deg);
}

.stationsLength {
  color: #609bf8;
  font-size: 22px;
}

.h40 {
  height: 40px;
}
</style>
