<template>
  <div v-if="state.speech" class="speech-col">
    <div class="speech-col-wrapper">
      <div class="box-wrapper">
        <div class="box-wrapper-img-wrapper">
          <!-- / 语音gif -->
          <tts-gif
            v-if="!isAndroid"
            v-show="state.isShowTTS || state.isShowRecommends"
            :width="$pxToRem(160)"
            :height="$pxToRem(160)"
            :state="state.speech.gifState"
          />
          <!-- / 语音gif -->
          <img
            v-else
            style="width: 160px; height: 160px"
            src="@/assets/lyra/Lyra_combination_00000.png"
          />
          <!-- <div class="box-wrapper-desc">
            {{
              state.speech.talkStatus.isUnderstanding
                ? $t('Understanding')
                : $t('Recording')
            }}
          </div> -->
        </div>
        <div class="box-wrapper-content-wrapper">
          <div class="box-wrapper-content-title">
            <span
              v-show="
                !(
                  state.speech.inputText &&
                  state.speech.inputText.length > 0 &&
                  state.isShowTTS
                ) &&
                state.speech.recommends &&
                state.speech.recommends.length > 0
              "
            >
              {{ state.guideTip || $t('consultMoreConvient') }}
            </span>
          </div>
          <div
            v-show="
              !(
                state.speech.inputText &&
                state.speech.inputText.length > 0 &&
                state.isShowTTS
              ) &&
              state.speech.recommends &&
              state.speech.recommends.length > 0
            "
            class="box-wrapper-content-tips"
          >
            <!-- S 推荐语 -->
            <speech-tip
              v-for="(msg, index) in state.speech.recommends"
              :key="index"
              class="tip-space"
            >
              {{ msg }}
            </speech-tip>
            <!-- E 推荐语 -->
          </div>
          <div class="box-wrapper-content-tips">
            <!-- S 输入语句 -->
            <speech-tip
              v-show="
                state.isShowTTS &&
                state.speech.inputText &&
                state.speech.inputText.length > 0
              "
              class="tip-space"
              style="color: #1b72f9; max-width: 1200px"
            >
              <div class="over-text2">
                {{ state.speech.inputText }}
              </div>
            </speech-tip>
            <!-- E 输入语句 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TtsGif from '@/components/tts/TtsGif.vue';
import SpeechTip from '@/components/SpeechTip.vue';
import pageSpeechCommon from './index';
export default {
  name: 'SpeechCardCol',
  components: { TtsGif, SpeechTip },
  props: {
    inputText: String,
    outputContent: String,
    message: Object,
    recommendList: Array,
    recommends: Array,
    guideTip: String
  },
  setup(props, context) {
    let { state } = pageSpeechCommon(props, context);
    return {
      state,
      isAndroid: window.config.isAndroid
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/common';
@import 'src/styles/mixins';
.speech-col {
  @include flexStyle(space-between, center, column);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 998;
  .speech-col-wrapper {
    width: 100%;
    // background: rgba(255, 255, 255, 0.6);
    // box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.04);
    .box-wrapper {
      @include flexStyle(flex-start, center);
      // flex: 1;
      // margin: 12px 20px;
      // 左部图片
      .box-wrapper-img-wrapper {
        //width: 104px;
        // height: 140px;
        margin-left: 20px;
        .box-wrapper-img {
          // width: 104px;
          // height: 104px;
          // background: url('/src/assets/images/icon-speech-col@2x.png') no-repeat
          //   center;
          // background-size: cover;
        }
        .box-wrapper-desc {
          // 图片描述
          background-image: linear-gradient(
            90deg,
            rgba(55, 155, 254, 1) 0%,
            rgba(226, 82, 241, 1) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          @include fontStyle(24, normal);
          text-align: center;
        }
      }
      // 右边tip
      .box-wrapper-content-wrapper {
        //@include flexStyle(space-between, center, column);
        display: flex;
        flex-direction: column;
        margin-left: 12px;
        // height: 140px;
        // “您可以说”的样式
        .box-wrapper-content-title {
          @include fontStyle(30, bold);
          width: 100%;
          margin-top: 10px;
          color: #4868c1;
        }
        .box-wrapper-content-tips {
          @include flexStyle(flex-start, center, row);
          overflow: hidden;
          .tip-space {
            overflow: hidden;
            margin-right: 15px;
          }
        }
      }
    }
  }
}
.gif-poi {
  margin-top: -10px;
}
</style>
