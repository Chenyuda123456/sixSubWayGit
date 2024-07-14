import { defineComponent } from 'vue';
import SpeechTip from '@/components/SpeechTip.vue';
import './style.scss';

export default defineComponent({
  name: 'ttsText',
  components: {
    SpeechTip
  },
  props: {
    text: String
  },
  render() {
    return (
      <div>
        <div class="top-left-kefu">
          <div class="top-left-icon-kefu"></div>
          <div class="top-left-kefu-content">
            <speech-tip>
              <div v-html={this.text}></div>
            </speech-tip>
          </div>
        </div>
      </div>
    );
  }
});
