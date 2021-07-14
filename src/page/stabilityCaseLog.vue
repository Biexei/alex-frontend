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
        <el-form-item label="日志编号">
          <el-input
            v-model="queryForm.stabilityTestLogNo"
            placeholder="日志编号"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="用例描述">
          <el-input
            v-model="queryForm.stabilityTestDesc"
            placeholder="用例描述"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryForm.status"
            clearable
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in statusTypeOptions"
              :key="item.value"
              size="mini"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运行环境">
          <el-select
            v-model="queryForm.runEnv"
            clearable
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in runEnvOptions"
              :key="item.value"
              size="mini"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button
            v-has="'stability:case:log:find'"
            type="primary"
            size="mini"
            @click="selectStabilityCaseLogList(queryForm)"
            >查询</el-button
          >
          <el-button
            v-has="'stability:case:log:find'"
            type="primary"
            size="mini"
            @click="resetForm"
            >重置</el-button
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
        <el-table-column
          property="stabilityTestLogNo"
          label="编号"
          min-width="30%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="stabilityTestDesc"
          label="用例描述"
          min-width="15%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="runEnvStr"
          label="运行环境"
          min-width="15%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="createdTime"
          label="创建时间"
          min-width="15%"
        ></el-table-column>
        <el-table-column property="status" label="状态" min-width="10%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="small"
              :type="scope.row.statusStyle"
              disable-transitions
              >{{ scope.row.statusStr }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              v-has="'stability:case:log:last'"
              @click="handleLast10(scope.row.stabilityTestLogNo)"
              icon="el-icon-zoom-in"
              circle
              type="danger"
              size="mini"
            ></el-button>
            <el-button
              v-has="'stability:case:log:download'"
              @click="handleDownload(scope.row.stabilityTestLogId)"
              icon="el-icon-download"
              circle
              type="info"
              size="mini"
            ></el-button>
            <el-button
              v-has="'stability:case:log:stop'"
              :disabled="scope.row.status != 0"
              @click="handleStop(scope.row.stabilityTestLogId)"
              icon="el-icon-close"
              circle
              type="danger"
              size="mini"
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
        title="日志"
        :visible.sync="last10DialogFormVisible"
      >
      <div v-html="last10"></div>
      </el-dialog>

  </div>
</template>
<script>
import headTop from "../components/headTop";
import { baseUrl } from "../config/env";
import {
  findStabilityCaseLogList,
  stopStabilityCaseById,
  stabilityCaseLast10ById,
} from "@/api/getData";
export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      last10: "",
      last10DialogFormVisible: false,
      statusTypeOptions: [
        {
          value: 0,
          label: "进行",
        },
        {
          value: 1,
          label: "停止",
        },
        {
          value: 2,
          label: "完成",
        },
      ],
      runEnvOptions: [
        {
          value: 4,
          label: "调试 DEBUG",
        },
        {
          value: 0,
          label: "开发 DEV",
        },
        {
          value: 1,
          label: "测试 TEST",
        },
        {
          value: 2,
          label: "预发 STG",
        },
        {
          value: 3,
          label: "线上 PROD",
        },
      ],
    };
  },
  components: {
    headTop,
  },
  mounted() {
    this.selectStabilityCaseLogList(this.queryForm);
  },
  methods: {
    async handleLast10(stabilityTestLogNo) {
      const res = await stabilityCaseLast10ById(stabilityTestLogNo);
      if (res.code == 200) {
        this.last10DialogFormVisible = true;
        this.last10 = "";
        this.last10 = res.data;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg,
        });
      }
    },
    handleDownload(logId) {
      window.open(baseUrl + "/stability/log/download/" + logId);
    },
    async handleStop(logId) {
      this.$confirm("此操作将强制停止该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await stopStabilityCaseById(logId);
        if (res.code == 200) {
          this.$message({
            type: "success",
            center: true,
            message: res.msg,
          });
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg,
          });
        }
      });
    },
    async selectStabilityCaseLogList(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      const res = await findStabilityCaseLogList(queryForm);
      if (res.code == 200) {
        this.dataList = [];
        this.total = res.data.total;
        res.data.list.map((element) => {
          element.logPath =
            baseUrl + "/stability/log/download/" + element.stabilityTestLogId;
          if (element.status == 0) {
            element.statusStr = "进行";
            element.statusStyle = "primary";
          } else if (element.status == 1) {
            element.statusStr = "停止";
            element.statusStyle = "info";
          } else if (element.status == 2) {
            element.statusStr = "完成";
            element.statusStyle = "success";
          } else {
            element.statusStr = "Others";
            element.statusStyle = "primary";
          }
          if (element.runEnv == 0) {
            element.runEnvStr = "开发 DEV";
          } else if (element.runEnv == 1) {
            element.runEnvStr = "测试 TEST";
          } else if (element.runEnv == 2) {
            element.runEnv = "预发 STG";
          } else if (element.runEnv == 3) {
            element.runEnvStr = "线上 PROD";
          } else if (element.runEnv == 4) {
            element.runEnvStr = "调试 DEBUG";
          } else {
            element.runEnvStr = "Others";
          }
        });
        this.dataList = res.data.list;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg,
        });
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectStabilityCaseLogList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectStabilityCaseLogList(this.queryForm);
    },
    async resetForm() {
      this.queryForm = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.selectStabilityCaseLogList(this.queryForm);
    },
  },
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
