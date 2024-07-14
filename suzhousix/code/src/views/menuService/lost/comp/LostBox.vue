<template>
  <div class="lost-box-wrapper">
    <div class="box-left">
      <div class="box-left-img"></div>
    </div>
    <div class="box-right">
      <div class="box-right-content">
        <div class="box-title">{{ lostObj.lostObj }}</div>
        <div :class="isWidthScreen ? '' : 'display-flex-between-center'">
          <div class="box-lost-place">
            <span class="box-info-title">{{ $t('keepPlace') }}：</span>
            <span>{{ lostObj.saveStation }}</span>
          </div>
          <div class="box-lost-time">
            <span class="box-info-title">{{ $t('pickTime') }}：</span>
            <span>{{ lostObj.pickTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LostBox',
  props: {
    lostObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isWidthScreen: {}
  }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/common';
@import 'src/styles/mixins';

.lost-box-wrapper {
  @include flexStyle(flex-start, center);
  width: 584px;
  height: 156px;
  background: rgba(249, 242, 200, 0.3);
  border-radius: 20px;
  overflow: hidden;

  .box-left {
    @include flexStyle(center, center);
    width: 156px;
    height: 156px;
    background: #f9f2c8;

    .box-left-img {
      width: 100px;
      height: 100px;
      background: url('../../../../assets/bg-lost@2x.png');
      background-size: cover;
    }
  }

  .box-right {
    width: 428px;
    height: 156px;
    box-sizing: border-box;
    padding: 24px;

    .box-right-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 22px;
      line-height: 22px;
      color: #333333;

      .box-title {
        @include fontStyle(28, bold);
        height: 28px;
        line-height: 28px;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 24px;
      }

      // 提示语样式 如“保管地”
      .box-info-title {
        color: #bd8e53;
        font-size: 22px;
        overflow: hidden;
      }

      .box-lost-time {
        margin-top: 12px;
      }
    }
  }
}

@media screen and (max-width: 1180px) {
  .lost-box-wrapper {
    @include flexStyle(flex-start, center);
    width: auto;
    height: 120px;
    background: rgba(249, 242, 200, 0.3);
    border-radius: 20px;
    overflow: hidden;

    .box-left {
      @include flexStyle(center, center);
      width: 120px;
      height: 120px;
      background: #f9f2c8;

      .box-left-img {
        width: 80px;
        height: 80px;
        background: url('../../../../assets/bg-lost@2x.png');
        background-size: cover;
      }
    }

    .box-right {
      width: auto;
      height: 120px;
      box-sizing: border-box;
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .box-right-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 22px;
        line-height: 22px;
        color: #333333;

        .box-title {
          @include fontStyle(28, bold);
          height: 28px;
          line-height: 28px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 18px;
        }

        // 提示语样式 如“保管地”
        .box-info-title {
          color: #bd8e53;
          font-size: 22px;
          overflow: hidden;
          width: 50%;
        }

        .box-lost-time {
          margin-top: 0px;
          width: 50%;
        }
      }
    }
  }
}
</style>
