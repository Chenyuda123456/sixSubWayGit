<template>
  <VueDragResize
    id="humanBox"
    style="cursor: pointer; z-index: 99999"
    :is-active="false"
    :w="340"
    :h="410"
    :x="data.left"
    :y="data.top"
    :parent-limitation="true"
    :is-resizable="false"
    @mousedown="startRecord()"
    @touchstart="startRecord()"
  >
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
      "
    >
      <div class="humanBox">
        <video id="localVideo" style="display: none"></video>
        <video
          id="remoteVideo"
          :style="{
            visibility: meetingStatus == 2 && false ? 'visible' : 'hidden'
          }"
          style="
            display: none;
            position: absolute;
            left: 100px;
            top: 300px;
            width: 340px;
            height: 200px;
            z-index: 9999;
          "
        ></video>
        <div class="humanBox-t flex justify-between">
          <div class="name">人工客服</div>
          <div class="close" @touchend="closeHuman" @mouseup="closeHuman">
            关闭
          </div>
        </div>
        <div class="human">
          <div v-if="meetingStatus === 3" class="comment-box">
            <div class="comment-title">
              <i class="icon icon-myd"></i>&nbsp;&nbsp;满意度调查
            </div>
            <div class="comment-title-sub">
              <a-divider>请问您对刚才的服务满意吗？</a-divider>
            </div>
            <div>
              <ul class="comment-wrapper">
                <li
                  v-for="(item, index) in commentList"
                  :key="index"
                  @mouseup="comment(index)"
                  @touchend="comment(index)"
                >
                  <img
                    :src="[
                      data.currentIndex === index
                        ? getImgSrc(item.activeUrl)
                        : getImgSrc(item.imgUrl)
                    ]"
                    alt=""
                    class="comment-icon"
                  />
                  <div class="comment">{{ item.comment }}</div>
                </li>
              </ul>
            </div>
            <p class="back-tip">{{ data.closeTime }}s后自动关闭</p>
          </div>
          <div v-else class="text-center">
            <!--视频展示，头像不展示-->
            <img
              alt="客服"
              class="img-kefu img-mt"
              src="@/assets/icon_service2.png"
            />
            <div class="tip-mt f36 color-gray text-center">
              <p>
                {{ phoneState }}
              </p>
              <p v-show="meetingStatus !== 0">
                {{ callTimer ? callTimer.timeStr : '00:00:00' }}
              </p>
            </div>
            <!-- E 通话提示语 -->
            <div class="btn-mt">
              <button
                v-if="meetingStatus === 1"
                class="btn-call btn-call-wait"
                @touchend="hangup('touchend')"
                @mouseup="hangup('mouseup')"
              >
                <i class="icon icon-revert"></i>
                <span>{{ btnText }}</span>
              </button>
              <button
                v-else-if="meetingStatus === 2"
                class="btn-call btn-call-wait"
                @touchend="hangup('touchend')"
                @mouseup="hangup('mouseup')"
              >
                <i class="icon icon-hangup"></i>
                <span>{{ btnText }}</span>
              </button>
              <!--        :class="[
              isRegistered && !hangTimer ? 'btn-call-default' : 'btn-call-disable'
              ]"-->
              <button
                v-else
                class="btn-call btn-call-default"
                @touchend="innerCall('touch')"
                @mouseup="innerCall('click')"
              >
                <i class="icon icon-phone"></i>
                <span>{{ btnText }}</span>
              </button>
            </div>
          </div>
        </div>
        <div
          class="tip"
          style="
            text-align: center;
            position: absolute;
            width: 100%;
            bottom: 10px;
          "
        >
          <div>人工客服坐席时间为 07:00-22:00</div>
          <div>非人工客服时段，请联系车站工作人员</div>
        </div>
      </div>
    </div>
  </VueDragResize>
</template>

