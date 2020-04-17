<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-select v-model="searchState" @change="pageArticle">
        <el-option label="审核成功" value="2"></el-option>
        <el-option label="审核失败" value="0"></el-option>
      </el-select>
      <el-button type="success" class="el-icon-search ml-5" @click="pageArticle">搜索</el-button>
      <el-button
          class="float-right"
          type="danger"
          icon="el-icon-delete"
          @click="deleteMore"
          :disabled="isDeleteMoreDisabled"
      >
        批量删除
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
            <delete-button
                :ref="scope.row.id"
                :id="scope.row.id"
                @start="deleteArticle"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination ref="Pagination" @getNewData="pageArticle"></pagination>
  </el-card>
</template>

<script>
  import {delArticleApi, pageArticleApi} from '@/api/run'

  export default {
    name: "ExperienceList",
    data() {
      return {
        isTableLoading: false,
        formData: [],
        searchState: '2',
        isDeleteMoreDisabled: true,
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
        let param = `current=${pagination.current}&size=${pagination.size}&state=${this.searchState}&title=`;
        pageArticleApi(param).then(result => {
          this.isTableLoading = false;
          let response = result.resultParam.articlePage;
          this.formData = response.records;
          pagination.total = response.total;
        })
      },
      deleteArticle(id) {
        delArticleApi({ids: id})
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
        this.isDeleteMoreDisabled = array.length === 0;
      },
      deleteMore() {
        this.$msgBox('确定批量删除操作吗？').then(() => {
          delArticleApi({ids: [this.deleteList]}).then(() => {
            this.pageArticle()
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>

