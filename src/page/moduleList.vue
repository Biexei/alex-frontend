<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="项目名称">
          <el-input v-model="queryForm.projectName" placeholder="项目名称"  size='mini'></el-input>
        </el-form-item>
        <el-form-item label="模块名称">
          <el-input v-model="queryForm.moduleName" placeholder="模块名称"  size='mini'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="selectModuleList(queryForm)">查询</el-button>
          <el-button type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button type="primary" size="mini" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="moduleId" label="模块编号" min-width="21%"></el-table-column>
        <el-table-column property="moduleName" label="模块名称" min-width="21%"></el-table-column>
        <el-table-column property="projectName" label="项目名称" min-width="21%"></el-table-column>
        <el-table-column property="desc" label="模块描述" min-width="21%" show-overflow-tooltip></el-table-column>
        <el-table-column property="createdTime" label="创建时间" min-width="21%"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.moduleId)"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.moduleId, scope.$index)"
              type="danger"
              size="mini"
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

      <el-dialog title="编辑" :visible.sync="editDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataInfo">
          <el-form-item label="*模块名称" label-width="100px">
            <el-input v-model="dataInfo.moduleName"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="模块描述" label-width="100px">
            <el-input v-model="dataInfo.desc"  size='mini'></el-input>
          </el-form-item>  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="updateModule" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible" @open="selectProjectList" :close-on-click-modal=false>
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*项目名称" label-width="100px" prop="name">
            <el-select v-model="dataAdd.projectId" @change="handleSelect"  size='mini'>
              <el-option
              size='mini'
              v-for="item in projectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*模块名称" label-width="100px" prop="domain">
            <el-input v-model="dataAdd.name" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="模块描述" label-width="100px" prop="desc">
            <el-input v-model="dataAdd.desc" size='mini'></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="handleAdd()" size="mini">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { saveModule,  modifyModule,  removeModule, findProjectModuleList, getAllProject} from "@/api/getData";
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
      projectOptions: [],
      selectIndex: null,
      editDialogFormVisible: false,
      addDialogFormVisible: false,
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectModuleList(this.queryForm);
  },
  methods: {
    async selectModuleList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      const res = await findProjectModuleList(this.queryForm)
      if (res.code == 200) {
          this.total = res.data.total
          this.dataList = res.data.list
      } else {
        this.$message({
          type:"error",
          center: true,
          message:res.msg
        });
      }
    },
    async selectProjectList(){
      this.projectOptions = []
      const res = await getAllProject({})
      if (res.code == 200) {
          let dataList = res.data
          dataList.forEach((item, index) => {
            this.projectOptions.push({
                label: item.name,
                value: item.projectId,
                index: index
            });
          });
      } else {
        this.$message({
          type:"error",
          center: true,
          message:res.msg
        });
      }
    },
    async handleSelect(projectId) {
      this.dataAdd['projectId'] = projectId;
    },  
    async handleAdd() {
        const res = await saveModule(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectModuleList({});
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },

    async handleEdit(moduleId) {
      const res = await findProjectModuleList({moduleId:moduleId});
      if (res.code == 200) {
        this.dataInfo = res.data.list[0];
        this.editDialogFormVisible = true;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleDelete(moduleId, index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await removeModule(moduleId);
        if (res.code == 200) {
          this.$message({
            type: "success",
            center: true,
            message: res.msg
          });
          this.total --;
          this.dataList.splice(index, 1);
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          });
        }
      })  
    },
    async updateModule() {
      let postData = {};
      postData['moduleId'] = this.dataInfo.moduleId
      postData['desc'] = this.dataInfo.desc
      postData['name'] = this.dataInfo.moduleName
      const res = await modifyModule(postData);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
        this.selectModuleList(this.queryForm);
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = true;
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectModuleList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectModuleList(this.queryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectModuleList(this.queryForm)
    }
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
