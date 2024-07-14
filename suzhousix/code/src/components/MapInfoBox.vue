<template>
  <div
    :class="{
      'nav-info-box-hidden': !data.isShow,
      'nav-info-box-show': data.isShow,
      'nav-info-box-noPosition': !isTicket && data.isWidthScreen
    }"
    class="nav-info-box"
  >
    <!--  S 顶部 切换与展开按钮  -->
    <div class="top">
      <div
        v-for="(item, index) in topInfo"
        :key="index"
        v-en="{
          display: 'flex',
          alignItems: 'enter',
          justifyContent: 'center',
          lineHeight: '20px',
          fontSize: '18px',
          textAlign: 'center'
        }"
        :class="[
          'btn-info',
          { 'btn-active': data.currentIndex === index },
          `btn-info-${topInfo.length}`,
          { 'btn-info-no-tickte': !isTicket }
        ]"
        @click="btnClick(index)"
      >
        <span>
          {{ item }}
        </span>
      </div>
      <div
        v-if="!data.isWidthScreen"
        class="btn-del"
        @click="data.isShow = !data.isShow"
      >
        <img
          v-if="data.isShow"
          class="btn-del-img-off"
          src="@/assets/btn-error@1x.png"
        />
        <img v-else class="btn-del-img-show" src="@/assets/btn-show@1x.png" />
      </div>
    </div>
    <!--  E 顶部 切换与展开按钮  -->
    <!--  S 具体信息传入  -->
    <div
      id="info"
      :class="isPrompt ? '' : 'info-wrapper-noPrompt'"
      class="info-wrapper"
    >
      <div class="top-title">
        <slot name="topInfo"></slot>
      </div>
      <div id="info-content" class="info-content">
        <slot></slot>
      </div>
      <!--  E 具体信息传入  -->
      <div
        v-if="isPrompt"
        class="prompt"
        style="
          padding-left: 10px;
          padding-right: 10px;
          text-align: justify;
          margin-top: 10px;
        "
      >
        {{ promptContent }}
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, computed, onMounted} from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'MapInfoBox',
  props: {
    topInfo: {
      type: Array,
      default: () => {
        return [''];
      }
    },
    isTicket: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    isPrompt: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    const data = reactive({
      isShow: true,
      currentIndex: 0,
      isWidthScreen: store.state.isWidthScreen
    });
    const btnClick = type => {
      data.currentIndex = type;
      emit('buttonClick', type);
      if (!data.isShow) {
        data.isShow = true;
      }
    };
    const changeCurrentIndex = type => {
      data.currentIndex = type;
    };
    const showInfo = () => {
      data.isShow = true;
    };
    const hideInfo = () => {
      data.isShow = false;
    };
    const promptContent = computed(() => {
      return store.getters.getLang == 'en'
        ? ' The above plan is for reference only,the actual arrival time may change.In order not to affect your itinerary,please pay attention to the first&last subway time.'
        : '以上方案仅供参考，具体以实际情况为准。请您留意进站及换乘的首末班时间，以免耽误您的行程';
    });
    return {
      data,
      btnClick,
      showInfo,
      hideInfo,
      promptContent,
      changeCurrentIndex
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/mixins';
@media screen and (min-width: 1280px) {
  .nav-info-box-show {
    transition: height 0.4s;
  }

  .nav-info-box-hidden {
    transition: height 0.4s;
    height: 68px;
  }

  .nav-info-box {
    position: absolute;
    top: 40px;
    left: 30px;
    max-height: 650px;

    background: #f1f1f1;
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    overflow: hidden;

    .top {
      @include flexStyle(space-between, flex-start);
      width: 100%;
      height: 68px;
      padding: 10px;

      .btn-info {
        @include flexStyle();
        width: 100px;
        height: 48px;
        background: #dbdbdb;
        border-radius: 6px;
        font-size: 22px;
        color: rgba(51, 51, 51, 0.3);
        cursor: pointer;
      }

      .btn-info-2 {
        width: 158px;
      }

      .btn-info-3 {
        width: 100px;
      }

      .btn-active {
        background: #fffffe;
        color: #333333;
      }

      .btn-info-no-tickte.btn-info-1 {
        width: 466px;
        justify-content: flex-start;
        text-indent: 22px;
      }

      .btn-info-no-tickte.btn-info-2 {
        width: 228px;
      }

      .btn-info-no-tickte.btn-info-3 {
        width: 148px;
      }

      .btn-del {
        text-align: center;
        line-height: 40px;
        width: 48px;
        height: 48px;
        color: #fffffe;
        background: #fff;
        border-radius: 6px;
        font-size: 40px;
        cursor: pointer;

        .btn-del-img-off {
          width: 28px;
          height: 28px;
          margin-top: 10px;
        }

        .btn-del-img-show {
          width: 24px;
          height: 24px;
          margin-top: 12px;
        }
      }
    }

    .info-wrapper {
      width: 384px;
      //max-height: 480px;
      border-radius: 6px;
      margin: 0 8px 10px 10px;
      overflow-y: auto;
      overflow-x: hidden;

      .info-content {
        width: 384px;
      }

      // S 滚动条样式
      &::-webkit-scrollbar {
        width: 4px; // 滚动条宽度
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
      }

      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.1);
      }

      // E 滚动条样式
    }

    .prompt {
      margin: 10px auto;
      width: 374px;
      height: 68px;
      font-size: 18px;
      font-weight: 400;
      color: rgba(51, 51, 51, 0.6);
      line-height: 24px;
      text-align: justify;
    }
  }

  .prompt {
    margin: 10px auto;
    width: 466px;
    height: 48px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(51, 51, 51, 0.6);
    line-height: 24px;
    text-align: justify;
  }

  .nav-info-box-noPosition {
    width: 490px;
    position: relative;
    top: auto;
    left: auto;
    background: #f1f1f1;
    border-radius: 20px;
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0);
    height: 650px;

    .top {
      margin-bottom: 12px;

      .btn-info {
        font-size: 26px;
        height: 56px;
      }
    }

    .info-wrapper {
      width: 466px;
      margin: auto;
      max-height: 556px;

      .info-content {
        width: 100%;
      }
    }

    .info-wrapper-noPrompt {
      max-height: 560px;
      margin: auto;
    }

    .prompt {
      margin: 10px auto;
      width: 466px;
      height: 48px;
      font-size: 18px;
      font-weight: 400;
      color: rgba(51, 51, 51, 0.6);
      line-height: 24px;
      text-align: justify;
    }
  }
}

