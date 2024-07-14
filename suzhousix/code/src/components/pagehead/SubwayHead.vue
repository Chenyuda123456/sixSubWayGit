<template>
  <div class="top">
    <div class="top-left">
      <img
        v-if="data.isLogo"
        :src="getImgSrc('logo@2x.png')"
        alt=""
        class="top-left-icon-subway"
      />
    </div>
    <div class="top-right-container">
      <div
        v-if="
          (data.routeName === 'welcome2' && isWidthScreen) ||
          (data.routeName === 'menubuy' && isWidthScreen) ||
          (data.routeName === 'menubuy' && !isBuyFare)
        "
        class="top-right-btn mr30"
        @click="switchLang()"
      >
        &nbsp;{{ $t('lang') }}
      </div>
      <div
        v-if="
          (data.routeName === 'welcome2' || data.routeName === 'menubuy') &&
          isWidthScreen
        "
        v-en="{
          lineHeight: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }"
        class="top-right-btn mr40"
        @click="goTtsChat"
      >
        <img :src="getImgSrc('icon_service@2x.png')" alt="" />
        <span v-en="{ width: '90px' }">{{ $t('robotService') }}</span>
      </div>
      <!--v-if="!isWidthScreen"-->

      <div class="top-right-border">
        <div class="top-right-one">{{ state.nowTime }}</div>
        <div class="top-right-two">
          <img :src="getImgSrc('icon_loc@2x.png')" alt="" />
          {{ state.currentSite }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageHeadCommon from './index';
import { reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { mapGetters, useStore } from 'vuex';

export default {
  name: 'SubwayHead',
  props: {
    leftType: {
      type: String,
      default: () => {
        return 'logo'; //logo-地铁图标，kefu-客服图标
      }
    },
    stationName: {
      type: String,
      default: () => {
        return '';
      }
    },
    intelligence: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    ...mapGetters({
      currentIndex: 'getCurrentIndex'
    })
  },
  setup() {
    const store = useStore();
    const isWidthScreen = store.state.isWidthScreen;
    const router = useRouter();
    const route = useRoute();
    console.log(route.name);
    const { state, goTtsChat, getNowTime } = pageHeadCommon();
    let isBuyFare = computed(() => store.getters.isBuyFare);
    const data = reactive({
      loop: null,
      routeName: route.name,
      isLogo: true
    });
    let fixStation = computed(() =>
      store.getters.getLang == 'en'
        ? window.config?.fixStation?.split(',')[1]
        : window.config?.fixStation?.split(',')[0]
    );
    if (isWidthScreen && route.meta.parent === 'menu') {
      data.isLogo = false;
    } else {
      data.isLogo = true;
    }
    const start = () => {
      clearTimeout(data.loop);
      data.loop = setTimeout(() => {
        router.push({
          path: '/initialization?page=true',
          query: { page: true }
        });
      }, 2000);
    };
    const end = () => {
      clearTimeout(data.loop);
    };
    const gtouchmove = () => {
      clearTimeout(data.loop);
    };
    const getImgSrc = name => {
      return new URL(`/src/assets/${name}`, import.meta.url).href;
    };
    const goFeedback = () => {
      router.push({
        name: 'feedback'
      });
    };
    const switchLang = () => {
      let lang = window.localStorage.getItem('lang');
      if (lang && lang == 'en') {
        window.onLanguageChanged('chinese');
      } else {
        window.onLanguageChanged('english');
      }
    };
    return {
      human: window.config.isHuman,
      data,
      state,
      end,
      goTtsChat,
      getNowTime,
      getImgSrc,
      goFeedback,
      isWidthScreen,
      switchLang,
      fixStation,
      isBuyFare
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/common.scss';
@import 'src/styles/mixins.scss';

.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 0 46px 0 30px;

  .top-left-icon-subway {
    width: 267px;
    height: 48px;
    vertical-align: top;
  }

  .top-left {
    padding-top: 44px;
    height: 48px;
  }

  // 顶部 右边
  .top-right-container {
    @include flexStyle(flex-end, center);
    padding-top: 30px;
    // 顶部 客服图标

    // 顶部 人工服务按钮btn
    .top-right-btn {
      @include flexStyle(center, center);
      width: 170px;
      height: 60px;
      color: $--subway-color-white1;
      font-size: 24px;
      padding: 0 10px 0;
      background: linear-gradient(180deg, #9aafff 0%, #6b89fb 100%);
      box-shadow: 0px 6px 10px 0px rgba(107, 137, 251, 0.4);
      border-radius: 30px;
      cursor: pointer;

      img {
        width: 24px;
      }
    }

    .top-right-border {
      @include flexStyle(flex-end, flex-end, column);

      .top-right-one {
        @include flexStyle(flex-end, flex-end);
        font-size: 24px;
        line-height: 36px;
        color: #3b3b3b;
      }

      .top-right-two {
        @include flexStyle(flex-end, flex-end);
        // width: 30px;
        line-height: 54px;
        line-height: 36px;
        font-size: 36px;
        font-weight: bold;
        color: #333;

        img {
          width: 36px;
          margin: 8px 10px 0 0;
          vertical-align: middle;
        }
      }
    }
  }
}

@media screen and (max-width: 1080px) {
  .top {
    position: relative;
    margin: 0 46px 0 46px;
    .top-left {
      padding-top: 42px;
    }
    // 顶部 右边
    .top-right-container {
      padding-top: 36px;
      .top-right-btn {
        position: absolute;
        right: 0;
        bottom: -90px;
        margin-right: 0px;
      }
    }
  }
}
</style>
