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
      <el-table
          v-loading="isTableLoading"
          :data="formData"
          @selection-change="getSelected"
          row-key="id"
          @row-click="rowClick"
          :expand-row-keys="expands"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="图片">
                <el-image
                    class="ml-5"
                    v-for="url in props.row.picture.split(',')"
                    :key="url"
                    :src="baseUrl + url"/>
              </el-form-item>
              <el-form-item label="内容">
                <pre>{{ props.row.content }}</pre>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="name" label="作者"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="time" label="创建时间">
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
                :width="100"
                msg="确认拒绝申请？"
                @start="reject"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination ref="Pagination" @getNewData="pageArticle"></pagination>
  </el-card>
</template>

<script>
  import {articleCheckApi, pageArticleApi} from '@/api/run'

  export default {
    name: "ExperienceAudit",
    data() {
      return {
        isTableLoading: false,
        formData: [],
        isMoreDisabled: true,
        deleteList: [],
        expands: []
      }
    },
    computed: {
      baseUrl() {
        return process.env.VUE_APP_BASE_API
      }
    },
    mounted() {
      this.pageArticle()
    },
    methods: {
      rowClick(row, event, column) {
        Array.prototype.remove = function (val) {
          let index = this.indexOf(val);
          if (index > -1) {
            this.splice(index, 1);
          }
        };
        if (this.expands.indexOf(row.id) < 0) {
          this.expands.push(row.id);
        } else {
          this.expands.remove(row.id);
        }
      },
      pageArticle() { // 0失败 1审核中 2成功
        this.isTableLoading = true;
        let pagination = this.$refs.Pagination;
        let param = `current=${pagination.current}&size=${pagination.size}&state=1&title=`;
        pageArticleApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.articlePage;
          this.formData = response.records;
          pagination.total = response.total;
        })
      },
      pass(id) {
        articleCheckApi({ids: id, state: 2}).then(() => {
          this.pageArticle()
        })
      },
      reject(id) {
        articleCheckApi({ids: id, state: 0})
          .then(() => {
            this.pageArticle();
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
          articleCheckApi({ids: [this.deleteList], state: 0}).then(() => {
            this.pageArticle()
          })
        })
      },
      passMore() {
        this.$msgBox('确定批量通过审核操作吗？').then(() => {
          articleCheckApi({ids: [this.deleteList], state: 2}).then(() => {
            this.pageArticle()
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