<script setup>
import VueDragResize from 'vue-drag-resize-via';
import Protocol from '@/mixins/protocol.ts';
import humanService from '@/service/HumanService';
import { useStore } from 'vuex';
import {
  computed,
  watch,
  reactive,
  getCurrentInstance,
  onBeforeUnmount
} from 'vue';
import { SecCounter, SecTimer } from '@/utils/tool';
import { useRouter } from 'vue-router';
const { firstLoad, onShortcut } = Protocol();
const store = useStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
firstLoad(['onShortcut', 'onBuyTickets']);
const data = reactive({
  currentIndex: null,
  closeTimer: '',
  closeTime: 10,
  left: store.state.isWidthScreen ? 1568 : 740,
  top: store.state.isWidthScreen ? 618 : 140,
  offsetLeft: 0,
  offsetTop: 0
});
const commentList = [
  {
    imgUrl: 'icon_emoji1@2x.png',
    activeUrl: 'icon_emoji1_s@2x.png',
    comment: '很不满意'
  },
  {
    imgUrl: 'icon_emoji2@2x.png',
    activeUrl: 'icon_emoji2_s@2x.png',
    comment: '不满意'
  },
  {
    imgUrl: 'icon_emoji3@2x.png',
    activeUrl: 'icon_emoji3_s@2x.png',
    comment: '一般'
  },
  {
    imgUrl: 'icon_emoji4@2x.png',
    activeUrl: 'icon_emoji4_s@2x.png',
    comment: '满意'
  },
  {
    imgUrl: 'icon_emoji5@2x.png',
    activeUrl: 'icon_emoji5_s@2x.png',
    comment: '很满意'
  }
];

// console.log(JSON.parse(window?.bridge?.getDiagCache()));
// console.log(store.state.human.DN);

let startRecord = () => {
  console.log('mouseDown--执行');
  let ele = document.documentElement.querySelector('#humanBox');
  data.offsetLeft = ele.offsetLeft;
  data.offsetTop = ele.offsetTop;
  console.log('data.offsetLeft', data.offsetLeft);
  console.log('data.offsetTop', data.offsetTop);
};
const innerCall = async type => {
  console.log(type);
  let ele = document.documentElement.querySelector('#humanBox');
  if (ele.offsetLeft !== data.offsetLeft || ele.offsetTop !== data.offsetTop) {
    return;
  }
  console.log(store.state.human.DN);
  // 获取智能对话前10条记录
  let list = JSON.parse?.(window?.bridge?.getDiagCache?.()) || [];
  console.log(list);
  let res = await humanService.sendInfo({
    stationId: store.state.human.DN,
    stationName: window.bridge.getDefaultSite(),
    ext: store.state.human.DN,
    content: list
  });
  if (res.status === 200) {
    console.log('innerCall');
    store.commit('innerCall');
  } else {
    proxy.$subwayInfo.normalInfo(res.message);
  }
};
const hangup = type => {
  console.log(type);
  let ele = document.documentElement.querySelector('#humanBox');
  if (ele.offsetLeft !== data.offsetLeft || ele.offsetTop !== data.offsetTop) {
    return;
  }
  store.commit('hangup');
};
let hangTimer = computed(() => store.state.human.hangTimer);
let isRegistered = computed(() => store.state.human.isRegistered);
let callId = computed(() => store.state.human.callId);
let meetingStatus = computed(() => store.getters.humanMeetingStatus);
let btnText = computed(() => store.getters.humanBtnText);
let callTimer = computed(() => store.getters.humanCallTimer);
let phoneState = computed(() => store.getters.humanPhoneState);
watch(
  () => meetingStatus.value,
  val => {
    if (val === 0) {
      // 关闭通话计时
      store.state.human.callTimer && store.state.human.callTimer.countStop();
      store.state.human.registerTimer &&
        store.state.human.registerTimer.countStop();
      // 开启圆圈倒计时
    } else if (val === 2) {
      store.state.human.registerTimer &&
        store.state.human.registerTimer.countStop();
      // 开始通话计时
      store.state.human.callTimer && store.state.human.callTimer.countStop();
      store.state.human.callTimer = new SecTimer();
      store.state.human.callTimer.countStart();
      // 等待接听
    } else if (val === 1) {
      store.state.human.registerTimer = new SecCounter();
      store.state.human.registerTimer.countStart(120, second => {
        if (second === 0) {
          store.commit('hangup');
        }
      });
    } else if (val == 3) {
      // 关闭通话计时
      store.state.human.callTimer && store.state.human.callTimer.countStop();
      data.closeTimer && data.closeTimer.countStop();
      data.closeTimer = new SecCounter();
      data.closeTimer.countStart(10, second => {
        data.closeTime = second;
        if (second === 0) {
          store.commit('setHumanShow', false);
        }
      });
    }
  },
  {
    immediate: false
  }
);

