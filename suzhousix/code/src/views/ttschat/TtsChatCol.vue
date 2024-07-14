<template>
  <div class="base-col">
    <subway-head :right-type="2"></subway-head>
    <buy-ticket-back-btn class="buyTicketBack" @click="goBack">
      {{ timeSecondsText }}&nbsp;{{ state.timeSeconds }}
    </buy-ticket-back-btn>

    <div class="speech-wrapper">
      <speech-card-col
        :input-text="state.inputText"
        :message="state.message"
        :output-content="state.outputContent"
        :recommend-list="state.recommendList"
        :show-title="false"
        @returnBtnInit="returnBtnInit"
      />
    </div>
  </div>
</template>

<script>
import SubwayHead from '@/components/pagehead/SubwayHead.vue';
import SpeechCardCol from '@/components/pageSpeech/SpeechCardCol.vue';
import BuyTicketBackBtn from '@/components/BuyTicketBackBtn.vue';
import ttsChatCommon from './index';

export default {
  name: 'TtsChatCol',
  components: {
    SpeechCardCol,
    SubwayHead,
    BuyTicketBackBtn
  },
  setup() {
    let { state, goBack, returnBtnInit } = ttsChatCommon();
    return {
      state,
      goBack,
      returnBtnInit
    };
  },
  data() {
    return {
      timeSecondsText: '返回' // 倒计时文字
    };
  }
};
</script>
<style lang="scss" scoped>
.base-col {
  width: 100vw;
  height: 100vh;
  background-size: cover;
}

.btn-wrapper {
  position: fixed;
  bottom: 240px;
  left: 0;
  right: 0;
}

.buyTicketBack {
  position: fixed;
  right: 30px;
  bottom: 30px;
  margin: auto;
  z-index: 999;
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
  .buyTicketBack {
    position: fixed;
    right: 0px;
    left: 0;
    bottom: 280px;
    margin: auto;
    z-index: 999;
  }
}
</style>
