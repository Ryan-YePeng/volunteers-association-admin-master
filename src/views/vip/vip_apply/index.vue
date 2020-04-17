<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-input placeholder="输入电话搜索" v-model="searchUsername" clearable class="w-200"
                @keyup.enter.native="getUserList"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getUserList">搜索</el-button>
    </div>
    <el-table v-loading="isTableLoading" :data="formData">
      <el-table-column prop="nickName" label="用户名"></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex == '1' ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="unit" label="单位">
        <template slot-scope="scope">
          <span>{{scope.row.userDetail.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系地址">
        <template slot-scope="scope">
          <span>{{scope.row.userDetail.address}}</span>
        </template>
      </el-table-column>
      <el-table-column label="缴费金额">
        <template slot-scope="scope">
          <span>{{scope.row.userDetail.price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否缴费">
        <template slot-scope="scope">
          <span v-if="scope.row.enabled"><el-tag type="success">是</el-tag></span>
          <span v-else><el-tag type="danger">否</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="缴费时间">
        <template slot-scope="scope">
          <span v-if="scope.row.userDetail.hasOwnProperty('time')">{{scope.row.userDetail.time | formatDateTime}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-check" @click.stop="open(scope.row.id)"></el-button>
          <delete-button
              :ref="scope.row.id"
              :id="scope.row.id"
              :width="100"
              msg="确认拒绝申请？"
              @start="reject"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @getNewData="getUserList"></pagination>
    <el-dialog
        title="请选择职位"
        width="400px"
        :close-on-click-modal="false"
        :visible.sync="visible">
      <el-select v-model="priceId">
        <el-option label="普通会员" value="5"></el-option>
        <el-option label="理事" value="4"></el-option>
        <el-option label="副会长" value="3"></el-option>
        <el-option label="会长" value="2"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="pass()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import {getUserListApi, userCheckApi} from '@/api/vip'

  export default {
    name: "Vip_Apply",
    data() {
      return {
        searchUsername: '',
        formData: [],
        isTableLoading: false,
        priceId: '5',
        visible: false,
        id: null
      }
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        this.isTableLoading = true;
        let pagination = this.$refs.Pagination;
        let param = `current=${pagination.current}&size=${pagination.size}&username=${this.searchUsername}&state=1`;
        getUserListApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.userList;
          this.formData = response.records;
          pagination.total = response.total;
        })
      },
      pass() {
        userCheckApi({ids: this.id, state: 2, priceId: this.priceId}).then(() => {
          this.visible = false;
          this.getUserList()
        })
      },
      open(id) {
        this.id = id;
        this.visible = true
      },
      reject(id) {
        userCheckApi({ids: id, state: 0, priceId: '5'})
          .then(() => {
            this.getUserList();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      },
    }
  }
</script>

<style scoped>

</style>
