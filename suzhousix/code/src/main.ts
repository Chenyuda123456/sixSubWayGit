// import 'amfe-flexible';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createApp } from 'vue';
import App from './App.vue';
import './styles/app.css';
import i18n from './lang';
import router from './router';
import store from './store';
import $ from 'jquery';
import { szmtr } from './components/line/szmtr.js';
import { List, NoticeBar, Form, Field, CellGroup, Popup } from 'vant';
import {
  Carousel,
  Col,
  Divider,
  Row,
  Switch,
  Tabs,
  Input,
  Table,
  DatePicker,
  ConfigProvider,
  Select,
  Modal,
  Checkbox,
  Cascader
} from 'ant-design-vue';
import subwayInfo from './components/buyTicket/BuyTicketMessages.js';
import MenuContainer from './components/layouts/MenuContainer.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'ant-design-vue/dist/antd.less';
import 'element-plus/dist/index.css';

import './styles/app.css';
import './styles/index.scss';
import './styles/common.scss';
import './styles/reset.scss';
import './styles/variable.scss';
import './styles/icon.scss';
import './styles/buyTicket.scss';
// import VueDragscroll from 'vue-dragscroll';

const app = createApp(App);
window['$'] = $;
dayjs.locale('zh-ch');
// @ts-ignore
app.config.globalProperties.$dayjs = dayjs;

