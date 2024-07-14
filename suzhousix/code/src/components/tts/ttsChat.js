/*
 *@description: tts公共逻辑
 */
import {
  reactive,
  onMounted,
  createApp,
  // getCurrentInstance,
  onBeforeUnmount
} from 'vue';
import TtsHandler from './ttsHandler';
import ttsContent from './TtsContent';
import $ from 'jquery';
export default function ttsCommon() {
  const state = reactive({
    guideTip: '', // 从props获取
    speech: new TtsHandler(),
    isShowTTS: false,
    isShowRecommends: true,
    text: null,
    talkType: '',
    message: null
  });

  // 获取语音内容
  const onAsrResult = (method, msg, type) => {
    console.log('执行的chatjs', method, msg, type);
    msg = JSON.parse(msg);
    // 设置语音输出内容
    if (method === 'context.output.text') {
      if (msg && msg.length !== 0) {
        state.isShowTTS = true;
        const talkType =
          // msg.content !== undefined && msg.content !== 1 ? 'chat' : 'designed'
          msg.content !== undefined ? 'chat' : 'designed';
        state.speech.output({
          talkType,
          content: msg.text,
          callback: () => {
            state.text && state.text.unmount();
            if (talkType === 'chat') {
              state.text = createApp(ttsContent, {
                text: msg.text,
                message: null
              });
              state.text.mount('#ttsContent');
              return;
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
        state.speech.input({
          text: msg.text,
          textType: 1
        });
      }
      if (state.speech.inputText && state.speech.inputText.length > 0) {
        // 隐藏推荐语，显示语音内容
        state.isShowRecommends = false;
        state.isShowTTS = true;
      }
    }
  };
  const onDMResult = data => {
    const widget = data;
    if (widget.type === 'text') {
      let inspire = widget.inspire.map(item => {
        return item.widget;
      });
      if (inspire && inspire.length > 0) {
        state.isShowTTS = true;
        state.talkType = 'chat';
        state.message = {
          type: 'recommends',
          title: widget.text || '',
          recommendList: inspire
        };
      }
    } else {
      const message = {
        type: 'pictext',
        title: widget.title || '',
        imageUrl: window.decodeURIComponent(widget.imageUrl || ''),
        videoUrl: window.decodeURIComponent(widget.videoUrl || ''),
        linkUrl: window.decodeURIComponent(widget.linkUrl || '')
      };
      if (
        message.imageUrl ||
        message.linkUrl ||
        message.videoUrl ||
        message.title
      ) {
        state.isShowTTS = true;
        state.talkType = 'chat';
        state.message = message;
      }
    }
    state.speech.output({
      talkType: 'chat',
      message: state.message,
      content: ''
    });
    state.speech.setGifState('unwakenend');
  };
  onMounted(() => {
    window['onAsrResult'] = (method, msg, type) => {
      // if (window.localStorage.getItem('isShowOrder') === 'false') return;
      console.log('protocol:asrResult:' + method, msg, type);
      onAsrResult(method, msg, type);
    };
    window['onDMResult'] = data => {
      onDMResult(data);
    };
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
    onAsrResult
  };
}
