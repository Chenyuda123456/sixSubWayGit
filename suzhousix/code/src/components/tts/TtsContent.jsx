import { defineComponent } from 'vue';
import './style.scss';
import { CScrollbar } from 'c-scrollbar';

export default defineComponent({
  name: 'ttsContent',
  components: {
    CScrollbar
  },
  props: {
    text: String,
    message: Object
  },
  render() {
    if (this.message) {
      return (
        <>
          <div class="tts-center">
            <div class="center-left">
              <div class="center-left-icon"></div>
              <div
                class={[
                  'center-left-content',
                  'message',
                  this.message.type == 'pictext' &&
                  !this.message.title &&
                  !this.message.imageUrl
                    ? 'active'
                    : ''
                ]}>
                <c-scrollbar class="content-card-lost-box">
                  <p
                    className="tts-content-text"
                    v-html={this.message.title}></p>
                  {this.message.type === 'pictext' && (
                    <div>
                      <img
                        src={this.message.imageUrl}
                        alt=""
                        className="message-pic"
                      />
                      <video
                        src={this.message.videoUrl}
                        className="message-pic"></video>
                      <iframe
                        src={this.message.linkUrl}
                        frameBorder="0"
                        className="message-iframe"></iframe>
                    </div>
                  )}
                  {this.message.type === 'recommends' && (
                    <ul class="tts-content-text color-blue mt30 text-left">
                      {this.message.recommendList.map((item, index) => {
                        return (
                          <li>
                            {index + 1}. {item.text}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </c-scrollbar>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div class="tts-center">
            <div class="center-left">
              <div class="center-left-icon"></div>
              <div class="center-left-content text">
                <c-scrollbar className="content-card-lost-box">
                  <div v-html={this.text}></div>
                </c-scrollbar>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
});
