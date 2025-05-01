<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background: rgba(248, 247, 250, 1);
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
