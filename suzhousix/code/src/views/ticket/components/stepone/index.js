import { reactive, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import ModuleBox from './ModuleBox.vue';
import TtsGif from '@/components/tts/TtsGif.vue';
import ttsChat from '@/components/tts/index.js';
import Line from './Line.vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

export default {
  name: 'Index',
  components: { ModuleBox, TtsGif, Line },
  setup(props, { emit }) {
    // const $route = useRoute();
    const store = useStore();
    const { t } = useI18n();
    const $router = useRouter();
    const isCardProcess = computed(() => store.getters.isCardProcess);
    const isBuyOutFare = computed(() => store.getters.isBuyOutFare);
    const freeFare = computed(() => store.getters.freeFare);
    const data = reactive({
      isAndroid: window.config.isAndroid,
      pirceList: [],
      allPriceList: [],
      pricePage: true,
      priceIndex: null
    });
    let speechTipsArr = computed(() => [
      t('gosuzhourail'),
      t('buy2$5ticket'),
      t('buygardentickets'),
      t('buyleqiaotickets')
    ]);
    let moduleArr = computed(() => [
      {
        picUrl: 'icon_yyzx@2x.png',
        title: t('goConsult'),
        intro: t('voiceconsulttips'),
        url: '/welcome2',
        titleClass: 'color-yyzx',
        introClass: 'color-yyzx',
        color: '#5171E6',
        isShow: true
      },
      {
        picUrl: 'icon_pkcl@2x.png',
        title: t('ticketService'),
        intro: t('ticketsolvetips'),
        url: '/card',
        titleClass: 'color-pk-title',
        introClass: 'color-pk-des',
        color: '#F58719',
        isShow: isCardProcess.value || isBuyOutFare.value || freeFare.value
      }
    ]);
    let MODULE_TIOM = computed(() => store.getters.MODULE_TIOM);
    const getImgSrc = name => {
      return new URL(`/src/assets/${name}`, import.meta.url).href;
    };
    const goPage = url => {
      if (url) {
        $router.push(url);
      }
    };
    const choosePrice = price => {
      data.priceIndex = price;
      emit('changeCost', data.pirceList[price]);
    };
    data.allPriceList = computed(() => store.getters.getAllPriceList);
    let isBuyFare = computed(() => store.getters.isBuyFare);
    watch(
      () => data.allPriceList,
      () => {
        if (data.allPriceList.length > 8) {
          data.pirceList = data.allPriceList.slice(0, 7);
        } else {
          data.pirceList = data.allPriceList;
        }
      },
      {
        immediate: true
      }
    );
    const choosePage = () => {
      data.pricePage = !data.pricePage;
      if (data.pricePage) {
        data.pirceList = data.allPriceList.slice(0, 7);
      } else {
        data.pirceList = data.allPriceList.slice(7);
      }
    };
    const { state } = ttsChat();
    watch(
      state.speech,
      val => {
        // 跳转闲聊页
        console.log(val);
        console.log(val);
        if (
          state.isShowTTS &&
          state.speech.talkType === 'chat' &&
          state.speech.outputContent &&
          !state.speech.emptyIntent
        ) {
          $router.push({
            name: 'ttschat',
            query: {
              inputText: state.speech.inputText,
              outputContent: state.speech.outputContent,
              message: JSON.stringify(state.speech.message)
            }
          });
        }
      },
      {
        deep: true
      }
    );
    return {
      data,
      state,
      getImgSrc,
      goPage,
      choosePrice,
      choosePage,
      MODULE_TIOM,
      moduleArr,
      speechTipsArr,
      isBuyFare
    };
  }
};
