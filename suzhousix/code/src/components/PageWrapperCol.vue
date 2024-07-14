<template>
  <!--  用于所有界面都要的页头，页尾（滚动信息）  -->
  <div class="page-wrapper">
    <div class="page-head">
      <subway-head-col></subway-head-col>
    </div>
    <slot></slot>
    <div class="page-foot">
      <subway-foot></subway-foot>
    </div>
  </div>
</template>

<script>
import SubwayFoot from '@/components/SubwayFoot.vue';
import SubwayHeadCol from '@/components/pagehead/SubwayHeadCol.vue';
export default {
  name: 'PageWrapperCol',
  components: {
    SubwayHeadCol,
    SubwayFoot
  },
  props: {
    flexCenter: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'src/styles/mixins';
.page-wrapper {
  @include flexStyle(flex-start, center, column);
  width: 100vw;
  height: 100vh;
  background: url('/src/assets/images/bg-goupiao-index@2x.png') no-repeat center;
  background-size: cover;
  .page-head {
    width: 100%;
  }
}
</style>
