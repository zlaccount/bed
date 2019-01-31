<template>
  <transition name="slide">
    <div class="orderViewPage">
      <van-nav-bar
        fixed
        left-arrow
        @click-left="onClickLeft"
        title="订单管理"
      >
      </van-nav-bar>
      <div class="topblank"></div>
      <!-- 导航 -->
      <div class="nav">
        <ul>
          <li
            class="tab-item"
            v-for="(n, index) in title"
            :key="index"
            @click="changeNav(index)"
            :class="{ active: index === oCurrentPage }"
          >
            <span class="tab-link"> {{ n.name }}</span>
          </li>
        </ul>
      </div>
      <!-- 外层翻页组件（轮播原理） -->
      <slider
        :oCurrentPage="oCurrentPage"
        ref="sendPage"
        v-on:switchTab="msgFromChild"
      >
        <div
          v-for="(item, index) in data"
          :key="index"
        >
          <!-- 上下拉加载更多，刷新数据的组件updown -->
          <up-down
            :data="data"
            :pulldown="pulldown"
            @pulldown="loadData"
          >
            <!-- 此处的ui结构just a demo of test -->
            <div
              class="cellCon"
              v-for="(item, index) in orderData"
              :key="index"
              @click="selectItem(item)"
            >
              <div class="gray"></div>
              <div style="width:100%;min-height:100%">
                <div style="min-height:210px;">
                  <van-cell
                    v-if="item.pay_state == 0"
                    value="已完成"
                    value-class="itemFinished"
                  >
                    <template slot="title">
                      <div class="custom-text">
                        订单编号111 : {{ item.order_id }}
                      </div>
                    </template>
                  </van-cell>
                  <van-cell
                    v-if="item.pay_state == 1"
                    value="未完成"
                    value-class="itemWaitPay"
                  >
                    <template slot="title">
                      <div class="custom-text">
                        订单编号 : {{ item.order_id }}
                      </div>
                    </template>
                  </van-cell>
                  <van-cell
                    v-if="item.pay_state == 2"
                    value="待审核"
                    value-class="itemAudit"
                  >
                    <template slot="title">
                      <div class="custom-text">
                        订单编号 : {{ item.order_id }}
                      </div>
                    </template>
                  </van-cell>
                  <van-cell
                    v-if="item.pay_state == 3"
                    value="正在使用"
                    value-class="itemAudit"
                  >
                    <template slot="title">
                      <div class="custom-text">
                        订单编号 : {{ item.order_id }}
                      </div>
                    </template>
                  </van-cell>
                  <div class="detail">
                    <van-cell>
                      <template slot="title">
                        <div class="custom-text">
                          医院 : {{ item.hospital_name }}
                        </div>
                        <div class="custom-text">
                          病房号 : {{ item.room_number }}
                        </div>
                        <div class="custom-text">
                          科室 :
                          {{ item.department_name }}
                        </div>
                        <div class="custom-text">
                          开始时间 : {{ item.start_time }}
                        </div>
                        <div class="custom-text">
                          结束时间 : {{ item.end_time }}
                        </div>
                        <div class="custom-text">
                          时长 : {{ sec_to_time(item.service_time) }}
                        </div>
                        <div class="link">
                          <van-icon name="arrow" />
                        </div>
                      </template>
                    </van-cell>
                  </div>
                </div>
              </div>
            </div>
          </up-down>
        </div>
      </slider>
      <div class="loading-wrapper"></div>
      <router-view></router-view>

    </div>
  </transition>
</template>

<script>
import Slider from 'base/scrolltab/slider'
import UpDown from 'base/scrolltab/UpDown'
import { mapGetters, mapMutations } from 'vuex'

