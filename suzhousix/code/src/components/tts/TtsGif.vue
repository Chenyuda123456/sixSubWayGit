<template>
  <div class="tts-gif">
    <!--    <img-->
    <!--      :style="{ width: width, height: height }"-->
    <!--      src="@/assets/lyra/Lyra_combination_00000.png"-->
    <!--    />-->
    <img :src="imageUrl" :style="{ width: width, height: height }" />
  </div>
</template>
<script>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue';
export default {
  name: 'TtsGif',
  props: {
    state: {
      type: String,
      default: 'toListening'
    },
    width: String,
    height: String
  },
  data() {
    return {
      imageUrl: this.getImgSrc('Lyra_combination_00000.png'),
      imgArr: [],
      unwakenend: [],
      toListening: [],
      listening: [],
      loading: [],
      timerImg: null,
      size: 0,
      i: 0
    };
  },
  watch: {
    state: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        this.cancelPlay();
        if (newVal === 'unwakenend') {
          this.imgArr = this.unwakenend;
          this.startPlay();
        }
        if (newVal === 'toListening') {
          this.imgArr = this.toListening;
          this.startPlay();
        }
        if (newVal === 'listening') {
          this.imgArr = this.listening;
          this.startPlay();
        }
        if (newVal === 'loading') {
          this.imgArr = this.loading;
          this.startPlay();
        }
      }
      // immediate: true,
    }
  },
  created() {
    for (let i = 0; i < 72; i++) {
      let j = i;
      if (j < 10) {
        j = '0' + j;
      }
      this.unwakenend.push('000' + j);
    }
    for (let i = 72; i < 96; i++) {
      this.toListening.push('000' + i);
    }
    for (let i = 96; i < 168; i++) {
      let j = i;
      if (j < 100) {
        j = '0' + j;
      }
      this.listening.push('00' + j);
    }
    for (let i = 168; i < 216; i++) {
      this.loading.push('00' + i);
    }
  },
  mounted() {
    // this.state = 'toListening'
    if (this.state === 'unwakenend') {
      this.imgArr = this.unwakenend;
    }
    if (this.state === 'toListening') {
      this.imgArr = this.toListening;
    }
    if (this.state === 'listening') {
      this.imgArr = this.listening;
    }
    if (this.state === 'loading') {
      this.imgArr = this.loading;
    }
    this.startPlay();
  },
  beforeUnmount() {
    this.cancelPlay();
  },
  methods: {
    startPlay() {
      this.size = this.imgArr.length;
      this.i = 0;
      this.timerImg = setInterval(() => {
        this.chImg();
      }, 40);
    },
    // 动效
    chImg() {
      if (this.i >= this.size) {
        this.i = 0;
      } else {
        this.imageUrl = this.getImgSrc(
          `Lyra_combination_${this.imgArr[this.i]}.png`
        );
        this.i++;
      }
    },
    cancelPlay() {
      if (this.timerImg) {
        clearInterval(this.timerImg);
      }
    },
    getImgSrc(name) {
      return new URL(`/src/assets/lyra/${name}`, import.meta.url).href;
    }
  }
};
</script>
<style scoped lang="scss">
.tts-gif {
  display: inline-block;
  img {
    width: 104px;
    height: 104px;
  }
}
</style>
