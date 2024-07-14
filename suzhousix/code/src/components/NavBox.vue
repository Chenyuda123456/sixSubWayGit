<template>
  <!-- 首页welcome的导航box -->
  <div
    class="nav-box-base"
    :class="{
      'bg-guopiao': title === $t('ticket') && isWidthScreen,
      'bg-guopiao-col': title === $t('ticket') && !isWidthScreen,
      'bg-zixun': title === $t('consult') && isWidthScreen,
      'bg-zixun-col': title === $t('consult') && !isWidthScreen,
      'bg-piaoka': title === $t('ticketService') && isWidthScreen,
      'bg-piaoka-col': title === $t('ticketService') && !isWidthScreen,
      'bg-huancheng': title === $t('transfer') && isWidthScreen,
      'bg-huancheng-col': title === $t('transfer') && !isWidthScreen,
      'bg-piaojia': title === $t('ticketprice') && isWidthScreen,
      'bg-piaojia-col': title === $t('ticketprice') && !isWidthScreen,
      'bg-shichang': title === $t('traveltime') && isWidthScreen,
      'bg-shichang-col': title === $t('traveltime') && !isWidthScreen,
      'bg-tese': title === $t('portrait') && isWidthScreen,
      'bg-tese-col': title === $t('portrait') && !isWidthScreen,
      'bg-shoumo': title === $t('schedule') && isWidthScreen,
      'bg-shoumo-col': title === $t('schedule') && !isWidthScreen,
      'bg-rengong': title === $t('humanService') && isWidthScreen,
      'bg-rengong-col': title === $t('humanService') && !isWidthScreen,
      'bg-shiwu': title === $t('lostthings') && isWidthScreen,
      'bg-shiwu-col': title === $t('lostthings') && !isWidthScreen,
      'bg-zhoubian': title === $t('siteAround') && isWidthScreen,
      'bg-zhoubian-col': title === $t('siteAround') && !isWidthScreen
    }"
    @click="toDetail"
  >
    <div
      class="nav-box-line-one"
      :class="{
        'nav-box-font-black': title === $t('portrait'),
        'welcome2-width-box':
          title === $t('portrait') || title === $t('schedule')
      }"
    >
      {{ title }}
    </div>
    <div
      class="nav-box-line-two"
      :class="{
        'nav-box-font-black': title === $t('portrait'),
        'welcome2-width-box':
          title === $t('portrait') || title === $t('schedule')
      }"
    >
      {{ sbuTitle }}
    </div>
  </div>
</template>

<script>
import {} from 'vue';

export default {
  name: 'navBox',
  props: {
    title: {
      type: String,
      default: () => {
        return '';
      }
    },
    sbuTitle: {
      type: String,
      default: () => {
        return '';
      }
    },
    isWidthScreen: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  setup(props, { emit }) {
    const toDetail = () => {
      emit('buttonClick', props.title);
    };
    return {
      toDetail
    };
  }
};
</script>

<style lang="scss" scoped>
@mixin imgSize($width: 460px, $height: 400px) {
  width: $width;
  height: $height;
}
.nav-box-base {
  width: 460px;
  height: 400px;
  /*margin: 0 20px;*/
  cursor: pointer;

  .nav-box-line-one {
    // welcome1界面 第一行
    margin-top: 50px;
    font-size: 48px;
    font-weight: bold;
    color: #fffffe;
    text-align: center;
  }

  .nav-box-line-two {
    // welcome1界面 第二行
    margin-top: 10px;
    font-size: 24px;
    color: #fffffe;
    text-align: center;
  }

  .welcome2-width-box {
    text-align: left;
    margin-left: 50px;
  }

  .nav-box-font-black {
    color: #111111;
  }
}

.bg-guopiao {
  // 购票 宽屏
  background: url('/src/assets/images/bg-goupiao@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize();
}

.bg-guopiao-col {
  background: url('/src/assets/images/bg-goupiao-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(306px, 400px);
}

.bg-zixun {
  // 咨询 宽屏
  background: url('/src/assets/images/bg-zixun@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize();
}

.bg-zixun-col {
  background: url('/src/assets/images/bg-zixun-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(306px, 400px);
}

.bg-piaoka {
  // 票卡业务 宽屏
  background: url('/src/assets/images/bg-piaoka@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize();
}

.bg-piaoka-col {
  background: url('/src/assets/images/bg-piaoka-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(306px, 400px);
}

.bg-huancheng {
  // 换乘 宽屏
  background: url('/src/assets/images/bg-huancheng@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(360px, 300px);
}
.bg-huancheng-col {
  background: url('/src/assets/images/bg-huancheng-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(316px, 400px);
}

.bg-piaojia {
  // 票价 宽屏
  background: url('/src/assets/images/bg-piaojia@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(360px, 300px);
}

.bg-piaojia-col {
  background: url('/src/assets/images/bg-piaojia-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(316px, 400px);
}

.bg-shichang {
  // 乘车时长 横屏
  background: url('/src/assets/images/bg-shichang@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(360px, 300px);
}

.bg-shichang-col {
  background: url('/src/assets/images/bg-shichang-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(316px, 400px);
}

.bg-tese {
  // 城市特色 宽屏
  background: url('/src/assets/images/bg-tese@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(550px, 232px);
  margin: 0 5px 0 0;
}

.bg-tese-col {
  background: url('/src/assets/images/bg-chengshi-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(484px, 280px);
  margin: 0 5px 0 0;
}

.bg-shoumo {
  // 首末班车 宽屏
  background: url('/src/assets/images/bg-shoumo@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(550px, 232px);
  margin: 0 0 0 5px; // 用于welcome2右部的间隔
}

.bg-shoumo-col {
  background: url('/src/assets/images/bg-shoumo-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(484px, 280px);
}

.bg-rengong {
  // 人工 横屏
  background: url('/src/assets/images/bg-rengong@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(360px, 300px);
}

.bg-rengong-col {
  background: url('/src/assets/images/bg-rengong-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(316px, 400px);
}

.bg-shiwu {
  // 失物 宽屏
  background: url('/src/assets/images/bg-shiwu@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(360px, 300px);
}

.bg-shiwu-col {
  background: url('/src/assets/images/bg-shiwu-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(316px, 400px);
}

.bg-zhoubian {
  // 周边 宽屏
  background: url('/src/assets/images/bg-zhoubian@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(360px, 300px);
}

.bg-zhoubian-col {
  background: url('/src/assets/images/bg-zhoubian-col@2x.png') no-repeat center;
  background-size: cover;
  @include imgSize(316px, 400px);
}
</style>
