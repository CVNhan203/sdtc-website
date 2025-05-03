<template>
<<<<<<< HEAD
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
  
=======
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
>>>>>>> origin/huynhFE
}
</style>
