<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="项目名称">
          <el-input v-model="queryForm.name" placeholder="项目名称" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="调试域名">
          <el-input v-model="queryForm.domain" placeholder="调试域名" size='mini'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-has="'project:find'" type="primary" size="mini" @click="selectProjectList(queryForm)">查询</el-button>
          <el-button v-has="'project:find'" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button v-has="'project:add'" type="primary" size="mini" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="projectId" label="项目编号" min-width="21%"></el-table-column>
        <el-table-column property="name" label="项目名称" min-width="21%"></el-table-column>
        <el-table-column property="desc" label="项目描述" min-width="43%" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.projectId)"
              v-has="'project:modify'"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.projectId, scope.$index)"
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
          <el-form-item label="*项目名称" label-width="120px">
            <el-input v-model="dataInfo.name"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*调试环境" label-width="120px">
            <el-row>
              <el-col :span="4">
                <el-select v-model="dataInfo.protocol" size='mini'>
                  <el-option
                    v-for="item in protocolTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16"><el-input v-model="dataInfo.domain" size='mini' placeholder="Host"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataInfo.port" size='mini' placeholder="Port"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*开发环境" label-width="120px">
            <el-row>
              <el-col :span="4">
                <el-select v-model="dataInfo.devProtocol" size='mini'>
                  <el-option
                    v-for="item in protocolTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16"><el-input v-model="dataInfo.devDomain" size='mini' placeholder="Host"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataInfo.devPort" size='mini' placeholder="Port"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*测试环境" label-width="120px">
            <el-row>
              <el-col :span="4">
                <el-select v-model="dataInfo.testProtocol" size='mini'>
                  <el-option
                    v-for="item in protocolTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16"><el-input v-model="dataInfo.testDomain" size='mini' placeholder="Host"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataInfo.testPort" size='mini' placeholder="Port"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*预发环境" label-width="120px">
            <el-row>
              <el-col :span="4">
                <el-select v-model="dataInfo.stgProtocol" size='mini'>
                  <el-option
                    v-for="item in protocolTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16"><el-input v-model="dataInfo.stgDomain" size='mini' placeholder="Host"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataInfo.stgPort" size='mini' placeholder="Port"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*生产环境" label-width="120px">
            <el-row>
              <el-col :span="4">
                <el-select v-model="dataInfo.prodProtocol" size='mini'>
                  <el-option
                    v-for="item in protocolTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16"><el-input v-model="dataInfo.prodDomain" size='mini' placeholder="Host"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataInfo.prodPort" size='mini' placeholder="Port"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="项目描述" label-width="120px">
            <el-input v-model="dataInfo.desc" size="mini" type="textarea" :rows="3"></el-input>
          </el-form-item>  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="updateProject" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*项目名称" label-width="120px">
            <el-input v-model="dataAdd.name" auto-complete="off"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*调试环境" label-width="120px">
            <el-row>
              <el-col :span="4">
                <el-select v-model="dataAdd.protocol" size='mini'>
                  <el-option
                    v-for="item in protocolTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16"><el-input v-model="dataAdd.domain" size='mini' placeholder="Host"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataAdd.port" size='mini' placeholder="Port"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*开发环境" label-width="120px">
            <el-row>
              <el-col :span="4">
                <el-select v-model="dataAdd.devProtocol" size='mini'>
                  <el-option
                    v-for="item in protocolTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16"><el-input v-model="dataAdd.devDomain" size='mini' placeholder="Host"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataAdd.devPort" size='mini' placeholder="Port"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*测试环境" label-width="120px">
            <el-row>
              <el-col :span="4">
                <el-select v-model="dataAdd.testProtocol" size='mini'>
                  <el-option
                    v-for="item in protocolTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16"><el-input v-model="dataAdd.testDomain" size='mini' placeholder="Host"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataAdd.testPort" size='mini' placeholder="Port"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*预发环境" label-width="120px">
            <el-row>
              <el-col :span="4">
                <el-select v-model="dataAdd.stgProtocol" size='mini'>
                  <el-option
                    v-for="item in protocolTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16"><el-input v-model="dataAdd.stgDomain" size='mini' placeholder="Host"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataAdd.stgPort" size='mini' placeholder="Port"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*生产环境" label-width="120px">
            <el-row>
              <el-col :span="4">
                <el-select v-model="dataAdd.prodProtocol" size='mini'>
                  <el-option
                    v-for="item in protocolTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16"><el-input v-model="dataAdd.prodDomain" size='mini' placeholder="Host"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataAdd.prodPort" size='mini' placeholder="Port"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="项目描述" label-width="120px" prop="desc">
            <el-input v-model="dataAdd.desc" size="mini" type="textarea" :rows="3"></el-input>
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
import { getProjectList, findModulesByProjectId, getProject, saveProject, modifyProject, deleteProject } from "@/api/getData";
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
      protocolTypeOptions:[
        {
          value: 'http',
          label: 'http'
        },
        {
          value: 'https',
          label: 'https'
        },
        {
          value: 'ws',
          label: 'ws'
        },
        {
          value: 'wss',
          label: 'wss'
        },
        {
          value: 'dubbo',
          label: 'dubbo'
        },
      ],
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
          center: true,
          message:res.msg
        });
      }
    },
    async handleAdd() {
        const res = await saveProject(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectProjectList({});
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },

    async handleEdit(projectId) {
      const res = await getProject({projectId:projectId});
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
    async handleDelete(projectId, index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteProject(projectId);
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
    async updateProject() {
      const res = await modifyProject(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
        this.selectProjectList(this.queryForm);
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
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectProjectList(this.queryForm)
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
