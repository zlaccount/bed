<!--  -->
<template>
    <!-- 首页index -->
    <div class="my">
        <div class="myself">
            <h4>我的</h4>
        </div>
        <!-- 我的入口 -->
        <my></my>
        <router-view></router-view>
    </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
//  信息管理
import common from "common/js/common.js";

import My from "components/my/my";

export default {
    // import引入的组件需要注入到对象中才能使用
    components: {
        My
    },
    data() {
        // 这里存放数据
        return {
            // 开关
            // 初始化数据
        };
    },
    // 监听属性 类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {},
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
    beforeCreate() {}, // 生命周期 - 创建之前
    beforeMount() {}, // 生命周期 - 挂载之前
    beforeUpdate() {}, // 生命周期 - 更新之前
    updated() {}, // 生命周期 - 更新之后
    beforeDestroy() {}, // 生命周期 - 销毁之前
    destroyed() {}, // 生命周期 - 销毁完成
    activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped lang="stylus">
.myself {
  position: relative;

  h4 {
    margin: 0;
    text-align: center;
    line-height: 45px;
    background: #4fd6bc;
    color: #fff;
    font-weight: 400;
    font-size: 16px;
    .van-button {
      height: 45px;
      width: 45px;
      position: absolute;
      right: 0;
      top: 0px;
      border: 0;

      .seeImg {
        margin-top: 10px;
      }
    }
  }

  .van-button {
    background: #4fd6bc;
  }
}
</style>
