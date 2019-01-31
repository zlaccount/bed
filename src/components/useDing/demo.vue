<template>
    <div class="page">
        <!-- 上下拉加载更多，刷新数据的组件updown -->
        <up-down :data="data" :pulldown="pulldown" @pulldown="loadData">
            <!-- 此处的ui结构just a demo of test -->
            <ul style="width:100%;min-height:100%">
                <li style="min-height:300px;background-color:#DDDDDD;">1</li>
                <li style="min-height:300px;background-color:#AAAAAA;">2</li>
                <li style="min-height:300px;background-color:#888888;">3</li>
            </ul>
        </up-down>
        <div class="loading-wrapper"></div>
    </div>
</template>

<script>
import UpDown from "base/scrolltab/UpDown";
export default {
    components: {
        UpDown
    },
    data() {
        return {
            pulldown: true,
            oCurrentPage: 0
        };
    },
    created() {
        this.loadData();
    },
    methods: {
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
        }
    },
    mounted() {
        this.msgFromChild();
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.page{
  font-size: 14px;
  .nav{
    ul{
      list-style: none;
      display: flex;
      li{
        list-style: none;
        flex: 1;
      }
    }
  }
  .wrapper{
    height: calc(100vh - 84px);
    overflow: hidden;
  }
}
.active{
  color: burlywood;
  border-bottom: 1px solid burlywood;
}
</style>
