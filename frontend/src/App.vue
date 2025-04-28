<template>
   <div id="app">
    <!-- Header ở trên cùng-->
  <Header />
  
  <!-- Nội dung chính của các trang sẽ được hiển thị thông qua router-view -->
  <main> 
    <router-view /> 
  </main>

  <!-- Footer ở dưới cùng-->
    <Footer />
  </div>

</template>

<script>

import Header from "./components/ComHeader.vue";
import Footer from "./components/ComFooter.vue";

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.body{
  margin: 0;
  padding: 0;
  
}
</style>
