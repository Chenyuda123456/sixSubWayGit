<template>
  <div class="scenic-category">
    <subway-head />
    <div class="center">
      <input-feedback-col :input-text="state.inputText"></input-feedback-col>
      <div class="speech-wrapper">
        <speech-card-col @update="updateInputText"></speech-card-col>
        <buy-ticket-back-btn class="buyTicketBack" @click="goBack">
          {{ state.timeSecondsText }}
        </buy-ticket-back-btn>
      </div>
    </div>
  </div>
</template>

<script>
import BuyTicketBackBtn from '@/components/BuyTicketBackBtn.vue';
import SubwayHead from '@/components/pagehead/SubwayHead.vue';
import inputFeedbackCol from '@/views/feedback/InputFeedbackCol.vue';
import SpeechCardCol from '@/components/pageSpeech/SpeechCardCol.vue';
import { reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import i18n from '@/lang';
import { useStore } from 'vuex';
export default {
  name: 'PageMenuRow',
  components: {
    SubwayHead,
    BuyTicketBackBtn,
    SpeechCardCol,
    inputFeedbackCol
  },
  setup() {
    const state = reactive({
      currentSite: '',
      inputText: '',
      timer: '',
      timeSecondsText: '返回' // 倒计时文字
    });
    const updateInputText = val => {
      state.inputText = '';
      setTimeout(() => {
        state.inputText = val;
      });
    };

    watch(
      () => i18n.global.locale,
      val => {
        state.currentSite =
          val === 'en'
            ? window?.bridge?.getSiteEnName()
            : window?.bridge?.getDefaultSite();
      },
      {
        immediate: true
      }
    );
    const $router = useRouter();
    const goBack = () => {
      $router.push({ name: 'welcome2' });
    };
    return {
      goBack,
      state,
      updateInputText
    };
  }
};
</script>
<style lang="scss" scoped>
@import 'src/styles/mixins';

.buyTicketBack {
  position: fixed;
  right: 30px;
  bottom: 30px;
  margin: auto;
  z-index: 999;
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

  .buyTicketBack {
    position: fixed;
    left: 260px;
    bottom: 280px;
    margin: 0;
    z-index: 9;
    width: 240px;
    height: 80px;
    border-radius: 40px;
    border: 3px solid #85a9ff;
    background: linear-gradient(180deg, #9aafff 0%, #6b89fb 100%);
    font-size: 32px;
    font-weight: 400;
    color: #fff;
    line-height: 76px;
    box-shadow: none;
  }
}
</style>
