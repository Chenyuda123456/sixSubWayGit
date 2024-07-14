import i18n from '@/lang';
import Mco from 'suplus-mco';
let userSIP = Mco.initSIP();
export default {
  state: {
    isShow: false,
    callTimer: null, // 打电话计时
    meeting: null,
    meetingStatus: 0, // 当前通话状态 0 未接通 1 等待中 2 已接通
    videoObserver: null,
    isMobile: window.config.isAndroid,
    SuplusPhone: null,
    state: '-1',
    StatusText: '离线',
    agentNumber: '8108',
    currentIndex: null,
    callId: null,
    DN: '',
    registerTimer: null,
    isRegistered: false,
    hangTimer: null,
    errTimes: 0
  },
  getters: {
    humanShow(state) {
      return state.isShow;
    },
    humanMeetingStatus(state) {
      return state.meetingStatus;
    },
    humanCallTimer(state) {
      return state.callTimer;
    },
    humanBtnText(state) {
      if (state.meetingStatus === 0) {
        return i18n.global.t('Call');
      } else if (state.meetingStatus === 1) {
        return i18n.global.t('Cancel');
      } else if (state.meetingStatus === 2) {
        return i18n.global.t('hangoff');
      } else {
        return i18n.global.t('Call');
      }
    },
    humanPhoneState(state) {
      if (state.meetingStatus === 0) {
        return i18n.global.t('pleasecallforservice');
      } else if (state.meetingStatus === 1) {
        return i18n.global.t('Waiting');
      } else if (state.meetingStatus === 2) {
        return i18n.global.t('inCalling');
      } else {
        return i18n.global.t('pleasecallforservice');
      }
    }
  },
  mutations: {
    humanSetDN(state, payload) {
      state.DN = payload;
    },
    humanInit(state, $subwayInfo) {
      console.log('注册了吗');
      const { Event } = userSIP;
      // 注册成功
      userSIP.on(Event.REGISTERED, () => {
        console.log('注册成功');
        if (!state.isRegistered) {
          state.isRegistered = true;
          console.log('registered');
        }
      });
      // 注销成功
      userSIP.on(Event.UNREGISTERED, () => {
        console.log('注销成功');
        state.isRegistered = false;
      });
      // 来电弹屏
      userSIP.on(Event.RINGING, eventData => {
        console.log(Event.RINGING, eventData);
      });
      // 回铃弹屏
      userSIP.on(Event.RINGBACK, eventData => {
        console.log(Event.RINGBACK, eventData);
        state.meetingStatus = 1;
      });
      // 挂机事件
      userSIP.on(Event.ENDED, eventData => {
        console.log('坐席挂断');
        console.log(Event.ENDED, eventData);
        window?.bridge?.hangUp?.();
        state.callTimer && state.callTimer.countStop();
        // 挂机
        if (state.meetingStatus == 2) {
          state.meetingStatus = 3;
          state.callId = eventData.call_id;
        } else {
          state.meetingStatus = 0;
        }
        state.hangTimer = setTimeout(() => {
          // 清除状态
          state.hangTimer = null;
        }, 3000);
      });
      // 接听事件
      userSIP.on(Event.ANSWER, eventData => {
        console.log('坐席接听');
        console.log(Event.ANSWER, eventData);
        state.meetingStatus = 2;
      });
      // 错误事件
      userSIP.on(Event.FAILED, eventData => {
        console.log('Event.FAILED', eventData.type);
        if (eventData.type === Event.REGISTERED) {
          console.log('注册失败 延迟10秒重新注册');
          setTimeout(() => {
            userSIP.Register({
              Url: 'wss://' + window.config.webURI + '/mcp/mq/', // 服务地址
              DNUrl: 'wss://' + window.config.webURI + '/mcp/webs/',
              DN: state.DN, // 分机号
              DNPassWord: 'Suplus#' + state.DN, // 分机密码
              Config: {
                video: { Local: 'localVideo', Remote: 'remoteVideo' },
                headers: { login: 'admin', passcode: 'Suplus#1234' }
              }
            });
          }, 10000);
        } else if (eventData.type === 'Call') {
          console.log('拨打失败再次拨打');
          state.errTimes += 1;
          if (state.errTimes > 1) {
            // console.log(Event.FAILED, eventData);
            state.meetingStatus = 0;
            state.errTimes = 0;
            $subwayInfo.normalInfo('通话异常请使用其他设备！');
          } else {
            console.log('audio 再次拨打');
            userSIP.Call(window.config.callPhone, false);
          }
        }
      });
      // 控制端同意
      userSIP.on(Event.START, () => {
        // You Code ...
      });
      // 座席端发起远程控制默认同意控制
      userSIP.on(Event.REMOTECONTROL, data => {
        // 注意：需要本地程序和在视频通话中才可以使用
        userSIP.Accept();
      });
      userSIP.Register({
        Url: 'wss://' + window.config.webURI + '/mcp/mq/', // 服务地址
        DNUrl: 'wss://' + window.config.webURI + '/mcp/webs/',
        DN: state.DN, // 分机号
        DNPassWord: 'Suplus#' + state.DN, // 分机密码
        Config: {
          video: { Local: 'localVideo', Remote: 'remoteVideo' },
          headers: { login: 'admin', passcode: 'Suplus#1234' }
        }
      });
    },
    hangup(state) {
      console.log('挂断电话');
      userSIP.Hangup();
    },
    innerCall(state) {
      state.errTimes = 0;
      if (!state.isRegistered || state.hangTimer) return;
      state.callId = null;
      window?.bridge?.makeCall?.();
      console.log(userSIP);
      console.log('userSIP.Call');
      userSIP.Call(window.config.callPhone, window.config.isCallVideo);
      state.meetingStatus = 1;
    },
    setHumanShow(state, val) {
      if (state.isShow == val) {
        return;
      } else {
        state.isShow = val;
        state.meetingStatus = 0;
      }
    }
  },
  actions: {}
};
