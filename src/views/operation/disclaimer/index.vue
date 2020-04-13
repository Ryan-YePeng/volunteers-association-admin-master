<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>免责声明</span>
      <submit-button ref="SubmitButton" class="float-right" @submit="update" text="保存"/>
    </div>
    <div>
      <edit-disclaimer ref="EditDisclaimer"/>
    </div>
  </el-card>
</template>

<script>
  import {getDisclaimerApi, editDisclaimerApi} from '@/api/operation'
  import EditDisclaimer from './EditDisclaimer'

  export default {
    name: "Disclaimer",
    components: {EditDisclaimer},
    data() {
      return {}
    },
    mounted() {
      this.getDisclaimer()
    },
    methods: {
      getDisclaimer() {
        getDisclaimerApi().then(result => {
          this.$refs.EditDisclaimer.setContent(result.resultParam.systemConfig.value);
        })
      },
      update() {
        this.$refs.SubmitButton.start();
        let data = this.$refs.EditDisclaimer.getContent();
        editDisclaimerApi({value: data})
          .then(() => {
            this.$refs.SubmitButton.stop();
          })
          .catch(() => {
            this.$refs.SubmitButton.stop();
          })
      }
    }
  }
</script>

<style scoped>

</style>
