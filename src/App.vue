<template>
  <div id="app">
    <router-view></router-view>
    <manager></manager>
    <result></result>
    <directions></directions>
    <tab></tab>
  </div>
</template>

<script type="text/ecmascript-6">
import Tab from 'components/tab/tab'
import Manager from 'components/manager/manager'
import Result from 'components/result/result'
import Directions from 'components/directions/directions'
import { mapMutations } from "vuex";
import { getWxCode, getUrlCode, getOpenId, deposit, busy } from "api/bed";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {

    }
  },
  methods: {
    _getData() {
      // 是否缴纳押金
      deposit().then(res => {
        console.log(res)
        this.setDepositType({
          type: (res.error_code) * 1,
          money: (res.cash_pledge_money) * 1
        })
        if (res.error_code * 1 === 0) {
          this.$toast("已经缴纳押金")
          // 是否有正在使用订单
          busy().then(res => {
            if (res.error_code * 1 === 1) {
              this.busyCode = res.data.chaperonage_bed_code;
              this.setUsedingState({
                state: true,
                res: res.data
              });
              this.$toast("有正在使用订单");
            }
          });
        } else {
          this.$toast("未缴纳押金")
        }
      });
      // 获取code
      // getWxCode().then(res => {
      //   if (!getUrlCode('code')) {
      //     this.$toast('微信授权中……')
      //     let currentUrl = encodeURIComponent(window.location.href)
      //     window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc925a2130da89369&redirect_uri=' + currentUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      //   } else {
      //     this.code = getUrlCode('code')
      //     // 获取openid
      //     getOpenId(this.code).then(res => {
      //       this.setOpenId({
      //         openId: res
      //       });

      //       deposit().then(res => {
      //         this.setDepositType({
      //           type: parseInt(res.error_code),
      //           money: parseInt(res.cash_pledge_money)
      //         })
      //       });

      //     })
      //   }
      // })
    },
    ...mapMutations({
      setOpenId: "SET_OPENID",
      setDepositType: "SET_DEPOSIT_TYPE",
      setUsedingState: "SET_USEDING_STATE",
    })
  },
  components: {
    Tab, Manager, Result, Directions
  },
  mounted() {

  },
  created() {
    this._getData();
  },
}
</script>

<style scoped></style>
