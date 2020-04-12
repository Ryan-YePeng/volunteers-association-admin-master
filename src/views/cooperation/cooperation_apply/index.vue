<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-input placeholder="输入资助方搜索" v-model="searchName" clearable class="w-200"
                @keyup.enter.native="getCooperationList"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getCooperationList">搜索</el-button>
      <el-button
          class="float-right ml-5"
          type="danger"
          icon="el-icon-delete"
          @click="rejectMore"
          :disabled="isMoreDisabled"
      >
        批量拒绝
      </el-button>
      <el-button
          class="float-right"
          type="success"
          icon="el-icon-check"
          @click="passMore"
          :disabled="isMoreDisabled"
      >
        批量通过
      </el-button>
    </div>
    <div>
      <el-table v-loading="isTableLoading" :data="formData" @selection-change="getSelected">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="资助方"></el-table-column>
        <el-table-column prop="way" label="资助类型">
          <template slot-scope="scope">
            {{scope.row.way === 0 ? '资金' : '物资'}}
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
            <el-button type="success" icon="el-icon-check" @click.stop="pass(scope.row.id)"></el-button>
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
  import {cooperationCheckApi, delCooperationApi, pageCooperationApi} from '@/api/cooperation'

  export default {
    name: "CooperationApply",
    data() {
      return {
        isTableLoading: false,
        formData: [],
        searchName: '',
        isMoreDisabled: true,
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
        let param = `current=${pagination.current}&size=${pagination.size}&state=1&name=${this.searchName}`;
        pageCooperationApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.cooperationPage;
          this.formData = response.records;
          pagination.total = response.total;
        })
      },
      pass(id) {
        this.$msgBox('确定通过审核吗？').then(() => {
          cooperationCheckApi({ids: id, state: 2}).then(() => {
            this.getCooperationList()
          })
        });
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
        this.isMoreDisabled = array.length === 0;
      },
      rejectMore() {
        this.$msgBox('确定批量拒绝审核操作吗？').then(() => {
          cooperationCheckApi({ids: [this.deleteList], state: 0}).then(() => {
            this.getCooperationList()
          })
        })
      },
      passMore() {
        this.$msgBox('确定批量通过审核操作吗？').then(() => {
          cooperationCheckApi({ids: [this.deleteList], state: 2}).then(() => {
            this.getCooperationList()
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>

