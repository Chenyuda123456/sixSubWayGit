<template>
  <div
    :class="{
      'speech-tip': true,
      'long-tip': longTip
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SpeechTip',
  props: {
    longTip: {
      type: Boolean,
      default: () => {
        return true; // 默认长文本左右间距40px，短文本为80px
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/common';
@import '../styles/mixins';

.speech-tip {
  font-size: 28px;
  width: fit-content;
  text-align: center;
  background: linear-gradient(180deg, #e0e7ff 0%, #d4deff 100%);
  box-shadow: 0px 4px 5px 0px rgba(107, 137, 251, 0.4);
  border-radius: 38px 38px 38px 0px;
  color: #4868c1;
  line-height: 30px;
}

.long-tip {
  padding: 20px 30px;
}
</style>
