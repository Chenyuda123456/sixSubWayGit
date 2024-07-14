<template>
  <div class="cancel">
    <div @click="buttonClick"><slot></slot></div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// eslint-disable-next-line no-undef
const $emit = defineEmits('buttonClick');
// eslint-disable-next-line no-undef
const buttonClick = () => {
  $emit('buttonClick', '');
};
</script>

<style lang="scss" scoped>
.cancel {
  text-align: center;
  margin: auto;
  margin-top: 62px;
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
  line-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    background: linear-gradient(180deg, #9aafff 0%, #6b89fb 100%);
    box-shadow: 0 6px 10px 0 rgba(107, 137, 251, 0.4);
    border-radius: 40px;
    padding: 0px 30px;
    min-width: 220px;
    box-sizing: border-box;
  }
}
</style>
