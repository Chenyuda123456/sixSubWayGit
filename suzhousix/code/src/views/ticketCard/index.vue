<template>
  <div>
    <card-wrapper>
      <template #content>
        <subway-head />
        <router-view></router-view>
        <!-- S tts拾音 -->
        <div class="speech-wrapper">
          <SpeechCardRow v-if="data.isWidthScreen"></SpeechCardRow>
          <speech-card-col v-else></speech-card-col>
          <div class="buyTicketBack-box">
            <buy-ticket-back-btn
              v-if="
                $route.meta.human ||
                ($route.name == 'update' &&
                  cardResult['promptInfo'] &&
                  cardResult['promptInfo'].includes('人工服务')) ||
                (cardResult?.errorList?.length &&
                  $route.name == 'updatePayResult')
              "
              class="buyTicketBack"
              @click="human"
            >
              {{ $t('StaffService') }}
            </buy-ticket-back-btn>
            <buy-ticket-back-btn
              class="buyTicketBack"
              :class="{ grayScale: data.isBack }"
              @click="goBack(null)"
            >
              {{ data.timeSecondsText }} ({{ data.timeSeconds }})
            </buy-ticket-back-btn>
          </div>
        </div>
      </template>
    </card-wrapper>
  </div>
</template>

<script setup>
import { SecCounter } from '@/utils/tool';
import Protocol from '@/mixins/protocol.ts';
import { mapGetters, useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import cardWrapper from './components/cardWrapper.vue';
import SubwayHead from '@/components/pagehead/SubwayHead.vue';
import SpeechCardRow from '@/components/pageSpeech/SpeechCardRow.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  watch,
  reactive,
  getCurrentInstance
} from 'vue';
import { useI18n } from 'vue-i18n';

const { firstLoad, onShortcut } = Protocol();
firstLoad([]);
const { proxy } = getCurrentInstance();
const { t } = useI18n();
const data = reactive({
  isBack: false,
  isWidthScreen: store.state.isWidthScreen,
  timer: null,
  timeSeconds: 120, // 倒计时秒数
  timeSecondsText: t('goback') // 倒计时文字
});
console.log(data.isWidthScreen);
const cardResult = computed(() => store.state.card.cardResult);
const cardUpdate = computed(() => store.state.card.cardUpdate);
const back = () => {
  if (route.name.includes('PayGuide')) {
    proxy.$subwayInfo.normalInfo('交易取消!');
  }
  data.isBack = false;
  if (route.name == 'chooseCardType') {
    router.push({ name: 'menubuy' });
  } else if (
    // 实体票和出站票
    cardUpdate.value.mediumType === 0 ||
    cardUpdate.value.mediumType === 1 ||
    route.name == 'readCard' ||
    route.name == 'chooseECardType'
  ) {
    router.push({
      name: 'chooseCardType'
    });
  } else {
    router.push({
      name: 'chooseECardType'
    });
  }
  // 返回重置数据 chooseCardType和chooseECardType也有此操作
  store.commit('cardReset');
};
watch(
  cardResult,
  newValue => {
    if (newValue.sts == 999) {
      if (newValue.errorList && newValue.errorList.length) {
        router.push({
          name: 'updatePayResult'
        });
      } else {
        if (newValue.substs == 258) {
          // 有用 统一页面上的取消操作 其实和和下面返回一样，只是为了统一跳转
          // 扫码页面有取消输入的操作 所以特殊判断下
          console.log('index--等待回传的258取消');
          if (data.isBack) {
            back();
          }
        } else if (newValue.substs == 256) {
          // 更新退票之类的成功就是60秒退出 下面这个是寻实体卡成功的所以要判断下
          if (cardResult.value.processInfo.processType !== 'QueryCard') {
            returnBtnInit(window.config.electronicInvoice || 120);
          } else {
            returnBtnInit(120);
          }
        }
      }
    }
  },
  { deep: true }
);
const returnBtnInit = val => {
  data.isBack = false;
  data.timeSeconds = val || 120;
  data.timer && data.timer.countStop();
  data.timer = new SecCounter();
  data.timer.countStart(data.timeSeconds, time => {
    data.timeSeconds = time;
    if (time === 0) {
      // 票卡倒计时返回首页
      goBack(true);
    }
  });
};

watch(
  () => router,
  val => {
    console.log('card--watch--router', val);
    returnBtnInit();
  },
  { deep: true, immediate: true }
);

const goBack = isTime => {
  if (isTime) {
    window?.bridge?.triggerCancelBusiness(true, true);
    return back();
  }
  // 找零和写卡 不让点
  if (
    data.isBack ||
    cardResult?.value?.sts == 204 ||
    cardResult?.value?.sts == 203
  ) {
    return;
  }
  data.isBack = true;
  // 如果在票卡处理进程中
  if (cardResult.value.sts) {
    // 如果已经结束
    if (cardResult.value.sts === 999) {
      back();
    } else {
      window?.bridge?.triggerCancelBusiness(true, true);
    }
  } else {
    back();
  }
};

const human = () => {
  store.commit('setHumanShow', true);
};

const cardOnShortCut = val => {
  if (val == '返回') {
    goBack();
  } else {
    onShortcut(val);
  }
};

provide('cardOnShortCut', cardOnShortCut);

window['onShortcut'] = val => {
  cardOnShortCut(val);
};
onMounted(() => {
  // 关于票卡方正返回的信息
  window['onProcessCardBusiness'] = res => {
    console.log('index--onProcessCardBusiness->接受后台都给的票卡数据');
    res.status.errorList =
      res.errorList && res.errorList.length
        ? res.errorList
        : res.status.errorList;
    console.log('setCardResult', res.status);
    store.commit('setCardResult', res.status);
    console.log('getCardResult', cardResult.value);
  };
});
onUnmounted(() => {
  data.timer && data.timer.countStop();
});
</script>
<style lang="scss" scoped>
.asr {
  top: 186px;
}

.buyTicketBack-box {
  position: fixed;
  right: 30px;
  bottom: 30px;
  margin: auto;
  z-index: 999;
  display: flex;
  justify-content: center;

  .buyTicketBack {
    margin-left: 10px;
  }
}

.center {
  margin-top: 30px;
}

@media screen and (max-width: 1180px) {
  .center {
    margin-top: 154px;
  }
  .speech-wrapper {
    position: fixed;
    height: 210px;
    bottom: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.04);
  }

  .buyTicketBack-box {
    position: fixed;
    right: 0px;
    left: 0;
    bottom: 240px;
    margin: auto;
    z-index: 999;
    display: flex;
    justify-content: center;

    .buyTicketBack {
      margin: 0 10px;
    }
  }
}
</style>
