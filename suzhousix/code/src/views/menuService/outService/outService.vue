<template>
  <div>
    <subway-head :intelligence="false" :artificial="false" />
    <div class="box">
      <div class="text-box">暂停服务</div>
      <div class="text-box-en">out &nbsp;of &nbsp;service</div>
      <img class="image" src="@/assets/img_service@2x.png" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SubwayHead from '@/components/pagehead/SubwayHead.vue';
export default {
  name: 'StepPayresult',
  filters: {},
  components: {
    SubwayHead
  },
  mixins: [],
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      cardResult: 'getCardResult'
    })
  },
  mounted() {
    console.log(this.$route.query);
  },
  methods: {
    cancelUpdate() {
      this.$router.push({
        name: 'console'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  text-align: center;
  .text-box {
    height: 100px;
    font-size: 100px;
    font-weight: bold;
    color: #f1584c;
    line-height: 100px;
    letter-spacing: 4px;
    margin-top: 44px;
  }
  .text-box-en {
    line-height: 62px;
    font-size: 62px;
    font-weight: 500;
    color: #f1584c;
    margin-top: 24px;
  }
  .image {
    width: 680px;
    height: 544px;
    margin-top: 60px;
  }
}

@media screen and (max-width: 1280px) {
  .box {
    text-align: center;
    .text-box {
      font-size: 100px;
      font-weight: bold;
      color: #f1584c;
      line-height: 100px;
      letter-spacing: 4px;
      margin-top: 288px;
    }
    .text-box-en {
      line-height: 62px;
      font-size: 62px;
      font-weight: 500;
      color: #f1584c;
      margin-top: 24px;
    }
    .image {
      width: 680px;
      height: 544px;
      margin-top: 180px;
    }
  }
}
</style>
