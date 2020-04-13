<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>会费设置</span>
      <el-button class="float-right" type="primary" @click="update">保存</el-button>
    </div>
    <div>
      <el-form :model="form" :rules="rules" ref="Form" label-width="80px" hide-required-asterisk>
        <el-form-item label="会费设置" prop="dues">
          <el-input-number
              v-model="form.dues"
              controls-position="right"
              :precision="2"
              :step="0.1"
              :min="0">
          </el-input-number>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="会长" prop="cdr">
              <el-input-number
                  v-model="form.cdr"
                  controls-position="right"
                  :precision="2"
                  :step="0.1"
                  :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="副会长" prop="vpo">
              <el-input-number
                  v-model="form.vpo"
                  controls-position="right"
                  :precision="2"
                  :step="0.1"
                  :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="理事" prop="council">
              <el-input-number
                  v-model="form.council"
                  controls-position="right"
                  :precision="2"
                  :step="0.1"
                  :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="普通会员" prop="comment">
              <el-input-number
                  v-model="form.comment"
                  controls-position="right"
                  :precision="2"
                  :step="0.1"
                  :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
  </el-card>
</template>

<script>
  import {getPriceApi, editPriceApi} from '@/api/operation'

  export default {
    name: "MembershipFee",
    data() {
      return {
        form: {
          dues: "0",
          cdr: "0",
          vpo: "0",
          council: "0",
          comment: "0"
        },
        rules: {
          dues: {required: true, message: '请输入费用', trigger: 'blur'},
          cdr: {required: true, message: '请输入费用', trigger: 'blur'},
          vpo: {required: true, message: '请输入费用', trigger: 'blur'},
          council: {required: true, message: '请输入费用', trigger: 'blur'},
          comment: {required: true, message: '请输入费用', trigger: 'blur'}
        }
      }
    },
    mounted() {
      this.getPrice()
    },
    methods: {
      getPrice() {
        getPriceApi().then(result => {
          result.resultParam.systemConfigList.forEach(item => {
            this.form[item.name] = item.value
          });
        })
      },
      update() {
        let list = [];
        let index = 1;
        for (let key in this.form) {
          list.push({
            id: index++,
            value: this.form[key]
          })
        }
        editPriceApi({systemConfigVoJson: JSON.stringify(list)}).then(() => {
          this.getPrice()
        })
      }
    }
  }
</script>

<style scoped>

</style>
