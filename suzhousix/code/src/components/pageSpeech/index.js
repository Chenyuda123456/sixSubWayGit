import { getCurrentInstance, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ttsCommon from '@/components/tts/index.js';

export default function pageSpeechCommon(props, context) {
  let $router = useRouter();
  let route = reactive(useRoute());
  const { proxy } = getCurrentInstance();
  const { state, onAsrResult, onDMResult } = ttsCommon();
  state.guideTip = props.guideTip;
  // 根据外部传入属性初始化语音数据
  watch(
    () => props.inputText,
    val => {
      console.log(window.onAsrResult);
      val &&
        onAsrResult(
          'context.input.text',
          JSON.stringify({
            var: val
          }),
          0
        );
      console.log(state.speech.gifState);
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.outputContent,
    val => {
      if (val && !props.message) {
        onAsrResult(
          'context.output.text',
          JSON.stringify({
            content: 0,
            text: val
          }),
          null
        );
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.message,
    val => {
      if (val && !props.outputContent) {
        onDMResult(val, true);
      }
    },
    {
      deep: true,
      immediate: true
    }
  );
  // 当前是咨询子页面，闲聊模式隐藏中间内容
  watch(
    () => state.speech,
    val => {
      if (
        (route.name == 'welcome2' && val.talkType === 'chat') ||
        (!val.emptyIntent &&
          val.talkType == 'chat' &&
          route.name !== 'ttschat' &&
          (val.outputContent || val.message) &&
          state.isShowTTS)
      ) {
        $router.push({
          name: 'ttschat',
          query: {
            inputText: val.inputText,
            outputContent: val.outputContent,
            message: JSON.stringify(val.message)
          }
        });
      }
      /*    if (
        route.path.indexOf('card') > -1 ||
        route.name == 'feedback' ||
        route.name == 'menubuy'
      ) {
        if (!val.emptyIntent && val.talkType == 'chat') {
          $router.push({
            name: 'ttschat',
            query: {
              inputText: val.inputText,
              outputContent: val.outputContent,
              message: JSON.stringify(val.message)
            }
          });
        }
      } else if (route.name !== 'ttsChat' && val.talkType === 'chat') {
        $router.push({
          name: 'ttschat',
          query: {
            inputText: val.inputText,
            outputContent: val.outputContent,
            message: JSON.stringify(val.message)
          }
        });
      }*/

      // 抛出结束状态的inputText
    },
    {
      deep: true
    }
  );
  watch(
    () => state.speech.textType,
    val => {
      if (state.speech.inputText && val === 1) {
        console.log(state.speech.inputText, val);
        console.log('speech-returnBtnInit');
        context.emit('update', state.speech.inputText);
        if (context.attrs.onReturnBtnInit) {
          context.emit('returnBtnInit');
        }
      }
    }
  );
  watch(
    () => props.recommends,
    val => {
      val && state.speech.setRecommends(val);
    },
    {
      deep: true,
      immediate: true
    }
  );
  return {
    state
  };
}