const closeHuman = () => {
  let ele = document.documentElement.querySelector('#humanBox');
  if (ele.offsetLeft !== data.offsetLeft || ele.offsetTop !== data.offsetTop) {
    return;
  }
  if (meetingStatus.value == 1 || meetingStatus.value == 2) {
    proxy.$subwayInfo.normalInfo('请先挂断电话！');
  } else {
    store.commit('setHumanShow', false);
  }
};
// 提交评价
const comment = async index => {
  let ele = document.documentElement.querySelector('#humanBox');
  if (ele.offsetLeft !== data.offsetLeft || ele.offsetTop !== data.offsetTop) {
    return;
  }
  data.currentIndex = index;
  const { status, message } = await humanService.sendSatisfaction({
    callid: callId.value,
    satisfaction: (index + 1).toString()
  });
  if (status === 200) {
    proxy.$subwayInfo.normalInfo('感谢您的评价！');
    closeHuman();
  } else {
    proxy.$message.error(message);
  }
};
const getImgSrc = name => {
  return new URL(`/src/assets/${name}`, import.meta.url).href;
};
onBeforeUnmount(() => {
  store.state.human.callTimer && store.state.human.callTimer.countStop();
  data.closeTimer && data.closeTimer.countStop();
  store.state.human.registerTimer &&
    store.state.human.registerTimer.countStop();
});
</script>

<style lang="scss" scoped>
@import 'src/styles/variable';

.humanBox {
  background: #fff;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  height: 100%;
  width: 100%;
  .humanBox-t {
    padding: 10px 10px 0;
    align-items: center;
    .name {
      font-size: 18px;
    }
    .close {
      font-size: 14px;
      padding: 4px 8px;
    }
  }
  .btn-call {
    width: 160px;
    height: 60px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
    color: $--subway-color-white1;
    border: none;
    border-radius: 50px;
    &.btn-call-default {
      background: linear-gradient(180deg, #7ed36e 0%, #42a84b 100%);
      box-shadow: 0px 8px 20px 4px rgba(123, 209, 109, 0.6);
    }

    .btn-call-disable {
      background: #d6d7db;
      pointer-events: none;
    }
    &.btn-call-wait {
      background: linear-gradient(180deg, #ff7c7c 0%, #de3f3f 100%);
      box-shadow: 0px 8px 20px 4px rgba(245, 108, 108, 0.4);
    }
  }

  .img-mt {
    margin-top: 20px;
    width: auto;
    height: 100px;
  }

  .tip-mt {
    display: flex;
    flex-direction: column;
    height: 100px;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    padding: 0 46px;
    font-weight: 400;
    color: #333333;
    line-height: 30px;
  }

  .backtip {
    margin-top: 50px;
    font-size: 24px;
    font-weight: 400;
    color: #666666;
    line-height: 24px;
  }

  .comment-box {
    margin: 0 auto;
    padding: 0 20px;
    padding-top: 40px;

    .comment-title {
      font-size: 20px;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      text-align: center;
      .icon {
        width: 24px;
        height: 24px;
        margin-top: -4px;
      }
    }

    .comment-title-sub {
      font-size: 16px;
      color: rgba(51, 51, 51, 0.6);
      line-height: 45px;
      margin-top: 10px;
      :deep(.ant-divider-inner-text) {
        padding: 0 5px;
      }
    }

    :deep(.ant-divider-horizontal.ant-divider-with-text::before) {
      border-top-color: #bebebe;
    }

    :deep(.ant-divider-horizontal.ant-divider-with-text::after) {
      border-top-color: #bebebe;
    }
    .comment-wrapper {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .comment-icon {
        width: 28px;
      }
      li {
        flex: 1;
        text-align: center;
        .comment {
          font-size: 14px;
          color: rgba(51, 51, 51, 0.6);
          line-height: 30px;
          margin-top: 10px;
          text-align: center;
        }
      }
    }
    .back-tip {
      margin-top: 40px;
      text-align: center;
    }
  }
}
</style>
