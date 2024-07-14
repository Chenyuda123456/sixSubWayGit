<template>
  <div class="cardWrapper">
    <slot name="content"></slot>
    <div class="blank"></div>
  </div>
</template>

<script>
export default {
  name: 'CardWrapper',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      timer: null,
      timeSeconds: 120, // 倒计时秒数
      timeSecondsText: '返回' // 倒计时文字
    };
  },
  computed: {},

  methods: {}
};
</script>

<style lang="scss" scoped>
.buyTicketBack {
  position: fixed;
  right: 30px;
  bottom: 30px;
  margin: auto;
  z-index: 999;

  &.disable {
    background: #ccc;
  }
}
</style>
