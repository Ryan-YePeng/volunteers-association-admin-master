<template>
  <div class="">
    <el-card v-show="!editFlag" class="box-card">
      <div slot="header" class="clearfix">
        <el-input placeholder="输入活动名称搜索" v-model="searchActivityName" clearable class="w-200"
                  @keyup.enter.native="getActivityList"/>
        <el-button type="success" class="el-icon-search ml-5" @click="getActivityList">搜索</el-button>
        <el-button class="float-right" type="danger" icon="el-icon-delete" @click="deleteMoreActivity">批量删除</el-button>
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
          <el-table-column  prop="title" label="活动名称"></el-table-column>
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
      <pagination ref="Pagination" @getNewData="getActivityList"></pagination>
    </el-card>
    <edit-ended-activity v-show="editFlag" ref="EditEndedActivity" @update="getActivityList"></edit-ended-activity>
  </div>

</template>

<script>
  import {delActivityApi, pageActivityApi} from '@/api/activity/activity'
  import EditEndedActivity from './edit/index'
  import {isEmpty, objectEvaluate} from "@/utils/common";

  export default {
    name: "EndedActivity",
    components: {EditEndedActivity},
    data() {
      return {
        isTableLoading: false,
        formData: [],
        searchActivityName: '',
        editFlag: false,
        isDeleteMoreDisabled: true,
        deleteList: []
      }
    },
    mounted() {
      this.getActivityList();

    },
    methods: {
      getActivityList() {
        this.isTableLoading = true;
        let pagination = this.$refs.Pagination;
        let param = `current=${pagination.current}&size=${pagination.size}&title=${this.searchActivityName}&timeState=0`;
        pageActivityApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.activityPage;
          this.formData = response.records;
          pagination.total = response.total;
        });
      },
      edit(obj) {
        /*let _this = this.$refs.EditEndedActivity;
        objectEvaluate(_this.form, obj);
        _this.visible = true*/
        this.editFlag = true;
        let _this = this.$refs.EditEndedActivity;
        if (!isEmpty(obj.picture)){
          let temp = (obj.picture.split(","));
          for (let i=0;i<temp.length;i++){
            temp[i]=process.env.VUE_APP_BASE_API+'/'+temp[i]
          }
          obj.picture2=temp;
        }else{
          obj.picture2=[]
        }
        let temp2 = {...obj};
        objectEvaluate(_this.form, temp2);
        //_this.$refs['Editor'].setContent(obj.content);
        _this.getActivityApplyList();
      },
      getSelected(array) {
        this.deleteList = array.map(item => item.id);
        this.isDeleteMoreDisabled = array.length === 0;
      },
      deleteActivity(id) {
        delActivityApi({ids: id})
          .then(() => {
            this.getActivityList();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      },
      deleteMoreActivity() {
        this.$msgBox('确定批量删除操作吗？').then(() => {
          delActivityApi({ids: [this.deleteList]}).then(() => {
            this.getActivityList();
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
