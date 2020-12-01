<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="名称">
          <el-input v-model="queryForm.name" placeholder="名称" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryForm.type" clearable placeholder="请选择"  size='mini'>
            <el-option
              v-for="item in factoryTypeOptions"
              :key="item.value"
              size='mini'
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="selectFactoryList(queryForm)">查询</el-button>
          <el-button type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button type="primary" size="mini" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="id" label="编号" min-width="10%"></el-table-column>
        <el-table-column property="name" label="名称" min-width="20%"></el-table-column>
        <el-table-column property="type" label="类型" min-width="15%">
            <template slot-scope="scope">
                <el-tag effect="dark" disable-transitions type="scope.row.style" size="small">{{scope.row.type}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column property="times" label="执行次数" min-width="15%"></el-table-column>
        <el-table-column property="createdTime" label="创建时间" min-width="15%"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button 
              @click="handleExecute(scope.row.id)"
              type="success"
              size="mini" 
              icon="el-icon-check" 
              circle>
            </el-button>
            <el-button
              @click="handleEdit(scope.row.id)"
              type="primary"
              size="mini" 
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.id, scope.$index)"
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
          <el-form-item label="*名称" label-width="120px">
            <el-input v-model="dataInfo.name" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*类型" label-width="120px">
            <el-select v-model="dataInfo.type" size='mini'>
              <el-option
                v-for="item in factoryTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*执行次数" label-width="120px">
            <el-input-number v-model="dataInfo.times" :min="1" :max="100" size="mini"></el-input-number>
          </el-form-item>
          <el-form-item label="*遇到错误停止" label-width="120px">
            <el-radio-group v-model="dataInfo.failedStop" size='mini'>
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="*数据源" label-width="120px" v-if="dataInfo.type == 0">
            <el-input v-model="dataInfo.sqlDbName"  @focus='handleDbList' size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*运行环境" label-width="120px" v-if="dataInfo.type == 0">
            <el-select v-model="dataInfo.sqlRunDev" size='mini'>
              <el-option
                v-for="item in runDevOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*SQL语句" label-width="120px" v-if="dataInfo.type == 0">
            <el-input v-model="dataInfo.sqlStr" size="mini" type="textarea" :rows="6" placeholder="如需运行多条语句，请回车换行"></el-input>
          </el-form-item>
          <el-form-item label="*接口测试套件" label-width="120px" v-if="dataInfo.type == 1">
            <el-select v-model="dataInfo.interfaceSuiteId" size='mini'>
              <el-option
                v-for="item in interfaceSuiteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*UI测试套件" label-width="120px" v-if="dataInfo.type == 2">
            <el-select v-model="dataInfo.uiSuiteId" size='mini'>
              <el-option
                v-for="item in uiSuiteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini" >取 消</el-button>
          <el-button type="primary" @click="updateDataFactory" size="mini" >确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*名称" label-width="120px">
            <el-input v-model="dataAdd.name" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*类型" label-width="120px">
            <el-select v-model="dataAdd.type" size='mini'>
              <el-option
                v-for="item in factoryTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*执行次数" label-width="120px">
            <el-input-number v-model="dataAdd.times" :min="1" :max="100" size="mini"></el-input-number>
          </el-form-item>
          <el-form-item label="*遇到错误停止" label-width="120px">
            <el-radio-group v-model="dataAdd.failedStop" size='mini'>
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="*数据源" label-width="120px" v-if="dataAdd.type == 0">
            <el-input v-model="dataAdd.sqlDbName"  @focus='handleDbList' size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*运行环境" label-width="120px" v-if="dataAdd.type == 0">
            <el-select v-model="dataAdd.sqlRunDev" size='mini'>
              <el-option
                v-for="item in runDevOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*SQL语句" label-width="120px" v-if="dataAdd.type == 0">
            <el-input v-model="dataAdd.sqlStr" size="mini" type="textarea" :rows="6" placeholder="如需运行多条语句，请回车换行"></el-input>
          </el-form-item>
          <el-form-item label="*接口测试套件" label-width="120px" v-if="dataAdd.type == 1">
            <el-select v-model="dataAdd.interfaceSuiteId" size='mini'>
              <el-option
                v-for="item in interfaceSuiteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*UI测试套件" label-width="120px" v-if="dataAdd.type == 2">
            <el-select v-model="dataAdd.uiSuiteId" size='mini'>
              <el-option
                v-for="item in uiSuiteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false" size="mini" >取 消</el-button>
          <el-button type="primary" @click="handleAdd()" size="mini" >确 定</el-button>
        </div>
      </el-dialog>



      <el-dialog title="选择数据源" :visible.sync="selectDbDialogFormVisible" append-to-body>
        <el-form :inline="true" :model="dbQueryForm" class="demo-form-inline" ref="queryForm">
          <el-form-item label="数据源名称">
            <el-input v-model="dbQueryForm.name" placeholder="数据源名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="dbQueryForm.type" clearable placeholder="请选择" size="mini">
              <el-option
                v-for="item in dbTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="dbQueryForm.desc" placeholder="描述" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" circle @click="selectDbList(dbQueryForm)" size="mini"></el-button>
            <el-button type="primary" icon="el-icon-refresh" circle @click="resetDbForm" size="mini"></el-button>
          </el-form-item>
        </el-form>
        <el-table 
        :data="dbList" 
        stripe 
        highlight-current-row 
        @row-click="handleSelectDb"
        style="width: 100%">
          <el-table-column property="id" label="编号" min-width="13%"></el-table-column>
          <el-table-column property="name" label="名称" min-width="13%"></el-table-column>
          <el-table-column property="type" label="类型" min-width="13%"></el-table-column>
          <el-table-column property="desc" label="描述" min-width="13%"></el-table-column>
        </el-table>
        <div class="pagination" style="text-align: left;margin-top: 10px;">
          <el-pagination
            @size-change="handleDbSizeChange"
            @current-change="handleDbCurrentChange"
            :current-page="dbPageNum"
            :page-sizes="[5, 10, 20]"
            :page-size="dbPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dbTotal"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { saveDataFactory, modifyDataFactory, findDataFactoryById, findDataFactoryList, removeDataFactoryById, executeDataFactory,findDbList,findInterfaceCaseSuiteAll } from "@/api/getData";
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
      factoryTypeOptions:[
        {
          value: 0,
          label: 'SQL'
        },
        {
          value: 1,
          label: '接口'
        },
        // {
        //   value: 2,
        //   label: 'UI'
        // },
      ],
      dbOptions:[],
      interfaceSuiteOptions:[],
      uiSuiteOptions:[],
      runDevOptions:[
          {
              value:4,
              label:'调试 DEBUG',
          },
          {
              value:0,
              label:'开发 DEV',
          },
          {
              value:1,
              label:'测试 TEST',
          },
          {
              value:2,
              label:'预发 STG',
          },
          {
              value:3,
              label:'线上 PROD',
          },
      ],


      selectDbDialogFormVisible: false,      
      dbList: [],
      dbQueryForm: {},
      dbTotal: 0,
      dbPageSize: 5,
      dbPageNum: 1,
      dbTypeOptions:[
        {
          value: 0,
          label: 'MySQL'
        },
        {
          value: 1,
          label: 'Oracle'
        },
        {
          value: 2,
          label: 'SQL Server'
        },
      ],
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectFactoryList(this.queryForm);
  },
  methods: {
    async selectFactoryList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      this.dataList = []
      const res = await findDataFactoryList(queryForm)
      if (res.code == 200) {
          this.total = res.data.total
          res.data.list.forEach(element => {
            if (element.type == 0) {
              element.type = 'SQL'
              element.style = 'primary'
            } else if (element.type == 1) {
              element.type = '接口'
              element.style = 'success'
            } else if (element.type == 2) {
              element.type = 'UI'
              element.style = 'warning'
            } 
            this.dataList.push(element)
          });
      } else {
        this.$message({
          type:"error",
          center: true,
          message:res.msg
        });
      }
    },
    async handleExecute(id) {
        const res = await executeDataFactory(id)
        if (res.code == 200) {
            this.$message({
                type: "success",
                center: true,
                message: "执行成功，共耗时" + res.data + "ms"
                })
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          })
        }
    },
    async handleAdd() {
        const res = await saveDataFactory(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectFactoryList({});
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },

    async handleEdit(id) {
      const res = await findDataFactoryById(id);
      if (res.code == 200) {
        this.dataInfo = res.data;
        const ifSuite = await findInterfaceCaseSuiteAll()
        if (ifSuite.code == 200) {
          this.interfaceSuiteOptions = []
          ifSuite.data.forEach(element => {
            this.interfaceSuiteOptions.push({
              label:element.suiteName,
              value:element.suiteId,
            })
          });
        } else {
          this.$message({
            type: "error",
            center: true,
            message: ifSuite.msg
          });
        }
        if(res.data.type == 0) {
            this.dataInfo.sqlDbName = res.data.elementName
        }
        this.editDialogFormVisible = true;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleDelete(id, index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await removeDataFactoryById(id);
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
    async updateDataFactory() {
      const res = await modifyDataFactory(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
        this.selectFactoryList(this.queryForm);
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
      this.selectFactoryList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectFactoryList(this.queryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
      this.dataAdd.failedStop = 1
      const ifSuite = await findInterfaceCaseSuiteAll()
      if (ifSuite.code == 200) {
        this.interfaceSuiteOptions = []
        ifSuite.data.forEach(element => {
          this.interfaceSuiteOptions.push({
            label:element.suiteName,
            value:element.suiteId,
          })
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: ifSuite.msg
        });
      }
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectFactoryList(this.queryForm)
    },



    // 选择数据源
    async handleDbList() {
      this.selectDbList()
      this.dbQueryForm = {}
      this.selectDbDialogFormVisible = true
    },
    async handleSelectDb(row){
      this.selectDbDialogFormVisible = false
      this.dataInfo.sqlDbId = row.id;
      this.dataInfo.sqlDbName = row.name;
      this.dataAdd.sqlDbId = row.id;
      this.dataAdd.sqlDbName = row.name;
    },
    async selectDbList(dbQueryForm){
      this.dbQueryForm['pageNum'] = this.dbPageNum
      this.dbQueryForm['pageSize'] = this.dbPageSize
      this.dbList = []
      const res = await findDbList(this.dbQueryForm)
      if (res.code == 200) {
          this.dbTotal = res.data.total
          res.data.list.forEach(element => {
            if (element.type == 0) {
              element.type = 'MySQL'
            } else if (element.type == 1) {
              element.type = 'Oracle'
            } else if (element.type == 2) {
              element.type = 'SQL Server'
            } else {
              tyoe = 'Others'
            }
            this.dbList.push({
                id: element.id,
                name: element.name,
                type: element.type,
                desc: element.desc,
                createdTime: element.createdTime,
                status: element.status == 0?'启用':'禁用'
            })
          });
      } else {
        this.$message({
          type:"error",
          center: true,
          message:res.msg
        });
      }
    },
    async resetDbForm() {
      this.dbQueryForm = {}
      this.dbPageSize = 10
      this.dbPageNum = 1
      this.selectDbList(this.dbQueryForm)
    },
    handleDbSizeChange(pageSize) {
      this.dbPageSize = pageSize;
      this.selectDbList(this.caseQueryForm);
    },
    handleDbCurrentChange(pageNum) {
      this.dbPageNum = pageNum;
      this.selectDbList(this.caseQueryForm);
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
