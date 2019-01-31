<template>
  <transition name="slide">
    <div id="usedingViewPage">
      <van-nav-bar
        fixed
        left-arrow
        @click-left="onClickLeft"
        title="共享陪护床"
      >
      </van-nav-bar>
      <div class="topblank"></div>
      <!-- 复杂场景 -->
      <Scroll
        ref="scroll"
        :updateData="[list]"
        :refreshData="[]"
        class="content"
        @pullingDown="loadRefresh"
        @pullingUp="loadMore"
      >
        <div>
          <div class="cellCon">
            <div class="gray"></div>
            <div class="beginUse">
              <div class="flexItem useTimeTitle">
                <div class="flex-item">开锁时间</div>
                <div class="flex-item">使用时间</div>
              </div>
              <div class="flexItem dateText">
                <div class="flex-item">
                  <div class="times">{{ startDate }}</div>
                  <div class="date">{{ startTime }}</div>
                </div>
                <div class="flex-item leftLine">
                  <div
                    class="times"
                    id="mytime"
                  >{{ str }}</div>
                </div>
              </div>
              <div class="beginBlank"></div>
            </div>
            <!-- <van-cell
              title="订单号"
              :value="res.order_id"
            > </van-cell> -->
            <div class="useding">
              <van-cell-group>
                <van-cell
                  title="医院"
                  :value="res.hospital_name"
                >
                </van-cell>
                <van-cell
                  title="科室"
                  :value="res.department_name"
                >
                </van-cell>
                <van-cell
                  title="病房号"
                  :value="res.room_number"
                >
                </van-cell>
                <van-cell
                  title="陪护床编号"
                  :value="res.chaperonage_bed_code"
                >
                </van-cell>
                <van-cell
                  title="管理员"
                  :value="res.user_name"
                />
                <van-cell
                  title="联系方式"
                  :value="res.mobile_phone"
                />
                <!-- <van-cell
                  title="预计消费"
                  :value="res.cost"
                  v-if="costShow"
                /> -->
                <van-cell
                  title="预计消费"
                  v-if="!costShow"
                  :value="cost"
                />
              </van-cell-group>
            </div>
            <div class="usedingBlank"></div>
            <div class="question">
              <p>手动将陪护床推进床柜即可关锁</p>
              <van-button
                type="default"
                class="breakdown"
                @click="breakdownClose"
              >
                故障关闭
              </van-button>
              <van-button
                class="normal"
                type="default"
                @click="normalClose"
              >
                正常关锁
              </van-button>
            </div>
          </div>
        </div>
      </Scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import Scroll from "base/lib";
