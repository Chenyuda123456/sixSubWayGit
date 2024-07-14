// TODO: gifState talkType 数据集合list
// import { useRouter, useRoute } from 'vue-router'
export default class TtsHandler {
  constructor() {
    this.recommends = []; // 页面推荐语
    this.inputText = ''; // 说话
    this.outputContent = ''; // 返回长段内容
    this.message = null; // 返回的dmresult
    this.gifState = 'toListening'; // 记录动画状态
    this.talkType = 'designed'; // designed or chat
    this.emptyIntent = false; // designed or chat
    this.status = 'silence'; // 对话状态
    this.textType = null; // 表示输入语音状态： 中间状态0 结束状态1
    // this.$route = useRoute()
    // this.$router = useRouter()
  }

  get talkStatus() {
    return {
      isUnderstanding: this.status === 'understanding'
    };
  }

  setStatus(status) {
    this.status = status;
  }
  output({ talkType, emptyIntent, content, message, callback }) {
    this.outputContent = content;
    this.message = message;
    this.talkType = talkType;
    this.emptyIntent = emptyIntent;
    typeof callback === 'function' && callback();
  }

  input({ text = '', textType = null }) {
    this.inputText = text;
    this.outputContent = '';
    this.textType = textType; //
  }

  setRecommends(recommends = []) {
    this.recommends = recommends;
  }

  setGifState(val = '') {
    this.gifState = val;
  }
}
