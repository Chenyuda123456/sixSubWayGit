import { Ticket, TicketStatus } from '@/views/ticket/js/index.js';
import subwayInfo from '@/components/buyTicket/BuyTicketMessages.js';
import { payMethods } from '@/views/ticketCard/enum.ts';
export default {
  state: {
    ticketData: new Ticket({}),
    mapInfo: [], // 地址列表
    transitData: [], // 公交路线信息
    currentIndex: null,
    ticketType: null, // 购票类型：数量，价格；目的站点；目的地；
    ticketStatus: new TicketStatus({}), // 存储方正返回买票信息
    payResult: null,
    allPriceList: '',
    mostPrice: 0,
    allMostPrice: window.localStorage.getItem('allMostPrice') || 0
  },
  getters: {
    getAllPriceList: state => {
      return (
        state.allPriceList ||
        JSON?.parse(window?.localStorage?.getItem('allPriceList')) ||
        []
      );
    },
    getMostPrice: state => {
      return state.mostPrice;
    },
    getAllMostPrice: state => {
      return state.allMostPrice * 1;
    },
    // 单价
    getPrice: state => {
      return state.ticketData.price;
    },
    // 初始站点名称
    getOrigin: state => {
      return state.ticketData.origin;
    },
    // 目的地名称
    getEndName: state => {
      return state.ticketData.endName;
    },
    // 目的车站名称
    getArrivalSite: state => {
      return state.ticketData.arrivalSite;
    },
    // 目的车站名称
    getArrivalSiteId: state => {
      return state.ticketData.arrivalSiteId;
    },
    getDestination: state => {
      return state.ticketData.destination;
    },
    getPayCode: state => {
      return state.ticketData.payCode;
    },
    getCount: state => {
      return state.ticketData.count;
    },
    getTicketData: state => {
      return key => {
        return key ? state.ticketData[key] : state.ticketData;
      };
    },
    getCurrentIndex: state => {
      return state.currentIndex;
    },
    getMapInfo: state => {
      return state.mapInfo;
    },
    getTransitData: state => {
      return state.transitData;
    },
    // 目的车站名称
    endArrivalSite: state => {
      console.log(state.ticketData);
      return (
        state.ticketData.arrivalSite ||
        (state.transitData.length > 0 && state.transitData[0].lename) ||
        ''
      );
    },
    endInitArrivalSite: state => {
      return (
        state.ticketData.initArrivalSite ||
        (state.transitData.length > 0 && state.transitData[0].lename) ||
        ''
      );
    },
    getPayMethod: state => {
      console.log(`state=`, state);
      return {
        isCash: state.ticketData.payCode === payMethods['cashMethod'],
        isScan: state.ticketData.payCode !== payMethods['cashMethod']
      };
    },
    getTicketSts: state => {
      return state.ticketStatus.sts;
    },
    getTicketsubsts: state => {
      return state.ticketStatus.substs;
    },
    getTicketStatus: state => {
      return state.ticketStatus;
    },
    getPayResult: state => {
      return state.payResult;
    }
  },
  mutations: {
    setLoading(state, data) {
      state.isLoading = data;
    },
    setAllPriceList(state, data) {
      state.allPriceList = data;
    },
    setMostPrice(state, data) {
      state.mostPrice = data;
    },
    setAllMostPrice(state, data) {
      state.allMostPrice = data;
    },
    setTicketData(state, data) {
      if (data.endArrivalSite) {
        delete data.endArrivalSite;
      }
      if (data.endName) {
        delete data.endName;
      }
      // console.log(`ggg-设置票的信息`, data)
      state.ticketData = Object.assign(state.ticketData, data);
    },
    setTransitData(state, data) {
      state.transitData = data;
    },
    setCurrentIndex(state, data) {
      state.currentIndex = data;
    },
    setMapInfo(state, data) {
      state.mapInfo = JSON.parse(JSON.stringify(data));
    },
    toggleLoadingTip(state, data) {
      state.showLoadingTip = data;
    },
    setTicketStatus(state, data) {
      console.log(data);
      state.ticketStatus = Object.assign(state.ticketStatus, data);
      console.log('state.ticketStatus', state.ticketStatus);
    },
    setPayResult(state, data) {
      state.payResult = data;
    }
  },
  actions: {
    clearData({ commit }) {
      commit('setMapInfo', []);
      commit('setTransitData', []);
      commit(
        'setTicketData',
        new Ticket({
          price: 2
        })
      );
      commit(
        'setTicketStatus',
        new TicketStatus({
          sts: null,
          substs: null,
          shouldIssued: null,
          issued: null,
          paied: null,
          shouldPaied: null,
          outChanged: null,
          qrType: null,
          qrInfo: null,
          qrPicInfo: null,
          errorList: []
        })
      );
      commit('setPayResult', null);
    },
    warning({ commit }) {
      subwayInfo.normalInfo('无该目的地相关信息');
      commit('setCurrentIndex', 1);
    }
  }
};
