<template>
  <div id="app">
   <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
   <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
   
   <!-- Header shown only for non-admin routes -->
   <Header v-if="!isAdminRoute" />
 
   <!-- Nội dung chính của các trang sẽ được hiển thị thông qua router-view -->
   <main :class="{ 'admin-view': isAdminRoute }"> 
     <router-view /> 
   </main>

   <!-- Footer shown only for non-admin routes -->
   <Footer v-if="!isAdminRoute" />
  
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
 computed: {
   // Check if current route is an admin route
   isAdminRoute() {
     return this.$route.path.startsWith('/admin')
   }
 }

}
</script>

<style>
body {
 font-family: 'Roboto', sans-serif;
 margin: 0;
 padding: 0;
}

.html{
 font-size: 10px;

}
html, body {
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;

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
 flex: 1;
 width: 100%;
 padding-top: 120px;
}

main.admin-view {
 padding-top: 0; /* Không cần padding-top cho trang admin vì không có header cố định */
}




</style>