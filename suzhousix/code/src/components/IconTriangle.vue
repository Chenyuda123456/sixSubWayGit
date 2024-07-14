<template>
  <!-- 解决动态icon元素样式问题 -->
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 16 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-86, -563)" fill-rule="nonzero">
        <g transform="translate(56, 422)">
          <g
            transform="translate(38, 149) rotate(90) translate(-38, -149) translate(30, 141)"
          >
            <rect
              fill="#000000"
              opacity="0"
              x="0"
              y="0"
              :width="width"
              :height="height"
            ></rect>
            <path
              d="M1.6734375,11.4921875 L7.140625,3.453125 C7.43125,2.9609375 8.065625,2.7953125 8.5578125,3.0859375 C8.7109375,3.1765625 8.8375,3.303125 8.928125,3.4578125 L14.353125,11.4953125 C14.640625,11.9890625 14.475,12.6234375 13.98125,12.9109375 C13.821875,13.003125 13.640625,13.053125 13.45625,13.051598 L2.565625,13.051598 C1.99375,13.051598 1.5296875,12.5875 1.53124607,12.015625 C1.53124607,11.83125 1.58125,11.65 1.6734375,11.4921875 Z"
              :fill="color"
            ></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'IconTriangle',
  props: {
    color: {
      type: String,
      default: '#81C43C',
    },
    width: {
      type: Number,
      default: 16,
    },
    height: {
      type: Number,
      default: 16,
    },
  },
}
</script>

<style lang="scss" scoped></style>
