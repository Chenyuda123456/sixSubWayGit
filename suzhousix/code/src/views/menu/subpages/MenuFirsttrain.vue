<template>
  <div class="map-box display-flex-between">
    <div id="map" style="height: 100%"></div>
    <!-- S 首末班车 -->
    <!--v-if="title[0]"-->
    <map-info-box
      ref="mapInfoBoxRef"
      :is-prompt="true"
      :prompt-content="$t('actualArrivalTime')"
      :top-info="rightTitle"
      @buttonClick="changeLineType"
    >
      <template #topInfo>
        <div class="top-title">
          <i class="icon icon-position"></i>
          <span
            v-chStationToEn="data.title[0]"
            v-en="{
              display: 'flex',
              alignItems: 'center',
              fontSize: $pxToRem(20),
              lineHeight: $pxToRem(22),
              minHeight: $pxToRem(48),
              wordBreak: 'break-word',
              boxSizing: 'border-box',
              paddingLeft: $pxToRem(10),
              paddingRight: $pxToRem(10)
            }"
            class="pl10 top-info-address"
            >{{ data.title[0] }}</span
          >
          <i class="icon icon-train-time"></i>
          <span class="pl10 pr-[10px]">{{ state.timeStr }}</span>
        </div>
      </template>
      <!-- / 线路信息 -->
      <div v-if="data.type === 0">
        <a-row
          v-for="item in data.lineInfoList"
          :key="item.lineNo"
          class="line-info-container"
        >
          <a-row
            v-chLineToEn="item.lineRemark"
            :class="`line-name ${data.lineNameClass[item.lineNo]}`"
            align="middle"
            justify="center"
            style="width: 100%"
            type="flex"
          >
            {{ item.lineRemark }}
          </a-row>
          <!-- S 线路详细信息 -->
          <a-row class="line-item" style="width: 100%">
            <template v-for="i in item.children" :key="i.tiRemark">
              <div
                v-if="i.endStationName !== data.title[0]"
                style="width: 100%"
              >
                <a-col :span="24" class="line-direction line-item-content">
                  <!--              <icon-triangle />-->
                  <span class="line-text">
                    <div
                      class="display-flex-start"
                      path="directiontox"
                      place="endstation"
                      style="align-items: center"
                    >
                      <img src="@/assets/threeArrow.png" />
                      <i>{{ $t('FirstTrainTo') }}</i>
                      <span
                        v-chStationToEn="i.endStationName"
                        v-en="{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: $pxToRem(20),
                          lineHeight: $pxToRem(22),
                          minHeight: $pxToRem(48),
                          wordBreak: 'break-word',
                          boxSizing: 'border-box',
                          paddingLeft: $pxToRem(10),
                          paddingRight: $pxToRem(10)
                        }"
                        place="endstation"
                        >{{ i.endStationName }}</span
                      >
                      <i>{{ $t('changeDirection') }}</i>
                    </div>
                  </span>
                </a-col>
                <a-row style="width: 100%">
                  <a-col :span="isEn ? 12 : 6" class="line-item-content">
                    <i class="line-text-icon icon-first">{{
                      $t('firstSite')
                    }}</i>
                    <span class="pl10 line-text-time">{{
                      i.firstShiftTime
                    }}</span>
                  </a-col>

                  <a-col :span="isEn ? 12 : 6" class="line-item-content">
                    <i class="line-text-icon icon-last">{{ $t('endSite') }}</i>
                    <span class="pl10 line-text-time">{{
                      i.lastShiftTime
                    }}</span>
                  </a-col>
                  <a-col
                    v-en="{
                      marginBottom: '20px'
                    }"
                    :span="isEn ? 24 : 12"
                    class="line-item-content"
                  >
                    <span v-if="!isEn">
                      &nbsp;
                      <span v-if="data.isWidthScreen">
                        &nbsp; &nbsp; &nbsp;&nbsp;
                      </span>
                    </span>

                    <span class="pl10 line-text-time">
                      {{ $t('MondayToThursday') }}
                    </span>
                  </a-col>
                </a-row>

                <a-row v-if="i.otherLastShiftTime" style="width: 100%">
                  <a-col :span="isEn ? 12 : 6" class="line-item-content">
                    <i class="line-text-icon icon-first">{{
                      $t('firstSite')
                    }}</i>
                    <span class="pl10 line-text-time">{{
                      i.otherFirstShiftTime
                    }}</span>
                  </a-col>
                  <a-col :span="isEn ? 12 : 6" class="line-item-content">
                    <i class="line-text-icon icon-last">{{ $t('endSite') }}</i>
                    <span class="pl10 line-text-time">{{
                      i.otherLastShiftTime
                    }}</span>
                  </a-col>
                  <a-col
                    v-en="{
                      marginBottom: '20px'
                    }"
                    :span="isEn ? 24 : 12"
                    class="line-item-content"
                  >
                    <span v-if="!isEn">
                      &nbsp; &nbsp; &nbsp;
                      <span v-if="data.isWidthScreen">
                        &nbsp; &nbsp; &nbsp;&nbsp;
                      </span>
                    </span>

                    <span class="pl10 line-text-time"
                      >{{ $t('FridayToSunday') }}
                    </span>
                  </a-col>
                </a-row>
                <div>
                  <!--              <a-col :span="6" class="line-item-content">-->
                  <!--                <i class="line-text-icon icon-first">首</i>-->
                  <!--                <span class="pl10 line-text-time">{{ i.firstShiftTime }}</span>-->
                  <!--              </a-col>-->
                  <!--              <a-col :span="18" class="line-item-content">-->
                  <!--                <i class="line-text-icon icon-last">末</i>-->
                  <!--                <span class="pl10 line-text-time">-->
                  <!--                {{ i.lastShiftTime }}-->
                  <!--                <template v-if="i.otherLastShiftTime">-->
                  <!--                  （{{ i.otherRemark }}：{{ i.otherLastShiftTime }}）-->
                  <!--                </template>-->
                  <!--              </span>-->
                  <!--              </a-col>-->
                </div>
              </div>
            </template>
          </a-row>
          <!-- E 线路详细信息 -->
        </a-row>
      </div>
      <!--列车时刻-->
      <div v-else-if="data.type === 1">
        <a-row
          v-for="item in data.lineInfoList"
          :key="item.lineNo"
          class="line-info-container"
        >
          <a-row
            v-chLineToEn="item.lineRemark"
            :class="`line-name ${data.lineNameClass[item.lineNo]}`"
            align="middle"
            justify="center"
            style="width: 100%"
            type="flex"
          >
            {{ item.lineRemark }}
          </a-row>
          <!-- S 线路详细信息 -->
          <a-row class="line-item" style="width: 100%">
            <template v-for="i in item.children" :key="i.tiRemark">
              <div
                v-if="i.endStationName !== data.title[0]"
                style="width: 100%"
              >
                <a-col :span="24" class="line-direction line-item-content">
                  <!--              <icon-triangle />-->
                  <span class="line-text display-flex-between">
                    <div
                      class="display-flex-center"
                      path="directiontox"
                      place="endstation"
                    >
                      <img src="@/assets/threeArrow.png" />
                      <i>{{ $t('changeTo') }}</i>
                      <span
                        v-chStationToEn="i.endStationName"
                        v-en="{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: $pxToRem(20),
                          lineHeight: $pxToRem(22),
                          minHeight: $pxToRem(48),
                          wordBreak: 'break-word',
                          boxSizing: 'border-box',
                          paddingLeft: $pxToRem(10),
                          paddingRight: $pxToRem(10)
                        }"
                        place="endstation"
                        >{{ i.endStationName }}</span
                      >
                      <i>{{ $t('changeDirection') }}</i>
                    </div>
                    <!-- <div class="line-text-entry-time"><i>5分钟</i>进站</div>-->
                  </span>
                </a-col>
                <a-row style="width: 100%">
                  <a-col class="line-item-content">
                    <div
                      v-if="getDepartToArriveTime(i.endStationName)"
                      class="line-item-content-time"
                    >
                      {{ $t('nextSubway') }}：<i>{{
                        getDisplay(i.endStationName) >
                        getDepartToArriveTime(i.endStationName)
                          ? $t('subwayEntry')
                          : `${(
                              getDisplay(i.endStationName) / 60 +
                              1
                            ).toFixed()}`
                      }}</i>
                      {{
                        getDisplay(i.endStationName) <
                        getDepartToArriveTime(i.endStationName)
                          ? $t('minuteEntry')
                          : ''
                      }}
                    </div>
                    <div v-else class="line-item-content-time">暂无班次</div>
                  </a-col>
                </a-row>
              </div>
            </template>
          </a-row>
          <!-- E 线路详细信息 -->
        </a-row>
      </div>
      <div v-else class="line-info-container time-box">
        <a-row>
          <div
            v-for="(item, index) in data.lineInfoList"
            :key="item.lineNo"
            class="flex"
            @click="classesLineHandle(index)"
          >
            <div
              v-chLineToEn="item.lineRemark"
              :class="[
                `line-name-color ${data.lineNameClass[item.lineNo]}`,
                index == data.classesLineCurrent
                  ? `current-line-name${item.lineNo}`
                  : ''
              ]"
              class="text-[100px] mr-[8px]"
            >
              {{ item.lineRemark }}
            </div>
          </div>
        </a-row>

        <div class="mt-2">
          <div
            class="px-[10px] py-[16px] bg-white rounded-[10px] mt-[10px] week-list mb-[10px]"
          >
            <a-tabs
              v-model:activeKey="data.activeKey"
              @change="getClassTimeListBack"
            >
              <a-tab-pane
                v-for="item in week"
                :key="item.value"
                :tab="item.key"
              >
                <div class="flex">
                  <img
                    src="@/assets/threeArrow.png"
                    class="w-[20px] h-[20px] mr-[8px] mt-[8px]"
                  />
                  <div
                    class="flex flex-1 flex-wrap items-center text-[22px] direction"
                  >
                    <i class="mb-[12px]">{{ $t('changeTo') }}</i>
                    <span
                      v-for="(item, index) in data.classesDestCurrentList"
                      :key="item"
                      v-chStationToEn="item"
                      :class="
                        index == data.classesDestCurrent ? 'currentEnd' : ''
                      "
                      class="mb-[12px] px-[18px] py-[6px] mx-[8px] rounded-[4px] border-[2px]"
                      @click="classesDestHandle(index)"
                      >{{ item }}
                    </span>
                    <i class="mb-[12px]">{{ $t('changeDirection') }}</i>
                  </div>
                </div>
                <div
                  v-if="
                    data.classesDestCurrentList[data.classesDestCurrent] !==
                    data.title[0]
                  "
                  class="text-[14px] leading-[40px] text-center mt-[4px]"
                >
                  <div class="flex">
                    <div class="w-[52px] bg-[rgba(241,241,241,0.6)]">
                      {{ $t('hours') }}
                    </div>
                    <div
                      class="flex-1 border-solid border-l-[1px] border-light-[#E4E4E4] bg-[rgba(241,241,241,0.6)]"
                    >
                      {{ $t('minutes') }}
                    </div>
                  </div>
                  <div
                    v-if="data.classesTimeList && data.classesTimeList.length"
                  >
                    <div
                      v-for="item in data.classesTimeList"
                      :key="item.hour"
                      class="flex"
                    >
                      <div class="w-[52px]">{{ item.hour }}</div>
                      <div
                        class="text-left flex flex-wrap flex-1 border-solid border-l-[1px] border-light-[#E4E4E4]"
                      >
                        <span
                          v-for="(per, index) in item.minute"
                          :key="index"
                          class="ml-[10px]"
                          >{{ per }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    v-else
                    class="text-[16px] leading-[40px] text-center mt-[40px] mb-[40px]"
                  >
                    {{ $t('None') }}
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </div>
    </map-info-box>
    <!-- E 首末班车 -->
    <!-- S 未选择始发站提示 -->
    <!--    <div v-else class="map-no-select-info bg-train-no-select">-->
    <!-- <span>{{ $t('seeSchedule') }}</span>-->
    <!--    </div>-->
    <!-- E 未选择始发站提示 -->
  </div>
</template>
<script setup>
import mapInfoBox from '@/components/mapInfoBox.vue';
import axios from 'axios';
import LMap from '@/components/line';
import moment from 'moment';
import pageHeadCommon from '@/components/pagehead';
import Protocol from '@/mixins/protocol.ts';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { SecCounter } from '@/utils/tool';
import dayjs from 'dayjs';
import { getTimeList } from '@/service/MenuFirsttrain.js';
import {
  reactive,
  computed,
  onMounted,
  nextTick,
  getCurrentInstance,
  ref
} from 'vue';
import { useRoute } from 'vue-router';

const { proxy } = getCurrentInstance();
let $route = useRoute();
let store = useStore();
const { t } = useI18n();
const { state } = pageHeadCommon();
let mapInfoBoxRef = ref();
const rightTitle = [
  t('FirstAndLasSubway'),
  t('subwayTimetable'),
  t('routeTime')
];
let isEn = window.localStorage.getItem('lang') == 'en';
let week = [
  {
    key: t('Monday'),
    value: 1
  },
  {
    key: t('Tuesday'),
    value: 2
  },
  {
    key: t('Wednesday'),
    value: 3
  },
  {
    key: t('Thursday'),
    value: 4
  },
  {
    key: t('Friday'),
    value: 5
  },
  {
    key: t('Saturday'),
    value: 6
  },
  {
    key: t('Sunday'),
    value: 7
  }
];
let data = reactive({
  activeKey: dayjs().day() ? dayjs().day() : 7,
  title: [''],
  time: '', // 当前时间
  lineInfoList: [], // 页面展示数据
  lineNameClass: {
    // 0: 'line-name1',
    1: 'line-name1',
    2: 'line-name2',
    3: 'line-name3',
    4: 'line-name4',
    7: 'line-name4', // 4号支线
    5: 'line-name5',
    6: 'line-name6',
    11: 'line-name11'
  }, // 根据lineNo区分线路颜色
  isSelect: true,
  lineMap: null,
  startMarker: null,
  isFirstLoad: true,
  store: {},
  type: 0,
  siteChangeFn: null,
  isWidthScreen: store.state.isWidthScreen,
  // 处理后的列车时刻
  AllTimeArr: [],
  classesAllTimeArr: [],
  classesLineCurrent: 0,
  classesDestCurrent: 0,
  classesDestTimeList: 0,
  classesDestCurrentList: [],
  classesTimeList: []
});
let currentSite = computed(() => window?.bridge?.getDefaultSite());
onMounted(() => {
  const { firstLoad } = Protocol();
  firstLoad(['onDriveTime']);
  nextTick(() => {
    init();
  });
});
const init = () => {
  data.lineMap = new LMap.Path('map', {
    zoom: 4,
    isNeedClick: true,
    language:
      window.localStorage.getItem('lang') === 'en' ? 'English' : 'Chinese'
  });
  // 绑定站点点击事件
  data.lineMap.event.on('clickStation', async e => {
    // 点击站点获取站点位置
    // 新增自定义图标
    let { position, siteCoord, name } = e;
    // console.log(name);
    data.store.departSite = name;
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
    // 获取接口数据
    getLineTime(name);
  });
  data.lineMap.event.on('clickLineName', () => {
    data.store = {};
  });
  window['onDriveTime'] = json => {
    console.log(json);
    onDriveTime(json);
  };
  onDriveTime($route.query);
  data.isFirstLoad = false;
};
let onDriveTime = ({ type, departSite =  currentSite.value}) => {
  departSite = proxy.$enStationToCn(departSite);
  data.store.type = type;
  data.store.departSite = departSite;
  updateTicketMap({ departSite });
  if (type == '班次时间') {
    window?.bridge?.generateNLG?.('banci', departSite, '', 0);
    mapInfoBoxRef?.value?.btnClick(2);
  } else if (type == '列车时刻') {
    window?.bridge?.generateNLG?.('shike', departSite, '', 0);
    mapInfoBoxRef?.value?.btnClick(1);
  } else if (type == '首末班车') {
    window?.bridge?.generateNLG?.(type, departSite, '', 0);
    mapInfoBoxRef?.value?.btnClick(0);
  }
};
// 获取当前站点首末班车时间
let getLineTime = sname => {
  sname = sname.replace('/', '');
  const ipUrl = window.config.apiUrl;
  return axios({
    method: 'get',
    url: `${ipUrl}/subway/stationid/${sname}`,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }).then(res => {
    data.title[0] = sname; // 添加title
    data.time = moment(new Date()).format('DD:mm'); // 获取当前时间
    lineDataProcess(res.data.data); // 处理获取到的数据
  });
};
// 处理线路数据
let lineDataProcess = val => {
  val = val.filter(item => {
    return item.stationName === data.title[0];
  });
  let arr = dataProcess(val, 'lineNo'); // 根据线路区分数据
  data.lineInfoList = arr;
  for (let i in arr) {
    let childrenArr = dataProcess(
      arr[i].children,
      'tiRemark',
      'tiRemark',
      '周五至周日'
    )[0].children; // 根据运营周期区分数据并删除【周五至周日】数据
    // 为处理后的数据添加【周五至周日】末班车运营时间
    for (let l in childrenArr) {
      for (let j in val) {
        if (
          val[j].lineNo === childrenArr[l].lineNo &&
          val[j].endStationName === childrenArr[l].endStationName &&
          val[j].tiRemark === '周五至周日'
        ) {
          childrenArr[l].otherRemark = '周五至周日';
          childrenArr[l].otherLastShiftTime = val[j].lastShiftTime;
          childrenArr[l].otherFirstShiftTime = val[j].firstShiftTime;
        }
      }
    }
    data.lineInfoList[i].children = childrenArr;
    if (data.lineInfoList[i].lineRemark) {
      data.lineInfoList[i].lineRemark = data.lineInfoList[i].lineRemark.replace(
        '一',
        '1'
      );
      data.lineInfoList[i].lineRemark = data.lineInfoList[i].lineRemark.replace(
        '二',
        '2'
      );
      data.lineInfoList[i].lineRemark = data.lineInfoList[i].lineRemark.replace(
        '三',
        '3'
      );
      data.lineInfoList[i].lineRemark = data.lineInfoList[i].lineRemark.replace(
        '四',
        '4'
      );
      data.lineInfoList[i].lineRemark = data.lineInfoList[i].lineRemark.replace(
        '五',
        '5'
      );
    }
    nextTick(() => {
      mapInfoBoxRef.value.showInfo(); // 数据加载完成后展开弹出层
      // 处理实时列车时刻
    });
  }
  dynamicFilterProcess();
};
// 获取当天所有时间的数据处理列车时刻时间
const dynamicFilterProcess = async () => {
  // 清除定时器  全部以秒为单位计算
  data.AllTimeArr.forEach(item => {
    item.timer && item.countStop && item.countStop();
  });
  const res = await getTimeList(
    data.title[0],
    dayjs().format('YYYY-MM-DD')
    // dayjs().format('2023-07-28')
  );
  let { result } = res.data;
  // result = result.sort((a, b) => {
  //   return (
  //     new Date(a.arriveTime).getTime() - new Date(b.arriveTime).getTime()
  //   );
  // });
  // console.log(result);
  // 根据终点站点分类
  data.AllTimeArr = [];
  data.lineInfoList.some(item => {
    item.children.some(itemPer => {
      let filterArr = result.filter(per => {
        per.arriveTime =
          per.arriveTime?.split(' ').length > 1
            ? per.arriveTime.split(' ')[1]
            : per.arriveTime;
        per.departTime =
          per.departTime?.split(' ').length > 1
            ? per.departTime.split(' ')[1]
            : per.departTime;
        return itemPer.endStationName == per.dest;
      });
      data.AllTimeArr.push({
        timeList: filterArr, // 对应终点站点的时间list
        timer: new SecCounter(), // 定时器
        departToArriveTime: 0, // 离开站点和到达下一站的总秒
        ArriveToArriveTime: 0, // 到达站点和到达下一站的总秒
        timeCount: 0, // 离开站点departToArriveTime和到达下一站的总秒
        countdown: 0, // 需要倒计时的秒
        index: 0, // 和当前时间匹配的index
        display: '',
        dest: itemPer.endStationName // 终点站点
      });
    });
  });
  data.classesAllTimeArr = data.AllTimeArr;
  // 处理列车时刻
  dynamicTimeProcess();
  // 处理班次时间
  classesLineHandle();
};

let dynamicTimeProcess = () => {
  // 找到下一班车到达时间的数据
  data.AllTimeArr.some(item => {
    const hour = dayjs().hour();
    const minute = dayjs().minute();
    const second = dayjs().second();
    const currentAllSecond = (hour * 60 + minute) * 60 + second;
    item.index = item.timeList.findIndex(per => {
      return currentAllSecond < timeTransformSecond(per?.arriveTime);
    });
    displayCompute(item);
  });
};

let displayCompute = item => {
  // console.log('item', item);
  const hour = dayjs().hour();
  const minute = dayjs().minute();
  const second = dayjs().second();
  const currentAllSecond = (hour * 60 + minute) * 60 + second;
  // 计算距离上次停在站点的总共秒数
  if (item.timeList[item.index - 1]) {
    // 上一次离开时间到下一次到达时间
    item.departToArriveTime =
      timeTransformSecond(item.timeList[item.index]?.arriveTime) -
      timeTransformSecond(item.timeList[item.index - 1]?.departTime);
    // 上一次到达时间到下一次到达时间
    item.ArriveToArriveTime =
      timeTransformSecond(item.timeList[item.index]?.arriveTime) -
      timeTransformSecond(item.timeList[item.index - 1]?.arriveTime);
    // 当前时间到下一站到达时间
    item.countdown =
      timeTransformSecond(item.timeList[item.index]?.arriveTime) -
      currentAllSecond;
  }
  item.timer.countStart(item.countdown, time => {
    if (time === 0) {
      setTimeout(() => {
        item.index++;
        if (item.timeList[item.index]) {
          if (item[item.index + 1]) {
            item.timer = new SecCounter();
            displayCompute(item);
          }
        } else {
          item.departToArriveTime = '';
        }
      }, 1000);
    }
    item.display = time;
  });
};

let getDisplay = endStationName => {
  return (
    data.AllTimeArr.find(item => {
      return item.dest == endStationName;
    })?.display || 0
  );
};
let getDepartToArriveTime = endStationName => {
  return (
    data.AllTimeArr.find(item => {
      return item.dest == endStationName;
    })?.departToArriveTime || 0
  );
};
let timeTransformSecond = time => {
  return moment.duration(time).as('seconds');
};
// 班次时间处理
// 获取当天所有班次时间接口
let getClassTimeListBack = async key => {
  const currentWeek = dayjs().day() ? dayjs().day() : 7;
  const resDate = dayjs(dayjs().format('YYYY-MM-DD'))
    .add(key - currentWeek, 'day')
    .format('YYYY-MM-DD');
  const res = await getTimeList(data.title[0], resDate);
  let { result } = res.data;
  // 根据终点站点分类
  let arr = [];
  data.lineInfoList.some(item => {
    item.children.some(itemPer => {
      let filterArr = result
        ? result.filter(per => {
            per.arriveTime =
              per.arriveTime?.split(' ').length > 1
                ? per.arriveTime?.split(' ')[1]
                : per.arriveTime;
            per.departTime =
              per.departTime?.split(' ').length > 1
                ? per.departTime?.split(' ')[1]
                : per.departTime;
            return itemPer.endStationName == per.dest;
          })
        : [];
      arr.push({
        timeList: filterArr, // 对应终点站点的时间list
        dest: itemPer.endStationName // 终点站点
      });
    });
  });
  data.classesAllTimeArr = arr;
  getClassesTimeList();
};
// 设置班次时间线路的index
let classesLineHandle = index => {
  data.classesLineCurrent = index || 0;
  getClassesDestCurrentList();
};
// 获取班次时间方向的列表
let getClassesDestCurrentList = () => {
  let arr =
    data.lineInfoList[data.classesLineCurrent].children.map(item => {
      return item.endStationName;
    }) || [];
  data.classesDestCurrentList = arr.filter(item => {
    return item !== data.title[0];
  });
  classesDestHandle();
};
// 设置末班车方向的index
let classesDestHandle = index => {
  data.classesDestCurrent = index || 0;
  getClassesTimeList();
};
// 根据上面三个方法过滤最后渲染数据
let getClassesTimeList = () => {
  let { timeList } = data.classesAllTimeArr.find(item => {
    return item.dest == data.classesDestCurrentList[data.classesDestCurrent];
  });
  let resObj = {};
  let arrIndex = [];
  timeList.forEach(item => {
    const arr = item?.departTime?.split(':');
    if (resObj[arr[0]]) {
      resObj[arr[0]].push(arr[1]);
    } else {
      arrIndex.push(arr[0]);
      resObj[arr[0]] = [arr[1]];
    }
  });
  data.classesTimeList = arrIndex.map(item => {
    return {
      hour: item,
      minute: resObj[item]
    };
  });
};
// 初步处理数据，入参：数据、比对依据、删除数据的依据key、删除数据的依据value
let dataProcess = (data, compare, delKey, delValue) => {
  let lineList = []; // 处理后数据
  for (let i in data) {
    if (lineList.length) {
      let flag = false;
      let j;
      // 数据比对
      for (j in lineList) {
        if (data[i][compare] === lineList[j][compare]) {
          flag = true;
          break;
        }
      }
      // 判断是否为需要删除的数据
      if (!delKey || data[i][delKey] !== delValue) {
        if (flag) {
          lineList[j].children.push(data[i]); // 比对成功添加为子元素
        } else {
          lineList.push({
            [compare]: data[i][compare],
            lineRemark: data[i].lineRemark,
            children: [data[i]]
          }); // 比对失败，为【处理后数据】新增一条数据
        }
      }
    } else {
      // 判断是否为需要删除的数据
      if (!delKey || data[i][delKey] !== delValue) {
        lineList.push({
          [compare]: data[i][compare],
          lineRemark: data[i].lineRemark,
          children: [data[i]]
        }); // 【处理后数据】为空，新增一条数据
      }
    }
  }
  return lineList;
};
let getStationId = id => {
  let result = id.replace('s', '').replace('r', '');
  if (result.indexOf('_') > -1) {
    result = result?.split('_')[1];
  }
  return result;
};
/**
 * @description 根据站点名选中站点
 * @param { String } departSite 站点名称
 */
let updateTicketMap = async ({ departSite = '' }) => {
  let startSiteId = data.lineMap.lineData.getStationByName(departSite).id;
  let startPosition = data.lineMap.getStationPoi({
    id: startSiteId
  });
  let site = window.$(`#s${startSiteId}`) || window.$(`#i${startSiteId}`);
  // 获取当前站点数据
  data.startMarker && data.startMarker.remove();
  data.startMarker = new LMap.Marker({
    mapId: 'map',
    markerId: 'logoStart',
    content:
      window.localStorage.getItem('lang') === 'en'
        ? '<div class="btn-set start-en"></div> '
        : '<div class="btn-set start-cn"></div>',
    position: startPosition,
    siteCoord: [
      site.attr('cx') || site.attr('x'),
      site.attr('cy') || site.attr('y')
    ]
  });
  data.lineMap.playPanZoomAnimation(startPosition[0], startPosition[1], 3);
  // 获取接口数据
  getLineTime(departSite);
};
let changeLineType = type => {
  console.log(type);
  data.type = type;
};
window.onSelectline = lineName => {
  let index = null;
  data.lineInfoList.forEach((item, i) => {
    if (item.lineRemark == lineName) {
      index = i;
    }
  });
  if (index !== null) {
    classesLineHandle(index);
  }
};
</script>
<style lang="scss" scoped>
@use 'sass:list';
@import 'src/styles/variable';
@import './menumap.scss';
@import 'src/styles/mixins';

@mixin imgSize($width: 460px, $height: 400px) {
  width: $width;
  height: $height;
}

.top-title {
  @include flexStyle(flex-start);
  margin: auto;
  margin-bottom: 12px;
  width: 466px;
  min-height: 56px;
  background: #fffffe;
  border-radius: 6px;
  font-size: 26px;
  font-weight: bold;
  color: #333333;
  padding-left: 20px;
}

// .map-box {
//   position: relative;
//   padding: 40px 30px 30px;
//   // 重置.info背景颜色
//   ::v-deep .info {
//     background-color: transparent;
//     border-radius: 0;
//   }
// }
.top-info-address {
  padding-right: 0px;
  width: 240px;

  margin-right: 10px;
}

.icon-train-time {
}

// 线路信息
.line-info-container {
  border-radius: 6px;
  // 线路名称
  .line-name {
    height: 48px;
    border-radius: 6px;
    color: #fff;
    font-size: 26px;
    line-height: 48px;
    // 区分线路颜色
    &.line-name1 {
      background-color: $--subway-color-line-1;
    }

    &.line-name2 {
      background-color: $--subway-color-line-2;
    }

    &.line-name3 {
      background-color: $--subway-color-line-3;
    }

    &.line-name4 {
      background-color: $--subway-color-line-4;
    }

    &.line-name5 {
      background-color: $--subway-color-line-5;
    }
    &.line-name6 {
      background-color: $--subway-color-line-6;
    }
    &.line-name11 {
      background-color: $--subway-color-line-11;
    }
  }

  // 线路名称
  .line-name-color {
    height: 48px;
    border-radius: 6px;
    color: #fff;
    font-size: 26px;
    line-height: 48px;
    box-sizing: border-box;
    border: 2px solid;
    padding: 0px 24px;
    // 区分线路颜色
    &.line-name1 {
      color: $--subway-color-line-1;
      border-color: $--subway-color-line-1;
    }

    &.current-line-name1 {
      color: #fff;
      background-color: $--subway-color-line-1;
    }

    &.line-name2 {
      color: $--subway-color-line-2;
      border-color: $--subway-color-line-2;
    }

    &.current-line-name2 {
      color: #fff;
      background-color: $--subway-color-line-2;
    }

    &.line-name3 {
      color: $--subway-color-line-3;
      border-color: $--subway-color-line-3;
    }

    &.current-line-name3 {
      color: #fff;
      background-color: $--subway-color-line-3;
    }

    &.line-name4 {
      color: $--subway-color-line-4;
      border-color: $--subway-color-line-4;
    }

    &.current-line-name4 {
      color: #fff;
      background-color: $--subway-color-line-4;
    }

    &.line-name5 {
      color: $--subway-color-line-5;
      border-color: $--subway-color-line-5;
    }
    &.line-name6 {
      color: $--subway-color-line-6;
      border-color: $--subway-color-line-6;
    }
    &.current-line-name6 {
      color: #fff;
      background-color: $--subway-color-line-6;
    }
    &.line-name11 {
      color: $--subway-color-line-11;
      border-color: $--subway-color-line-11;
    }

    &.line-name11 {
      color: $--subway-color-line-11;
      border-color: $--subway-color-line-11;
    }

    &.current-line-name5 {
      color: #fff;
      background-color: $--subway-color-line-5;
    }

    &.current-line-name11 {
      color: #fff;
      background-color: $--subway-color-line-11;
    }
  }

  // 线路详情
  .line-item {
    margin: 10px 0;
    padding: 0 20px 16px;
    background-color: #fff;
    border-radius: 6px;

    .line-text {
      font-size: 26px;
      color: #333333;
      vertical-align: middle;
      padding-left: 0;
      width: 100%;
      line-height: 26px;

      img {
        height: 20px;
        width: 20px;
        margin-right: 8px;
      }

      span {
        margin: 0 8px;
        color: #e23d06;
      }
    }

    .line-direction {
      padding-top: 16px;
      padding-bottom: 2px;
    }

    .line-text-entry-time {
      color: #4587ef;
      height: 20px;
      font-size: 20px;
      font-weight: 400;
      color: rgba(51, 51, 51, 0.6);
      line-height: 26px;

      i {
        color: #4587ef;
      }
    }

    .line-item-content {
      display: flex;
      align-items: center;
      margin-top: 16px;
      // 首-末icon样式
      .line-text-icon {
        display: inline-block;
        line-height: 16px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        border-radius: 2px;
        padding: 2px;
        margin-right: 8px;
        // 区分首-末icon颜色
        &.icon-first {
          background-color: #5591ef;
        }

        &.icon-last {
          background-color: #e05e5e;
        }
      }

      .line-text-time {
        font-size: 20px;
        color: #333333;
        vertical-align: middle;
        padding-left: 0;
        line-height: 20px;
      }

      .line-item-content-time {
        font-size: 20px;
        color: #333333;
        vertical-align: middle;
        padding-left: 0;
        line-height: 20px;
        margin-left: 26px;

        i {
          color: #4587ef;
        }
      }
    }
  }
}

// 未选择始发站提示
.map-no-select-info {
  width: 449px;
  height: 76px;
  position: absolute;
  top: 34px;
  left: 24px;

  span {
    display: inline-block;
    padding-top: 14px;
    padding-left: 36px;
    font-size: 26px;
    color: #333333;
  }
}

// 未选择始发站提示背景
.bg-train-no-select {
  //background: url('~@/assets/images/bg-train-no-select@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(449px, 76px);
}

.time-box {
  .week-list {
    ::v-deep .ant-tabs-nav {
      width: 100%;

      .ant-tabs-tab {
        font-size: 18px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        padding: 0;
        margin: 0px 7px 16px;
        color: rgba(51, 51, 51, 0.6);
      }

      .ant-tabs-tab-active {
        color: #1890ff;
      }
    }

    .direction {
      line-height: 22px;

      span {
        border-radius: 4px;
        border: 2px solid #66a1ff;
      }

      .currentEnd {
        color: #fff;
        background: #66a1ff;
      }
    }
  }
}

@media screen and (max-width: 1180px) {
  .top-title {
    @include flexStyle(flex-start);
    width: auto;
    margin-right: 6px;
  }
  // 线路详情
  .line-info-container {
    .line-item {
      .line-text {
        font-size: 22px;

        .line-text-entry-time {
          font-size: 18px;
        }

        .line-text-time {
          font-size: 18px;
        }

        .line-item-content-time {
          font-size: 18px;
        }
      }
    }

    .line-name {
      font-size: 22px;
    }

    .line-name-color {
      font-size: 22px;
    }
  }
}
</style>
