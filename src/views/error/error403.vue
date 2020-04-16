<template>
  <div class="out">
    <div id="container">
      <img class="png" src="../../assets/error/403_404/images/403.png" />
      <!--<img class="png msg" src="../../assets/error/403_404/images/404_msg.png" />-->
      <div style="height: 60px; color: rgba(244,249,253, 1);font-size: 25px;font-family: '幼圆','Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;">很抱歉，您似乎没有权限访问该页面</div>
      <p ><a style="cursor: pointer;" @click.stop="$router.go(-1)" target="_blank"><span class="btn" >返回上一页</span></a> </p>
    </div>
    <div id="cloud" class="png"></div>
  </div>
</template>

<script>
  export default {
    name: "Error404",

  }
</script>

<style scoped lang="scss">
  .out {
    height: calc(100% - 25px);
    background: url("../../assets/error/403_404/images/error_bg.jpg") repeat-x scroll 0 0 #67ACE4;
    overflow: hidden;
    position: absolute;
    right: 12px;
    top: 12px;
    width: calc(100% - 25px);
  }
  .btn{
    background-color: white;
    padding: 8px 20px;
    letter-spacing:0.8px;
    color: rgb(72,151,217);
    border-radius: 20px;
  }
  #container {
    margin: 0 auto;
    padding-top: 5%;
    text-align: center;
    width: 560px;
  }
  #container img {
    border: medium none;
    margin-bottom: 50px;
  }
  #container .error {
    height: 200px;
    position: relative;
  }
  #container .error img {
    bottom: -50px;
    position: absolute;
    right: -50px;
  }
  #container .msg {
    margin-bottom: 65px;
  }
  #cloud {
    background: url("../../assets/error/403_404/images/error_cloud.png") repeat-x scroll 0 0 transparent;
    bottom: 0;
    height: 170px;
    position: absolute;
    width: 100%;
  }
</style>