import { timeout } from "base/lib/Scroll/utils";
import WaitPay from "components/waitPay/waitPay";
import { busy, normalClose, openLock } from "api/bed";
import { ERR_OK } from "api/config";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    Scroll,
    WaitPay
  },
  data() {
    return {
      list: [],
      res: {},
      costShow: false,
      cost: 0,
      startDate: "",
      startTime: "",
      // 初始化数据
      h: 0, // 定义时，分，秒，毫秒并初始化为0；
      m: 0,
      ms: 0,
      s: 0,
      time: 0,
      str: "",
      mytime: "",
      costTime: 0,
      chaperonage_bed_code: ""
    };
  },
  // 监控data中的数据变化
  watch: {
    cost(val, oldval) {
      this.cost = val;
    }
  },
  created() {
    // 不会引起DOM变化的数据在此定义
    this.page = 1;
    this.pageSize = 10;
  },
  computed: {
    ...mapGetters(["orderUseState", "order"])
  },
  mounted() {
    this.time = setInterval(this.timer, 60)
    // if (this.orderUseState.state === true) {
    //   let _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    //   _this.cost = (_this.orderUseState.res.cost) * 1
    //   _this.timer = setInterval(() => {
    //     _this.cost = (_this.orderUseState.res.cost) * 1 + 2
    //   }, _this.orderUseState.res.free_time * 1000)
    // }
    this.loadRefresh();
    this.getData()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  }, // 生命周期 - 销毁之前
  methods: {
    onClickLeft() {
      // this._busy()
      this.$router.back();
    },
    _busy() {
      var user_id = localStorage.getItem("id") ? localStorage.getItem("id") : '';
      //接口对接
      busy().then(res => {
        if ((res.error_code) * 1 === 1) {
          this.chaperonage_bed_code = res.data.chaperonage_bed_code
          this.setOrderUseState({
            state: false,
            busyCode: res.data.chaperonage_bed_code
          });
        }
      });
    },
    getData() {
      // if (this.orderUseState.state === false) {
        // this.$router.push({
        //   name: 'bed'
        // })
      // }
    },
    start(bolean) {
      let _this = this;
      let hour, minute, second;
      hour = minute = second = 0;
      if (bolean === true) {
        _this.timer = setInterval(function () {
          if (second >= 0) {
            second = second + 1;
          }
          if (second >= 60) {
            second = 0;
            minute = minute + 1;
          }
          if (minute >= 60) {
            minute = 0;
            hour = hour + 1;
          }
          _this.callinTime =
            hour + "时" + minute + "分" + second + "秒";
        }, 1000);
      } else {
        window.clearInterval(_this.timer);
      }
    },

    timer() {
      // 定义计时函数
      let that = this;
      that.ms = that.ms + 60; // 毫秒
      if (that.ms >= 1000) {
        that.ms = 0;
        if (that.orderUseState.state === true) {
          that.s = that.s + 1; // 秒
        }
      }
      if (that.s >= 60) {
        that.s = 0;
        that.m = that.m + 1; // 分钟
        that.costTime = that.costTime + 1;
      }
      if (that.m >= 60) {
        that.m = 0;
        that.h = that.h + 1; // 小时
      }
      // 半小时

      if (that.orderUseState.state === true) {
        if (
          that.orderUseState.service_time * 1 <=
          that.orderUseState.free_time * 1
        ) {
          that.cost = that.orderUseState.res.cost * 1;
        } else {
          if (that.costTime >= 30) {
            that.costShow = false;
            that.cost = that.orderUseState.res.cost * 1 + 2;
          }
        }
      }
      that.str =
        that.toDub(that.h) +
        ":" +
        that.toDub(that.m) +
        ":" +
        that.toDub(that.s) +
        ""; /* +that.toDubms(this.ms)+"毫秒" */
      // document.getElementById('mytime').innerHTML=h+"时"+m+"分"+s+"秒"+ms+"毫秒";
    },

    reset() {
      // 重置
      clearInterval(this.time);
      this.h = 0;
      this.m = 0;
      this.ms = 0;
      this.s = 0;
      this.str = "00:00:00";
    },

    start() {
      // 开始
      this.time = setInterval(this.timer, 60);
    },

    stop() {
      // 暂停
      clearInterval(this.time);
    },

    toDub(n) {
      // 补0操作
      if (n < 10) {
        return "0" + n;
      } else {
        return "" + n;
      }
    },

    toDubms(n) {
      // 给毫秒补0操作
      if (n < 10) {
        return "00" + n;
      } else {
        return "0" + n;
      }
    },
    // 故障反馈关闭
    breakdownClose() {
      this.$router.push({
        name: "feedback"
      });
    },
    // 正常关锁
    normalClose() {
      normalClose(this.orderUseState.res.chaperonage_bed_code).then(res => {
        console.log(res);
        if (res.error_code * 1 === ERR_OK) {
          this.$router.push({
            name: "closeLock",
          });
          this.setNormalState({
            state: true,
            order: res.data
          });
          this.setOrderUseState({
            state: false
          });
          this.setUsedingState({
            state: false
          });
        }
      }
      );
    },

    // 滚动到顶部
    scrollToTop() {
      this.$refs.scroll.scrollToTop();
    },
    // 滚动到底部
    scrollToBottom() {
      this.$refs.scroll.scrollToBottom();
    },
    // 加载刷新数据
    async loadRefresh() {
      const data = await this._fetchList();

      // 初始化数据
      this.list = data;
      this.page = 1;
    },
    // 加载更多数据
    async loadMore() {
      const page = this.page + 1;
      const data = await this._fetchList(page);

      this.list.push(...data);
      data.length < this.pageSize
        ? this.$refs.scroll.update(true)
        : this.page++; // 判断是否已达最后一页?如果已是最后一页，可调用this.$refs.scroll.update(true)关闭上拉
    },

    // 模拟一个异步获取列表操作

    async _fetchList(page = 1, pageSize = this.pageSize) {
      if (!this.$route.params.id) {
        this.$router.push("/bed");
        return;
      }
      openLock(this.$route.params.id).then(res => {
        this.res = res.data;
        this.startDate = res.data.start_time.trim().split(" ")[1];
        this.startTime = res.data.start_time.trim().split(" ")[0];
      });
      try {
        await timeout(1000);

        if (page < 3) {
          // 模拟数据返回
          return Array.from(
            { length: pageSize },
            (value, index) => `第${page}页的数据${value}`
          );
        } else {
          // 模拟已到达最后一页时的数据返回
          return Array.from(
            { length: pageSize / 2 },
            (value, index) => `最后一页,第${page}页的数据${value}`
          );
        }
      } catch (e) {
        return false;
      }
    },
    ...mapMutations({
      setTrueManger: 'SET_BEDMANAGER',
      setOrderUseState: 'SET_ORDER_USE_STATE',
      setFeedBackState: 'SET_FEEDBACK',
      setNormalState: 'SET_NORMAL_STATE',
      setUseding: "SET_USEDING_STATE",
      setUsedingState: 'SET_USEDING_STATE'

    })
  }
};
</script>

<style lang="stylus">
$headerHeight = 44px;
$baseColor = #6A9FB5;
$bgColor = #FAFAFA;

#usedingViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 152;
  background: #f5f3f4;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .beginUse {
    position: relative;

    .flexItem {
      display: flex;
      align-items: center; /* 垂直居中 */
      justify-content: center; /* 水平居中 */
      width: 100%;
      height: 100%;
      text-align: center;

      .flex-item {
        flex: 1;
      }
    }

    .useTimeTitle {
      line-height: 36px;
      background: #fff;
      margin-top: 10px;
      font-size: 16px;
    }

    .dateText {
      .leftLine {
        border-left: 1px solid #ccc;
        margin: 10px 0;
      }

      .times {
        color: orange;
        font-size: 20px;
        line-height: 34px;
      }

      .date {
        font-size: 14px;
        color: #999;
        padding-bottom: 10px;
      }
    }

    .beginBlank {
      height: 10px;
      background: #fff;
      margin-bottom: 10px;
    }

    .cell {
      .van-cell {
        color: #999;
      }
    }

    .van-popup {
      background: #f5f3f4;
    }
  }

  .usedingBlank {
    height: 100px;
  }

  .question {
    width: 94%;
    position: absolute;
    bottom: 20px;
    left: 0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;

    p {
      color: #999;
      text-align: center;
      font-size: 12px;
      line-height: 25px;
    }

    .breakdown {
      width: 50%;
      background: #f39357;
      color: #fff;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      float: left;
    }

    .normal {
      width: 50%;
      color: #fff;
      background: #4fd6bc;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      float: left;
    }
  }

  .content {
    flex: 1;
    background-color: $bgColor;
    overflow: hidden;
    box-sizing: border-box;

    ul {
      li {
        background: #fff;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: $baseColor;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>
