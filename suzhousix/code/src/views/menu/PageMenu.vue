<template>
  <div class="scenic-category" @click="returnBtnInit">
    <!-- S 页头信息 -->
    <subway-head />
    <!-- E 页头信息 -->

    <div class="center">
      <div class="scenic-left">
        <div
          v-if="
            $route.name == 'menulost' ||
            $route.name === 'service' ||
            $route.name === 'menunearby'
          "
        >
          <router-view></router-view>
        </div>
        <menu-container
          v-else
          :title="$t($route.meta.title)"
          :second-title="$route.meta.secondTitle && $t($route.meta.secondTitle)"
          :second-link="$route.meta.secondLink"
        >
          <router-view></router-view>
        </menu-container>
      </div>
      <div class="speech-wrapper">
        <SpeechCardRow
          v-if="isWidthScreen"
          @returnBtnInit="returnBtnInit"
        ></SpeechCardRow>
        <speech-card-col
          v-else
          @returnBtnInit="returnBtnInit"
        ></speech-card-col>
        <!--        <subway-foot class="subwayFoot" v-if="!isWidthScreen" />-->
        <buy-ticket-back-btn class="buyTicketBack" @click="goBack">
          {{ timeSecondsText }}&nbsp;{{ data.timeSeconds }}
        </buy-ticket-back-btn>
      </div>
    </div>
  </div>
</template>

<script>
import BuyTicketBackBtn from '@/components/BuyTicketBackBtn.vue';
import SubwayHead from '@/components/pagehead/SubwayHead.vue';
import SubwayFoot from '@/components/SubwayFoot.vue';
import SpeechCardCol from '@/components/pageSpeech/SpeechCardCol.vue';
import SpeechCardRow from '@/components/pageSpeech/SpeechCardRow.vue';
import { SecCounter } from '@/utils/tool';
import { reactive, watch, provide, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import i18n from '../../lang';
import { useRouter } from 'vue-router';

export default {
  name: 'PageMenuRow',
  components: {
    SubwayHead,
    BuyTicketBackBtn,
    // SubwayFoot,
    SpeechCardCol,
    SpeechCardRow
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const isWidthScreen = store.state.isWidthScreen;
    const router = useRouter();
    const data = reactive({
      timer: null,
      timeSeconds: 120, // 倒计时秒数
      timeSecondsText: t('goback') // 倒计时文字
    });
    const goBack = () => {
      if (isWidthScreen) {
        router.push({ name: 'welcome2' });
      } else {
        router.push({ name: 'menubuy' });
      }
    };
    const returnBtnInit = () => {
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
    };
    watch(
      () => router.currentRoute,
      val => {
        returnBtnInit();
      },
      {
        deep: true,
        immediate: true
      }
    );
    onBeforeUnmount(() => {
      data.timer && data.timer.countStop();
    });
    return {
      returnBtnInit,
      data,
      goBack,
      isWidthScreen,
      timeSecondsText: t('goback') // 倒计时文字
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
    right: 0px;
    left: 0;
    bottom: 240px;
    width: 220px;
    margin: auto;
    z-index: 999;
  }
}
</style>
