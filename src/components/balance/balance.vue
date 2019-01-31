<!--  -->
<template>
  <transition name="slide">
    <div class='routerViewPage balance'>
      <van-nav-bar
        fixed
        title="账户充值"
        left-arrow
        right-text="消费明细"
        @click-left="routerBack"
        @click-right="statement"
      > </van-nav-bar>
      <div class="topblank"></div>
      <div class="AmountOfAccount">
        <div class="AccountWH">
          <div class="title">账户金额:(元)</div>
          <h4>959.13</h4>
          <p>温馨提示 :<br><span>账户金额可用于电话咨询、预约医生、送礼物、购买商品等。</span></p>
        </div>
      </div>
      <van-cell-group>
        <van-field
          v-model="value"
          placeholder="0.00"
        />
      </van-cell-group>
      <!-- 付款 -->
      <wait-pay></wait-pay>
    </div>
  </transition>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
// 付款
import WaitPay from "components/waitPay/waitPay";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { WaitPay },
  data() {
    //这里存放数据
    return {
      value: ''
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    routerBack() {
      this.$router.back()
    },
    statement() { }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped lang="stylus">
// @import url(); 引入公共css类
.balance {
  .AmountOfAccount {
    font-size: 14px;
    position: relative;
    background: #fff;

    .AccountWH {
      width: 92%;
      margin: 0 auto;

      .title {
        line-height: 40px;
        font-size: 14px;
        font-weight: 600;
        padding-top: 10px;
      }

      h4 {
        font-size: 24px;
        margin: 0;
      }

      p {
        color: #999;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 20px;
        padding-top: 10px;

        span {
          padding-left: 30px;
        }
      }
    }
  }
}
</style>