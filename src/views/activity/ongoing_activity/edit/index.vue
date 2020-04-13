<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-page-header @back="cancel" content="活动详情" style="height: 32px;line-height: 32px;"></el-page-header>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="活动详情" name="details">
        <el-form :model="form" class="addActivity" :rules="rules" ref="Form" label-width="7rem" hide-required-asterisk>
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动名称">
                <span>{{this.form.title}}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{this.form.phone}}</span>
              </el-form-item>
              <el-form-item label="负责人">
                <span>{{this.form.name}}</span>
              </el-form-item>
              <el-form-item label="活动地点">
                <span>{{this.form.address}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否收费" >
                <el-switch
                    disabled
                    v-model="form.isPrice"
                    active-color="#13ce66">
                </el-switch>
              </el-form-item>
              <el-form-item label="个人费用" v-show="form.isPrice">
                <span>{{this.form.ownPrice}}</span>
              </el-form-item>
              <el-form-item label="团体费用" v-show="form.isPrice">
                <span>{{this.form.groupPrice}}</span>
              </el-form-item>
              <el-form-item label="限报人数">
                <span>{{this.form.maxNumber}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="活动时间">
                <span>{{this.form.beginTime | formatDateTime}}</span> 至
                <span>{{this.form.endTime | formatDateTime}}</span>
              </el-form-item>
              <el-form-item label="报名时间">
                <span>{{this.form.registerBeginTime | formatDateTime}}</span> 至
                <span>{{this.form.registerEndTime | formatDateTime}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="封面图片">
                <img :src="baseUrl+form.cover" alt="">
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="活动简介">
                <div class="watch" v-html="form.content" style="border: 1px solid rgba(120,120,120,0.8);"></div>
                <!--<custom-editor :editor-key="1" ref="Editor"></custom-editor>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <!--<submit-button class="submitBtn float-right " ref="SubmitButton" @submit="submitForm"/>-->
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="参与者" name="participant">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-input placeholder="输入活动名称搜索" v-model="searchActivityName" clearable class="w-200"
                      @keyup.enter.native="getActivityApplyList"/>
            <el-button type="success" class="el-icon-search ml-5" @click="getActivityApplyList">搜索</el-button>
            <el-button class="float-right" type="danger" icon="el-icon-delete" @click="deleteMoreActivity">批量删除</el-button>
            <el-button class="float-right" type="success" icon="el-icon-download" @click="deleteActivity">下载</el-button>
          </div>
          <div class="">
            <el-table
                v-loading="isTableLoading"
                :data="formData"
                @selection-change="getSelected"
            >
              <el-table-column
                  type="selection"
                  width="55">
              </el-table-column>
              <el-table-column  prop="name" label="姓名"></el-table-column>
              <el-table-column label="活动开始时间">
                <template slot-scope="scope">
                  <span>{{scope.row.beginTime | formatDateTime2}}</span>
                </template>
              </el-table-column>
              <el-table-column label="活动结束时间">
                <template slot-scope="scope">
                  <span>{{scope.row.endTime | formatDateTime2}}</span>
                </template>
              </el-table-column>
              <!--<el-table-column label="报名开始时间">
                <template slot-scope="scope">
                  <span>{{scope.row.registerBeginTime | formatDateTime2}}</span><br>
                </template>
              </el-table-column>
              <el-table-column label="报名结束时间">
                <template slot-scope="scope">
                  <span>{{scope.row.registerEndTime | formatDateTime2}}</span>
                </template>
              </el-table-column>-->
              <el-table-column prop="number" label="已报名人数"></el-table-column>
              <el-table-column prop="maxNumber" label="限报人数"></el-table-column>
              <el-table-column prop="name" label="负责人"></el-table-column>
              <el-table-column prop="phone" label="联系方式"></el-table-column>
              <el-table-column prop="address" label="活动地点"></el-table-column>
              <el-table-column label="操作" fixed="right" align="center" width="150">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-view" @click="edit(scope.row)"></el-button>
                  <delete-button
                      :ref="scope.row.id"
                      :id="scope.row.id"
                      @start="deleteActivity"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <pagination ref="Pagination" @getNewData="getActivityApplyList"></pagination>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-card>

</template>

<script>
  import ActivityCoverUploaderPlus from '../component/cover_uploader';
  import {validatePhone} from "@/utils/validate";
  import {addActivityApi, delActivityApi, pageActivityApi, pageActivityApplyApi} from "@/api/activity/activity";
  import CustomEditor from '../component/CustomEditor'

  export default {
    name: "EditOngoingActivity",
    components: {ActivityCoverUploaderPlus, CustomEditor },
    props: {},
    data() {
      return {
        visible: false,
        baseUrl:process.env.VUE_APP_BASE_API,
        activeName: 'details',
        isTableLoading: false,
        formData: [],
        searchActivityName: '',
        isDeleteMoreDisabled: true,
        deleteList: [],
        form: {
          ActivityTime: [],
          RegisterTime: [],
          title: '',
          beginTime: '',
          maxNumber: '',
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
        },
        rules: {
          title: {required: true, message: '请输入名称', trigger: 'blur'},
          address: {required: true, message: '请输入地址', trigger: 'blur'},
          name: {required: true, message: '请输入负责人姓名', trigger: 'blur'},
          ActivityTime: {type: 'array', message: '请选择活动时间', required: true, trigger: 'blur'},
          RegisterTime: {type: 'array', message: '请选择报名时间', required: true, trigger: 'blur'},
          price: {required: true, message: '请输入价格', trigger: 'blur'},
          phone: {validator: validatePhone, trigger: 'blur'},
          cover: {required: true, message: '请选择封面图片', trigger: 'blur'}
        }
      }
    },
    mounted() {
      //this.getActivityApplyList();
    },
    methods: {
      getActivityApplyList() {
        console.log(this.form);
        this.isTableLoading = true;
        let pagination = this.$refs.Pagination;
        let param = `current=${pagination.current}&size=${pagination.size}&name=${this.searchActivityName}&activityId=${this.form.id}`;
        pageActivityApplyApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.activityApplyPage;
          this.formData = response.records;
          pagination.total = response.total;
        })
      },
      getSelected(array) {
        this.deleteList = array.map(item => item.id);
        this.isDeleteMoreDisabled = array.length === 0;
      },
      deleteActivity(id) {
        delActivityApi({ids: id})
          .then(() => {
            this.getActivityApplyList();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      },
      deleteMoreActivity() {
        this.$msgBox('确定批量删除操作吗？').then(() => {
          delActivityApi({ids: [this.deleteList]}).then(() => {
            this.getActivityApplyList();
          })
        })
      },
      submitForm() {
        let data = {...this.form};
        data.content = this.$refs.Editor.getContent();
        this.$refs.SubmitButton.start();
        addActivityApi(data).then(() => {
          this.$refs.SubmitButton.stop();
          this.$emit('update');
          this.cancel()
        }).catch(() => {
          this.$refs.SubmitButton.stop();
        })
      },
      cancel() {
        this.$parent.getActivityList();
        this.$parent.editFlag = false;
        Object.assign(this.$data.form, this.$options.data().form);
        this.$refs['coverUploader'].url = '';
        this.$refs['Form'].resetFields();
        this.$refs.Editor.setContent();
      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },

  }
</script>

<style lang="scss">
  .addActivity {
    padding: 20px 0;

    .el-range-editor--small.el-input__inner {
      width: 100%;
    }

    .submitBtn {
      margin-right: 40px;
    }
  }
</style>
