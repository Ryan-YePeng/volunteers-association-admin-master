<template>
  <el-dialog
      title="活动详情"
      width="80%"
      @close="cancel"
      :visible.sync="visible">
    <div>
      <el-form v-if="isHas" :model="form" class="addActivity" ref="Form" label-width="7rem">
        <div class="loadingShow">
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动名称" prop="title">
                <span>{{form.title}}</span>
              </el-form-item>
              <el-form-item label="联系方式" prop="phone">
                <span>{{form.phone}}</span>
              </el-form-item>
              <el-form-item label="负责人" prop="name">
                <span>{{form.name}}</span>
              </el-form-item>
              <el-form-item label="活动地点" prop="address">
                <span>{{form.address}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否收费" prop="isPrice">
                <el-switch :disabled="true" v-model="form.isPrice" active-color="#13ce66"></el-switch>
              </el-form-item>
              <el-form-item label="个人费用" prop="ownPrice" v-show="form.isPrice">
                <span>{{form.ownPrice}}</span>
              </el-form-item>
              <el-form-item label="团体费用" prop="groupPrice" v-show="form.isPrice">
                <span>{{form.groupPrice}}</span>
              </el-form-item>
              <el-form-item label="限报人数" prop="maxNumber">
                <span>{{form.maxNumber}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="活动时间" prop="beginTime">
                <span>{{form.beginTime | formatDateTime}} 至 </span>
                <span>{{form.endTime | formatDateTime}}</span>
              </el-form-item>
              <el-form-item label="报名时间" prop="registerBeginTime">
                <span>{{form.registerBeginTime | formatDateTime}} 至 </span>
                <span>{{form.registerEndTime | formatDateTime}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="封面图片" prop="cover">
                <img :src="form.cover===''?'':baseUrl+form.cover" alt="">
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="活动简介" prop="content">
              <div class="watch" v-html="form.content"></div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h1 v-else>该活动已被删除</h1>
    </div>
  </el-dialog>
</template>

<script>
  import {getActivityApi} from '@/api/activity/activity'
  import {isEmpty, objectEvaluate} from "@/utils/common";

  export default {
    name: "ActivityDetail",
    data() {
      return {
        visible: false,
        isHas: true,
        id: null,
        baseUrl: process.env.VUE_APP_BASE_API,
        form: {
          title: '',
          maxNumber: '',
          beginTime: '',
          endTime: '',
          registerBeginTime: '',
          registerEndTime: '',
          content: '',
          cover: '',
          isPrice: false,
          address: '',
          phone: '',
          ownPrice: 0,
          groupPrice: 0,
          name: '',
          id: null,
        }
      }
    },
    methods: {
      get() {
        getActivityApi(this.id).then(result => {
          if (isEmpty(result.resultParam.activity)) {
            this.isHas = false
          } else {
            this.isHas = true;
            objectEvaluate(this.form, result.resultParam.activity)
          }
        })
      },
      cancel() {
        Object.assign(this.$data.form, this.$options.data().form);
      }
    }
  }
</script>

<style lang="scss">
  .addActivity {
    padding: 20px 0;

    .watch {
      border: 1px solid rgba(200, 200, 200, 0.8);
      border-radius: 5px;
      padding: 5px;

      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
</style>
