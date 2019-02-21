<template>
  <transition name="slide">
    <div id="detailViewPage">
        <van-nav-bar
            fixed
            left-arrow
            @click-left="onClickLeft"
            title="订单详情"
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
                    <van-cell title="订单号" :value="res.order_id"> </van-cell>
                    <div class="detail">
                        <van-cell-group>
                            <van-cell title="医院" :value="res.hospital_name">
                            </van-cell>
                            <van-cell title="科室" :value="res.department_name">
                            </van-cell>
                            <van-cell title="病房号" :value="res.room_number">
                            </van-cell>
                            <van-cell
                                title="陪护床编号"
                                :value="res.chaperonage_bed_code"
                            >
                            </van-cell>
                            <van-cell title="开始时间" :value="res.start_time">
                            </van-cell>
                            <van-cell title="结束时间" :value="res.end_time">
                            </van-cell>
                            <van-cell title="时长" :value="sec_to_time(res.service_time)">
                            </van-cell>
                            <van-cell title="费用" :value="res.cost">
                            </van-cell>
                            <van-cell
                                v-if="res.end_way == 0"
                                value="异常关锁"
                                title="结束方式"
                            >
                            </van-cell>
                            <van-cell
                                v-if="res.end_way == 1"
                                value="正常关锁"
                                title="结束方式"
                            >
                            </van-cell>
                            <van-cell
                                v-if="res.pay_state == 0"
                                value="已完成"
                                title="状态"
                                value-class="itemFinished"
                            >
                            </van-cell>
                            <van-cell
                                v-if="res.pay_state == 1"
                                value="未支付"
                                title="状态"
                                value-class="itemWaitPay"
                            >
                            </van-cell>
                            <van-cell
                                v-if="res.pay_state == 2"
                                value="待审核"
                                title="状态"
                                value-class="itemAudit"
                            >
                            </van-cell>
                            <div v-if="res.pay_state == 1">
                                <wait-pay :orderId="res.order_id"></wait-pay>
                            </div>
                            <div v-if="res.pay_state == 2">
                                <div class="gray"></div>
                                <h4>问题反馈</h4>
                                <div class="textarea">
                                    <p>{{ res.problem_description }}</p>
                                    <div class="uploader">
                                        <img
                                            @click="selectFile"
                                            :src="res.bed_image"
                                            class="uploadImg"
                                            ref="uploadImg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </van-cell-group>
                    </div>
                </div>
            </div>
        </Scroll>
    </div></transition>
</template>

<script>
import Scroll from 'base/lib'
import { timeout } from 'base/lib/Scroll/utils'
import WaitPay from 'components/waitPay/waitPay'
import { ERR_OK } from 'api/config'
import { orderDetail } from 'api/bed'
import { ImagePreview } from 'vant'
export default {
  components: {
    Scroll,
    WaitPay
  },
  data() {
    return {
      list: [],
      res: {}
    }
  },
  created() {
    // 不会引起DOM变化的数据在此定义
    this.page = 1
    this.pageSize = 10
  },
  mounted() {
    this.loadRefresh()
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
    selectFile() {
      ImagePreview([this.$refs.uploadImg.src])
    },
    // 滚动到顶部
    scrollToTop() {
      this.$refs.scroll.scrollToTop()
    },
    // 滚动到底部
    scrollToBottom() {
      this.$refs.scroll.scrollToBottom()
    },
    // 加载刷新数据
    async loadRefresh() {
      const data = await this._fetchList()

      // 初始化数据
      this.list = data
      this.page = 1
    },
    // 加载更多数据
    async loadMore() {
      const page = this.page + 1
      const data = await this._fetchList(page)

      this.list.push(...data)
      data.length < this.pageSize
        ? this.$refs.scroll.update(true)
        : this.page++ // 判断是否已达最后一页?如果已是最后一页，可调用this.$refs.scroll.update(true)关闭上拉
    },

    // 模拟一个异步获取列表操作

    async _fetchList(page = 1, pageSize = this.pageSize) {
      orderDetail(this.$route.params.id).then(res => {
        this.res = res
      })
      try {
        await timeout(1000)

        if (page < 3) {
          // 模拟数据返回
          return Array.from(
            { length: pageSize },
            (value, index) => `第${page}页的数据${value}`
          )
        } else {
          // 模拟已到达最后一页时的数据返回
          return Array.from(
            { length: pageSize / 2 },
            (value, index) => `最后一页,第${page}页的数据${value}`
          )
        }
      } catch (e) {
        return false
      }
    }
  }
}
</script>

<style lang="stylus">
$headerHeight = 44px;
$baseColor = #6A9FB5;
$bgColor = #FAFAFA;

#detailViewPage {
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

    // h4 {
    //   padding: 10px 15px;
    //   font-weight: 600;
    //   font-size: 14px;
    //   border-bottom: 1px solid #ebedf0;
    // }

    .textarea {
      padding: 10px 15px;

      p {
        color: #999;
        padding-bottom: 20px;
      }

      .uploader {
        .uploadImg {
          width: 60px;
          height: 60px;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
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
