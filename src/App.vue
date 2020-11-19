<template>
  <div id="app">
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app,body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  margin: 0;
  padding:0;
  height:100%;
  width:100%;
  overflow: hidden;
}
</style>
