<template>
  <div>
    <div v-if="data.isShowDialog" class="dialog">
      <van-dialog
        v-model:show="data.isShowDialog"
        :show-confirm-button="false"
        @closed="dialogCloseCb"
      >
        <div v-if="!data.resultStatus" class="dialog-phone-wrapper">
          <div class="dialog-title">反馈人联系方式</div>
          <van-form class="mt80" @submit="submit">
            <van-cell-group>
              <van-field
                id="userName"
                v-model="data.userName"
                label="&nbsp;&nbsp;姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 名"
                name="姓名"
                :class="data.eventId == 'userName' && 'currentInput'"
                placeholder=""
                readonly
                @click="openKeyBoard"
              ></van-field>
              <van-field
                id="mobile"
                v-model="data.mobile"
                :class="data.eventId == 'mobile' && 'currentInput'"
                :rules="[
                  {
                    required: true,
                    validator: phoneValidator,
                    message: phoneMessage
                  }
                ]"
                label="联系电话"
                placeholder=""
                required
                readonly
                @click="openKeyBoard"
              ></van-field>
            </van-cell-group>
            <div class="btn-wrapper">
              <button class="dialog-button" native-type="submit">
                提交反馈
              </button>
              <button class="dialog-button border" @click="closeDialog">
                取消
              </button>
            </div>
          </van-form>
        </div>
        <div v-if="data.resultStatus" class="dialog-result-wrapper">
          <div class="result">
            <img
              :src="getImgSrc(data.resultData[data.resultStatus].imgUrl)"
              alt=""
            />
            <div class="tip">{{ data.resultData[data.resultStatus].tip }}</div>
          </div>
          <p class="back-tip">{{ data.timeSeconds }}s后自动返回首页</p>
        </div>
      </van-dialog>
    </div>

    <div class="area">
      <div class="area-act input">
        <c-scrollbar>
          <van-field
            id="textarea"
            v-model="data.message"
            autosize
            placeholder="请点击右侧按钮，选择输入方式，输入完成后，点击下一步进行提交"
            show-word-limit
            type="textarea"
            readonly
            @click="openKeyBoard"
          />
          <!--          @blur="closeKeyBoard"-->
        </c-scrollbar>
        <div
          v-if="data.message.length > 0"
          class="clear-btn"
          @click="clearMessage"
        >
          <i class="icon icon_clear"></i>&nbsp;清空内容
        </div>
      </div>
      <div class="area-act btn">
        <div
          :class="{ active: data.audioStatus === data.AUDIOSTATUS.LISTENING }"
          class="button"
          @click="changeAudio"
        >
          <i
            :class="[
              'icon',
              data.audioStatus === data.AUDIOSTATUS.PAUSE
                ? data.audioBtn.init.iconName
                : data.audioBtn.over.iconName
            ]"
            class="mr10"
          ></i
          >{{
            data.audioStatus === data.AUDIOSTATUS.PAUSE
              ? data.audioBtn.init.name
              : data.audioBtn.over.name
          }}
        </div>
        <div class="button" @click="changeAudio(true)">
          <i key="" class="icon icon_keyboard mr10"></i>
          键盘输入
        </div>
        <div
          :class="{ active: data.message.length > 0 }"
          class="button-next"
          @click="showDialog"
        >
          下一步
        </div>
      </div>
    </div>
  </div>
  <div
    v-show="data.isShowKeyboard"
    class="simple-keyboard"
    style="
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: none;
    "
    @click="cancelEvent"
  ></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, watch } from 'vue';
import { Dialog } from 'vant';
import 'vant/es/dialog/style/index.js';
import { useRouter } from 'vue-router';
import { CScrollbar } from 'c-scrollbar';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import layout from 'simple-keyboard-layouts/build/layouts/chinese.js';
import { SecCounter } from '@/utils/tool';
import Protocol from '@/mixins/protocol.ts';

