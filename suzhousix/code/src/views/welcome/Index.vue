<template>
  <div class="welcome1" @click="returnBtnInit">
    <subway-head />
    <main class="main">
      <div class="main-left">
        <div class="center">
          <div
            v-if="state.speech"
            class="center-line-one"
            style="text-align: center"
          >
            <!-- / 语音gif -->
            <tts-gif
              v-if="!data.isAndroid"
              v-show="state.isShowTTS || state.isShowRecommends"
              :width="$pxToRem(160)"
              :height="$pxToRem(160)"
              :state="state.speech.gifState"
              austrailia
              california
              chicago
            />
            <!-- / 语音gif -->
            <img
              v-else
              style="width: 160px; height: 160px"
              src="@/assets/lyra/Lyra_combination_00000.png"
            />
          </div>
          <div class="center-line-two over-text2">
            {{ state.speech.inputText || $t('say') }}
          </div>
        </div>
        <ul class="speech-tips">
          <li
            v-for="(tip, index) in speechTipsArr"
            :key="index"
            v-en="{
              bigScreen: {
                lineHeight: '28px',
                fontSize: '24px',
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              },
              smallScreen: {
                marginRight: '20px',
                width: '400px',
                lineHeight: '28px',
                fontSize: '24px',
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            }"
            class="speech-tips-item"
          >
            {{ tip }}
          </li>
        </ul>
        <div v-if="data.isWidthScreen">
          <ul class="module-list">
            <li
              v-for="(module, index) in moduleHomeArr"
              v-show="module.isShow"
              :key="index"
              class="module-item"
            >
              <ModuleBoxHome
                :height="$pxToRem(340)"
                :width="$pxToRem(550)"
                :intro="module.intro"
                :intro-class="module.introClass"
                :pic-url="getImgSrc(module.picUrl)"
                :title="module.title"
                :title-class="module.titleClass"
                :color="module.color"
                @moduleClick="goPage(module.url)"
              />
            </li>
          </ul>
          <div class="call">{{ $t('serviceHotline') }}：0512-69899000</div>
        </div>
      </div>
      <div class="main-right">
        <ul class="module-list">
          <li
            v-for="(module, index) in moduleArr"
            :key="index"
            class="module-item"
          >
            <module-box
              :pic-url="getImgSrc(module.picUrl)"
              :tips="module.tips"
              :title="module.title"
              @moduleClick="goPage(module.url)"
            />
          </li>
        </ul>
      </div>
    </main>
    <div v-if="!data.isWidthScreen">
      <subway-foot class="subwayFoot" />
      <div class="btn-visible">
        <div class="index-arrow" @click="show = !show">
          <img
            :class="show ? 'index-arrow-up' : 'index-arrow-down'"
            src="@/assets/index-arrow.png"
          />
        </div>
        <van-popup
          v-model:show="show"
          round
          class="van-popup-index"
          style="
            height: 428px;
            background: #edf3ff;
            border-radius: 30px 30px 0px 0px;
          "
          position="right"
        >
          <div class="van-popup-main">
            <div
              v-for="item in data.arrowArr"
              :key="item.picUrl"
              class="item"
              @click="arrowArrJump(item.link)"
            >
              <img :src="getImgSrc(item.picUrl)" />
              <div class="text">
                {{ item.text }}
                <span v-if="item.text == $t('homepage')"
                  >({{ data.timeSeconds }})</span
                >
              </div>
            </div>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>