@media screen and (max-width: 1080px) {
  .nav-info-box-show {
    transition: height 0.4s;
    width: 400px;
    // max-height: 592px;
  }
  .nav-info-box-hidden {
    transition: height 0.4s;
    width: 400px;
    height: 68px;
  }
  .nav-info-box {
    position: absolute;
    top: 40px;
    left: 30px;
    background: #f1f1f1;
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    overflow: hidden;
    .top {
      @include flexStyle(space-between, flex-start);

      height: 68px;
      padding: 10px;

      .btn-info {
        @include flexStyle();
        width: 100px;
        height: 48px;
        background: #dbdbdb;
        border-radius: 6px;
        font-size: 22px;
        font-weight: bold;
        color: rgba(51, 51, 51, 0.3);
        cursor: pointer;
      }

      .btn-info-1 {
        flex: 1;
        margin-right: 8px;
        text-indent: 24px;
        justify-content: flex-start;
      }
      .btn-info-2 {
        width: 158px;
      }

      .btn-info-3 {
        width: 100px;
      }

      .btn-active {
        background: #fffffe;
        color: #333333;
      }

      .btn-del {
        text-align: center;
        line-height: 40px;
        width: 48px;
        height: 48px;
        color: #fffffe;
        background: #fff;
        border-radius: 6px;
        font-size: 40px;
        cursor: pointer;
        .btn-del-img-off {
          width: 28px;
          height: 28px;
          margin-top: 10px;
        }
        .btn-del-img-show {
          width: 24px;
          height: 24px;
          margin-top: 12px;
        }
      }
    }
    .info-wrapper {
      width: 384px;
      max-height: 516px;
      margin: 0 8px 10px 10px;
      overflow-y: auto;
      .info-content {
        width: 376px;
      }
      // S 滚动条样式
      &::-webkit-scrollbar {
        width: 4px; // 滚动条宽度
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
      }
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.1);
      }
      // E 滚动条样式
    }
  }
}
</style>
