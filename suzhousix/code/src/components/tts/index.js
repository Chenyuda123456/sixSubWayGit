/*
 *@description: tts公共逻辑
 */
import {
  reactive,
  onMounted,
  createApp,
  getCurrentInstance,
  watch,
  onBeforeUnmount
} from 'vue';
import $ from 'jquery';
import { useRoute, useRouter } from 'vue-router';
import TtsHandler from './ttsHandler.js';
import ttsText from './TtsText';
import ttsContent from './TtsContent';
import subwayInfo from '@/components/buyTicket/BuyTicketMessages.js';
import i18n from '@/lang';
export default function ttsCommon() {
  const state = reactive({
    guideTip: '', // 从props获取
    speech: new TtsHandler(),
    isShowTTS: false,
    isShowRecommends: true,
    text: null,
    talkType: '',
    message: null,
    asrTimer: ''
  });

  const routeRes = useRoute();
  // 获取语音内容
  const onAsrResult = (method, msg, type, isTicketModule = false) => {
    console.log('执行的commonjs', method, msg, type);
    msg = JSON.parse(msg);
    // 设置语音输出内容
    if (method === 'context.output.text') {
      if (msg && msg.length !== 0) {
        console.log(routeRes);
        console.log(msg);
        window['sendLog']({ type: 'speech', output: msg.text });
        const talkType =
          msg.content !== undefined && msg.content !== 1 ? 'chat' : 'designed';
        state.speech.output({
          talkType,
          emptyIntent: msg.emptyIntent,
          content: msg.text,
          callback: () => {
            state.text && state.text.unmount();
            if (isTicketModule && talkType === 'designed') {
              subwayInfo.normalInfo(msg.text);
            } else {
              if (talkType === 'chat' && routeRes.name === 'ttschat') {
                state.text = createApp(ttsContent, {
                  text: msg.text,
                  message: null
                });
                state.text.mount('#ttsContent');
                return;
              }
              if (talkType === 'designed') {
                state.text = createApp(ttsText, {
                  text: msg.text,
                  message: null
                });
                return;
              }
            }
          }
        });
        state.speech.setGifState('unwakenend');
      } else {
        // 不显示tts 不隐藏页面 做重置操作
        state.isShowTTS = false;
        // vm.parent.ctx.state.isShowView = true
      }
      return;
    }
    // 设置语音输入内容
    if (method === 'context.input.text') {
      state.speech.setGifState('listening');
      if (type === 0 && msg.var) {
        let length = msg.var.length;
        if (length > 24) {
          state.speech.input({
            text: msg.var.substring(length - 24, length),
            textType: 0
          });
        } else {
          state.speech.input({
            text: msg.var,
            textType: 0
          });
        }
      } else if (type === 1 && msg.text) {
        window['sendLog']({ type: 'speech', input: msg.text });
        state.speech.input({
          text: msg.text,
          textType: 1
        });
      }
      // 隐藏推荐语，显示语音内容
      state.asrTimer && clearTimeout(state.asrTimer);
      state.isShowRecommends = false;
      state.isShowTTS = true;
      // 不是智能客服页面过一秒显示推荐语
      if (routeRes.name !== 'ttschat' && msg.eof == 1) {
        // console.log(state.speech.recommends);
        // console.log(routeObj);
        state.asrTimer = setTimeout(() => {
          state.isShowRecommends = true;
          state.isShowTTS = false;
          state.speech.inputText = '';
        }, 1000);
      }
    }
  };

  // 获取当前页面推荐语
  const onRecommends = ({ pageKey = '', msg = [], isClear = false }) => {
    console.log('onRecommends==', pageKey, msg);
    // 获取配置默认推荐语
    const getRecommendList = () => {
      try {
        let recommendList = window.sessionStorage.getItem('recommendList');
        if (window.bridge && recommendList == null) {
          recommendList =
            i18n.global.locale === 'en' && window?.bridge?.enRecommendations
              ? window?.bridge?.enRecommendations()
              : window?.bridge?.getDefaultRecommendations();
          window.sessionStorage.setItem('recommendList', recommendList);
        }
        // console.log(recommendList);
        return JSON.parse(window.sessionStorage.getItem('recommendList'));
      } catch (error) {
        console.log(error);
      }
    };
    if (isClear && msg.length === 0) {
      // 咨询页清空数据
      state.speech.setRecommends([]);
      // 显示语音内容，隐藏推荐语
      state.isShowTTS = true;
      state.isShowRecommends = false;
    } else {
      const recommendList = getRecommendList();
      if (!recommendList) return;
      const routeRecommends = recommendList[pageKey];
      if (msg && msg.length > 0) {
        // 动态推荐语
        state.speech.setRecommends(msg);
      } else if (recommendList && routeRecommends) {
        // 默认推荐语
        state.speech.setRecommends(routeRecommends);
      }
      /*   if (
        (state.speech.recommends && state.speech.recommends.length > 0) ||
        pageKey == '人工服务'
      ) {
        console.log(state.speech.recommends);
        // 显示推荐语，隐藏语音内容
        state.isShowRecommends = true;
        state.isShowTTS = false;
      }*/
    }
  };

  const onDMResult = (data, isSource = false) => {
    const widget = typeof data === 'string' ? JSON.parse(data) : data;
    if (!isSource) {
      if (widget.type === 'text') {
        let inspire = widget.inspire.map(item => {
          return item.widget;
        });
        state.message = {
          type: 'recommends',
          title: widget.text || '',
          recommendList: inspire
        };
      } else {
        state.message = {
          type: 'pictext',
          imageUrl: window.decodeURIComponent(widget.imageUrl || ''),
          videoUrl: window.decodeURIComponent(widget.videoUrl || ''),
          title: widget.title || '',
          linkUrl: window.decodeURIComponent(widget.linkUrl || '')
        };
      }
    } else {
      state.message = widget;
    }
    state.isShowTTS = true;
    state.talkType = 'chat';
    state.speech.output({
      talkType: 'chat',
      message: state.message,
      callback: () => {
        state.text && state.text.unmount();
        state.text = createApp(ttsContent, {
          message: state.message,
          text: ''
        });
        state.text.mount('#ttsContent');
      }
    });
    state.speech.setGifState('unwakenend');
  };

  const messageDMResult = data => {
    state.isShowTTS = true;
    state.talkType = 'chat';
    state.speech.output({
      talkType: 'chat',
      message: data,
      callback: () => {
        state.text && state.text.unmount();
        state.text = createApp(ttsContent, {
          message: data,
          text: ''
        });
        state.text.mount('#ttsContent');
      }
    });
    state.speech.setGifState('unwakenend');
  };
  onMounted(() => {
    console.log('ttsCommon开始初始化');
    const route = reactive(useRoute());
    window['onAsrResult'] = (method, msg, type) => {
      // if (window.localStorage.getItem('isShowOrder') !== 'true') return;
      // console.log('protocol:asrResult:' + method, msg, type);
      onAsrResult(method, msg, type, route.name === 'menubuy');
    };
    window['onRecommends'] = recommends => {
      console.log('protocol:asrRecommends:' + recommends);
      onRecommends({ msg: recommends });
    };
    window['onStatusChange'] = status => {
      state.speech.setStatus(status); // silence listening understanding speaking
    };
    window['onDMResult'] = data => {
      onDMResult(data);
    };

    if ($('#ttsText').length === 0) {
      const parent = document.createElement('div');
      parent.setAttribute('id', 'ttsText');
      $('#app').append(parent);
    }
    if ($('#ttsContent').length === 0) {
      const parent1 = document.createElement('div');
      parent1.setAttribute('id', 'ttsContent');
      $('#app').append(parent1);
    }
  });
  onBeforeUnmount(() => {
    state.text && state.text.unmount();
  });

  return {
    state,
    onAsrResult,
    onRecommends,
    onDMResult,
    messageDMResult
  };
}
