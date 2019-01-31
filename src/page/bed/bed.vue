<template>
    <div class="bed">
        <div class="navbed">
            <van-nav-bar fixed title="共享陪护床" @click-right="manger">
                <img
                    src="../../../static/img_icon/more.png"
                    slot="right"
                    class="mangerIcon"
                />
            </van-nav-bar>
        </div>
        <div class="topblank"></div>
        <van-steps
            :active="stepsActive"
            active-color="#4FD6BC"
            v-if="!usedingState.state"
        >
            <van-step>扫码 </van-step>
            <van-step>开锁</van-step>
            <van-step>支付</van-step>
        </van-steps>
        <!-- 开锁方式 -->
        <div class="way">
            <van-popup v-model="openLockIsShow">
                <div class="topservice">
                    <van-row>
                        <van-col span="24">
                            <div class="topImg">
                                <img
                                    src="../../../static/img/Sweeptheyard.png"
                                    class="more"
                                    @click="wx()"
                                />
                            </div>
                            <p>扫码开锁</p>
                        </van-col>
                    </van-row>
                    <van-row>
                        <van-col span="24">
                            <div class="topImg">
                                <img
                                    src="../../../static/img/Theinput.png"
                                    class="more"
                                    @click="handinput()"
                                />
                            </div>
                            <p>输入编码开锁</p>
                        </van-col>
                    </van-row>
                </div>
            </van-popup>
            <div class="pleaseSelect">
                <p class="pleaseText">请选择开锁方式</p>
                <p class="tip">提示:未在医院工作时间内不能成功开锁</p>
            </div>
        </div>
        <!-- 解锁 -->
        <div class="lockresult">
            <!-- 开锁失败 -->
            <div class="lockTopay">
                <van-popup v-model="toPayPop">
                    <div class="fail">
                        <p>
                            <img
                                src="../../../static/img/fail.png"
                                alt=""
                                class="failImg"
                            />
                        </p>
                        <div class="unfinished">
                            <p v-if="typeResult == 9">
                                <span class="nopaytitle">您还未缴纳押金</span>
                                <a
                                    href="javascript:void(0)"
                                    @click="toPayRouter(typeResult)"
                                    class="payClickTitle"
                                >
                                    <van-cell title="点击缴纳押金" is-link
                                /></a>
                            </p>
                            <p v-if="typeResult == 10">
                                <span class="nopaytitle">您有未缴纳的订单</span>
                                <a
                                    href="javascript:void(0)"
                                    @click="toPayRouter(typeResult)"
                                    class="payClickTitle"
                                >
                                    <van-cell title="点击查看详情" is-link
                                /></a>
                            </p>
                        </div>
                    </div>
                </van-popup>
            </div>

            <div class="locking">
                <div class="lockLoading" v-if="usedingState.state == true">
                    <div class="loadingBg"></div>
                    <div class="live" @click="useding" v-if="typeResult == 0">
                        <div class="liveimg">
                            <img src="../../../static/img/lock.png" />
                        </div>
                        <span></span> <span></span> <span></span>
                        <!-- <p>正在使用...</p> -->
                    </div>
                    <!-- 开锁结果-->
                    <div class="locked">
                        <div class="success" v-if="typeResult == 0">
                            <img
                                src="../../../static/img/success.png"
                                slot="right"
                            />
                            <p>开锁成功...</p>
                        </div>

                        <div class="failure" v-if="typeResult == -1">
                            <img
                                src="../../../static/img/failure.png"
                                slot="right"
                            />
                            <p>开锁失败!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import common from "common/js/common.js";
import { mapGetters, mapMutations } from "vuex";

