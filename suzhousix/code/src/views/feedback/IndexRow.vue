<template>
  <div class="scenic-category">
    <!-- S 页头信息 -->
    <subway-head />
    <!-- E 页头信息 -->
    <div class="center">
      <div class="scenic-left">
        <menu-container :title="$t('feedback')">
          <input-feedback :input-text="state.inputText"></input-feedback>
        </menu-container>
      </div>
      <div class="speech-wrapper">
        <speech-card-Row @update="updateInputText"></speech-card-Row>
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
import inputFeedback from '@/views/feedback/InputFeedback.vue';
import SpeechCardRow from '@/components/pageSpeech/SpeechCardRow.vue';
import { reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import i18n from '@/lang';
export default {
  name: 'PageMenuRow',
  components: {
    SubwayHead,
    BuyTicketBackBtn,
    SpeechCardRow,
    inputFeedback
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
</style>
