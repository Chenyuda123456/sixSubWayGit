<template>
  <div
    :style="{ width: width, height: height }"
    class="module-box"
    @click="moduleClick"
  >
    <div
      v-en="{
        smallScreen: {
          width: '316px'
        }
      }"
      class="content"
    >
      <img :src="picUrl" alt="" />
      <div>
        <p
          v-en="{
            smallScreen: {
              fontSize: '32px'
            }
          }"
          class="title"
        >
          {{ title }}
        </p>
        <div class="tips">
          <span
            v-for="(item, index) in tips"
            :key="index"
            v-en="{
              smallScreen: {
                lineHeight: '30px'
              }
            }"
            >“{{ item }}”</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeMount, onMounted } from 'vue';

export default {
  name: 'ModuleBox',
  props: {
    width: {
      type: String
    },
    height: {
      type: String
    },
    title: {
      type: String
    },
    tips: {
      type: Array
    },
    picUrl: {
      type: String
    }
  },
  setup(props, { emit }) {
    const moduleClick = () => {
      emit('moduleClick');
    };
    return {
      moduleClick
    };
  }
};
</script>
<style lang="scss" scoped>
.module-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 360px;
  min-height: 256px;
  background: linear-gradient(180deg, #ffffff 0%, #edf6ff 100%);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.06);
  border-radius: 30px;
  text-align: center;

  .content {
    text-align: center;
  }

  img {
    width: 116px;
    height: 116px;
  }

  .title {
    font-size: 36px;
    font-weight: bold;
    color: #4868c1;
    line-height: 36px;
    margin-top: 22px;
  }

  .tips {
    font-size: 24px;
    font-weight: 400;
    color: #6d87ce;
    line-height: 24px;
    margin-top: 16px;
  }
}
@media screen and (max-width: 1080px) {
  .module-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 316px;
    min-height: 360px;
    background: linear-gradient(180deg, #ffffff 0%, #edf6ff 100%);
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.06);
    border-radius: 30px;
    border-radius: 30px;
    text-align: center;

    .content {
      text-align: center;
    }

    img {
      width: 140px;
      height: 140px;
    }

    .title {
      font-size: 40px;
      font-weight: bold;
      color: #4868c1;
      line-height: 40px;
      margin-top: 44px;
    }

    .tips {
      font-size: 24px;
      font-weight: 400;
      color: #6d87ce;
      line-height: 24px;
      margin-top: 24px;
    }
  }
}
</style>
