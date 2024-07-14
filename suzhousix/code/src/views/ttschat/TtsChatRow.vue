<template>
  <div class="base-col">
    <subway-head :right-type="2"></subway-head>
    <buy-ticket-back-btn class="buyTicketBack" @click="goBack">
      {{ timeSecondsText }}&nbsp;{{ state.timeSeconds }}
    </buy-ticket-back-btn>
    <div class="speech-wrapper">
      <speech-card-row
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
import SpeechCardRow from '@/components/pageSpeech/SpeechCardRow.vue';
import BuyTicketBackBtn from '@/components/BuyTicketBackBtn.vue';
import ttsChatCommon from './index';

export default {
  name: 'TtsChatCol',
  components: {
    SpeechCardRow,
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
</style>
