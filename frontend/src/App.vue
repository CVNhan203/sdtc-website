<template>
  <div id="app">
    <Header v-if="!isAdminRoute" />
    <main>
      <router-view />
    </main>
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script>
import Header from './components/view/ComHeader.vue'
import Footer from './components/view/ComFooter.vue'

export default {
  name: 'App',
  components: { Header, Footer },
  computed: {
    isAdminRoute() {
      return this.$route.path.startsWith('/admin')
    }
  }
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
.html {
  font-size: 10px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
