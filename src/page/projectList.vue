<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="项目名称">
          <el-input v-model="queryForm.name" placeholder="项目名称"></el-input>
        </el-form-item>
        <el-form-item label="域名">
          <el-input v-model="queryForm.domain" placeholder="域名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectProjectList(queryForm)">查询</el-button>
          <el-button type="primary" @click="queryForm = {}">重置</el-button>
          <el-button type="primary" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="project_id" label="项目编号" min-width="20%"></el-table-column>
        <el-table-column property="name" label="项目名称" min-width="20%"></el-table-column>
        <el-table-column property="domain" label="域名" min-width="20%"></el-table-column>
        <el-table-column property="desc" label="项目描述" min-width="20%"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="20%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.project_id)"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.project_id, scope.$index)"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <el-dialog title="编辑" :visible.sync="editDialogFormVisible">
        <el-form :model="dataInfo">
          <el-form-item label="*项目名称" label-width="100px">
            <el-input v-model="dataInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="*项目域名" label-width="100px">
            <el-input v-model="dataInfo.domain"></el-input>
          </el-form-item>
          <el-form-item label="项目描述" label-width="100px">
            <el-input v-model="dataInfo.desc"></el-input>
          </el-form-item>  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateProject">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible">
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*项目名称" label-width="100px" prop="name">
            <el-input v-model="dataAdd.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="*项目域名" label-width="100px" prop="domain">
            <el-input v-model="dataAdd.domain"></el-input>
          </el-form-item>
          <el-form-item label="项目描述" label-width="100px" prop="desc">
            <el-input v-model="dataAdd.desc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { getProjectList, findModulesByPeojectId, getProject, saveProject, modifyProject, deleteProject } from "@/api/getData";
export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      dataAdd:{},
      editDialogFormVisible: false,
      addDialogFormVisible: false,
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectProjectList(this.queryForm);
  },
  methods: {
    async selectProjectList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      const res = await getProjectList(this.queryForm)
      if (res.code == 200) {
          this.total = res.data.total
          this.dataList = res.data.list
      } else {
        this.$message({
          type:"error",
          message:res.msg
        });
      }
    },
    async handleAdd() {
        const res = await saveProject(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectProjectList({});
        } else {
            this.$message({
            type: "error",
            message: res.msg
            });
        }
    },

    async handleEdit(project_id) {
      const res = await getProject({projectId:project_id});
      if (res.code == 200) {
        this.dataInfo = res.data;
        this.editDialogFormVisible = true;
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    async handleDelete(project_id, index) {
      const res = await deleteProject(project_id);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.total --;
        this.dataList.splice(index, 1);
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    async updateProject() {
      const res = await modifyProject(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.editDialogFormVisible = false;
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
        this.editDialogFormVisible = true;
      }
      this.selectProjectList(this.queryForm);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectProjectList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectProjectList(this.queryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
    },
  }
}
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 5px;
}
.query {
  padding: 5px;
}
.pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
</style>
