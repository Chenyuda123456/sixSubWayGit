<template>
  <div class="menu-content-wrapper">
    <div class="menu-content-wrapper-header">
      <div class="flex justify-between items-center">
        <span class="f36">{{ title }}</span>
        <div v-if="secondTitle" class="right-btn" @click="jump">
          {{ secondTitle }}
        </div>
      </div>
    </div>
    <!-- S 内容区 -->
    <div class="menu-content-wrapper-detail">
      <slot></slot>
    </div>
    <!-- E 内容区 -->
  </div>
</template>

<script>
export default {
  name: 'MenuContainer',
  props: {
    title: String,
    secondTitle: String,
    secondLink: String
  },
  methods: {
    jump() {
      console.log('jump');
      console.log(this.secondLink);
      this.$router.push({
        name: this.secondLink
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/variable';
.right-btn {
  font-size: 26px;
  font-weight: 400;
  color: #ffffff;
  line-height: 48px;
  height: 48px;
  background: #66a1ff;
  border-radius: 8px;
  padding: 0 16px;
}
@media screen and (min-width: 1180px) {
  .menu-content-wrapper {
    width: 1860px;
    height: 758px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    margin: auto;
    box-sizing: border-box;

    &-header {
      position: relative;
      padding: 0 30px;
      line-height: 84px;
      //border-bottom: 1px solid #999;

      span {
        font-size: 36px;
        font-weight: bold;
        color: #4868c1;
      }
    }

    &-detail {
      height: calc(100% - 108px); // todo: 去除了边框的paddingbottom,svg应自适应
    }
  }
}

@media screen and (max-width: 1080px) {
  .menu-content-wrapper {
    //统一高度 竖屏中间内容 例如换乘查询和失物查询 为了内容自适应暂不加
    padding: 1px 30px 30px 30px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    margin: 0 26px;
    box-sizing: border-box;
    position: relative;
    &-header {
      position: relative;
      padding: 36px 0;
      line-height: 1;
      border-bottom: 1px solid #999;
      margin-bottom: 40px;
      span {
        font-weight: bold;
      }
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 58px;
        height: 8px;
        background: #ff4718;
      }
    }

    &-detail {
      height: calc(100% - 108px); // todo: 去除了边框的paddingbottom,svg应自适应
    }
  }
}
</style>
