<template>
  <main class="main">
    <div class="main-inside">
      <div class="module-wrapper">
        <div class="center">
          <div
            v-if="state.speech && !data.isAndroid"
            class="center-line-one"
            style="text-align: center"
          >
            <tts-gif
              :height="$pxToRem(160)"
              :state="state.speech.gifState"
              :width="$pxToRem(160)"
            />
          </div>
          <img
            v-else
            style="width: 160px; height: 160px"
            src="@/assets/lyra/Lyra_combination_00000.png"
          />
          <div class="center-line-two over-text">
            {{ state.speech.inputText || $t('sayStation') }}
          </div>
        </div>
        <ul
          v-en="{
            marginTop: '4px'
          }"
          class="speech-tips"
        >
          <li
            v-for="(tip, index) in speechTipsArr"
            :key="index"
            v-en="{
              lineHeight: '30px',
              fontSize: '26px',
              width: '375px',
              height: '94px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '23px'
            }"
            class="speech-tips-item"
          >
            {{ tip }}
          </li>
        </ul>
      </div>
      <div v-if="isBuyFare" class="main-price">
        <div class="ticket-price">
          <ul>
            <li
              v-for="(item, index) in data.pirceList"
              :key="index"
              :class="{ active: index === data.priceIndex }"
              class="ticket-price-item"
              @click="choosePrice(index)"
            >
              ¥ {{ item }}
            </li>
            <li
              v-if="data?.allPriceList?.length > 8"
              class="ticket-price-item ticket-price-page"
              @click="choosePage()"
            >
              {{ data?.pricePage ? $t('pageDown') : $t('pageUp') }}
            </li>
          </ul>
        </div>
        <Line />
      </div>
      <ul class="module-list">
        <li
          v-for="(module, index) in moduleArr"
          v-show="module.isShow"
          :key="index"
          class="module-item"
        >
          <module-box
            :height="$pxToRem(280)"
            :intro="module.intro"
            :intro-class="module.introClass"
            :pic-url="getImgSrc(module.picUrl)"
            :title="module.title"
            :title-class="module.titleClass"
            :width="$pxToRem(484)"
            :color="module.color"
            @moduleClick="goPage(module.url)"
          />
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
import index from './index.js';
export default {
  ...index
};
</script>
<style lang="scss" scoped>
@import 'indexColumn.scss';
</style>
