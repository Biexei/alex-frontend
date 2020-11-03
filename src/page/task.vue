<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="名称">
          <el-input v-model="queryForm.desc" placeholder="名称" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" clearable placeholder="请选择"  size='mini'>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              size='mini'
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试套件">
          <el-input v-model="queryForm.suiteName" placeholder="测试套件名称"  size='mini'></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="queryForm.emailAddress" placeholder="Email"  size='mini'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="selectTaskList(queryForm)">查询</el-button>
          <el-button type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button type="primary" size="mini" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="taskId" label="编号" min-width="10%"></el-table-column>
        <el-table-column property="desc" label="名称" min-width="15%"></el-table-column>
        <el-table-column property="cron" label="Cron" min-width="15%"></el-table-column>
        <el-table-column property="suiteName" label="测试套件" min-width="15%"></el-table-column>
        <el-table-column property="nextTime" label="下次执行时间" min-width="20%"></el-table-column>
        <el-table-column property="status" label="状态" min-width="10%">
          <template slot-scope="scope">
          <el-switch
            @change='updateTaskStatus(scope.row)'
            v-model="scope.row.status"
            :active-value=0
            :inactive-value=1>
          </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.taskId)"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.taskId, scope.$index)"
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
           <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataInfo.desc" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*Cron" label-width="100px">
            <el-input v-model="dataInfo.cron" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*测试套件" label-width="100px">
            <el-input v-model="dataInfo.suiteName" size='mini' @focus='handleSuiteList'></el-input>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-radio-group v-model="dataInfo.status" size='mini'>
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="收件人" label-width="100px">
            <el-select  v-model="dataInfo.emailList"  multiple placeholder="请选择" size="mini" style="width:100%" value-key="item">
              <el-option
                v-for="item in emailList"
                :key="item"
                :label="item"
                :value="item"
                size='mini'>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="updateTask" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataAdd.desc" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*Cron" label-width="100px">
            <el-input v-model="dataAdd.cron" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*测试套件" label-width="100px">
            <el-input v-model="dataAdd.suiteName" size='mini' @focus='handleSuiteList'></el-input>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-radio-group v-model="dataAdd.status" size='mini'>
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="收件人" label-width="100px">
            <el-select v-model="dataAdd.emailList" multiple placeholder="请选择" size='mini' style="width:100%" value-key="item">
                <el-option
                v-for="item in emailList"
                :key="item"
                :label="item"
                :value="item"
                size='mini'>
                </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="handleAdd()" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="测试套件列表" :visible.sync="selectSuiteDialogFormVisible" append-to-body>
        <el-form :inline="true" :model="suiteQueryForm" class="demo-form-inline" ref="queryForm">
          <el-form-item label="名称">
            <el-input v-model="suiteQueryForm.suiteName" placeholder="名称" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="执行方式">
            <el-select v-model="suiteQueryForm.executeType" clearable placeholder="请选择"  size='mini'>
              <el-option
                v-for="item in executeTypeOptions"
                :key="item.value"
                size='mini'
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="suiteQueryForm.desc" placeholder="描述"  size='mini'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getSuiteList(queryForm)">查询</el-button>
            <el-button type="primary" size="mini" @click="resetSuiteForm">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table 
        :data="suiteList" 
        stripe 
        highlight-current-row 
        @row-click="handleSelectSuite"
        style="width: 100%">
          <el-table-column property="suiteId" label="编号" min-width="10%"></el-table-column>
          <el-table-column property="suiteName" label="名称" min-width="35%"></el-table-column>
          <el-table-column property="desc" label="描述" min-width="40%"></el-table-column>
          <el-table-column property="executeType" label="执行方式" min-width="15%">
            <template slot-scope="scope">
              <el-tag effect="dark" disable-transitions v-if="scope.row.executeType==0">并行</el-tag>
              <el-tag effect="dark" disable-transitions v-else-if="scope.row.executeType==1">串行</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" style="text-align: left;margin-top: 10px;">
          <el-pagination
            @size-change="handleSuiteSizeChange"
            @current-change="handleSuiteCurrentChange"
            :current-page="suitePageNum"
            :page-sizes="[5, 10, 20]"
            :page-size="suitePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="suiteTotal"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {findInterfaceCaseSuite,findAllEmail, findTaskList, findTaskById, saveTaskAndRef, modifyTask, removeTask, saveTaskEmailRef, removeTaskEmailRef } from "@/api/getData";
export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      emailList:[],
      dataInfo: {},
      dataAdd:{},
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      suiteTypeOption:[
        {
          value: 0,
          label: '接口'
        },
        {
          value: 1,
          label: 'UI'
        },
      ],
      statusOptions:[
        {
          value: 0,
          label: '启用'
        },
        {
          value: 1,
          label: '禁用'
        },
      ],


      selectSuiteDialogFormVisible: false,      
      suiteList: [],
      suiteQueryForm: {},
      suiteTotal: 0,
      suitePageSize: 5,
      suitePageNum: 1,
      executeTypeOptions:[
          {
              value:0,
              label:'并行',
          },
          {
              value:1,
              label:'串行',
          },
      ]
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectTaskList(this.queryForm);
  },
  methods: {
    async selectTaskList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      this.dataList = []
      const res = await findTaskList(queryForm)
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
        const res = await saveTaskAndRef(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectTaskList({});
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },

    async handleEdit(taskId) {
      const res = await findTaskById(taskId);
      if (res.code == 200) {
        this.dataInfo = res.data;
        this.getAllEmail(); 
        this.editDialogFormVisible = true;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleDelete(taskId, index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await removeTask(taskId);
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
    async updateTask() {
      const res = await modifyTask(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
        this.selectTaskList(this.queryForm);
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
      this.selectTaskList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectTaskList(this.queryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.getAllEmail();
      this.dataAdd = {};
      this.dataAdd.status = 0
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectTaskList(this.queryForm)
    },
    async getAllEmail() {
        const res = await findAllEmail();
        if (res.code == 200){
          this.emailList = res.data
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },
    async updateTaskStatus(row) {
      const res = await modifyTask(row);
      if (res.code == 200) {
        this.editDialogFormVisible = false;
        this.selectTaskList(this.queryForm);
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    handleSuiteSizeChange(pageSize) {
      this.suitePageSize = pageSize;
      this.getSuiteList(this.suiteQueryForm);
    },
    handleSuiteCurrentChange(pageNum) {
      this.suitePageNum = pageNum;
      this.getSuiteList(this.suiteQueryForm);
    },
    async resetSuiteForm() {
      this.suiteQueryForm = {}
      this.suitePageSize = 5
      this.suitePageNum = 1
      this.getSuiteList(this.suiteQueryForm)
    },
    async getSuiteList(){
      this.suiteQueryForm['pageSize'] = this.suitePageSize 
      this.suiteQueryForm['pageNum'] = this.suitePageNum 
      const res = await findInterfaceCaseSuite(this.suiteQueryForm)
      if (res.code == 200) {
        this.suiteList = []
        this.suiteTotal = res.data.total
        this.suiteList = res.data.list
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }      
    },  
    async handleSuiteList() {
      this.getSuiteList()
      this.caseQueryForm = {}
      this.selectSuiteDialogFormVisible = true
    },
    async handleSelectSuite(row){
      this.selectSuiteDialogFormVisible = false
      this.dataInfo.suiteId = row.suiteId;
      this.dataInfo.suiteName = row.suiteName;
      this.dataAdd.suiteId = row.suiteId;
      this.dataAdd.suiteName = row.suiteName;
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
