<template>
  <div class="page-wrapper">
    <!-- <div class="page-title">便民服务</div> -->
    <div class="page-cont">
      <div class="page-cont-left title-list">
        <c-scrollbar ref="titleListRef" class="page-cont-left-wrapper">
          <ul>
            <li
              v-for="(item, index) in data.titleList"
              :key="index"
              class="title-item"
              :class="{ active: data.currentIndex === index }"
              @click="changeCont(index)"
            >
              <!--              <i-->
              <!--                class="icon"-->
              <!--                :class="[-->
              <!--                  data.iconList[item.noticeLevel],-->
              <!--                  data.currentIndex === index && 'active'-->
              <!--                ]"-->
              <!--              ></i>-->
              <div class="title over-text">{{ item.noticeTitle }}</div>
            </li>
          </ul>
        </c-scrollbar>
      </div>
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
</template>
<script>
import index from './index.js';
export default {
  ...index
};
</script>
<style scoped lang="scss">
.menu-content-wrapper {
  background: none;
  box-shadow: none;
  border: none;
}
.page-wrapper {
  // display: flex;
  // justify-content: space-between;
  // // align-content: flex-start;
  .page-cont {
    display: flex;
    justify-content: center;
    align-items: center;
    &-left {
      height: 758px;
      background: transparent;
      &-wrapper {
        height: 100%;
      }
    }
    &-right {
      width: 1280px;
      height: 758px;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
      border-radius: 30px;
      padding: 30px 30px 30px 50px;
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
  .title-list {
    margin-right: 30px;
    .title-item {
      display: flex;
      align-content: flex-start;
      justify-content: center;
      margin-top: 20px;
      width: 550px;
      height: 104px;
      background: rgba(255, 255, 255, 0.6);
      //box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
      border-radius: 24px;
      padding: 30px 100px;
      font-size: 36px;
      font-weight: 400;
      color: #333333;
      line-height: 54px;
      .title {
        flex: 1;
        text-align: center;
      }
      &:first-child {
        margin-top: 0;
      }
      &.active {
        background: linear-gradient(180deg, #7ea4ff 0%, #3c76ff 100%);
        box-shadow: 0px 2px 8px 0px #7ea4ff;
        border-radius: 24px;
        color: #fff;
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
</style>
