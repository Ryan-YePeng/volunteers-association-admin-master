<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {axiosGs} from '@/api/request/index'

  export default {
    name: "App",
    mounted() {
      const getUserListUrl = "admin/user/pageUser"; // 获得用户列表
      let data = {
        current: 1,
        size: 10,
        username: ''
      };
      axiosGs(getUserListUrl, data)
    }
  };
</script>
