<template>
  <a-config-provider :locale="locale">
    <div
      style="position: relative; height: 100vh; width: 100vw; overflow: hidden"
      @click="clickScreen"
    >
      <router-view v-if="isRouterAlive" />
      <Human v-if="humanShow"></Human>
    </div>
  </a-config-provider>
</template>

<script setup>
import {
  nextTick,
  ref,
  provide,
  computed,
  onMounted,
  watch,
  reactive,
  getCurrentInstance
} from 'vue';
import { noticeService } from '@/service/noticeService.js';
import { TicketStatus } from '@/views/ticket/js';
import humanService from '@/service/HumanService';
import { SecTimer, SecCounter } from '@/utils/tool';
import { ElMessage } from 'element-plus';
import i18n from './lang';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import LMapData from '@/components/line/lineData.js';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import Human from '@components/human/human.vue';
import moment from 'moment';
import 'moment/locale/zh-cn';
const locale = ref('');
let isNormal = true;
const router = useRouter();
const route = useRoute();
const store = useStore();

// 进入页面默认显示推荐语
watch(
  () => router.currentRoute,
  val => {
    if (val && val.meta && val.meta.key) {
      const key = i18n.global.messages[i18n.global.locale]?.[val?.meta?.key];
      window['onRecommends']?.({ pageKey: key });
    }
  },
  {
    deep: true,
    immediate: true
  }
);
watch(
  () => i18n.global.locale,
  val => {
    if (val) {
      const key =
        i18n.global?.messages?.[i18n.global.locale]?.[
          router?.currentRoute?.meta?.key
        ];
      window['onRecommends']?.({ pageKey: key });
    }
  },
  {
    immediate: true
  }
);

watch(
  () => store.getters.getLang,
  val => {
    if (val !== 'en') {
      moment.locale('zh-cn');
      locale.value = zhCN;
    } else {
      moment.locale('en-us');
      locale.value = enUS;
    }
  },
  { immediate: true }
);
// 降级后不能购票保证能用语音咨询
watch(
  () => store.getters.isBuyFare,
  val => {
    if (val) {
      window?.bridge?.excludeBuyTicketsSkill?.(false);
    } else {
      window?.bridge?.excludeBuyTicketsSkill?.(true);
    }
  },
  { immediate: true }
);

let meetingStatus = computed(() => store.getters.humanMeetingStatus);
let humanShow = computed(() => store.getters.humanShow);

watch(
  () => router.currentRoute.value,
  newValue => {
    console.log(newValue);
    // 人工客服在状体==0 切换页面的时候 自动关闭
    if (meetingStatus.value == 0) {
      store.commit('setHumanShow', false);
    }
    // 人工客服通话中禁止对话
    if (meetingStatus.value == 2) {
      console.log('禁止对话');
      window?.bridge?.stopTheWorld?.(true);
    } else {
      if (newValue.meta.banSpeech) {
        console.log('禁止对话');
        window?.bridge?.stopTheWorld?.(true);
      } else {
        console.log('可以对话');
        window?.bridge?.stopTheWorld?.(false);
      }
    }
  }
);
const clickScreen = () => {
  window?.bridge?.onPageClick?.();
};
const { proxy } = getCurrentInstance();
window.openTest = (name, query) => {
  router.push({
    name: name,
    query: query
  });
};
const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};
const lineData = new LMapData();
provide('reload', reload);
let elMessage;
const warnFuc = () => {
  elMessage = ElMessage({
    message: i18n.global.t('networkerror'),
    customClass: 'subway-buy-ticket-network-message',
    center: true,
    duration: 0
  });
};
const removeFuc = () => {
  elMessage && elMessage.close();
};
window['sendLog'] = data => {
  if (window.config.logUrl) {
    let json = JSON.parse(data);
    Navigator.sendBeacon(window.config.logUrl, json);
  }
};
// 新的网络开小差监听
window['onHardwareChanged'] = network => {
  if (network === 'off') {
    removeFuc();
    warnFuc();
  } else if (network === 'on') {
    removeFuc();
  }
};
//暂停服务
window['onWorkModeAbnormal'] = val => {
  if (val !== isNormal) {
    isNormal = val;
    if (val) {
      router.push({
        name: 'outService'
      });
    } else {
      router.push({ name: 'menubuy' });
    }
  }
};

