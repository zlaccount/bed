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
      <!-- 导航 -->
      <div class="nav">
        <div class="nav-tab">
          <ul>
            <li
              class="item"
              v-for="(n, index) in title"
              :key="index"
              @click="changeNav(index)"
              :class="{ active: index === oCurrentPage }"
            >
              {{ n.name }}
            </li>
          </ul>
        </div>
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
            <ul style="width:100%;min-height:100%">
              <li style="min-height:300px;background-color:#DDDDDD;">
                1
              </li>
              <li style="min-height:300px;background-color:#AAAAAA;">
                2
              </li>
              <li style="min-height:300px;background-color:#888888;">
                3
              </li>
            </ul>
          </up-down>
        </div>
      </slider>
      <div class="loading-wrapper"></div>
      <!-- <div>
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
        </div> -->
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import Slider from "base/scrolltab/slider";
import UpDown from "base/scrolltab/UpDown";

import { busy, normalClose, openLock } from "api/bed";
import { ERR_OK } from "api/config";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    Slider,
    UpDown
  },
  data() {
    return {
      data: [1, 1, 1, 1, 1],
      pulldown: true,
      title: [
        { name: "推荐" },
        { name: "新品" },
        { name: "众筹" },
        { name: "限时购" },
        { name: "居家" }
      ],
      oCurrentPage: 0,
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
    this.loadData();
  },
  computed: {
    ...mapGetters(["orderUseState", "order"])
  },
  mounted() {
    this.msgFromChild();
    this.time = setInterval(this.timer, 60);
    // if (this.orderUseState.state === true) {
    //   let _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    //   _this.cost = (_this.orderUseState.res.cost) * 1
    //   _this.timer = setInterval(() => {
    //     _this.cost = (_this.orderUseState.res.cost) * 1 + 2
    //   }, _this.orderUseState.res.free_time * 1000)
    // }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  }, // 生命周期 - 销毁之前
  methods: {
    onClickLeft() {
      // this._busy()
      this.$router.back();
    },
    _busy() {
      var user_id = localStorage.getItem("id")
        ? localStorage.getItem("id")
        : "";
      //接口对接
      busy().then(res => {
        if (res.error_code * 1 === 1) {
          this.chaperonage_bed_code = res.data.chaperonage_bed_code;
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
      normalClose(this.orderUseState.res.chaperonage_bed_code).then(
        res => {
          console.log(res);
          if (res.error_code * 1 === ERR_OK) {
            this.$router.push({
              name: "closeLock"
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
    changeNav(num) {
      this.oCurrentPage = num;
      console.log(this.oCurrentPage);
      this.$refs.sendPage.setPage(this.oCurrentPage);
    },
    loadData() {
      // 调用api获取数据
      console.log("初始化页面数据");
    },
    // 获取子组件传过来的当前页码值
    msgFromChild(data) {
      if (data || data === 0) {
        this.oCurrentPage = data;
      }
    },

    ...mapMutations({
      setTrueManger: "SET_BEDMANAGER",
      setOrderUseState: "SET_ORDER_USE_STATE",
      setFeedBackState: "SET_FEEDBACK",
      setNormalState: "SET_NORMAL_STATE",
      setUseding: "SET_USEDING_STATE",
      setUsedingState: "SET_USEDING_STATE"
    })
  }
};
</script>

<style lang="stylus">
@import 'variable.styl';

body, html {
  line-height: 1;
  font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
  user-select: none;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  background: $color-background;
  color: $color-text;
}

.van-steps--horizontal .van-steps__items.van-steps__items--alone {
  margin: 0;
  padding: 0;
}

.van-nav-bar__title {
  color: #fff;
}

.van-step--horizontal:last-child .van-step__circle-container {
  right: -19px;
}

.van-cell {
  border-bottom: 1px solid #ebedf0;
}

.van-cell::after {
  border: 0;
}

.van-cell:not(:last-child)::after {
  border-bottom: 0;
}

.van-tabbar-item--active {
  color: #4fd6bc;
}

.topblank {
  height: 46px;
}

.van-nav-bar {
  background: #4fd6bc;
  color: #fff;
}

.van-popup {
  height: 100%;
  width: 100%;
  // z-index: 10 !important;
}

// .BgPop{
// .van-popup {
// background: $color-background;
// }
// }
// 滑动
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

// 页面
.routerViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: $color-background;
}

.mangerIcon {
  position: fixed;
  top: 12px;
  right: 10px;
  width: 20px;
  height: 20px;
}

.van-step--horizontal .van-step__circle-container {
  background-color: transparent;
}

// .van-overlay{
// background-color: rgba(0,0,0,.5);
// }
.way {
  .van-overlay {
    display: none;
  }
}

// 护士端
.van-collapse-item {
  .van-cell {
    padding: 12px 0;

    .van-cell__right-icon {
      position: absolute;
      right: -2px;
    }
  }

  .van-collapse-item__wrapper {
    // position: absolute;
    // width: 100%;
    // left 0
    // right: 0
    .van-collapse-item__content {
      padding: 0;

      .van-cell {
        padding: 10px 0;
      }
    }
  }
}

.van-collapse-item__title--expanded {
  .colltitle {
    color: $color-theme;
  }
}

.van-collapse-item:last-child {
  .van-cell__right-icon {
    right: 12px;
  }
}

// 列表
.gray {
  height: 10px;
  background: #f5f3f4;
}

.white {
  height: 10px;
  background: #fff;
  position: relative;
}

.itemFinished {
  color: #2d9e43;
}

.itemWaitPay {
  color: #fd0708;
}

.itemAudit {
  color: #fe191a;
}

.entry span {
  color: #fe191a;
}

// 登录
.loginCon {
  .van-field .van-cell__title {
    max-width: 55px !important;
  }
}

.van-cell__left-icon {
  color: #4fd6bc;
}

// 客服服务
.van-dialog .van-button {
  height: 40px;
  line-height: 40px;
}

.van-dialog__confirm, .van-dialog__confirm:active {
  color: #4fd6bc;
  border-left: 1px solid #ebedf0 !important;
}

.confirmCon {
  .van-field__control {
    background: #ededed;
    border-radius: 5px;
    padding-left: 5px;
    height: 30px;
  }
}

.textarea {
  .van-field__control {
    color: #999;
    min-height: 80px;
  }
}

.van-hairline--top-bottom::after {
  border: 0;
}

// 
.van-collapse-item__wrapper {
  position: absolute;
  width: 100%;
  right: 0;
  left: 0;
  z-index: 100;
}

// 个人资料
.person {
  .van-field__control {
    text-align: right;
    color: #000;
  }

  .van-cell__value {
    color: #000;
    padding-right: 10px;
  }

  .phone {
    .van-cell__value {
      padding-right: 0px;
    }
  }

  .van-hairline--top-bottom::after {
    border: 0;
  }
}

.van-nav-bar {
  .van-icon, .van-nav-bar__text {
    color: #fff;
  }
}

.person {
  .van-nav-bar {
    .van-icon, .van-nav-bar__text {
      color: #999;
    }
  }
}

// 解锁失败
.unfinished {
  .van-cell {
    width: 142px;
    margin: 0 auto;
    border: 0;

    .van-cell__title {
      color: orange;
    }

    .van-cell__right-icon {
      color: #ffa500;
      margin: 0;
    }
  }
}

.leftIcon {
  width: 15px;
  height: 15px;
  margin: -2px 0px;
}

.way {
  .van-popup {
    width: 200px;
    height: 302px;
    background: #f5f3f4;
    z-index: 10 !important;
  }

  .light {
    height: 20px;
    width: 15px;
    position: relative;
    top: 5px;
  }

  .topservice {
    text-align: center;

    .van-row:first-child {
      margin-bottom: 20px;
    }

    .topImg {
      margin-top: 10px;

      img {
        width: 100px;
        height: 100px;
      }
    }

    .h4 {
      font-weight: 400;
    }

    p {
      font-size: 14px;
      color: #4fd6bc;
      margin: 0;
      line-height: 25px;
    }
  }

  .pleaseSelect {
    width: 100%;
    position: fixed;
    text-align: center;
    font-size: 12px;
    bottom: 72px;
    left: 0;

    p {
      margin: 0;
    }

    .pleaseText {
      color: #4fd6bc;
      line-height: 25px;
    }

    .tip {
      color: #ccc;
    }
  }
}

// 故障反馈
.selectQues {
  .van-radio .van-icon {
    display: none;
  }

  .van-radio__label {
    width: 100%;
    text-align: center;
    margin: 0;
    color: #999;
  }

  .radioActive {
    border: 1px solid red !important;

    .van-radio__label {
      color: red;
    }
  }
}

// 列表
.detail {
  .van-cell {
    .link {
      position: absolute;
      top: 50%;
      right: 12px;
      margin-top: -7px;
    }
  }
}

.van-cell {
  z-index: 100;
}
</style>
