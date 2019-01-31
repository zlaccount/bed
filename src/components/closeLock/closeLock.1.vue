<!--  -->
<template>
  <transition name="slide">
    <div
      class="normalViewPage"
      v-if="normalState.state == true"
    >
      <van-nav-bar
        fixed
        title="共享陪护床"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
      <close-detail :orderDetail="normalState.order"></close-detail>
    </div>
  </transition>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters, mapMutations } from "vuex";
import CloseDetail from "components/closeDetail/closeDetail";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: { CloseDetail },
  data() {
    //这里存放数据
    return {

    };
  },
  //监听属性 类似于data概念
  computed: {
    ...mapGetters(["normalState"])
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    onClickLeft() {
      this.$router.push({
        name: "bed",
      });
      this.setNormalState({
        state: false
      });
    },
    ...mapMutations({
      setNormalState: "SET_NORMAL_STATE"
    })
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() { },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() { },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped lang="stylus">
// @import url(); 引入公共css类
.normalViewPage {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 152;
  background: #f5f3f4;
}
</style>
