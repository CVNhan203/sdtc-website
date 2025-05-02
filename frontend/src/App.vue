<template>
   <div id="app">
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
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

import Header from "./components/view/ComHeader.vue";
import Footer from "./components/view/ComFooter.vue";

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
.html{
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

main {
  flex: 1; /* Phần main sẽ chiếm không gian còn lại của trang */
  width: 100%;
  margin-top: 5rem;
}
</style>
