<template>
  <div class="bottom">
    <div class="bottom-bg">
      <img :src="getImgSrc('icon_notice@2x.png')" alt="notice" />
    </div>
    <div class="bottom-content-row-screen bottom-content">
      <van-notice-bar
        speed="30"
        :scrollable="true"
        :text="noticeStr"
        class="scroll-content"
      />
    </div>
  </div>
</template>

<script>
import { noticeServiceFoot } from '@/service/noticeService';
export default {
  name: 'SubwayFoot',
  props: {
    content: {
      type: String,
      default: () => {
        return '苏州轨道交通6号线途经高新区、姑苏区和工业园区，全长36.12km，设站31座（地下站30座，地上站1座）。是城市东西向穿越古城及金鸡湖的重要客流通道，同时也是探索...';
      }
    }
  },
  setup() {
    const getImgSrc = name => {
      return new URL(`/src/assets/${name}`, import.meta.url).href;
    };
    return {
      getImgSrc
    };
  },
  data() {
    return {
      isWidthScreen: true,
      noticeContentArray: [],
      noticeStr: ''
    };
  },
  mounted() {
    function delHtmlTag(str) {
      return str.replace(/<[^>]+>/g, '');
    }

    let site = window?.bridge?.getDefaultSite();
    noticeServiceFoot.getNotice(site, 0).then(res => {
      const data = res.data.result;
      this.noticeContentArray = data;
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          if (!item.noticeTitile) {
            item.noticeTitile = '';
          }
          this.noticeStr += item.noticeTitile + delHtmlTag(item.noticeContent);
        });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/common.scss';
@import 'src/styles/mixins.scss';

.bottom {
  @include flexStyle(flex-start, flex-end);
  position: fixed;
  left: 0;
  bottom: 0;
  // height: 24px;
  font-size: 24px;
  .bottom-bg {
    display: inline-block;
    height: 44px;
    padding: 7px;
    img {
      width: 30px;
      height: 30px;
    }
  }
  .bottom-content-row-screen {
    width: 1900px;
  }
  .bottom-content {
    height: 40px;
    margin-left: 10px;
    :deep(.van-notice-bar) {
      // background: none;
      padding: 0;
      display: flex;
      width: 100%;
      height: 40px;
      font-size: 24px;
      line-height: 36px;
      color: $--subway-color-red1;
      overflow: hidden;
      white-space: nowrap;
      background: transparent;
    }
  }
}
</style>
