<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="依赖名称">
          <el-input v-model="queryForm.relyName" placeholder="依赖名称" size='small'></el-input>
        </el-form-item>
        <el-form-item label="依赖描述" class='input'>
          <el-input v-model="queryForm.relyDesc" placeholder="依赖描述" size='small'></el-input>
        </el-form-item>
        <el-form-item label="用例描述" class='input'>
          <el-input v-model="queryForm.caseDesc" placeholder="用例描述" size='small'></el-input>
        </el-form-item>
        <el-form-item label="提取方式" class='input'>
          <el-select v-model="queryForm.contentType" clearable placeholder="请选择" size='small'>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              size='small'
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <br/>    
        <el-form-item label="起始时间">
          <el-date-picker
            size='small'
            v-model="queryForm.createdStartTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择起始时间"
            align="right">
          </el-date-picker>
        </el-form-item>  
        <el-form-item label="截止时间"  class='input'>
          <el-date-picker
            size='small'
            v-model="queryForm.createdEndTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择截止时间"
            align="right">
          </el-date-picker>
        </el-form-item>         
        <el-form-item>
          <el-button type="primary" size="small" @click="selectIfRelyDataList(queryForm)">查询</el-button>
          <el-button type="primary" size="small" @click="resetForm">重置</el-button>
          <el-button type="primary" size="small" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe style="width: 100%">
        <el-table-column property="relyId" label="编号" min-width="10%"></el-table-column>
        <el-table-column property="relyName" label="名称" min-width="10%"></el-table-column>
        <el-table-column property="contentType" label="提取方式" min-width="10%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.style"
              disable-transitions>{{scope.row.contentType}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="extractExpression" label="提取表达式" min-width="10%"></el-table-column>
        <el-table-column property="relyDesc" label="依赖描述" min-width="15%"></el-table-column>
        <el-table-column property="caseDesc" label="用例描述" min-width="15%"></el-table-column>
        <el-table-column property="createdTime" label="创建时间" min-width="15%"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button 
              @click="handleCheck(scope.row.relyId)"
              type="success" 
              size="small"
              icon="el-icon-check" 
              circle>
            </el-button>
            <el-button
              @click="handleEdit(scope.row.relyId)"
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.relyId, scope.$index)"
              type="danger"
              size="small"
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
          <el-form-item label="*依赖名称" label-width="100px">
            <el-input v-model="dataInfo.relyName" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*提取方式" label-width="100px">
            <el-select v-model="dataInfo.contentType" size='small'>
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*提取表达式" label-width="100px">
            <el-input v-model="dataInfo.extractExpression" size='small'></el-input>
          </el-form-item>
          <el-form-item label="依赖描述" label-width="100px">
            <el-input v-model="dataInfo.relyDesc" size='small'></el-input>
          </el-form-item>  
          <el-form-item label="*用例编号" label-width="100px">
            <el-input readonly v-model="dataInfo.relyCaseId" @focus='handleCaseList' size='small'></el-input>
          </el-form-item>
          <el-form-item label="*用例名称" label-width="100px">
            <el-input disabled v-model="dataInfo.caseDesc" size='small'></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="updateIfRelyData" size="small">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="接口用例列表" :visible.sync="selectCaseDialogFormVisible" append-to-body>
        <el-form :inline="true" :model="caseQueryForm" class="demo-form-inline" ref="queryForm">
          <el-form-item label="项目名称">
            <el-input v-model="caseQueryForm.projectName" placeholder="项目名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="模块名称">
            <el-input v-model="caseQueryForm.moduleName" placeholder="模块名称"  size="mini"></el-input>
          </el-form-item>
          <el-form-item label="用例描述">
            <el-input v-model="caseQueryForm.desc" placeholder="用例描述" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" circle @click="getCaseList(caseQueryForm)" size="mini"></el-button>
            <el-button type="primary" icon="el-icon-refresh" circle @click="caseQueryForm = {}" size="mini"></el-button>
          </el-form-item>
        </el-form>
        <el-table 
        :data="caseList" 
        stripe 
        highlight-current-row 
        @row-click="handleSelectCase"
        style="width: 100%">
          <el-table-column property="caseId" label="用例编号" min-width="20%"></el-table-column>
          <el-table-column property="projectName" label="项目名称" min-width="25%"></el-table-column>
          <el-table-column property="moduleName" label="模块名称" min-width="25%"></el-table-column>
          <el-table-column property="desc" label="用例描述" min-width="30%"></el-table-column>
        </el-table>
        <div class="pagination" style="text-align: left;margin-top: 10px;">
          <el-pagination
            @size-change="handleCaseSizeChange"
            @current-change="handleCaseCurrentChange"
            :current-page="casePageNum"
            :page-sizes="[5, 10, 20]"
            :page-size="casePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="caseTotal"
          ></el-pagination>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible">
        <el-form :model="dataAdd">
          <el-form-item label="*依赖名称" label-width="100px">
            <el-input v-model="dataAdd.relyName"></el-input>
          </el-form-item>
          <el-form-item label="*提取方式" label-width="100px">
            <el-select v-model="dataAdd.contentType" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*提取表达式" label-width="100px">
            <el-input v-model="dataAdd.extractExpression"></el-input>
          </el-form-item>
          <el-form-item label="依赖描述" label-width="100px">
            <el-input v-model="dataAdd.relyDesc"></el-input>
          </el-form-item>  
          <el-form-item label="*用例编号" label-width="100px">
            <el-input readonly v-model="dataAdd.relyCaseId" @focus='handleCaseList'></el-input>
          </el-form-item>
          <el-form-item label="*用例名称" label-width="100px">
            <el-input disabled v-model="dataAdd.caseDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="handleAdd()" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { saveIfRelyData, modifyIfRelyData, findIfRelyData, findIfRelyDataList, removeIfRelyData, listInterfaceCase, checkIfRelyData} from "@/api/getData";
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

      selectCaseDialogFormVisible: false,      
      caseList: [],
      caseQueryForm: {},
      caseTotal: 0,
      casePageSize: 5,
      casePageNum: 1,
      typeOptions:[
        {
          value: 0,
          label: 'json'
        },
        {
          value: 1,
          label: 'html'
        },
        {
          value: 2,
          label: 'header'
        },
      ],
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectIfRelyDataList(this.queryForm);
  },
  methods: {
    async selectIfRelyDataList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      this.dataList = [];
      const res = await findIfRelyDataList(this.queryForm)
      if (res.code == 200) {
          this.total = res.data.total
          res.data.list.forEach(element => {
            if (element.contentType == 0) {
              element.style = ""
              element.contentType = 'json'
            } else if (element.contentType == 1) {
              element.style = "success"
              element.contentType = 'html'
            } else if (element.contentType == 2) {
              element.style = "danger"
              element.contentType = 'header'
            } else {
              element.contentType = 'other'
            }
            this.dataList.push({
              relyId:element.relyId,
              relyName:element.relyName,
              contentType:element.contentType,
              extractExpression:element.extractExpression,
              relyDesc:element.relyDesc,
              caseDesc:element.caseDesc,
              createdTime:element.createdTime,
              style: element.style
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
    async handleCheck(relyId) {
      const res = await checkIfRelyData(relyId);
      if (res.code == 200) {
          this.$message({
          type: "success",
          center: true,
          message: res.data.result
          });
      } else {
          this.$message({
          type: "error",
          center: true,
          message: res.msg
          });
      }            
    },
    async handleAdd() {
        const res = await saveIfRelyData(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectIfRelyDataList({});
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },
    async getCaseList(){
      this.caseQueryForm['pageSize'] = this.casePageSize 
      this.caseQueryForm['pageNum'] = this.casePageNum 
      const res = await listInterfaceCase(this.caseQueryForm)
      if (res.code == 200) {
        this.caseList = []
        this.caseTotal = res.data.total
        this.caseList = res.data.list
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }      
    },
    async handleCaseList() {
      this.getCaseList()
      this.caseQueryForm = {}
      this.selectCaseDialogFormVisible = true
    },
    async handleSelectCase(row){
      console.log(row)
      this.selectCaseDialogFormVisible = false
      this.dataInfo.relyCaseId = row.caseId;
      this.dataInfo.caseDesc = row.desc;
      this.dataAdd.relyCaseId = row.caseId;
      this.dataAdd.caseDesc = row.desc;
    },
    async handleEdit(relyId) {
      const res = await findIfRelyData(relyId);
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
    async handleDelete(relyId, index) {
      const res = await removeIfRelyData(relyId);
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
    },
    async updateIfRelyData() {
      let modifyData = {
        relyId:this.dataInfo.relyId,
        relyCaseId:this.dataInfo.relyCaseId,
        relyName:this.dataInfo.relyName,
        relyDesc:this.dataInfo.relyDesc,
        contentType:this.dataInfo.contentType,
        extractExpression:this.dataInfo.extractExpression,
      }
      const res = await modifyIfRelyData(modifyData);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
      this.editDialogFormVisible = false;
      this.selectIfRelyDataList({});
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
      this.selectIfRelyDataList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectIfRelyDataList(this.queryForm);
    },

    handleCaseSizeChange(pageSize) {
      this.casePageSize = pageSize;
      this.getCaseList(this.caseQueryForm);
    },
    handleCaseCurrentChange(pageNum) {
      this.casePageNum = pageNum;
      this.getCaseList(this.caseQueryForm);
    },

    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectIfRelyDataList(this.queryForm)
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
.input{
  padding-left:50px;
}
</style>