// 获取设备服务列表
// console.log(store.getters.getReceiveCash);
window['onSeqServiceSts'] = val => {
  store.commit('setBSeqServiceStsList', val.BSeqServiceStsList || []);
  store.commit('setModuleServiceStsList', val.ModuleServiceStsList || []);
};
// 获取设备基础信息
window['onSleModuleInfo'] = val => {
  store.commit('setModuleInfo', val);
};

// 获取设备各个模块信息
window['onSleModuleInfoNotice'] = val => {
  let MODULE_CONF_LIST = val.MODULE_CONF_LIST || [];
  store.commit('setMODULE_CONF_LIST', MODULE_CONF_LIST);
};

// 获取支付模块状态
window['onPaymentsSts'] = val => {
  store.commit('setPaymentsSts', val);
};

// 购票和补票返回的数据
window['onSellTicketBusiness'] = res => {
  console.log('res--出站票', res);
  console.log('res.status--出站票', res.status);
  let status = res.status;
  let ticketStatus = new TicketStatus({
    sts: status.sts,
    substs: status.substs,
    issued: status.issued,
    shouldIssued: status.shouldIssued,
    paied: status.paied / 100,
    shouldPaied: status.shouldPaied / 100,
    outChanged: status.outChanged / 100,
    qrInfo: status.qrInfo,
    qrPicInfo: status.qrPicInfo,
    errorList:
      res.errorList && res.errorList.length ? res.errorList : status.errorList,
    loginSts: status.loginSts
  });
  store.commit('setTicketStatus', ticketStatus);
};
const BSeqServiceStsList = computed(() => store.getters.getBSeqServiceStsList);
const getModuleInfo = computed(() => store.getters.getModuleInfo);
const ModuleServiceStsList = computed(
  () => store.getters.getModuleServiceStsList
);
console.log(BSeqServiceStsList.value);
console.log(ModuleServiceStsList.value);
console.log(getModuleInfo.value);
// 方正给的当前站点最高价格
const calculatePrice = val => {
  store.commit('setMostPrice', val);
  let arr = new Array(val - 1).fill(1).map((item, index) => {
    return index + 2;
  });
  store.commit('setAllPriceList', arr);
};
window['onCurStationMaxPrice'] = val => {
  console.log('onCurStationMaxPrice---', val);
  calculatePrice(val / 100);
  window.localStorage.setItem('CurStationMaxPrice', val);
};
// 方正给的线网最高价格
window['onAllStationMaxPrice'] = val => {
  window.localStorage.setItem('allMostPrice', val / 100);
  store.commit('setAllMostPrice', val / 100);
};
window['showHuman'] = val => {
  store.commit('setHumanShow', true);
};
let humanInit = async () => {
  // "255.255.248.0" 测试用的ip
  // let res = await humanService.getDN('255.255.248.0');
  let res = await humanService.getDN(window?.bridge?.getIPV4?.());
  if (res.code == 200) {
    store.commit('humanSetDN', res.result);
    store.commit('humanInit', proxy.$subwayInfo);
  } else {
    proxy.$subwayInfo.normalInfo('请在后台设备管理配置分机号！');
  }
};
// 获取便民列表
let getService = async () => {
  const site = window?.bridge?.getDefaultSite();
  let result = await noticeService.getNotice(site, 2, {});
  store.commit('setServiceList', result.data.result.data);
};
onMounted(() => {
  humanInit();
  let CurStationMaxPrice = window.localStorage.getItem('CurStationMaxPrice');
  if (CurStationMaxPrice) {
    window['onCurStationMaxPrice'](CurStationMaxPrice);
  }
  getService();
});
</script>
<style lang="scss" scoped>
html {
  overflow: hidden;
}
@import 'src/styles/variable';
</style>
