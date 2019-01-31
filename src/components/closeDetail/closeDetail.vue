<template>
  <div>
    <div class="OrderDetail">
      <scroll
        ref="scroll"
        class="OrderDetail-content"
      >
        <div>
          <van-steps
            :active="stepsActive"
            active-color="#4FD6BC"
          >
            <van-step>扫码 </van-step>
            <van-step>开锁</van-step>
            <van-step>支付</van-step>
          </van-steps>
          <div class="cellCon">
            <div class="gray"></div>
            <van-cell
              title="订单号"
              :value="orderDetail.orderId"
            >
            </van-cell>
            <div class="detail">
              <van-cell-group>
                <van-cell
                  title="医院"
                  :value="orderDetail.hospitalName"
                >
                </van-cell>
                <van-cell
                  title="科室"
                  :value="orderDetail.departmentName"
                >
                </van-cell>
                <van-cell
                  title="病房号"
                  :value="orderDetail.roomId"
                >
                </van-cell>

                <van-cell
                  title="时长"
                  :value="orderDetail.serviceTime"
                >
                </van-cell>
                <van-cell
                  title="开始时间"
                  :value="orderDetail.startTime"
                >
                </van-cell>
                <van-cell
                  title="结束时间"
                  :value="orderDetail.endTime"
                >
                </van-cell>
                <van-cell
                  title="费用"
                  :value="orderDetail.cost"
                >
                </van-cell>
                <van-cell
                  v-if="orderDetail.endWay == 0"
                  value="故障关锁"
                  title="结束方式"
                  value-class="itemFinished"
                >
                </van-cell>
                <van-cell
                  v-if="orderDetail.endWay == 1"
                  value="正常关锁"
                  title="结束方式"
                  value-class="itemFinished"
                >
                </van-cell>
                <van-cell
                  v-if="orderDetail.payState == 0"
                  value="已完成"
                  title="状态"
                  value-class="itemFinished"
                >
                </van-cell>
                <van-cell
                  v-if="orderDetail.pay_state == 1"
                  value="未完成"
                  title="状态"
                  value-class="itemWaitPay"
                >
                </van-cell>
                <van-cell
                  v-if="orderDetail.pay_state == 2"
                  value="待审核"
                  title="状态"
                  value-class="itemAudit"
                >
                </van-cell>
              </van-cell-group>
            </div>
          </div>
          <pay-way :orderId="orderDetail.orderId"></pay-way>
        </div>
        <!-- <div
        class="loading-container"
        v-show="!orderDetail"
      >
        <loading></loading>
      </div> -->
      </scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import PayWay from "components/waitPay/waitPay";

export default {
  props: {
    orderDetail: {
      type: Object
    }
  },
  data() {
    return {
      stepsActive: 2,
      len: [],
    }
  },

  methods: {
    loadImgae() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    delClose() {

    },
    _getData() {

    }
  },
  computed: {
  },
  components: {
    Scroll,
    Loading,
    PayWay
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this._getData()
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.OrderDetail {
  position: fixed;
  width: 100%;
  top: 46px;
  bottom: 0px;

  .OrderDetail-content {
    height: 100%;
    overflow: hidden;

    .van-steps {
      width: 72%;
      margin: 0 auto 0;
      background: #f5f3f4;
      height: 60px;

      .van-steps__items .van-steps__items--alone {
        height: 60px !important;
      }

      .van-step__title {
        position: relative;
        top: 50px;
      }

      .van-step--horizontal {
        line-height: 100px;
        height: 60px;
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.del {
  position: fixed;
  bottom: 20px;
  margin-left: 3%;
  width: 94%;
  margin-right: 3%;

  .delBtn {
    width: 100%;
    background: #f39357;
    color: #fff;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    float: left;
  }
}
</style>