// 比较英文转成中文
app.config.globalProperties.$enStationToCn = val => {
  if (window.localStorage.getItem('lang') == 'en') {
    let res = /[A-Za-z]/.test(val);
    if (res) {
      let tramVal = val.replace(/\s/g, '').replace(/\//g, '').toLowerCase();
      let stationObj: any = {};
      szmtr.line.some(per => {
        stationObj = per.station.find(item => {
          return (
            item?.eName?.replace(/\s/g, '').replace(/\//g, '').toLowerCase() ==
            tramVal
          );
        });
        return stationObj && true;
      });
      return stationObj.name.replace(/\//g, '');
    } else {
      return val;
    }
  } else {
    return val;
  }
};

// px->rem
app.config.globalProperties.$pxToRem = val => {
  return (val / 108).toFixed(5) + 'rem';
};
// 中文站点转英文
const ChStationToEn = (stationName, lineName = '') => {
  let currentLine: any = '';
  let enStationObj: any = '';
  if (lineName) {
    currentLine = szmtr.line.find(item => {
      return item.name == lineName || item.lineRemark == lineName;
    });
    enStationObj = currentLine.station.find(item => {
      return item.name.replace(/\//g, '') == stationName;
    });
  } else {
    szmtr.line.some(per => {
      enStationObj = per.station.find(item => {
        return item.name.replace(/\//g, '') == stationName;
      });
      return enStationObj && true;
    });
  }
  return enStationObj?.eName?.replace(/\//g, '') || stationName || '';
};
app.directive('chStationToEn', {
  mounted(element, option: any) {
    if (store.getters.getLang == 'en') {
      if (typeof option.value == 'string') {
        element.innerHTML = ChStationToEn(option.value);
      } else {
        element.innerHTML = ChStationToEn(
          option?.value?.station,
          option?.value?.line
        );
      }
    } else {
      if (typeof option.value == 'string') {
        element.innerHTML = option.value;
      } else {
        element.innerHTML = option?.value?.station;
      }
    }
  },
  updated(element, option: any) {
    if (store.getters.getLang == 'en') {
      if (typeof option.value == 'string') {
        element.innerHTML = ChStationToEn(option.value);
      } else {
        element.innerHTML = ChStationToEn(
          option?.value?.station,
          option?.value?.line
        );
      }
    } else {
      if (typeof option.value == 'string') {
        element.innerHTML = option.value;
      } else {
        element.innerHTML = option?.value?.station;
      }
    }
  }
});
app.config.globalProperties.$ChStationToEn = ChStationToEn;
const ChLineToEn = lineName => {
  let currentLine: any = '';
  currentLine = szmtr.line.find(item => {
    return item.name == lineName || item.lineRemark == lineName;
  });
  return currentLine?.eName || lineName;
};
app.directive('chLineToEn', {
  mounted(element, option: any) {
    if (window.localStorage.getItem('lang') == 'en') {
      let line: String = element.innerText;
      element.innerHTML = ChLineToEn(line);
    }
  }
});
// 英文行内样式
app.directive('en', {
  mounted(element, option) {
    if (store.getters.getLang == 'en') {
      if (option.value.bigScreen || option.value.smallScreen) {
        const isWidthScreen =
          (window?.bridge?.getClientSize?.() ||
            document.documentElement.clientWidth ||
            document.body.clientWidth) > 1080;
        if (isWidthScreen) {
          if (option.value.bigScreen) {
            for (const item in option.value.bigScreen) {
              element.style[item] = option.value.bigScreen[item];
            }
          }
        } else {
          if (option.value.smallScreen) {
            for (const item in option.value.smallScreen) {
              element.style[item] = option.value.smallScreen[item];
            }
          }
        }
      } else {
        for (const item in option.value) {
          element.style[item] = option.value[item];
        }
      }
    } else {
      if (option.value.bigScreen || option.value.smallScreen) {
        const isWidthScreen =
          (window?.bridge?.getClientSize?.() ||
            document.documentElement.clientWidth ||
            document.body.clientWidth) > 1080;
        if (isWidthScreen) {
          if (option.value.bigScreen) {
            for (const item in option.value.bigScreen) {
              element.style[item] = '';
            }
          }
        } else {
          if (option.value.smallScreen) {
            for (const item in option.value.smallScreen) {
              element.style[item] = '';
            }
          }
        }
      } else {
        for (const item in option.value) {
          element.style[item] = '';
        }
      }
    }
  },
  updated(element, option) {
    if (store.getters.getLang == 'en') {
      if (option.value.bigScreen || option.value.smallScreen) {
        const isWidthScreen =
          (window?.bridge?.getClientSize?.() ||
            document.documentElement.clientWidth ||
            document.body.clientWidth) > 1080;
        if (isWidthScreen) {
          if (option.value.bigScreen) {
            for (const item in option.value.bigScreen) {
              element.style[item] = option.value.bigScreen[item];
            }
          }
        } else {
          if (option.value.smallScreen) {
            for (const item in option.value.smallScreen) {
              element.style[item] = option.value.smallScreen[item];
            }
          }
        }
      } else {
        for (const item in option.value) {
          element.style[item] = option.value[item];
        }
      }
    } else {
      if (option.value.bigScreen || option.value.smallScreen) {
        const isWidthScreen =
          (window?.bridge?.getClientSize?.() ||
            document.documentElement.clientWidth ||
            document.body.clientWidth) > 1080;
        if (isWidthScreen) {
          if (option.value.bigScreen) {
            for (const item in option.value.bigScreen) {
              element.style[item] = '';
            }
          }
        } else {
          if (option.value.smallScreen) {
            for (const item in option.value.smallScreen) {
              element.style[item] = '';
            }
          }
        }
      } else {
        for (const item in option.value) {
          element.style[item] = '';
        }
      }
    }
  }
});
app.component('MenuContainer', MenuContainer);
app.use(NoticeBar);
app.use(List);
app.use(Table);
app.use(Input);
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use($);
app.use(Row);
app.use(Col);
app.use(Divider);
app.use(Tabs);
app.use(Carousel);
app.use(Switch);
app.use(Popup);
app.use(DatePicker);
app.use(ConfigProvider);
app.use(Select);
app.use(Modal);
app.use(Cascader);
app.use(Checkbox);
// app.use(VueDragscroll);
app.use(i18n).use(store).use(router);
app.config.globalProperties.$subwayInfo = subwayInfo;
app.mount('#app');
