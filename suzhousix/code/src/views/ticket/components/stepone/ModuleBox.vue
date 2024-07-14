<template>
  <div
    class="module-box"
    :style="{ width: width, height: height, color: color }"
    @click="moduleClick"
  >
    <div class="content">
      <div
        v-en="{
          smallScreen: {
            width: '300px',
            marginRight: '10px'
          }
        }"
      >
        <p
          v-en="{
            bigScreen: {
              lineHeight: '30px',
              fontSize: '30px'
            },
            smallScreen: {
              width: '100%',
              lineHeight: '30px',
              fontSize: '30px'
            }
          }"
          class="title"
          :class="titleClass"
        >
          {{ title }}
        </p>
        <p
          v-en="{
            bigScreen: {
              lineHeight: '20px',
              fontSize: '20px',
              width: '300px'
            },
            smallScreen: {
              width: '280px',
              lineHeight: '30px',
              fontSize: '30px',
              wordBreak: 'break-all'
            }
          }"
          class="intro"
          :class="introClass"
        >
          {{ intro }}
        </p>
      </div>
      <img :src="picUrl" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ModuleBox',
  props: {
    width: {
      type: String
    },
    color: {
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
    },
    intro: {
      type: String
    },
    titleClass: String,
    introClass: String
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
<style scoped lang="scss">
.module-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 260px;
  min-height: 280px;
  background: linear-gradient(180deg, #ffffff 0%, #edf6ff 100%);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.06);
  border-radius: 30px;
  text-align: center;
  .content {
    text-align: center;
  }
  img {
    width: 128px;
    height: 128px;
    margin: auto;
    margin-top: 20px;
  }
  .title {
    font-size: 40px;
    font-weight: bold;
    color: #5171e6;
    line-height: 60px;
  }
  .intro {
    font-size: 24px;
    font-weight: 400;
    color: #6d87ce;
    line-height: 32px;
    margin: 20px auto;
  }
  .color-pk-title {
    color: #f58719;
  }
  .color-pk-des {
    color: #eea256;
  }
}
@media screen and (max-width: 1180px) {
  .module-box {
    .content {
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: 0 44px;
    }
    img {
      width: 140px;
      height: 140px;
      margin-top: 20px;
    }
    .title {
      width: 216px;
      font-size: 44px;
      font-weight: bold;
      line-height: 44px;
      text-align: left;
      text-indent: 6px;
    }
    .intro {
      width: 216px;
      height: 64px;
      font-size: 24px;
      font-weight: 400;
      line-height: 32px;
      text-align: justify;
      margin: 0;
      margin-top: 20px;
    }
  }
}
</style>
