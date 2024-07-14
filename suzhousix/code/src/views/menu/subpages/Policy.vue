<template>
  <div class="page-wrapper">
    <!-- <div class="page-title">乘车政策</div> -->
    <div class="page-cont">
      <div class="page-cont-left">
        <van-list
          v-model:loading="data.loading"
          :finished="page.isNoData"
          :finished-text="$t('nomoreresults')"
          class="a-list"
          @load="handleLoadStart"
        >
          <div
            v-for="(item, index) in data.listData"
            :key="index"
            class="a-item"
            :class="{ active: index === data.currentIndex }"
            @click="changeCont(index)"
          >
            <i class="a-item-icon"></i>
            <div class="a-title-box">
              <div class="a-item-title">{{ item.noticeTitle }}</div>
            </div>
          </div>
        </van-list>
      </div>
      <!--      v-if="data.listData && data.listData.length > 0"-->

      <div class="page-cont-right">
        <div class="page-cont-right-wrapper">
          <div
            id="htmlWrap"
            class="pr10"
            v-html="data.listData[data.currentIndex]?.noticeContent"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, nextTick } from 'vue';
import Protocol from '@/mixins/protocol.ts';
import { noticeService } from '@/service/noticeService.js';
const data = reactive({
  listData: [],
  currentIndex: 0,
  loading: false // 是否在加载下一页数据
});
const page = reactive({
  pageNo: 0,
  pageSize: 15,
  isNoData: false // 是否还有数据
});
const changeCont = index => {
  data.currentIndex = index;
  nextTick(() => {
    disposalImg();
  });
};
// 加载下一页数据
const handleLoadStart = () => {
  if (!page.isNoData) {
    page.pageNo++;
    getData();
  }
};
const getData = async () => {
  const site = window?.bridge?.getDefaultSite();
  let result = await noticeService.getNotice(site, 1, page);
  data.loading = false;
  if (
    result &&
    result.data &&
    result.data.result &&
    result.data.result.data &&
    result.data.result.data.length
  ) {
    data.listData = [...data.listData, ...result.data.result.data];
  }
  nextTick(() => {
    disposalImg();
  });
  if (data.listData.length >= result.data.result.totalNum) {
    page.isNoData = true;
  }
};
onMounted(() => {
  window?.bridge?.generateNLG('ticketpolicy');
  const { firstLoad } = Protocol();
  firstLoad();
});
const disposalImg = () => {
  const imgAll = document.documentElement.querySelectorAll('#htmlWrap img');
  imgAll.forEach(item => {
    if (item.src.includes('http')) {
      console.log(item.src);
    } else {
      item.src = 'http://10.202.1.127:8083/images/news' + item.src;
      if (item.attributes.width && item.attributes.width.value) {
        if (item.attributes.width.value > 450) {
          item.attributes.width.value = 450;
        }
      }
      if (item.attributes.height && item.attributes.height.value) {
        item.attributes.height.value = '';
      }
    }
    item.onerror = function () {
      this.style.display = 'none';
    };
  });

  const linkAll = document.documentElement.querySelectorAll('#htmlWrap a');
  linkAll.forEach(item => {
    item.href = 'javascript:';
    item.target = '';
  });
};
</script>
<style scoped lang="scss">
.page-wrapper {
  // position: absolute;
  // top: 50px;
  // left: 20px;
  // width: 1860px;
  // height: 758px;
  // background: rgba(255, 255, 255, 0.8);
  // box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  // border-radius: 30px;
  .page-title {
    padding: 20px 30px;
    border-bottom: 1px solid #e4e4e4;
    font-size: 36px;
    font-weight: bold;
    color: #4868c1;
    line-height: 54px;
  }
  .page-cont {
    display: flex;
    justify-content: left;
    border-top: 1px solid #e4e4e4;
    height: 640px;
    &-left {
      width: calc(100% - 1280px);
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 6px;
        background: #ffffff;
      }

      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track {
        background: #ffffff;
      }

      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.2);
      }

      :deep .van-list__finished-text {
        margin: auto;
      }
    }
    &-right {
      flex: 1;
      height: 100%;
      ::-webkit-scrollbar {
        width: 0;
      }
      box-sizing: border-box;
      padding: 30px 30px 30px 50px;
      font-weight: 400;
      color: #333333;
      line-height: 50px;
      font-size: 28px;
      border-left: 1px solid #e4e4e4;

      &-wrapper {
        height: 100%;
        overflow: auto;
        display: block;
        img {
          max-width: 100% !important;
          height: auto !important;
        }
      }
    }
  }
  .a-item {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 20px 30px;

    &-icon {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(180deg, #9aafff 0%, #6b89fb 100%);
      margin-right: 30px;
    }
    &-title {
      width: 100%;
      font-size: 28px;
      font-weight: 500;
      color: #333333;
      line-height: 42px;
      overflow: hidden; //超出文本隐藏
      text-overflow: ellipsis; ///超出部分省略号显示
      display: -webkit-box; //弹性盒模型
      -webkit-box-orient: vertical; //上下垂直
      -webkit-line-clamp: 2; //自定义行数
    }
    .a-title-box {
      width: calc(100% - 40px);
    }
    &-date {
      font-size: 24px;
      font-weight: 400;
      color: #9d9d9d;
      line-height: 36px;
      margin-top: 10px;
    }
    &.active {
      border-left: 6px solid #6b89fb;
      background: linear-gradient(270deg, #edf3ff 0%, #d4deff 100%);
    }
  }
  .tip {
    font-size: 24px;
    font-weight: 400;
    color: #9d9d9d;
    line-height: 36px;
    line-height: 58px;
    text-align: center;
  }
}

@media (max-width: 1080px) {
  .page-wrapper {
    .page-title {
    }
    .page-cont {
      border-top: 0px;
      height: 1054px;
      &-left {
        width: 420px;
      }
      &-right {
        font-size: 24px;

        &-wrapper {
        }
      }
    }
    .a-list {
    }
    .a-item {
      &-icon {
      }
      &-title {
        font-size: 24px;
      }
      .a-title-box {
      }
      &-date {
      }
      &.active {
      }
    }
    .tip {
    }
  }
}
</style>