import {
    busy,
    openLock,
    deposit,
    payDeposit,
    jsApiCall,
    RichScan,
    getUrlKey
} from "api/bed";
import wx from "weixin-js-sdk";
export default {
    components: {},
    data() {
        return {
            // 初始化数据
            stepsActive: 0,
            openLockIsShow: true,
            busyCode: "",
            // -1 开锁失败 0 开锁成功 1 未缴纳押金 2未支付订单
            typeResult: "",
            toPayPop: false, // 解锁失败(未缴纳押金或者未支付订单)
            lockLoading: false // 解锁中
        };
    },
    computed: {
        ...mapGetters(["orderUseState", "usedingState"])
    },
    watch: {},
    methods: {
        // 信息管理
        manger() {
            this.setTrueManger(true);
            // this.$router.push({
            //   name: 'manager'
            // })
        },

        wx() {
            if (localStorage.getItem("id") != null) {
                if (localStorage.getItem("chaperonage_bed_code") === null) {
                    RichScan()
                        .then(res => {
                            let sign = res; //后端返回的微信的数据
                            wx.config({
                                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                appId: sign.appId, // 必填，公众号的唯一标识
                                timestamp: sign.timestamp, // 必填，生成签名的时间戳
                                nonceStr: sign.nonce_str, // 必填，生成签名的随机串
                                signature: sign.signature, // 必填，签名，见附录1
                                jsApiList: ["checkJsApi", "scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            });
                            wx.ready(function() {
                                wx.checkJsApi({
                                    jsApiList: ["scanQRCode"],
                                    success: function(res) {
                                        // 以键值对的形式返回，可用true，不可用false。如：{"checkResult":{"scanQRCode":true},"errMsg":"checkJsApi:ok"}
                                        if (
                                            res.checkResult.scanQRCode != true
                                        ) {
                                            alert(
                                                "抱歉，当前客户端版本不支持扫一扫"
                                            );
                                        }
                                    },
                                    fail: function(res) {
                                        //检测getNetworkType该功能失败时处理
                                        alert("checkJsApi error");
                                    }
                                });

                                /*处理失败验证*/
                                wx.error(function(res) {
                                    alert("share error: " + res.errMsg);
                                });

                                wx.scanQRCode({
                                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
                                    scanType: ["qrCode"],
                                    success: function(res) {
                                        console.log(res);
                                        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                                        alert("扫描结果：" + result);
                                        window.location.href = result; //因为我这边是扫描后有个链接，然后跳转到该页面

                                        // var data = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                                        // var result = data.split(",")[1]; //返回的结果是码的类型+‘,’+内容，所以要以数组分割取第二个。
                                        //处理自己的逻辑
                                    },
                                    fail: function(res) {
                                        console.log(res);
                                        alert(JSON.stringify(res));
                                    }
                                });
                            });
                        })
                        .catch(function(err) {});
                } else {
                    this.$toast("有正在使用订单");
                }
            } else {
                this.$toast("您还未登录");
            }
        },
        handinput() {
            if (localStorage.getItem("id") != null) {
                this.$router.push({
                    name: "serial"
                });
            } else {
                this.$toast("您还未登录");
            }
        },
        payBtn() {
            const vm = this;
            let wx = require("weixin-js-sdk");
            var user_id = localStorage.getItem("id")
                ? localStorage.getItem("id")
                : "";
            // 接口对接
            if (user_id != "") {
                console.log(111);
                payDeposit(user_id, 1).then(res => {
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
            } else {
                this.$toast("您还未登录");
            }
        },

        _getData() {
            // 根据key名获取传递回来的参数，data就是map
            common.$on(
                "handresult",
                function(code, data) {
                    // 解锁成功
                    if (code === 0) {
                        this.lockLoading = true;
                        this.typeResult = data;
                        this._busy();
                        return false;
                    }
                    // 解锁失败，原因是有未支付订单
                    if (data === 10) {
                        console.log("data", data);
                        this.toPayPop = true;
                        this.typeResult = data;
                    }
                    // 解锁失败，原因是未缴纳押金
                    if (data === 9) {
                        console.log("data", data);
                        this.toPayPop = true;
                        this.typeResult = data;
                    }
                    // 解锁失败，原因是陪护床编号不存在
                    if (data === 3) {
                        console.log("data", data);
                        this.toPayPop = true;
                        this.typeResult = data;
                    }
                    // 网络原因解锁失败
                    if (data === -1) {
                    }
                }.bind(this)
            );
            this._busy();
        },
        _busy() {
            busy().then(res => {
                if (res.error_code * 1 === 1) {
                    this.$router.push({
                        name: "useDing",
                        params: {
                            id: res.data.chaperonage_bed_code
                        }
                    });
                    this.busyCode = res.data.chaperonage_bed_code;
                    this.setUsedingState({
                        state: true,
                        res: res.data
                    });
                    this.setOrderUseState({
                        state: false
                    });
                    this.$toast("有正在使用订单");
                }
            });
        },
        // 正在使用
        useding() {
            this._openLock();
        },
        _openLock() {
            openLock(
                this.orderUseState.busyCode
                    ? this.orderUseState.busyCode
                    : this.busyCode
            ).then(res => {
                if (res.error_code * 1 === 1) {
                    return false;
                } else {
                    this.$router.push({
                        name: "useDing",
                        params: {
                            id: res.data.chaperonage_bed_code
                        }
                    });
                    this.setUsedingState({
                        state: true,
                        res: res.data
                    });
                    this.setOrderUseState({
                        state: true,
                        res: res.data
                    });
                }
            });
        },
        toPayRouter(index) {
            this.openLockIsShow = false;
            this.toPayPop = false;
            // 未支付订单
            if (index === 10) {
                this.setOrder({
                    type: 4
                });
                this.$router.push({
                    name: "order"
                });
                return false;
            }
            // 未缴纳押金
            if (index === 9) {
                deposit().then(res => {
                    this.$router.push({
                        name: "deposit",
                        params: {
                            id: res.error_code
                        }
                    });
                    this.setDepositType({
                        type: res.error_code * 1
                    });
                    return false;
                });
            }
        },
        ...mapMutations({
            setDepositType: "SET_DEPOSIT_TYPE",
            setTrueManger: "SET_BEDMANAGER",
            setOrderUseState: "SET_ORDER_USE_STATE",
            setUsedingState: "SET_USEDING_STATE",
            setOrder: "SET_ORDER"
        })
    },
    created() {
        this._getData();
    },
    mounted() {
        clearInterval(this.timer);
    },
    beforeCreate() {},
    beforeMount() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {
        clearInterval(this.timer);
    },
    activated() {}
};
</script>
<style scoped lang="stylus">
.van-steps {
  background: #f5f3f4;
  height: 72px;
  width: 80%;
  height: 72px;
  position: absolute;
  top: 46px;
  z-index: 10;
  margin-left: 10%;
  margin-right: 10%;
  padding: 0;

  .van-steps__items .van-steps__items--alone {
    height: 70px !important;
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

.useding {
  position: relative;
  z-index: 100;
}

.lockresult {
  // 开锁失败
  .lockTopay {
    .van-popup {
      text-align: center;
      width: 60%;
      height: 320px;
      font-size: 13px;

      .failImg {
        margin: 50px 0 0;
      }

      .unfinished {
        color: #999;
        font-size: 14px;
        display: block;
        height: 100px;

        p {
          span {
            display: block;
            line-height: 62px;
          }

          a {
            display: block;
            height: 45px;
            letter-spacing: 1px;
            position: absolute;
            z-index: 10000;
            width: 100%;
            margin: 0;
            bottom: 25px;
            left: 0;
            line-height: 30px;
          }
        }
      }
    }
  }

  .locking {
    // 开锁中
    .lockLoading {
      .loadingBg {
        position: fixed;
        width: 200px;
        height: 302px;
        top: 50%;
        left: 50%;
        z-index: 10;
        background: #f5f3f4;
        margin-left: -100px;
        margin-top: -151px;
      }

      .live {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 12;
        width: 120px;
        height: 120px;
        margin-left: -60px;
        margin-top: -105px;
        z-index: 12;

        .liveimg {
          width: 120px;
          height: 120px;
          background: #b0e2d7;
          border-radius: 50%;
          position: relative;

          img {
            z-index: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -30px;
            margin-left: -25px;
          }
        }

        @keyframes living {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }

          50% {
            transform: scale(1.5);
            opacity: 0; /* 圆形放大的同时，透明度逐渐减小为0 */
          }

          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }

        span {
          position: absolute;
          width: 100px;
          height: 100px;
          left: 0;
          bottom: 0;
          border-radius: 50%;
          background: #b0e2d7;
          -webkit-animation: living 3s linear infinite;
          border: 10px solid #bce5dd;
          z-index: -1;
        }

        span:nth-child(2) {
          -webkit-animation-delay: 1s; /* 第二个span动画延迟1.5秒 */
        }

        span:nth-child(3) {
          -webkit-animation-delay: 1.5s; /* 第三个span动画延迟1.5秒 */
        }
      }
    }

    // 开锁成功
    .locked {
      position: fixed;
      width: 200px;
      height: 302px;
      top: 50%;
      left: 50%;
      z-index: 10;
      background: #f5f3f4;
      margin-left: -100px;
      margin-top: -151px;

      div {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 105px;
        height: 105px;
        margin-left: -52px;
        margin-top: -105px;
        z-index: 12;
        text-align: center;
      }

      .success {
        p {
          margin: 40px 0 0px;
          color: #4fd6bc;
        }
      }

      .failure {
        p {
          margin: 40px 0 0px;
          color: orange;
        }
      }

      h4 {
        font-size: 24px;
        font-weight: 400;
        margin: 0;
      }
    }
  }
}
</style>