<script>
import {
  onBeforeUnmount,
  onMounted,
  reactive,
  watch,
  ref,
  computed
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SubwayHead from '@/components/pagehead/SubwayHead.vue';
import TtsGif from '@/components/tts/TtsGif.vue';
import ttsChat from '@/components/tts/index.js';
import { useI18n } from 'vue-i18n';
import ModuleBox from '@/views/welcome/components/ModuleBox.vue';
import ModuleBoxHome from '@/views/ticket/components/stepone/ModuleBox.vue';
import Protocol from '@/mixins/protocol.ts';
import { SecCounter } from '@/utils/tool';
export default {
  name: 'Index',
  components: {
    SubwayHead,
    ModuleBox,
    ModuleBoxHome,
    TtsGif
  },
  setup() {
    let store = useStore();
    const { t } = useI18n();
    // const $route = useRoute();
    // 竖屏 右下角小箭头
    const show = ref(false);
    console.log(t);
    console.log('leqiao', t('leqiao'));
    const $router = useRouter();
    const isCardProcess = computed(() => store.getters.isCardProcess);
    const isBuyOutFare = computed(() => store.getters.isBuyOutFare);

    const moduleHomeArr = computed(() => [
      {
        picUrl: 'icon_pkcl@2x.png',
        title: t('ticketService'),
        intro: t('ticketsolvetips'),
        url: '/card',
        titleClass: 'color-pk-title',
        introClass: 'color-pk-des',
        color: '#F58719',
        isShow: isCardProcess.value || isBuyOutFare.value
      }
    ]);
    const speechTipsArr = computed(() => [
      t('elevator'),
      t('washingroom'),
      t('childrenBuyTickets')
    ]);

    const moduleArr = computed(() => [
      {
        picUrl: 'icon_chuxing@2x.png',
        title: t('transfer'),
        tips: [t('leqiao')],
        url: 'menu/menuchange'
      },
      {
        picUrl: 'icon_piaojia@2x.png',
        title: t('ticketprice'),
        tips: [t('leqiaoprice')],
        url: 'menu/menuticket'
      },
      {
        picUrl: 'icon_shike@2x.png',
        title: t('menuschedule'),
        tips: [t('schedule')],
        url: 'menu/menuFirsttrain'
      },
      {
        picUrl: 'icon_shiwu@2x.png',
        title: t('lostthings'),
        tips: [t('blueHat')],
        url: 'menu/menulost'
      },
      {
        picUrl: 'icon_zhannei@2x.png',
        title: t('insiteguide'),
        tips: [t('waytoWashingroom')],
        url: 'menu/menunavigation'
      },
      {
        picUrl: 'icon_zhoubian@2x.png',
        title: t('siteAround'),
        tips: [t('KFCGate')],
        url: 'menu/menunearby'
      },
      {
        picUrl: 'icon_bianmin@2x.png',
        title: t('service'),
        tips: [t('convenientServices')],
        url: 'menu/service'
      },
      {
        picUrl: 'icon_zhengce@2x.png',
        title: t('policy'),
        tips: [t('passengerPolicy')],
        url: 'menu/policy'
      },
      {
        picUrl: 'icon_gonggao@2x.png',
        title: t('announcement'),
        tips: [t('viewAnnouncement')],
        url: 'menu/announcement'
      }
    ]);
    const data = reactive({
      isAndroid: window.config.isAndroid,
      isWidthScreen: true,
      // isShowOrder: window.localStorage.getItem('isShowOrder') === 'true',
      // t('gateone'),
      arrowArr: [
        {
          picUrl: 'index-home.png',
          text: t('homepage'),
          link: {
            name: 'menubuy'
          }
        },
        // {
        //   picUrl: 'index-message.png',
        //   text: t('feedback'),
        //   link: {
        //     name: 'feedback'
        //   }
        // },
        {
          picUrl: 'index-robot.png',
          text: t('robotService'),
          link: {
            name: 'ttschat',
            query: {
              inputText: '',
              outputContent: t('YouCanAskYourQuestionsHere')
            }
          }
        }
      ],
      arrowArrNotBuy: [
        {
          picUrl: 'index-message.png',
          text: t('feedback'),
          link: {
            name: 'feedback'
          }
        },
        {
          picUrl: 'index-robot.png',
          text: t('robotService'),
          link: {
            name: 'ttschat',
            query: {
              inputText: '',
              outputContent: t('YouCanAskYourQuestionsHere')
            }
          }
        }
      ],
      timer: null,
      timeSeconds: 120 // 倒计时秒数
    });
    data.isWidthScreen =
      (window?.bridge?.getClientSize?.() ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) > 1080;
    window.onresize = function () {
      data.isWidthScreen =
        (window?.bridge?.getClientSize?.() ||
          document.documentElement.clientWidth ||
          document.body.clientWidth) > 1080;
    };
    const navClick = name => {
      // if (!data.isShowOrder) return;
      // if (name === t('consult')) {
      //   window?.bridge?.changeSkill?.('Ask');
      //   $router.push({ name: 'welcome2' });
      // } else if (name === t('ticket')) {
      //   window?.bridge?.changeSkill?.('BuyTickets');
      //   $router.push({ name: 'menubuy' });
      // } else if (name === t('ticketService')) {
      //   window?.bridge?.onClick?.('ticket');
      //   $router.push({ name: 'card' });
      // }
    };
    const getImgSrc = name => {
      return new URL(`/src/assets/${name}`, import.meta.url).href;
    };
    const goPage = url => {
      $router.push(url);
    };
    const { state } = ttsChat();
    const arrowArrJump = option => {
      $router.push(option);
    };
    watch(
      state.speech,
      val => {
        // 跳转闲聊页
        console.log(
          'state 跳转' +
            state.isShowTTS +
            state.speech.talkType +
            state.speech.outputContent
        );
        if (
          state.isShowTTS &&
          state.speech.talkType === 'chat' &&
          state.speech.outputContent
        ) {
          console.log(
            'state 跳转' +
              state.isShowTTS +
              state.speech.talkType +
              state.speech.outputContent
          );
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
    const goBack = () => {
      $router.push({ name: 'menubuy' });
    };
    const returnBtnInit = () => {
      if (!data.isWidthScreen) {
        data.timeSeconds = 120;
        data.timer && data.timer.countStop();
        data.timer = new SecCounter();
        data.timer.countStart(data.timeSeconds, time => {
          data.timeSeconds = time;
          if (time === 0) {
            // 票卡倒计时返回首页
            goBack(true);
          }
        });
      }
    };
    onMounted(() => {
      window?.bridge?.onButtonClick('返回');
      const { firstLoad } = Protocol();
      firstLoad();
      window?.bridge?.changeSkill?.('Ask');
      returnBtnInit();
    });
    onBeforeUnmount(() => {
      data.timer && data.timer.countStop();
    });
    return {
      data,
      navClick,
      state,
      getImgSrc,
      goPage,
      show,
      arrowArrJump,
      t,
      moduleHomeArr,
      moduleArr,
      speechTipsArr,
      returnBtnInit
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'index';
:deep(.van-popup--right) {
  width: 100%;
  top: calc(100vh - 214px);
}
</style>
