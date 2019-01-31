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
export default {
  data() {
    return {

    }
  },
  components: {
    Tab,Manager,Result,Directions
  }
}
</script>

<style scoped></style>
