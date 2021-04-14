<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="编号">
          <el-input v-model="queryForm.serverId" placeholder="编号" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="queryForm.port" placeholder="端口" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="queryForm.desc" placeholder="描述" size='mini'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-has="'project:find'" type="primary" size="mini" @click="selectMockServerList(queryForm)">查询</el-button>
          <el-button v-has="'project:find'" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button v-has="'project:add'" type="primary" size="mini" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="serverId" label="编号" min-width="8%"></el-table-column>
        <el-table-column property="host" label="Host" min-width="15%"></el-table-column>
        <el-table-column property="port" label="Port" min-width="10%"></el-table-column>
        <el-table-column property="isForward" label="自动转发" min-width="10%"></el-table-column>
        <el-table-column property="desc" label="项目描述" min-width="20%" show-overflow-tooltip></el-table-column>
        <el-table-column property="creatorName" label="创建人" min-width="10%"></el-table-column>
        <el-table-column property="createdTime" label="创建时间" min-width="15%"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.serverId)"
              v-has="'project:modify'"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.serverId, scope.$index)"
              v-has="'project:remove'"
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

      <el-dialog title="编辑" :visible.sync="editDialogFormVisible"  :close-on-click-modal=false>
        <el-form :model="dataInfo">
          <el-form-item label="*Port" label-width="120px">
            <el-input v-model="dataInfo.port"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*转发地址" label-width="120px">
            <el-input v-model="dataInfo.domain"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*转发端口" label-width="120px">
            <el-input v-model="dataInfo.devDomain"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*描述" label-width="120px">
            <el-input v-model="dataInfo.desc"  size='mini'></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="updateMockServer" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*Port" label-width="120px">
            <el-input v-model="dataAdd.port"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*转发地址" label-width="120px">
            <el-input v-model="dataAdd.domain"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*转发端口" label-width="120px">
            <el-input v-model="dataAdd.devDomain"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*描述" label-width="120px">
            <el-input v-model="dataAdd.desc"  size='mini'></el-input>
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
import { baseUrl } from '../config/env';
import { saveMockServer, modifyMockServer, findAllMockServer, findMockServer, findMockServerById, removeMockServer, stopMockServer, 
         startMockServer, forceStartMockServer, stopAllMockServer, startAllMockServer} from "@/api/getData";

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
    this.selectMockServerList(this.queryForm);
  },
  methods: {
    async selectMockServerList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      const res = await findMockServer(this.queryForm)
      if (res.code == 200) {
          this.total = res.data.total
          let result = res.data.list
          result.forEach(element => {
              let split = baseUrl.split(":")
              let protocolAndHost;
              let url;
              if (split.length == 1) {
                protocolAndHost = split[0]
              } else {
                protocolAndHost = split[1]
              }
              url = protocolAndHost.split("//")[1]
              element["host"] = url;
              if (element.remoteHost == null || element.remoteHost == "" || element.remotePort == null) {
                element["isForward"] = "否"
              } else {
                element["isForward"] = "是"
              }
          })
          this.dataList = result;
      } else {
        this.$message({
          type:"error",
          center: true,
          message:res.msg
        });
      }
    },
    async handleAdd() {
        const res = await saveMockServer(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectMockServerList({});
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },

    async handleEdit(serverId) {
      const res = await findMockServerById(serverId);
      if (res.code == 200) {
        this.dataInfo = res.data;
        this.editDialogFormVisible = true;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleDelete(serverId, index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await removeMockServer(serverId);
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
    async updateMockServer() {
      const res = await modifyMockServer(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
        this.selectMockServerList(this.queryForm);
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
      this.selectMockServerList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectMockServerList(this.queryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectMockServerList(this.queryForm)
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
