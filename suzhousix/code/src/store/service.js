export default {
  state: {
    serviceList: [],
    serviceKeywords: []
  },
  getters: {
    getServiceList(state) {
      return state.serviceList;
    },
    getServiceKeywords(state) {
      return state.serviceKeywords;
    }
  },
  mutations: {
    setServiceList(state, data) {
      state.serviceList = data;
      state.serviceKeywords = data.map(item => {
        let pattern = /[“”（）]/g;
        return item.noticeTitle.replace(pattern, '');
      });
    }
  },
  actions: {}
};
