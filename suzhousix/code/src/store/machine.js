export default {
  state: {
    lang: window.localStorage.getItem('lang') || 'cn',
    // 参考devServiceSts.json
    BSeqServiceStsList: [],
    ModuleServiceStsList: [],
    MODULE_CONF_LIST: [],
    moduleInfo: {
      isPaymentArea: false,
      lineId: 0,
      stationId: 0,
      deviceType: 0,
      deviceId: 0,
      nccId: 0,
      stationName: window?.bridge?.getDefaultSite()
    },
    paymentsSts: {},
    findMethod: (state, val) =>
      state.BSeqServiceStsList.find(item => item.descript == val),
    findModuleNameMethod: (state, val) =>
      state.MODULE_CONF_LIST.find(item => item.moduleName == val)
  },
  getters: {
    getLang(state) {
      return state.lang;
    },
    getIsPaymentArea(state) {
      console.log(
        'state.moduleInfo.isPaymentArea',
        state.moduleInfo.isPaymentArea
      );
      return state.moduleInfo.isPaymentArea;
    },
    IsCardBalancePayEnable(state) {
      return state.paymentsSts.IsCardBalancePayEnable;
    },
    IsCoinPayEnable(state) {
      return state.paymentsSts.IsCoinPayEnable;
    },
    IsDigCashPayEnable(state) {
      return state.paymentsSts.IsDigCashPayEnable;
    },
    IsNotesPayEnable(state) {
      return state.paymentsSts.IsNotesPayEnable;
    },
    IsQrPayEnable(state) {
      return state.paymentsSts.IsQrPayEnable;
    },
    isBuyFare(state) {
      let res = state.findMethod(state, '普通单程票售票');
      return res && res.workSts == 0;
    },
    isBuyOutFare(state) {
      let res = state.findMethod(state, '付费出站票售票');
      return res && res.workSts == 0;
    },
    freeFare(state) {
      let res = state.findMethod(state, '免费出站票');
      return res && res.workSts == 0;
    },
    isCardProcess(state) {
      let res = state.findMethod(state, '票卡业务处理');
      return res && res.workSts == 0;
    },
    getIsZhiBi(state) {
      let res = state.findModuleNameMethod(state, '纸币接收');
      return res && res.isOpen;
    },
    getModuleInfo(state) {
      return state.moduleInfo;
    },
    getModuleInfoStationName(state) {
      return state.moduleInfo.stationName;
    },
    getBSeqServiceStsList(state) {
      return state.BSeqServiceStsList;
    },
    getModuleServiceStsList(state) {
      return state.ModuleServiceStsList;
    },
    getMODULE_CONF_LIST(state) {
      return state.MODULE_CONF_LIST;
    }
  },
  mutations: {
    setMODULE_CONF_LIST(state, data) {
      state.MODULE_CONF_LIST = data;
    },
    setLanguage(state, data) {
      state.lang = data;
    },
    setBSeqServiceStsList(state, data) {
      state.BSeqServiceStsList = data;
    },
    setModuleServiceStsList(state, data) {
      state.ModuleServiceStsList = data;
    },
    setModuleInfo(state, data) {
      state.moduleInfo = data;
    },
    setPaymentsSts(state, data) {
      state.paymentsSts = data;
    }
  },
  actions: {}
};
