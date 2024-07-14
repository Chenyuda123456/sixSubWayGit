import { createStore } from 'vuex';
import ticket from './ticket.js';
import card from './card.js';
import machine from './machine.js';
import human from './human.js';
import service from './service.js';
export default createStore({
  state: {
    isWidthScreen:
      (window?.bridge?.getClientSize?.() ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) > 1180
  },
  mutations: {},
  actions: {},
  modules: { ticket, card, machine, human, service }
});
