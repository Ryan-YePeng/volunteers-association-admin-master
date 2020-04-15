<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>审核列表</span>
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
            <el-button type="success" icon="el-icon-check" @click.stop="pass(scope.row.id)"></el-button>
            <delete-button
                :ref="scope.row.id"
                :id="scope.row.id"
                width="100"
                msg="确认拒绝申请？"
                @start="reject"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination ref="Pagination" @getNewData="getRunList"></pagination>
  </el-card>
</template>

<script>
  import {delCallRunApi, getRunListApi, checkRunApi} from '@/api/run'

  export default {
    name: "RunAudit",
    data() {
      return {
        isTableLoading: false,
        formData: [],
        isMoreDisabled: true,
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
        let param = `current=${pagination.current}&size=${pagination.size}&state=1`;
        getRunListApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.callRunPage;
          this.formData = response.records;
          pagination.total = response.total;
        })
      },
      pass(id) {
        checkRunApi({ids: id, state: 2}).then(() => {
          this.getRunList()
        })
      },
      reject(id) {
        checkRunApi({ids: id, state: 0})
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
        this.isMoreDisabled = array.length === 0;
      },
      rejectMore() {
        this.$msgBox('确定批量拒绝审核操作吗？').then(() => {
          checkRunApi({ids: [this.deleteList], state: 0}).then(() => {
            this.getRunList()
          })
        })
      },
      passMore() {
        this.$msgBox('确定批量通过审核操作吗？').then(() => {
          checkRunApi({ids: [this.deleteList], state: 2}).then(() => {
            this.getRunList()
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
