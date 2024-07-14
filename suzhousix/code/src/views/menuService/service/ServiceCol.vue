<template>
  <MenuContainer :title="$t('convenient')">
    <div class="page-wrapper">
      <!-- <div class="page-title">便民服务</div> -->
      <div class="page-cont">
        <div v-if="data.titleList?.length > 0" class="page-cont-right">
          <c-scrollbar class="page-cont-right-wrapper">
            <div
              class="pr10"
              v-html="data.titleList[data.currentIndex].noticeContent"
            ></div>
          </c-scrollbar>
        </div>
      </div>
    </div>
  </MenuContainer>
  <div class="page-cont-left title-list">
    <c-scrollbar ref="titleListRef" class="service-menu-wrapper">
      <div
        v-for="(item, index) in data.titleList"
        :key="index"
        class="title-item"
        :class="{ active: data.currentIndex === index }"
        @click="changeCont(index)"
      >
        <!--        <div class="icon-box">-->
        <!--          <i-->
        <!--            class="icon"-->
        <!--            :class="[-->
        <!--              data.iconList[item.noticeLevel],-->
        <!--              data.currentIndex === index && 'active'-->
        <!--            ]"-->
        <!--          ></i>-->
        <!--        </div>-->

        <div class="title over-text">{{ item.noticeTitle }}</div>
      </div>
    </c-scrollbar>
  </div>
</template>

<script>
import index from './index.js';
export default {
  ...index
};
</script>
<style scoped lang="scss">
.page-wrapper {
  .page-cont {
    &-right {
      height: 678px;
      border-radius: 30px;
      padding: 0px;
      font-weight: 400;
      color: #333333;
      line-height: 50px;
      font-size: 28px;
      &-wrapper {
        height: 100%;
        :deep(.c-scrollbar-content img) {
          width: 100%;
        }
      }
    }
  }
  .detail {
    width: 1280px;
    height: 758px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    font-size: 28px;
    color: #333333;
    line-height: 50px;
    padding: 60px 50px;
  }
}
.title-list {
  margin: 20px 26px 0px;
  height: 360px;
  .title-item {
    display: flex;
    align-content: flex-start;
    justify-content: center;
    margin-top: 20px;
    width: 494px;
    height: 100px;
    background: #fff;
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 24px;
    font-size: 30px;
    font-weight: 400;
    color: #333333;
    line-height: 100px;
    margin-right: 15px;
    .icon-box {
      width: 159px;
      text-align: right;
    }
    .title {
      flex: 1;
      text-align: center;
    }
    &.active {
      background: linear-gradient(180deg, #7ea4ff 0%, #3c76ff 100%);
      box-shadow: 0px 2px 8px 0px #7ea4ff;
      border-radius: 24px;
      color: #fff;
    }
  }
}
.service-menu-wrapper {
  height: 100%;

  :deep(.c-scrollbar-content) {
    display: flex;
    align-content: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  :deep(.c-scrollbar-content img) {
    width: 100%;
  }
}
</style>
