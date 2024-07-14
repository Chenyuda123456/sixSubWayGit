import moment from 'moment';
import { useRouter } from 'vue-router';
import { onMounted, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

export default function pageHeadCommon() {
  const $router = useRouter();
  const state = reactive({
    timer: null,
    nowTime: '',
    timeStr: '',
    currentSite: ''
  });
  const { t } = useI18n();
  const store = useStore();
  watch(
    () => store.getters.getLang,
    val => {
      console.log(val);
      state.currentSite =
        val === 'en'
          ? window?.bridge?.getSiteEnName()
          : window?.bridge?.getDefaultSite();
    },
    { immediate: true }
  );
  const goTtsChat = () => {
    $router.push({
      name: 'ttschat',
      query: {
        inputText: '',
        outputContent: t('YouCanAskYourQuestionsHere')
      }
    });
  };
  const getNowTime = () => {
    const getTime = () => {
      state.nowTime = moment().format('YYYY-MM-DD HH:mm');
      state.timeStr = moment().format('HH:mm');
    };
    getTime();
    state.timer = setInterval(() => {
      getTime();
    }, 1000);
  };
  onMounted(() => {
    getNowTime();
  });
  return {
    state,
    goTtsChat,
    getNowTime
  };
}
