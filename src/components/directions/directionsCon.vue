<template>
  <div class="directionsCon">
    <scroll
      ref="scroll"
      class="directionsCon-content"
      :data="data"
    >
      <div>
        <div
          v-for="(item, index) in data"
          :key="index"
        >
          <div class="center">
            <h4>{{ item.depositdirections }}</h4>
            <p>
              {{ item.define }}<br /><span>{{ item.money }}</span>
            </p>
            <p>{{ item.costback }}<br />{{ item.operation }}</p>
            <h4>{{ item.costdirections }}</h4>
            <p>
              1.收费标准如下：<span>{{ item.costmoney }}</span>{{ item.standard }}
            </p>
            <p>{{ item.settlement }}</p>
            <p>{{ item.describe }}</p>
          </div>
        </div>
        <div class="blank"></div>
      </div>
      <div
        class="loading-container"
        v-show="!data.length"
      >
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import { ERR_OK } from 'api/config'
import { mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    onClickLeft() {
      this.setDirections(false)
    },
    _getData() {
    },
    ...mapMutations({
      setDirections: 'SET_DIRECTIONS'
    })
  },
  computed: {
    ...mapGetters(['beddirections'])
  },
  components: {
    Scroll,
    Loading
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this._getData()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
.directionsCon {
  position: fixed;
  width: 100%;
  top: 46px;
  bottom: 0px;
  .directionsCon-content {
    height: 100%;
    overflow: hidden;
    .center {
      width: 92%;
      margin: 0 auto;
      h4 {
        border-bottom: 1px solid #ddd;
        line-height: 37px;
        margin: 10px 0 0;
        font-size: 16px;
        font-weight: 500;
      }
      p {
        line-height: 24px;
        color: #999;
        font-size: 14px;
        span {
          color: red;
          font-size: 15px;
        }
      }
    }
    .blank {
      height: 10px;
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>