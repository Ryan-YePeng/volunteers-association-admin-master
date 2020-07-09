<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-input placeholder="输入资助方搜索" v-model="searchName" clearable class="w-200"
                @keyup.enter.native="getCooperationList"/>
      <el-select class="ml-5" v-model="searchState" @change="getCooperationList">
        <el-option label="审核成功" value="2"></el-option>
        <el-option label="审核失败" value="0"></el-option>
      </el-select>
      <el-button type="success" class="el-icon-search ml-5" @click="getCooperationList">搜索</el-button>
      <el-button
          class="float-right"
          type="danger"
          icon="el-icon-delete"
          @click="deleteMore"
          :disabled="isDeleteMoreDisabled"
      >
        批量删除
      </el-button>
      <el-button
          class="float-right"
          type="warning"
          icon="el-icon-download"
          @click="download">
        导出
      </el-button>
    </div>
    <div>
      <el-table
          v-loading="isTableLoading"
          :data="formData"
          @selection-change="getSelected"
          @row-click="rowClick"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="资助方"></el-table-column>
        <el-table-column prop="way" label="资助类型">
          <template slot-scope="scope">
            {{scope.row.way === 0 ? '资金' : ''}}
            {{scope.row.way === 1 ? '物资' : ''}}
            {{scope.row.way === 2 ? '其他' : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="unit" label="公司单位"></el-table-column>
        <el-table-column label="资助活动">
          <template slot-scope="scope">
            {{scope.row.activityName ? scope.row.activityName : '无'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template slot-scope="scope">
            <delete-button
                :ref="scope.row.id"
                :id="scope.row.id"
                @start="deleteCooperation"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination ref="Pagination" @getNewData="getCooperationList"></pagination>
  </el-card>
</template>

<script>
  import {delCooperationApi, pageCooperationApi, downloadCooperationApi} from '@/api/cooperation'

  export default {
    name: "CooperationList",
    data() {
      return {
        isTableLoading: false,
        formData: [],
        searchState: '2',
        searchName: '',
        isDeleteMoreDisabled: true,
        deleteList: []
      }
    },
    mounted() {
      this.getCooperationList()
    },
    methods: {
      getCooperationList() { // 0失败 1审核中 2成功
        this.isTableLoading = true;
        let pagination = this.$refs.Pagination;
        let param = `current=${pagination.current}&size=${pagination.size}&state=${this.searchState}&name=${this.searchName}`;
        pageCooperationApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.cooperationPage;
          this.formData = response.records;
          pagination.total = response.total;
        })
      },
      rowClick(value) {
        this.$router.push({
          name: 'cooperation_detail',
          query: {id: value.id},
          params: {name: 'cooperation_list'}
        })
      },
      download() {
        downloadCooperationApi().then(result => {
          const blob = new Blob([result]);
          this.$fileSaver.saveAs(blob, "合作数据.xls")
        })
      },
      deleteCooperation(id) {
        delCooperationApi({ids: id})
          .then(() => {
            this.getCooperationList();
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
          delCooperationApi({ids: [this.deleteList]}).then(() => {
            this.getCooperationList()
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
