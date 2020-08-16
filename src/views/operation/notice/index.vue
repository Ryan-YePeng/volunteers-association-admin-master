<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>入会须知</span>
      <submit-button ref="SubmitButton" class="float-right" @submit="update" text="保存"/>
    </div>
    <div>
      <edit-notice ref="EditNotice"/>
    </div>
  </el-card>
</template>

<script>
  import {getNoticeApi, editNoticeApi} from '@/api/operation'
  import EditNotice from './EditNotice'

  export default {
    name: "Notice",
    components: {EditNotice},
    data() {
      return {}
    },
    mounted() {
      this.getNotice()
    },
    methods: {
      getNotice() {
        getNoticeApi().then(result => {
          this.$refs.EditNotice.setContent(result.resultParam.systemConfig.value);
        })
      },
      update() {
        this.$refs.SubmitButton.start();
        let data = this.$refs.EditNotice.getContent();
        editNoticeApi({value: data})
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
