export default {
  state: {
    // 票卡处理类型
    processType: '',
    // 票卡更新
    cardUpdate: {
      processType: '', // 票卡处理类型
      amount: 0, // 补票金额，分
      stationName: '',
      paymentType: 0, // 付款类型
      // true:票卡处理业务可进入下一状态（付款或者写卡阶段）
      // false:票卡处理只停留在卡异常处理提示界面，该状态下，当前的票卡处理消息可多次下发，不进行后续票卡处理逻辑，paymentType、stationId、等信息可随时更新
      isConfirm: false
      // transationTime: '', 补充卡信息时 填入交易时间时使用(入站时间、出站时间等等……) 格式必须是：yyyy-MM-dd HH:mm:ss
      // startDate: '',  开始日期 格式必须是：yyyy-MM-dd
      // endDate: '' 结束日期 格式必须是：yyyy-MM-dd
    },
    // 票卡充值
    // 后端返回值 函数写在card/index.vue
    cardResult: {
      processInfo: {},
      historyRecord: []
    },
    stationList: []
  },
  getters: {
    getCardProcessType(state) {
      return state.cardProcessType;
    },
    getCardResult(state) {
      return state.cardResult;
    },
    getCardUpdate(state) {
      return state.cardUpdate;
    }
  },
  mutations: {
    setCardUpdate(state, data) {
      console.log('setCardUpdate', data);
      state.cardUpdate = Object.assign(state.cardUpdate, data);
    },
    setCardProcessType(state, data) {
      state.cardProcessType = data;
    },
    setCardResult(state, data) {
      console.log('setCardResult', data);
      state.cardResult = { ...state.cardResult, ...data };
    },
    setStationList(state, data) {
      state.stationList = data;
    },
    cardReset(state) {
      state.cardUpdate = {};
      state.cardResult = {
        processInfo: {},
        historyRecord: []
      };
    }
  }
};
