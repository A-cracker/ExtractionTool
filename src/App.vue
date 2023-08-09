<template>
  <div id="root">
    <el-menu
        default-active="/tree"
        class="el-menu-demo"
        mode="horizontal"
        router="router"
    >
      <div style="display: flex;align-items: center;margin: 10px 20px;font-size: 20px;">文件分析工具</div>
      <el-menu-item index="/tree">分析点树</el-menu-item>
      <el-menu-item index="/doc">文档预览</el-menu-item>
    </el-menu>
    <div class="content">
      <RouterView/>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getRtParam } from './base/constant';
import { onBeforeMount, provide, ref } from 'vue';
const runToolParam = ref<string>('');
onBeforeMount(() => {
  runToolParam.value = getRtParam() || '';
  if (/^\{.*\}$/.test(runToolParam.value)) {
    const runToolParamJson = JSON.parse(runToolParam.value);
    provide('runToolParam', {
      bandId: runToolParamJson.bandID
    });
  }
});
</script>
<style scoped>
#root{
  display:flex;
  flex-direction: column;
  height: 100vh;
}
.content{
  flex-grow: 1;
  max-height:calc(100vh - 58.67px);
}
</style>
<style>
#app {
  font-family: Helvetica,Avenir,Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>