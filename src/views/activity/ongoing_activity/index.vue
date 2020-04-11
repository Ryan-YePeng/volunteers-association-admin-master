<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-input placeholder="输入活动名称搜索" v-model="searchActivityName" clearable class="w-200"
                @keyup.enter.native="getActivityList"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getActivityList">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <div>
      <el-table
              v-loading="isTableLoading"
              :data="formData"
      >
        <el-table-column prop="name" label="活动名称"></el-table-column>
        <el-table-column label="报名时间">
          <template slot-scope="scope">
            <span>{{scope.row.dept.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="已报名人数"></el-table-column>
        <el-table-column prop="sort" label="现报人数"></el-table-column>
        <el-table-column prop="sort" label="地址"></el-table-column>
        <el-table-column prop="sort" label="联系方式"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)"></el-button>
            <delete-button
                    :ref="scope.row.id"
                    :id="scope.row.id"
                    @start="deleteActivity"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination ref="Pagination" @getNewData="getActivityList"></pagination>
    <add-ongoing-activity ref="AddOngoingActivity" :dept="tree" @update="getActivityList"></add-ongoing-activity>
    <edit-ongoing-activity ref="EditOngoingActivity" :dept="tree" @update="getActivityList"></edit-ongoing-activity>
  </el-card>
</template>

<script>
  import {getActivityApi, delActivityApi} from '@/api/activity'
  import AddOngoingActivity from './add'
  import EditOngoingActivity from './edit'
  import {objectEvaluate} from "@/utils/common";

  export default {
    name: "OngoingActivity",
    components: {EditOngoingActivity, AddOngoingActivity},
    data() {
      return {
        isTableLoading: false,
        formData: [],
        tree: [],
        searchActivityName: ''
      }
    },
    mounted() {
      this.getActivityList();
    },
    methods: {
      getActivityList() {
        this.isTableLoading = true;
        let pagination = this.$refs.Pagination;
        let param = `current=${pagination.current}&size=${pagination.size}&jobName=${this.searchActivityName}`;
        getActivityApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.jobList;
          this.formData = response.records;
          pagination.total = response.total;
        })
      },
      add() {
        let _this = this.$refs.AddOngoingActivity;
        _this.visible = true
      },
      edit(obj) {
        let _this = this.$refs.EditOngoingActivity;
        if (obj.deptId === 0) obj.deptId = null;
        objectEvaluate(_this.form, obj);
        _this.visible = true
      },
      deleteActivity(id) {
        delActivityApi(id)
                .then(() => {
                  this.getActivityList();
                  this.$refs[id].close()
                })
                .catch(() => {
                  this.$refs[id].stop();
                })
      }
    }
  }
</script>

<style scoped>

</style>
