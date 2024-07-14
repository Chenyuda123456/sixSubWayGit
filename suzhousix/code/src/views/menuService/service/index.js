import MenuContainer from '../../../components/layouts/MenuContainer.vue';
import { reactive, onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Protocol from '@/mixins/protocol.ts';
import { noticeService } from '@/service/noticeService.js';
import { CScrollbar } from 'c-scrollbar';
import { useStore } from 'vuex';

export default {
  name: 'Service',
  components: { CScrollbar, MenuContainer },
  setup() {
    const titleListRef = ref();
    const route = useRoute();
    const store = useStore();
    const data = reactive({
      titleList: [],
      serviceKeywords: [],
      currentIndex: 0,
      iconList: [
        '',
        'icon-kefu',
        'icon-changyou',
        'icon-duban',
        'icon-zhitong',
        'icon-kongtiao',
        'icon-tushuguan',
        'icon-nvxing',
        'icon-yusan',
        'icon-aixin',
        'icon-piao'
      ]
    });
    onMounted(async () => {
      window?.bridge?.generateNLG('bianming');
      const { firstLoad, onShortcut } = Protocol();
      firstLoad(['onShortcut']);
      data.titleList = store.getters.getServiceList;
      data.serviceKeywords = store.getters.getServiceKeywords;
      const scrollTo = index => {
        data.currentIndex = Number(index);
        const elList = document.querySelectorAll('.title-item');
        const titleTop = elList[index].offsetTop;
        titleListRef.value.setScrollTop(titleTop);
      };
      window['onShortcut'] = words => {
        return new Promise(resolve => {
          if (data.serviceKeywords.includes(words)) {
            const index = data.serviceKeywords.findIndex(i => {
              return i === words;
            });
            if (index == 0 || index) {
              scrollTo(index);
            }
            resolve();
          } else {
            onShortcut(words);
            resolve();
          }
        });
      };
      const index = route?.query?.index;
      if (index) {
        nextTick(() => {
          scrollTo(index);
        });
      }
      // 获取便民列表
      const site = window?.bridge?.getDefaultSite();
      let result = await noticeService.getNotice(site, 2, {});
      store.commit('setServiceList', result.data.result.data);
    });
    const changeCont = index => {
      data.currentIndex = index;
    };
    return {
      data,
      changeCont,
      titleListRef
    };
  }
};
