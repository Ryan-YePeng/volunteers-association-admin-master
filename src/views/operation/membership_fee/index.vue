<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>会费设置</span>
      <el-button class="float-right" type="primary">保存</el-button>
    </div>
    <div>
      <span>内容</span>
    </div>
  </el-card>
</template>

<script>
  import {getPriceApi} from '@/api/operation'

  export default {
    name: "MembershipFee",
    data() {
      return {}
    },
    mounted() {
      this.getPrice()
    },
    methods: {
      getPrice() {
        getPriceApi().then(result => {
          console.log(result)
        })
      }
    }
  }
</script>

<style scoped>

</style>
