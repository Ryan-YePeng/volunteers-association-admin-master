<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-select v-model="searchState" @change="getRunList">
        <el-option label="审核成功" value="2"></el-option>
        <el-option label="审核失败" value="0"></el-option>
      </el-select>
      <el-button type="success" class="el-icon-search ml-5" @click="getRunList">搜索</el-button>
      <el-button class="float-right" type="danger" icon="el-icon-delete" @click="deleteMore">批量删除</el-button>
    </div>
    <div>
      <el-table v-loading="isTableLoading" :data="formData" @selection-change="getSelected">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="发起者"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="number" label="报名人数"></el-table-column>
        <el-table-column prop="maxNumber" label="限报人数"></el-table-column>
        <el-table-column prop="place" label="地点"></el-table-column>
        <el-table-column prop="time" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template slot-scope="scope">
            <delete-button
                    :ref="scope.row.id"
                    :id="scope.row.id"
                    @start="deleteRun"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination ref="Pagination" @getNewData="getRunList"></pagination>
  </el-card>
</template>

<script>
  import {delCallRunApi, getRunListApi} from '@/api/run'

  export default {
    name: "RunList",
    data() {
      return {
        isTableLoading: false,
        formData: [],
        tree: [],
        searchState: '2',
        isDeleteMoreDisabled: true,
        deleteList: []
      }
    },
    mounted() {
      this.getRunList()
    },
    methods: {
      getRunList() { // 0失败 1审核中 2成功
        this.isTableLoading = true;
        let pagination = this.$refs.Pagination;
        let param = `current=${pagination.current}&size=${pagination.size}&state=${this.searchState}`;
        getRunListApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.callRunPage;
          this.formData = response.records;
          pagination.total = response.total;
        })
      },
      deleteRun(id) {
        delCallRunApi({ids: id})
          .then(() => {
            this.getRunList();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      },
      getSelected(array) {
        this.deleteList = array.map(item => item.id);
        this.isDeleteMoreDisabled = array.length === 0;
      },
      deleteMore() {
        this.$msgBox('确定批量删除操作吗？').then(() => {
          delCallRunApi({ids: [this.deleteList]}).then(() => {
            this.getRunList()
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
