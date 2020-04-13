<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-select v-model="searchType" @change="listPicture">
        <el-option label="活动信息" value="0"></el-option>
        <el-option label="同城约跑" value="1"></el-option>
        <el-option label="合作交流" value="2"></el-option>
      </el-select>
      <el-button type="success" class="el-icon-search ml-5" @click="listPicture">搜索</el-button>
      <el-button type="primary" class="el-icon-plus float-right" @click="add">新增</el-button>
    </div>
    <div>
      <el-table v-loading="isTableLoading" :data="formData">
        <el-table-column label="图片">
          <template slot-scope="scope">
            <el-avatar shape="square" :src="baseUrl + scope.row.name">
              <img src="../../../assets/notFound.png" alt="图片">
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template slot-scope="scope">
            <delete-button
                :ref="scope.row.id"
                :id="scope.row.id"
                @start="delPicture"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-slideshow ref="AddSlideshow" @update="listPicture"></add-slideshow>
  </el-card>
</template>

<script>
  import {listPictureApi, delPictureApi} from '@/api/operation'
  import AddSlideshow from './add'

  export default {
    name: "Slideshow",
    components: {AddSlideshow},
    data() {
      return {
        isTableLoading: false,
        formData: [],
        searchType: '0'
      }
    },
    computed: {
      baseUrl() {
        return process.env.VUE_APP_BASE_API
      }
    },
    mounted() {
      this.listPicture()
    },
    methods: {
      add() {
        this.$refs.AddSlideshow.visible = true
      },
      listPicture() { // 0失败 1审核中 2成功
        this.isTableLoading = true;
        listPictureApi(this.searchType).then(result => {
          this.isTableLoading = false;
          this.formData = result.resultParam.pictureList
        })
      },
      delPicture(id) {
        delPictureApi(id)
          .then(() => {
            this.listPicture();
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
