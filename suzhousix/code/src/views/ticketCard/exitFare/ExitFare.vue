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
                (ticketStatus?.errorList?.length &&
                  $route.name == 'moneyFareExitPayResult')
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
              {{ data.timeSecondsText }} ({{ data.timeSeconds }}s)
            </buy-ticket-back-btn>
          </div>
        </div>
      </template>
    </card-wrapper>
  </div>
</template>

<script setup>
import cardWrapper from '../components/cardWrapper.vue';
import { SecCounter } from '@/utils/tool';
import Protocol from '@/mixins/protocol.ts';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import SubwayHead from '@/components/pagehead/SubwayHead.vue';
import SpeechCardRow from '@/components/pageSpeech/SpeechCardRow.vue';
const store = useStore();
const route = useRoute();
const router = useRouter();
import {
  computed,
  watch,
  reactive,
  getCurrentInstance,
  onUnmounted
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

const ticketStatus = computed(() => store.getters.getTicketStatus);
const back = () => {
  if (route.name.includes('PayGuide')) {
    proxy.$subwayInfo.normalInfo('交易取消!');
  }
  router.push({
    name: 'chooseCardType'
  });
};

const returnBtnInit = val => {
  data.timeSeconds = val || 120;
  data.timer && data.timer.countStop();
  data.timer = new SecCounter();
  data.timer.countStart(data.timeSeconds, time => {
    data.timeSeconds = time;
    if (time === 0) {
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
watch(
  ticketStatus,
  newValue => {
    console.log(newValue);
    if (newValue.sts === 203) {
      store.commit('setPayResult', 'success');
      router.push({
        name: 'moneyFareExitPayResult'
      });
    }
    if (newValue.sts == 999) {
      if (newValue.errorList && newValue.errorList.length) {
        router.push({
          name: 'moneyFareExitPayResult'
        });
      } else {
        if (newValue.substs == 258) {
          back();
        } else if (newValue.substs == 256) {
          returnBtnInit(window.config.electronicInvoice || 120);
        }
      }
    }
  },
  { deep: true }
);
const goBack = isTime => {
  if (isTime) {
    window?.bridge?.triggerCancelBusiness(true, true);
    return back();
  }
  if (
    data.isBack ||
    ticketStatus?.value?.sts == 204 ||
    ticketStatus?.value?.sts == 203
  ) {
    return;
  }
  data.isBack = true;
  if (ticketStatus.value.sts != null) {
    if (ticketStatus.value.sts === 999) {
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
