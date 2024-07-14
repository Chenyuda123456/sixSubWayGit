import LostBox from '@/views/menuService/lost/comp/LostBox.vue';
import lostService from '@/service/LostService';
import Protocol from '@/mixins/protocol.ts';
import { useStore } from 'vuex';
import { DatePicker, Input } from 'ant-design-vue';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import layout from 'simple-keyboard-layouts/build/layouts/chinese.js';
import dayjs from 'dayjs';
import { szmtr } from '@/components/line/szmtr';
export default {
  name: 'lostRow',
  components: {
    LostBox,
    Input,
    DatePicker
  },
  data() {
    let store = useStore();
    return {
      lang: window.localStorage.getItem('lang') === 'en' ? 'En' : 'Cn',
      tel: '0512-69899000',
      lostLoading: false, // 是否在加载下一页数据
      lostList: [],
      searchInfo: {
        rangeTime: [null, null],
        lostOverview: '', // 丢失物品描述
        stationName: [], // 站点
        pageNum: 0,
        pageSize: 20
      },
      page: {
        // 后端只有一个总数，所以删除掉页数
        total: 0,
        isNoData: false, // 是否还有数据
        queryState: false // 当前查询状态， false-未查询，true-查询中
      },
      isWidthScreen: store.state.isWidthScreen,
      isShowKeyboard: false,
      eventId: 'textarea',
      keyboard: null,
      options: []
    };
  },
  async mounted() {
    const { firstLoad } = Protocol();
    firstLoad(['onLost']);
    window.config.isCustomKeyboard && this.initKeyboard();
    document.body.addEventListener('click', this.clickfn);
    let res = await window?.bridge?.getSubwayData();
    this.options = JSON?.parse?.(res);
    // this.options = szmtr.line;
    window['onLost'] = options => {
      this.lost(JSON.parse(options));
    };
    // 路由跳转调用（其他界面语音调用）query params
    if (this.$route.query && !window.$.isEmptyObject(this.$route.query)) {
      this.lost(this.$route.query);
    } else {
      this.handleClick();
    }
  },
  methods: {
    lost(options) {
      const { description, site, startTime, endTime, lineId } = options;
      console.log(description, site, startTime, endTime, lineId);
      let lineName = '';
      console.log(lineName);
      this.options.forEach(item => {
        if (item.id == lineId) {
          lineName = item.name;
        }
      });
      this.searchInfo.lostOverview = description;
      this.searchInfo.stationName = site ? [lineName, site] : [];
      this.searchInfo.rangeTime = startTime ? [startTime, endTime] : [];
      this.searchInfo.pageNum = 1;
      this.lostList = [];
      this.page.total = 0;
      this.page.isNoData = false;
      this.$nextTick(() => {
        this.findLostList();
      });
      //语音播报
      if (window.bridge) {
        window?.bridge?.generateNLG('lost');
      }
      if (window.config.isCustomKeyboard) {
        // this.keyboard.setInput('', 'stationName');
        this.keyboard.setInput(description, 'lostOverview');
      }
    },
    routerBack() {
      this.$router.go(-1);
    },
    handleClick() {
      console.log('handleClick');
      this.searchInfo.pageNum = 1;
      this.page.total = 0;
      this.lostList = [];
      this.page.isNoData = false;
      this.$nextTick(() => {
        this.findLostList();
      });
    },
    // 语音查询失物列表
    findLostList() {
      let obj = {
        startTime: this.searchInfo?.rangeTime?.[0]
          ? this.searchInfo.rangeTime[0] + ' 00:00:00'
          : null,
        endTime: this.searchInfo?.rangeTime?.[1]
          ? this.searchInfo.rangeTime[1] + ' 23:59:59'
          : null,
        stationName: this.searchInfo.stationName?.[1] || '',
        lostOverview: this.searchInfo.lostOverview,
        pageNum: this.searchInfo.pageNum,
        pageSize: this.searchInfo.pageSize
      };
      lostService.findLost(obj).then(res => {
        this.lostLoading = false;
        if (res.result === null) {
          this.page.isNoData = true;
          // 没有查询到数据
          console.error('后端查询没有查询到数据!!!');
          return;
        } else {
          this.page.total = res.result.total;
          this.lostList.push(...res.result.data);
        }
      });
    },
    // 加载下一页数据
    handleLoadStart() {
      if (this.lostList.length < this.page.total) {
        this.searchInfo.pageNum++;
        this.findLostList();
      } else {
        this.page.isNoData = true;
        console.log('wl-失物查询-已经到最后一页了');
      }
    },
    initKeyboard() {
      this.keyboard = new Keyboard({
        ...layout,
        onChange: input => {
          if (this.eventId === 'stationName') {
            // data.keyboard.setInput(input, 'textarea');
            // this.searchInfo.stationName = input;
          } else if (this.eventId === 'lostOverview') {
            // data.keyboard.setInput(input, 'userName');
            this.searchInfo.lostOverview = input;
          }
        }
      });
    },
    cancelEvent(event) {
      event.stopPropagation();
    },
    openKeyBoard(event) {
      if (window.config.isCustomKeyboard) {
        this.eventId = event.target.id;
        let inputName = this.eventId;
        this?.keyboard?.setOptions({
          inputName
        });
        this.isShowKeyboard = true;
      } else {
        window?.bridge?.showKeyboard();
      }
    },
    closeKeyBoard() {
      if (this.isShowKeyboard) {
        this.isShowKeyboard = false;
      } else {
        window?.bridge?.hideKeyboard();
      }
    },
    clickfn(event) {
      if (!event) return;
      let classList = [...event.target.classList];
      if (!classList.includes('input') && this.isShowKeyboard) {
        this.isShowKeyboard = false;
      }
    }
  },
  beforeUnmount() {
    document.body.removeEventListener('click', this.clickfn);
  }
};
