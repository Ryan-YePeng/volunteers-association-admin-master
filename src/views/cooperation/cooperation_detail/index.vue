<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-page-header @back="goBack" content="合作详情" style="height: 32px;line-height: 32px;"></el-page-header>
    </div>
    <div>
      <el-form label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="资助方:">
              {{form.name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资助活动:">
              <span v-if="form.activityName">
                {{form.activityName}}
                <el-button icon="el-icon-search" type="success" class="ml-15"
                           @click="check(form.activityId)"></el-button>
              </span>
              <span v-else>无</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="联系方式:">
              {{form.phone}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位/公司:">
              {{form.unit}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="资助方式:">
              {{form.way === 0 ? '资金' : ''}}
              {{form.way === 1 ? '资金' : ''}}
              {{form.way === 2 ? '其他' : ''}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间:">
              {{form.createTime | formatDateTime}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.way===0" label="资金">
              {{form.wayContent}}
            </el-form-item>
            <el-form-item v-if="form.way===1" label="物资">
              {{form.wayContent}}
            </el-form-item>
            <el-form-item v-if="form.way===2" label="其他">
              {{form.wayContent}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="备注:">
              {{form.note}}
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div v-if="name === 'cooperation_apply'">
        <el-button
            class="float-right ml-5 mb-10"
            type="danger"
            icon="el-icon-delete"
            @click="reject"
        >
          拒绝
        </el-button>
        <el-button
            class="float-right mb-10"
            type="success"
            icon="el-icon-check"
            @click="pass"
        >
          通过
        </el-button>
      </div>
    </div>
    <activity-detail ref="ActivityDetail"></activity-detail>
  </el-card>
</template>

<script>
  import {cooperationCheckApi, getCooperationApi} from '@/api/cooperation'
  import ActivityDetail from '../activity_detail'

  export default {
    name: "CooperationDetail",
    components: {ActivityDetail},
    mounted() {
      this.id = this.$route.query.id;
      this.name = this.$route.params.name;
      this.getCooperation()
    },
    data() {
      return {
        id: null,
        name: '',
        form: {}
      }
    },
    methods: {
      check(id) {
        let _this = this.$refs.ActivityDetail;
        _this.id = id;
        _this.get();
        _this.visible = true
      },
      pass() {
        this.$msgBox('确定通过审核吗？').then(() => {
          cooperationCheckApi({ids: this.id, state: 2}).then(() => {
            this.goBack()
          })
        });
      },
      reject() {
        this.$msgBox('确定拒绝审核吗？').then(() => {
          cooperationCheckApi({ids: this.id, state: 0}).then(() => {
            this.goBack()
          })
        });
      },
      getCooperation() {
        getCooperationApi(this.id).then(result => {
          this.form = result.resultParam.cooperation
        })
      },
      goBack() {
        this.$router.push({
          name: this.name
        })
      }
    }
  }
</script>

<style scoped>

</style>
