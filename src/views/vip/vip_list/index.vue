<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-input placeholder="输入电话搜索" v-model="searchUsername" clearable class="w-200"
                @keyup.enter.native="getUserList"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getUserList">搜索</el-button>
    </div>
    <el-table v-loading="isTableLoading" :data="formData">
      <el-table-column prop="nickName" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)"></el-button>
          <delete-button
              :ref="scope.row.id"
              :id="scope.row.id"
              @start="deleteUser"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @getNewData="getUserList"></pagination>
  </el-card>
</template>

<script>
  import {getUserListApi, downloadUserApi} from '@/api/vip'

  export default {
    name: "VipList",
    data() {
      return {
        searchUsername: '',
        formData: [],
        isTableLoading: false
      }
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        this.isTableLoading = true;
        let pagination = this.$refs.Pagination;
        let param = `current=${pagination.current}&size=${pagination.size}&deptId=&username=${this.searchUsername}&state=2`;
        getUserListApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.userList;
          this.formData = response.records;
          pagination.total = response.total;
        })
      },
      deleteUser(id) {
        deleteUserApi({ids: id})
          .then(() => {
            this.getUserList();
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
