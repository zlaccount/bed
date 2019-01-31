import axios from 'axios'
// 用户端
// 1.扫码或输入编号开锁接口（写好待测）
export function openLock(code) {
  const url = '/openLock'
  const data = Object.assign({}, {
    user_id: localStorage.getItem('id') ? localStorage.getItem('id') : '',
    chaperonage_bed_code: code
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 2.正常关锁接口
export function normalClose(chaperonage_bed_code) {
  const url = '/close_lock'
  const data = Object.assign({}, {
    user_id: localStorage.getItem('id') ? localStorage.getItem('id') : '',
    chaperonage_bed_code: chaperonage_bed_code
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 3.判断用户是否正在使用陪护床接口
export function busy() {
  const url = '/busy'
  const data = Object.assign({}, {
    user_id: localStorage.getItem('id') ? localStorage.getItem('id') : ''
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 4.用户进入缴纳押金界面或查看押金接口（写好待测）
export function deposit() {
  const url = '/pay_deposit'
  const data = Object.assign({}, {
    user_id: localStorage.getItem('id') ? localStorage.getItem('id') : ''
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 5.用户缴纳押金接口
export function payDeposit(way) {
  const url = '/cash_pledge'
  const data = Object.assign({}, {
    user_id: localStorage.getItem('id') ? localStorage.getItem('id') : '',
    pay_way: way
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 6.用户使用完陪护床后支付费用接口
export function waitPay(order_id, state) {
  const url = '/pay'
  const data = Object.assign({}, {
    user_id: localStorage.getItem('id') ? localStorage.getItem('id') : '',
    order_id: order_id,
    pay_way: state
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 8.退还押金接口
export function refunddeposit() {
  const url = '/deposit_refund'
  const data = Object.assign({}, {
    user_id: localStorage.getItem('id') ? localStorage.getItem('id') : ''
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 9.我的订单接口（写好待测）
export function order(state, pageNum, pageSize) {
  const url = '/my_order'
  const data = Object.assign({}, {
    user_id: localStorage.getItem('id') ? localStorage.getItem('id') : '',
    pay_state: state,
    pageNum: pageNum,
    pageSize: pageSize
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 10.详情订单接口（写好待测）
export function orderDetail(order_id) {
  const url = '/order_form'
  const data = Object.assign({}, {
    user_id: localStorage.getItem('id') ? localStorage.getItem('id') : '',
    order_id: order_id
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 11.使用规则接口
export function instructions(deposit, cost) {
  const url = '/instructions'
  const data = Object.assign({}, {
    cashPledgeMoney: deposit,
    costNormal: cost
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 微信支付
export function pay(order_id) {
  const url = '/E2306_service/app/rescheduAppletPay'
  const data = Object.assign({}, {
    user_id: localStorage.getItem('id') ? localStorage.getItem('id') : '',
    order_id: order_id
  })
  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
// 微信支付方法（点击按键调用）
export function jsApiCall(data) {
  // let redirectURI = encodeURIComponent(URIString)     // url需要encode
  // window.location = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + response.data.data.jsapiAppId + '&redirect_uri=' + redirectURI + '&response_type=code&scope=snsapi_base&state=WXPaySTATE#wechat_redirect'
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest', {
      appId: data.appid, // 公众号名称，由商户传入
      timeStamp: String(data.timestamp), // 时间戳，自1970年以来的秒数
      nonceStr: data.noncestr, // 随机串
      package: 'prepay_id=' + data.prepayid,
      signType: 'MD5', // 微信签名方式：
      paySign: data.sign // 微信签名
    },
    function (res) {
      console.log(res)
      if (res.err_msg == 'get_brand_wcpay_request:ok') {
        let params = {
          arrAddress: ''
        }
        this.$router.push({
          name: 'bed',
          params: params
        })
        // 使用以上方式判断前端返回,微信团队郑重提示：
        // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
      }
    }
  )
}
export function getUrlKey(name) {
  let url = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let newUrl = window.location.search.substr(1).match(url)
  if (newUrl != null) {
    return unescape(newUrl[2])
  } else {
    return false
  }
}