const AUDIOSTATUS = {
  PAUSE: 'pause',
  LISTENING: 'listening'
};
const $router = useRouter();
const props = defineProps({
  inputText: String
});
const VanDialog = Dialog.Component;
const data = reactive({
  AUDIOSTATUS,
  audioBtn: {
    init: {
      iconName: 'icon_speech',
      name: '语音输入'
    },
    over: {
      iconName: 'icon_stop',
      name: '停止语音识别'
    }
  },
  userName: '',
  mobile: '',
  isShowDialog: false,
  resultData: {
    success: {
      imgUrl: 'icon_success2@2x.png',
      tip: '反馈提交成功'
    },
    fail: {
      imgUrl: 'icon_fail2@2x.png',
      tip: '反馈提交失败'
    }
  },
  resultStatus: '',
  message: '',
  timeSeconds: 3,
  audioStatus: 'pause',
  isShowKeyboard: false,
  eventId: 'textarea',
  keyboard: null
});
const submit = obj => {
  console.log(obj);
  // 数据校验
  data.resultStatus = 'success'; // 'fail'
  // 倒计时
  const timer = new SecCounter();
  timer.countStart(3, time => {
    if (time === 0) {
      data.isShowDialog = false;
      if (data.resultStatus === 'success') {
        data.message = '';
      }
      data.userName = '';
      data.mobile = '';
      // 返回首页
      $router.push({
        name: 'welcome2'
      });
    }
    data.timeSeconds = time;
  });
};
const getImgSrc = name => {
  return new URL(`/src/assets/${name}`, import.meta.url).href;
};
const openKeyBoard = event => {
  if (window.config.isCustomKeyboard) {
    data.eventId = event.target.id;
    let inputName = data.eventId;
    data?.keyboard?.setOptions({
      inputName
    });
    data.isShowKeyboard = true;
  } else {
    window.bridge.showKeyboard();
  }

  data.audioStatus = AUDIOSTATUS.PAUSE;
};
const closeKeyBoard = () => {
  if (data.isShowKeyboard) {
    data.isShowKeyboard = false;
  } else {
    window.bridge.hideKeyboard();
  }
};
const clearMessage = () => {
  data.message = '';
  data.keyboard.setInput('', 'textarea');
};
const showDialog = () => {
  data.isShowDialog = true;
  data.isShowKeyboard = true;
  data.audioStatus = AUDIOSTATUS.PAUSE;
};
const closeDialog = () => {
  data.isShowDialog = false;
};
const dialogCloseCb = () => {
  data.resultStatus = '';
};
const changeAudio = (isClose = false) => {
  console.log('changeAudio -- ' + isClose);
  if (isClose === true) {
    if (data.audioStatus === AUDIOSTATUS.LISTENING) {
      data.audioStatus = AUDIOSTATUS.PAUSE;
    }
    if (window.config.isCustomKeyboard) {
      data.isShowKeyboard = true;
    } else {
      window.bridge.showKeyboard();
    }
    return;
  }

  if (data.audioStatus === AUDIOSTATUS.LISTENING) {
    data.audioStatus = AUDIOSTATUS.PAUSE;
  } else {
    data.audioStatus = AUDIOSTATUS.LISTENING;
  }
};
const phoneValidator = val => {
  if (val) {
    const reg = /^[1][3,4,5,7,8][0-9]\d{8}$/;
    return reg.test(val);
  } else {
    return false;
  }
};
const phoneMessage = val => {
  if (val) {
    const reg = /^[1][3,4,5,7,8][0-9]\d{8}$/;
    if (!reg.test(val)) {
      return '请填写正确格式手机号';
    } else {
      return '';
    }
  } else {
    return '请填写联系电话';
  }
};
const cancelEvent = event => {
  event.stopPropagation();
};
const initKeyboard = () => {
  data.keyboard = new Keyboard({
    onChange: function (input) {
      console.log(input);
      if (data.eventId === 'textarea') {
        // data.keyboard.setInput(input, 'textarea');
        data.message = input;
      } else if (data.eventId === 'userName') {
        // data.keyboard.setInput(input, 'userName');
        data.userName = input;
      } else {
        // data.keyboard.setInput(input, 'mobile');
        data.mobile = input;
      }
    },
    ...layout
  });
};
const clickfn = event => {
  console.log(event);
  if (!event) return;
  let classList = [...event.target.classList];
  if (
    !classList.includes('van-field__control') &&
    !classList.includes('button') &&
    data.isShowKeyboard
  ) {
    data.isShowKeyboard = false;
  }
};
watch(
  () => props.inputText,
  val => {
    if (val && data.audioStatus === AUDIOSTATUS.LISTENING) {
      console.log(val);
      console.log(data.keyboard);
      data.message = data.message + val;
      data?.keyboard?.setInput(data.message, 'textarea');
    }
  }
);
onMounted(() => {
  window?.bridge?.keepSilence(true);
  const { firstLoad } = Protocol();
  firstLoad();
  window.config.isCustomKeyboard && initKeyboard();
  document.body.addEventListener('click', clickfn);
});
onBeforeUnmount(() => {
  window?.bridge?.keepSilence(false);
  document.body.removeEventListener('click', clickfn);
});
</script>
<style lang="scss" scoped>
.area {
  display: flex;
  justify-content: space-between;
  padding: 0 30px 24px;
  height: 100%;

  &-act {
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    height: 650px;
  }

  &-act.input {
    position: relative;
    width: 1280px;
    height: 100%;
    padding: 15px 15px 95px;

    :deep(.van-field__control) {
      font-size: 30px;
      color: #333333;
      line-height: 45px;
      min-height: 450px;

      &::placeholder {
        color: rgba(51, 51, 51, 0.6);
      }
    }

    .clear-btn {
      position: absolute;
      bottom: 20px;
      right: 30px;
      width: 188px;
      height: 60px;
      background: #f4f4f4;
      border-radius: 34px;
      font-size: 26px;
      color: #666666;
      line-height: 60px;
      text-align: center;
    }
  }

  &-act.btn {
    position: relative;
    width: 490px;
    height: auto;
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 370px;
    height: 110px;
    background: linear-gradient(180deg, #edf3ff 0%, #d4deff 100%);
    box-shadow: 0px 4px 5px 0px rgba(107, 137, 251, 0.4);
    border: none;
    border-radius: 20px;
    font-size: 36px;
    font-weight: 500;
    color: #4868c1;
    line-height: 54px;
    margin: 60px;

    &.active {
      background: linear-gradient(360deg, #6f99ff 0%, #5687fc 100%);
      box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
      color: #fff;
    }
  }

  .button-next {
    position: absolute;
    bottom: 30px;
    left: 30px;
    width: 430px;
    height: 88px;
    background: #d6d7db;
    border-radius: 44px;
    font-size: 30px;
    font-weight: 500;
    color: #ffffff;
    line-height: 88px;
    text-align: center;

    &.active {
      background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
      box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
    }
  }
}

.dialog {
  :deep(.van-dialog) {
    width: 944px;
    height: 624px;
    background: #ffffff;
    border-radius: 30px;
  }

  &-title {
    font-size: 36px;
    font-weight: bold;
    color: #4868c1;
    line-height: 54px;
    margin-top: 60px;
    text-align: center;
  }

  .btn-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 100px;
    // padding: 0 120px;
  }

  &-button {
    display: block;
    border: none;
    width: 332px;
    height: 88px;
    line-height: 88px;
    background: linear-gradient(360deg, #5687fc 0%, #6f99ff 100%);
    box-shadow: 0px 4px 5px 0px rgba(86, 135, 252, 0.4);
    border-radius: 44px;
    font-size: 36px;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
  }

  &-button.border {
    background: #fcfcfc;
    border-radius: 44px;
    border: 3px solid #85a9ff;
    color: #4868c1;
    box-shadow: none;
  }

  :deep(.van-form) {
    padding: 0 120px;
  }

  :deep(.van-cell) {
    overflow: visible;
    margin-top: 40px;
    padding: 0;
  }

  :deep(.van-field__label) {
    font-size: 30px;
    font-weight: 400;
    color: #333333;
    line-height: 80px;
  }

  :deep(.van-cell__value) {
    width: 520px;
    height: 80px;
    //background: #f4f5f9;
    background: #fff;
    border-radius: 10px;
    border: 2px solid #d6d9df;
  }

  :deep(.van-field__body) {
    height: 100%;
  }

  :deep(.van-field__control) {
    font-size: 30px;
    font-weight: 400;
    color: #333333;
    line-height: 45px;
    padding: 0 30px;
  }

  :deep(.van-field__error-message) {
    padding-top: 10px;
    font-size: 22px;
  }
}

.dialog-result-wrapper {
  img {
    width: 160px;
    margin-right: 40px;
  }

  .tip {
    width: 264px;
    height: 44px;
    font-size: 44px;
    font-weight: bold;
    color: #4868c1;
    line-height: 66px;
  }

  .result {
    display: flex;
    align-items: center;
    margin-top: 176px;
    padding: 0 240px;
  }

  .back-tip {
    position: absolute;
    bottom: 80px;
    left: 0;
    right: 0;
    font-size: 30px;
    font-weight: 400;
    color: rgba(51, 51, 51, 0.6);
    line-height: 45px;
    text-align: center;
  }
}

:deep(.hg-theme-default) {
  padding: 0;
}
:deep(.hg-theme-default .hg-button) {
  height: 50px;
}
:deep(.hg-rows) {
  background: #ececec;
  padding: 5px;
}
:deep(.hg-candidate-box) {
  position: sticky;
  margin-top: auto;
  transform: none;
}
.currentInput {
  :deep(.van-field__value) {
    border-color: rgba(24, 144, 255, 0.2);
    box-shadow: 0 0 0 0.01852rem rgba(24, 144, 255, 0.2);
  }
}
</style>
