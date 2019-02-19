<!--  -->
<template>
  <transition name="slide">
    <!-- 退还押金 -->
    <div
      class="depositViewPage"
      v-if="depositType.type == 0"
    >
      <van-nav-bar
        fixed
        title="押金管理"
        left-arrow
        @click-left="onClickLeft"
      >
      </van-nav-bar>
      <div class="topblank"></div>
      <div class="deposit">
        <p>押金（元）</p>
        <h4><span>￥</span>58元</h4>
        <p class="tip">押金随心退，安全速到账</p>
      </div>
      <div class="backdMoney">
        <a
          href="javascript:void(0)"
          @click="directionsManager"
          class="seeQuestion"
        >
          对押金规则不清楚？</a>
        <van-button
          type="default"
          @click="refunddeposit()"
        >退还
        </van-button>
      </div>
      <router-view></router-view>
    </div>
    <!-- 缴纳押金 -->
    <div
      class="depositViewPage toPayDeposit"
      v-if="depositType.type == 1"
    >
      <van-nav-bar
        fixed
        title="缴纳押金"
        left-arrow
        @click-left="onClickLeft"
      >
      </van-nav-bar>
      <div class="topblank"></div>
      <div class="deposit">
        <p class="moneyTitle">金额</p>
        <h4>58元</h4>
        <p class="tip">押金随心退，安全速到账</p>
      </div>
      <div class="payway">
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell
              title-class="radioIcon"
              clickable
              @click="radio = '1'"
            >
              <template slot="title">
                <img
                  :src="icon.wx"
                  slot="right"
                  class="leftPayIcon"
                />
                <span class="custom-text">微信支付</span>
              </template>
              <van-radio name="1" />
            </van-cell>
            <van-cell
              title-class="radioIcon"
              clickable
              @click="radio = '2'"
            >
              <template slot="title">
                <img
                  :src="icon.yue"
                  slot="right"
                  class="leftPayIcon"
                />
                <span class="custom-text">余额支付</span>
              </template>
              <van-radio name="2" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <div class="payBtn">
          <a
            href="javascript:void(0)"
            @click="seeQuestion"
            class="seeQuestion"
          >
            对押金规则不清楚？</a>
          <van-button
            type="default"
            @click="payMoney"
          >
            <span>支付</span>
          </van-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import common from "common/js/common.js";
import yue from "../../../static/img_icon/yue.png";
import wxpng from "../../../static/img_icon/wx.png";
import { weChatPay, weChat_refun, jsApiCall, deposit } from "api/bed";
import wx from "weixin-js-sdk";
import { ERR_OK } from "api/config";
// 支付结果
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      resultType: "",
      num: 0,
      radio: "1",
      currentTabNav: ["使用说明", "退还结果"],
      icon: {
        wx: wxpng,
        yue: yue
      }
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["depositType", "openId"])
  },
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    //返回
    onClickLeft() {
      this.$router.back();
    },
    seeQuestion() {
      this.setDirections(true);
    },
    payMoney() {
      weChatPay(this.openId.openId).then(res => {
        if (typeof WeixinJSBridge === "undefined") {
          if (document.addEventListener) {
            document.addEventListener(
              "WeixinJSBridgeReady",
              jsApiCall(res),
              false
            );
          } else if (document.attachEvent) {
            document.attachEvent(
              "WeixinJSBridgeReady",
              jsApiCall(res)
            );
            document.attachEvent(
              "onWeixinJSBridgeReady",
              jsApiCall(res)
            );
          }
        } else {
          jsApiCall(res);
        }
      });
    },

    // 使用说明
    directionsManager() {
      this.setDirections(true);
    },
    getData() { },
    // 退还押金
    refunddeposit() {
      // this.setRefund({

      // })
      this.$router.push({
        name: "myRefund"
      });
      // weChat_refun().then(res => {
      //     if ((res.error_code) * 1 == ERR_OK) {
      //         this.$toast("退还成功");
      //         deposit().then(res => {
      //             this.setDepositType({
      //                 type: res.error_code * 1,
      //                 money: res.cash_pledge_money * 1
      //             });
      //         });
      //     } else {
      //         this.$toast(res.error);
      //     }
      // });
    },
    ...mapMutations({
      setRefund: "SET_REFUND",
      setDepositType: "SET_DEPOSIT_TYPE",
      setDirections: "SET_DIRECTIONS"
    })
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() { },
  beforeCreate() { }, // 生命周期 - 创建之前
  beforeMount() { }, // 生命周期 - 挂载之前
  beforeUpdate() { }, // 生命周期 - 更新之前
  updated() { }, // 生命周期 - 更新之后
  beforeDestroy() { }, // 生命周期 - 销毁之前
  destroyed() { }, // 生命周期 - 销毁完成
  activated() { } // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="stylus" scoped>
// @import url(); 引入公共css类
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.depositViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 154;
  background: $color-background;

  .deposit {
    text-align: center;
    position: relative;

    // margin-top: 15%;
    h4 {
      color: orange;
      font-size: 23px;
      font-weight: 400;
      line-height: 10px;
      margin: 10px 0;
    }

    .moneyTitle {
      padding-top: 20px;
    }

    p {
      line-height: 48px;
    }

    .tip {
      color: #333;
      font-size: 14px;
    }
  }

  .payway {
    background: #f5f3f4;

    .van-radio-group {
      padding-top: 20px;
      text-align: left;

      .van-cell {
        background: #f5f3f4;

        .leftPayIcon {
          height: 25px;
          width: 25px;
          margin: -6px 0;
        }
      }
    }

    .payBtn {
      position: fixed;
      width: 90%;
      margin-left: 5%;
      margin-right: 5%;
      margin-top: 20px;
      padding-bottom: 15px;
      background: #f5f3f4;
      bottom: 0;

      .seeQuestion {
        font-size: 14px;
        display: block;
        text-align: center;
        line-height: 30px;
      }

      .van-button {
        background: #4fd6bc;
        color: #fff;
        font-size: 16px;
        width: 100%;
      }
    }
  }

  .backdMoney {
    position: relative;

    .seeQuestion {
      position: fixed;
      bottom: 72px;
      text-align: center;
      color: #999;
      width: 100%;
      left: 0;
    }

    .van-button {
      position: fixed;
      bottom: 20px;
      left: 0px;
      right: 0px;
      width: 92%;
      margin-left: auto;
      margin-right: auto;
      background: #4fd6bc;
      color: #fff;
      font-size: 16px;
    }
  }

  .toPayDeposit {
    text-align: center;
    position: absolute;
    width: 200px;
    margin-left: -100px;
    left: 50%;
    height: 200px;
    margin-top: -200px;
    top: 50%;

    h4 {
      color: orange;
      font-size: 26px;
      font-weight: 400;
      line-height: 10px;
      margin: 10px 0;

      span {
        font-size: 17px;
      }
    }

    p {
      line-height: 48px;
    }

    .tip {
      color: #999;
      font-size: 14px;
    }
  }
}
</style>