import { ERR_OK } from 'api/config'
import { order } from 'api/bed'
export default {
  name: 'HelloWorld',
  components: {
    Slider,
    UpDown
  },
  data() {
    return {
      data: [1, 1, 1, 1],
      pulldown: true,
      title: [
        { name: '全部订单' },
        { name: '已完成' },
        { name: '未支付' },
        { name: '待审核' }
      ],
      oCurrentPage: 0,
      orderData: [],
      allData: []
    }
  },
  created() {
    this.loadData()
  },
  computed: {
    ...mapGetters(['order'])
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    sec_to_time(s) {
      var t;
      if (s > -1) {
        var hour = Math.floor(s / 3600);
        var min = Math.floor(s / 60) % 60;
        var sec = s % 60;
        if (hour < 10) {
          t = '0' + hour + ":";
        } else {
          t = hour + ":";
        }

        if (min < 10) { t += "0"; }
        t += min + ":";
        if (sec < 10) { t += "0"; }
        t += sec
      }
      return t;
    },
    changeNav(num) {
      this.oCurrentPage = num
      this.$refs.sendPage.setPage(this.oCurrentPage)
    },
    selectItem(order) {
      console.log('order', this.order)
      if (this.order.type === 1) {
        this.$router.push({
          path: `/bed/order/${order.order_id}`,
          params: {
            id: order.order_id
          }
        })
      } else if (this.order.type === 2) {
        this.$router.push({
          path: `/my/order/${order.order_id}`,
          params: {
            id: order.order_id
          }
        })
      } else if (this.order.type === 3) {
        this.$router.push({
          path: `/my/order/${order.order_id}`,
          params: {
            id: order.order_id
          }
        })
      }
      else if (this.order.type === 4) {
        this.$router.push({
          path: `/bed/order/${order.order_id}`,
          params: {
            id: order.order_id
          }
        })
      }

    },
    loadData() {
      var pageNum = 1
      var pageSize = 20
      var state = -1
      // 调用api获取数据
      // 接口对接
      if (this.order.type === 3) {
        var state = this.order.type - 2
        this.oCurrentPage = this.order.type - 1
      }
      if (this.order.type === 4) {
        var state = this.order.type - 3
        this.oCurrentPage = this.order.type - 2
      }
      order(state, pageNum, pageSize).then(res => {
        if (res.error_code * 1 === ERR_OK) {
          this.orderData = res.data
          this.allData = res.data
          this.dataDeal(res.data)
        } else {
        }
      })
    },
    dataDeal(data) {
      var that = this
      var arr = data
      var listArr = []

      arr.forEach(function (el, index) {
        for (var i = 0; i < listArr.length; i++) {
          // 对比相同的字段key，相同放入对应的数组
          if (listArr[i].payState === el.payState) {
            listArr[i].listInfo.push({
              order_id: el.order_id,
              payState: el.payState,
              hospitalName: el.hospitalName,
              departmentName: el.departmentName,
              serviceTime: el.serviceTime,
              startTime: el.startTime,
              endTime: el.endTime
            })
            return
          }
        }
        // 第一次对比没有参照，放入参照
        listArr.push({
          payState: el.payState,
          listInfo: [
            {
              order_id: el.order_id,
              payState: el.payState,
              hospitalName: el.hospitalName,
              departmentName: el.departmentName,
              serviceTime: el.serviceTime,
              startTime: el.startTime,
              endTime: el.endTime
            }
          ]
        })
      })
      that.orderList = listArr
    },
    // 获取子组件传过来的当前页码值
    msgFromChild(data) {
      if (data || data === 0) {
        this.oCurrentPage = data
        var pageNum = 1
        var pageSize = 20
        order(this.oCurrentPage - 1, pageNum, pageSize).then(res => {
          if (res.error_code * 1 === ERR_OK) {
            this.orderData = res.data
            this.allData = res.data
            this.dataDeal(res.data)
          } else {
          }
        })
      }
    },
    ...mapMutations({
      setOrder: "SET_ORDER"
    })
  },
  mounted() {
    this.msgFromChild()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '~common/stylus/variable';

.orderViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 156;
  background: #f5f3f4;

  .nav {
    ul {
      list-style: none;
      display: flex;
      height: 40px;
      line-height: 40px;
      font-size: $font-size-medium;
      background: #fff;
      border-bottom: 1px solid #dbdcde;

      li {
        list-style: none;
        flex: 1;
        text-align: center;

        .tab-link {
          padding-bottom: 5px;
          color: $color-default;
        }
      }

      .active {
        .tab-link {
          color: $color-theme;
          border-bottom: 2px solid $color-theme;
        }
      }
    }
  }

  .wrapper {
    height: calc(100vh - 84px);
    overflow: hidden;
  }

  .detail {
    .van-cell {
      border: 0;
    }
  }

  .custom-text {
    text-align: left;
  }
}
</style>
