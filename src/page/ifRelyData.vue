<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
        ref="queryForm"
      >
        <el-form-item label="依赖名称">
          <el-input
            v-model="queryForm.relyName"
            placeholder="依赖名称"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="依赖描述" class="input">
          <el-input
            v-model="queryForm.relyDesc"
            placeholder="依赖描述"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="用例描述" class="input">
          <el-input
            v-model="queryForm.caseDesc"
            placeholder="用例描述"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="提取类型" class="input">
          <el-select
            v-model="queryForm.contentType"
            clearable
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              size="mini"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <br/>     -->
        <!-- <el-form-item label="起始时间">
          <el-date-picker
            size='mini'
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
            size='mini'
            v-model="queryForm.createdEndTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择截止时间"
            align="right">
          </el-date-picker>
        </el-form-item>          -->
        <el-form-item>
          <el-button
            v-has="'data_center:if_rely:find'"
            type="primary"
            size="mini"
            @click="selectIfRelyDataList(queryForm)"
            >查询</el-button
          >
          <el-button
            v-has="'data_center:if_rely:find'"
            type="primary"
            size="mini"
            @click="resetForm"
            >重置</el-button
          >
          <el-button
            v-has="'data_center:if_rely:add'"
            type="primary"
            size="mini"
            @click="openAdd"
            plain
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="预检地址:">
                <el-input
                  :value="props.row.caseUrl"
                  readonly
                  size="mini"
                ></el-input>
              </el-form-item>
              <br />
              <el-form-item label="用例描述:">
                <el-input
                  :value="props.row.caseDesc"
                  readonly
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          property="relyId"
          label="编号"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          property="relyName"
          label="名称"
          min-width="15%"
        ></el-table-column>
        <el-table-column
          property="extractExpression"
          label="提取表达式"
          min-width="20%"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-row :gutter="5">
              <el-col :span="4"
                ><el-tag
                  effect="dark"
                  size="mini"
                  :type="scope.row.style"
                  disable-transitions
                  >{{ scope.row.contentType }}</el-tag
                ></el-col
              >
              <el-col :span="20"
                ><span>{{ scope.row.extractExpression }}</span></el-col
              >
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          property="relyDesc"
          label="依赖描述"
          min-width="25%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="createdTime"
          label="创建时间"
          min-width="15%"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              @click="handleCheck(scope.row.relyId)"
              v-has="'data_center:if_rely:execute'"
              type="success"
              size="mini"
              icon="el-icon-check"
              circle
            >
            </el-button>
            <el-button
              @click="handleEdit(scope.row.relyId)"
              v-has="'data_center:if_rely:modify'"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.relyId, scope.$index)"
              v-has="'data_center:if_rely:remove'"
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

      <el-dialog
        title="编辑"
        :visible.sync="editDialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="dataInfo">
          <el-form-item label="*依赖名称" label-width="115px">
            <el-row :gutter="10">
              <el-col :span="23"
                ><el-input v-model="dataInfo.relyName" size="mini"></el-input
              ></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*提取配置" label-width="115px">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-select
                  v-model="dataInfo.contentType"
                  placeholder="请选择"
                  size="mini"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="dataInfo.extractExpression"
                  size="mini"
                  placeholder="请输入提取表达式"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*依赖用例" label-width="115px">
            <el-row :gutter="10">
              <el-col :span="3"
                ><el-input
                  readonly
                  v-model="dataInfo.relyCaseId"
                  @focus="handleCaseList"
                  size="mini"
                  placeholder="请选择"
                ></el-input
              ></el-col>
              <el-col :span="20"
                ><el-input
                  disabled
                  v-model="dataInfo.caseDesc"
                  size="mini"
                ></el-input
              ></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*权限设置" label-width="115px">
            <el-row :gutter="20">
              <el-col :span="5">
                <el-checkbox
                  v-model="dataInfo.othersModifiable"
                  :true-label="0"
                  :false-label="1"
                  :disabled="userId != dataInfo.creatorId"
                  >允许他人修改</el-checkbox
                >
              </el-col>
              <el-col :span="5">
                <el-checkbox
                  v-model="dataInfo.othersDeletable"
                  :true-label="0"
                  :false-label="1"
                  :disabled="userId != dataInfo.creatorId"
                  >允许他人删除</el-checkbox
                >
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="依赖描述" label-width="115px">
            <el-row :gutter="10">
              <el-col :span="23">
                <el-input v-model="dataInfo.relyDesc" size="mini"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="创建人" label-width="115px">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-input
                  v-model="dataInfo.creatorId"
                  size="mini"
                  disabled
                ></el-input>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="dataInfo.creatorName"
                  size="mini"
                  disabled
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="updateIfRelyData" size="mini"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        title="接口用例列表"
        :visible.sync="selectCaseDialogFormVisible"
        append-to-body
      >
        <el-form
          :inline="true"
          :model="caseQueryForm"
          class="demo-form-inline"
          ref="queryForm"
        >
          <el-form-item label="项目名称">
            <el-input
              v-model="caseQueryForm.projectName"
              placeholder="项目名称"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item label="模块名称">
            <el-input
              v-model="caseQueryForm.moduleName"
              placeholder="模块名称"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item label="用例描述">
            <el-input
              v-model="caseQueryForm.desc"
              placeholder="用例描述"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              circle
              @click="getCaseList(caseQueryForm)"
              size="mini"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-refresh"
              circle
              @click="resetCaseForm"
              size="mini"
            ></el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="caseList"
          stripe
          highlight-current-row
          @row-click="handleSelectCase"
          style="width: 100%"
        >
          <el-table-column
            property="caseId"
            label="用例编号"
            min-width="20%"
          ></el-table-column>
          <el-table-column
            property="projectName"
            label="项目名称"
            min-width="25%"
          ></el-table-column>
          <el-table-column
            property="moduleName"
            label="模块名称"
            min-width="25%"
          ></el-table-column>
          <el-table-column
            property="desc"
            label="用例描述"
            min-width="30%"
          ></el-table-column>
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

      <el-dialog
        title="添加"
        :visible.sync="addDialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="dataAdd">
          <el-form-item label="*依赖名称" label-width="115px">
            <el-row :gutter="10">
              <el-col :span="23"
                ><el-input v-model="dataAdd.relyName" size="mini"></el-input
              ></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*提取配置" label-width="115px">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-select
                  v-model="dataAdd.contentType"
                  placeholder="请选择"
                  size="mini"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="dataAdd.extractExpression"
                  size="mini"
                  placeholder="请输入提取表达式"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*依赖用例" label-width="115px">
            <el-row :gutter="10">
              <el-col :span="3"
                ><el-input
                  readonly
                  v-model="dataAdd.relyCaseId"
                  @focus="handleCaseList"
                  size="mini"
                  placeholder="请选择"
                ></el-input
              ></el-col>
              <el-col :span="20"
                ><el-input
                  disabled
                  v-model="dataAdd.caseDesc"
                  size="mini"
                ></el-input
              ></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*权限设置" label-width="115px">
            <el-row :gutter="20">
              <el-col :span="5">
                <el-checkbox
                  v-model="dataAdd.othersModifiable"
                  :true-label="0"
                  :false-label="1"
                  >允许他人修改</el-checkbox
                >
              </el-col>
              <el-col :span="5">
                <el-checkbox
                  v-model="dataAdd.othersDeletable"
                  :true-label="0"
                  :false-label="1"
                  >允许他人删除</el-checkbox
                >
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="依赖描述" label-width="115px">
            <el-row :gutter="10">
              <el-col :span="23">
                <el-input v-model="dataAdd.relyDesc" size="mini"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="handleAdd()" size="mini"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {
  saveIfRelyData,
  modifyIfRelyData,
  findIfRelyData,
  findIfRelyDataList,
  removeIfRelyData,
  listInterfaceCase,
  checkIfRelyData
} from "@/api/getData";
export default {
  data() {
    return {
      userId: null,
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      dataAdd: {},
      editDialogFormVisible: false,
      addDialogFormVisible: false,

      selectCaseDialogFormVisible: false,
      caseList: [],
      caseQueryForm: {},
      caseTotal: 0,
      casePageSize: 5,
      casePageNum: 1,
      typeOptions: [
        {
          value: 0,
          label: "json"
        },
        {
          value: 1,
          label: "html"
        },
        {
          value: 2,
          label: "header"
        }
      ]
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectIfRelyDataList(this.queryForm);
    this.getUserId();
  },
  methods: {
    async selectIfRelyDataList(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      const res = await findIfRelyDataList(this.queryForm);
      if (res.code == 200) {
        this.dataList = [];
        this.total = res.data.total;
        res.data.list.forEach(element => {
          if (element.contentType == 0) {
            element.style = "";
            element.contentType = "json";
          } else if (element.contentType == 1) {
            element.style = "success";
            element.contentType = "html";
          } else if (element.contentType == 2) {
            element.style = "danger";
            element.contentType = "header";
          } else {
            element.contentType = "other";
          }
          this.dataList.push({
            relyId: element.relyId,
            relyName: element.relyName,
            contentType: element.contentType,
            extractExpression: element.extractExpression,
            relyDesc: element.relyDesc,
            caseDesc: element.caseDesc,
            createdTime: element.createdTime,
            style: element.style,
            caseUrl: element.caseUrl
          });
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
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
    async getCaseList() {
      this.caseQueryForm["pageSize"] = this.casePageSize;
      this.caseQueryForm["pageNum"] = this.casePageNum;
      const res = await listInterfaceCase(this.caseQueryForm);
      if (res.code == 200) {
        this.caseList = [];
        this.caseTotal = res.data.total;
        this.caseList = res.data.list;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleCaseList() {
      this.getCaseList();
      this.caseQueryForm = {};
      this.selectCaseDialogFormVisible = true;
    },
    async handleSelectCase(row) {
      this.selectCaseDialogFormVisible = false;
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
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await removeIfRelyData(relyId);
        if (res.code == 200) {
          this.$message({
            type: "success",
            center: true,
            message: res.msg
          });
          this.total--;
          this.dataList.splice(index, 1);
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          });
        }
      });
    },
    async updateIfRelyData() {
      let modifyData = {
        relyId: this.dataInfo.relyId,
        relyCaseId: this.dataInfo.relyCaseId,
        relyName: this.dataInfo.relyName,
        relyDesc: this.dataInfo.relyDesc,
        contentType: this.dataInfo.contentType,
        extractExpression: this.dataInfo.extractExpression,
        othersDeletable: this.dataInfo.othersDeletable,
        othersModifiable: this.dataInfo.othersModifiable
      };
      const res = await modifyIfRelyData(modifyData);
      if (res.code == 200) {
        this.editDialogFormVisible = false;
        this.selectIfRelyDataList({});
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
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
      this.dataAdd = {
        othersDeletable: 0,
        othersModifiable: 0
      };
    },
    async resetForm() {
      this.queryForm = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.selectIfRelyDataList(this.queryForm);
    },
    async resetCaseForm() {
      this.caseQueryForm = {};
      this.casePageSize = 5;
      this.casePageNum = 1;
      this.getCaseList(this.caseQueryForm);
    },
    // 获取用户ID
    getUserId() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      this.userId = userInfo.userId;
    }
  }
};
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
.input {
  padding-left: 0px;
}
</style>
