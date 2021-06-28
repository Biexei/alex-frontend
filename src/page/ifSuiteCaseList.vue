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
        <el-form-item label="用例编号">
          <el-input
            v-model="queryForm.caseId"
            placeholder="用例编号"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="用例名称">
          <el-input
            v-model="queryForm.caseDesc"
            placeholder="用例名称"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input
            v-model="queryForm.url"
            placeholder="URL"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="用例等级">
          <el-select
            v-model="queryForm.level"
            clearable
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in levelTypeOptions"
              :key="item.value"
              size="mini"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryForm.caseStatusOptions"
            clearable
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in caseStatusOptions"
              :key="item.value"
              size="mini"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="selectSuiteCaseList(queryForm)"
            >查询</el-button
          >
          <el-button type="primary" size="mini" @click="resetForm"
            >重置</el-button
          >
          <el-button type="primary" size="mini" @click="openAdd" plain
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        :data="dataList"
        stripe
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column property="order" label="排序" min-width="5%">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.order"
              size="mini"
              @blur="handleEdit(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          property="caseId"
          label="用例编号"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          property="suiteName"
          label="测试套件"
          min-width="19%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="caseDesc"
          label="用例名称"
          min-width="19%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="url"
          label="URL"
          min-width="21%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column property="level" label="等级" min-width="10%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.levelStyle"
              disable-transitions
              size="small"
              >{{ scope.row.level }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column property="caseStatus" label="状态" min-width="10%">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.caseStatus"
              @change="handleEdit(scope.row)"
              :active-value="0"
              :inactive-value="1"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="10%">
          <template slot-scope="scope">
            <el-button
              @click="handleExecute(scope.row)"
              type="success"
              size="mini"
              icon="el-icon-check"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.id)"
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
    </div>
    <el-dialog
      title="接口用例列表"
      :visible.sync="selectCaseDialogFormVisible"
      append-to-body
      width="60%"
      top="8vh"
      @close="resetForm"
    >
      <el-form
        :inline="true"
        :model="caseQueryForm"
        class="demo-form-inline"
        ref="queryForm"
      >
        <el-form-item label="项目">
          <el-input
            v-model="caseQueryForm.projectName"
            placeholder="项目名称"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="模块">
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
        <el-form-item label="URL">
          <el-input
            v-model="caseQueryForm.url"
            placeholder="URL"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="getCaseList"
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
        ref="caseList"
        :data="caseList"
        stripe
        highlight-current-row
        :row-key="getRowKey"
        style="width: 100%"
      >
        <el-table-column property="isCheck" label="选择" min-width="5%">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.isCheck"
              :checked="scope.row.isCheck"
              @change="handleSelect(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          property="caseId"
          label="用例编号"
          min-width="8%"
        ></el-table-column>
        <el-table-column
          property="projectName"
          label="项目名称"
          min-width="14%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="moduleName"
          label="模块名称"
          min-width="14%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="desc"
          label="用例描述"
          min-width="24%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="url"
          label="请求地址"
          min-width="20%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column property="method" label="请求方式" min-width="10%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.methodStyle"
              disable-transitions
              size="mini"
              >{{ scope.row.method }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column property="level" label="级别" min-width="5%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.levelStyle"
              disable-transitions
              size="mini"
              >{{ scope.row.level }}</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          @size-change="handleCaseSizeChange"
          @current-change="handleCaseCurrentChange"
          :current-page="casePageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="casePageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="caseTotal"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {
  executeCaseInSuite,
  removeSuiteCaseByObject,
  findAllSuiteCase,
  listInterfaceCase,
  modifySuiteCase,
  saveInterfaceCaseSuite,
  modifyInterfaceCaseSuite,
  removeInterfaceCaseSuiteById,
  findInterfaceCaseSuiteById,
  findInterfaceCaseSuite,
  saveSuiteCase,
  removeSuiteCase,
  findSuiteCaseList,
  executeSuiteCase
} from "@/api/getData";
export default {
  data() {
    return {
      suiteId: this.$route.query.suiteId,

      queryForm: {},
      caseQueryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      dataAdd: [],
      levelTypeOptions: [
        {
          value: 0,
          label: "高"
        },
        {
          value: 1,
          label: "中"
        },
        {
          value: 2,
          label: "低"
        }
      ],
      caseStatusOptions: [
        {
          value: 0,
          label: "启用"
        },
        {
          value: 1,
          label: "禁用"
        }
      ],

      selectRows: [],
      selectCaseDialogFormVisible: false,
      caseQueryForm: {},
      caseTotal: 0,
      casePageSize: 10,
      casePageNum: 1,
      caseList: [],
      suiteCaseList: [],
      AllSuiteCase: []
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.queryForm = {
      suiteId: this.suiteId
    };
    this.selectSuiteCaseList(this.queryForm);
    this.selectSuiteAllCase();
  },
  methods: {
    async selectSuiteAllCase() {
      const res = await findAllSuiteCase({ suiteId: this.suiteId });
      if (res.code == 200) {
        this.AllSuiteCase = res.data;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async selectSuiteCaseList(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      const res = await findSuiteCaseList(queryForm);
      if (res.code == 200) {
        this.dataList = [];
        this.total = res.data.total;
        res.data.list.forEach(element => {
          if (element.level == 0) {
            element.levelStyle = "danger";
            element.level = "高";
          } else if (element.level == 1) {
            element.levelStyle = "warning";
            element.level = "中";
          } else {
            element.levelStyle = "";
            element.level = "低";
          }
          this.dataList.push(element);
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleDelete(suiteId, index) {
      const res = await removeSuiteCase(suiteId);
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
    },
    async handleEdit(row) {
      const res = await modifySuiteCase(row);
      if (res.code == 200) {
        this.dataInfo = res.data;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectSuiteCaseList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectSuiteCaseList(this.queryForm);
    },
    async resetForm() {
      this.queryForm = {
        suiteId: this.suiteId
      };
      this.caseQueryForm = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.caseList = [];
      this.selectSuiteAllCase();
      this.selectSuiteCaseList(this.queryForm);
    },
    async openAdd() {
      this.selectSuiteAllCase();
      this.getCaseList({});
      this.selectCaseDialogFormVisible = true;
      this.dataAdd = [];
    },
    async resetCaseForm() {
      this.caseQueryForm = {};
      this.casePageSize = 10;
      this.casePageNum = 1;
      this.getCaseList(this.caseQueryForm);
    },
    handleCaseSizeChange(pageSize) {
      this.casePageSize = pageSize;
      this.getCaseList(this.caseQueryForm);
    },
    handleCaseCurrentChange(pageNum) {
      this.casePageNum = pageNum;
      this.getCaseList(this.caseQueryForm);
    },
    getRowKey(row) {
      return row.caseId;
    },
    async handleSelect(row) {
      if (row.isCheck) {
        // 调用新增接口
        let data = {};
        let dataList = [];
        data.suiteId = this.suiteId;
        data.caseId = row.caseId;
        data.caseStatus = 0;
        data.order = 1;
        dataList.push(data);
        const res = await saveSuiteCase(dataList);
        if (res.code != 200) {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          });
        }
      } else {
        // 调用删除接口
        let data = {};
        data.suiteId = this.suiteId;
        data.caseId = row.caseId;
        const res = await removeSuiteCaseByObject(data);
        if (res.code != 200) {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          });
        }
      }
    },
    async getCaseList() {
      this.selectRows = [];
      this.caseQueryForm["pageSize"] = this.casePageSize;
      this.caseQueryForm["pageNum"] = this.casePageNum;
      const res = await listInterfaceCase(this.caseQueryForm);
      if (res.code == 200) {
        this.caseList = [];
        this.caseTotal = res.data.total;
        res.data.list.forEach(element => {
          // 列表的测试用例编号若在该测试套件下
          this.AllSuiteCase.forEach(item => {
            if (item.caseId == element.caseId) {
              element.isCheck = true;
            }
          });
          if (element.isCheck == undefined) {
            element.isCheck = false;
          }
          if (element.level == 0) {
            element.levelStyle = "danger";
            element.level = "高";
          } else if (element.level == 1) {
            element.levelStyle = "warning";
            element.level = "中";
          } else {
            element.levelStyle = "";
            element.level = "低";
          }
          // 请求方式
          if (element.method == 0) {
            element.methodStyle = "";
            element.method = "GET";
          } else if (element.method == 1) {
            element.methodStyle = "";
            element.method = "POST";
          } else if (element.method == 2) {
            element.methodStyle = "";
            element.method = "UPDATE";
          } else if (element.method == 3) {
            element.methodStyle = "";
            element.method = "PUT";
          } else if (element.method == 4) {
            element.methodStyle = "";
            element.method = "DELETE";
          } else if (element.method == 5) {
            element.methodStyle = "";
            element.method = "HEAD";
          } else if (element.method == 6) {
            element.methodStyle = "";
            element.method = "OPTIONS";
          } else if (element.method == 7) {
            element.methodStyle = "";
            element.method = "TRACE";
          } else {
            element.methodStyle = "";
            element.method = "UNKNOW";
          }
          this.caseList.push(element);
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleExecute(row) {
      let suiteId = row.suiteId;
      let caseId = row.caseId;
      const res = await executeCaseInSuite({
        suiteId: suiteId,
        caseId: caseId
      });
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
      } else {
        if (res.msg === "执行失败") {
          this.$message({
            type: "warning",
            center: true,
            message: res.msg
          });
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          });
        }
      }
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
</style>
