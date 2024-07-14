import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import i18n from '@/lang';
import Protocol from '@/mixins/protocol.ts';
import { useStore } from 'vuex';
import { SecCounter } from '@/utils/tool';
export default function ttsChatCommon() {
  const state = reactive({
    inputText: '',
    outputContent: '',
    message: null,
    currentSite: '',
    isWidthScreen:
      (window?.bridge?.getClientSize?.() ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) > 1080,
    timer: null,
    timeSeconds: 120 // 倒计时秒数
  });
  let store = useStore();
  const routeObj = reactive(useRouter());

  watch(
    () => routeObj.currentRoute,
    val => {
      if (val && val.name === 'ttschat') {
        let { inputText, outputContent, message } = val.query;
        state.inputText = inputText;
        state.outputContent = outputContent;
        if (message) {
          state.message =
            typeof message === 'string' ? JSON.parse(message) : message;
        }
      }
    },
    {
      deep: true,
      immediate: true
    }
  );
  let stationName = computed(() => store.getters.getModuleInfoStationName);
  watch(
    () => stationName.value,
    val => {
      state.currentSite =
        val === 'en' ? window?.bridge?.getSiteEnName() : stationName;
    }
  );
  watch(
    () => i18n.global.locale,
    val => {
      state.currentSite =
        val === 'en' ? window?.bridge?.getSiteEnName() : stationName;
    },
    {
      immediate: true
    }
  );
  const $router = useRouter();
  const goBack = () => {
    $router.push({
      name: 'welcome2'
    });
  };

  const returnBtnInit = () => {
    state.timeSeconds = 120;
    state.timer && state.timer.countStop();
    state.timer = new SecCounter();
    state.timer.countStart(state.timeSeconds, time => {
      state.timeSeconds = time;
      if (time === 0) {
        // 票卡倒计时返回首页
        goBack();
      }
    });
  };
  onBeforeUnmount(() => {
    state.timer && state.timer.countStop();
    document.body.removeEventListener('click', returnBtnInit);
  });
  onMounted(() => {
    returnBtnInit();
    document.body.addEventListener('click', returnBtnInit);
    const { firstLoad } = Protocol();
    firstLoad();
  });
  return {
    state,
    goBack,
    returnBtnInit
  };
}
