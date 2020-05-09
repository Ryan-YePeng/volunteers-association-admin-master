<template>
  <el-dialog
      title="新增轮播图"
      width="500px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="150px" hide-required-asterisk>
      <el-form-item label="轮播图位置">
        <el-select v-model="form.type">
          <el-option label="活动信息" value="0"></el-option>
          <el-option label="同城约跑" value="1"></el-option>
          <el-option label="合作交流" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <upload-picture ref="UploadPicture" @getImage="getImage"></upload-picture>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="SubmitButton" @submit="submitForm"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addPictureApi} from '@/api/operation'
  import UploadPicture from './uploadPicturePlus'

  export default {
    name: "AddSlideshow",
    components: {UploadPicture},
    data() {
      return {
        visible: false,
        form: {
          name: '',
          type: '0'
        },
        rules: {
          name: {required: true, message: '请上传图片', trigger: 'change'}
        }
      }
    },
    methods: {
      submitForm() {
        this.$refs['Form'].validate((valid) => {
          if (valid) {
            let data = {...this.form};
            this.$refs.SubmitButton.start();
            addPictureApi(data).then(() => {
              this.$refs.SubmitButton.stop();
              this.$emit('update');
              this.cancel()
            }).catch(() => {
              this.$refs.SubmitButton.stop();
            })
          } else {
            return false;
          }
        });
      },
      getImage(value) {
        this.form.name = value;
        this.$refs['Form'].validate('name')
      },
      cancel() {
        this.visible = false;
        Object.assign(this.$data.form, this.$options.data().form);
        this.$refs['Form'].resetFields();
        this.$refs.UploadPicture.clearFiles();
      }
    }
  }
</script>

<style scoped>

</style>


