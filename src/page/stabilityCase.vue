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
        <el-form-item label="编号">
          <el-input
            v-model="queryForm.stabilityTestId"
            placeholder="编号"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="协议">
          <el-select
            v-model="queryForm.protocol"
            clearable
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in protocolOptions"
              :key="item.value"
              size="mini"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用例描述">
          <el-input
            v-model="queryForm.desc"
            placeholder="用例描述"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input
            v-model="queryForm.creatorName"
            placeholder="创建人"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-has="'stability:case:find'"
            type="primary"
            size="mini"
            @click="selectStabilityCaseList(queryForm)"
            >查询</el-button
          >
          <el-button
            v-has="'stability:case:find'"
            type="primary"
            size="mini"
            @click="resetForm"
            >重置</el-button
          >
          <el-button
            v-has="'stability:case:add'"
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
      <el-table
        :data="dataList"
        stripe
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          property="stabilityTestId"
          label="编号"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          property="desc"
          label="用例描述"
          min-width="19%"
        ></el-table-column>
        <el-table-column
          property="creatorName"
          label="创建人"
          min-width="20%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="createdTime"
          label="创建时间"
          min-width="17%"
        ></el-table-column>
        <el-table-column
          property="lastExecuteTime"
          label="最近执行时间"
          min-width="17%"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="17%">
          <template slot-scope="scope">
            <el-button
              @click="handleExecute(scope.row.stabilityTestId)"
              v-has="'stability:case:execute'"
              type="success"
              size="mini"
              icon="el-icon-check"
              circle
            >
            </el-button>
            <el-button
              @click="openEdit(scope.row.stabilityTestId)"
              v-has="'stability:case:modify'"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.id, scope.$index)"
              v-has="'stability:case:remove'"
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

          <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="基本信息">
              <el-form-item label="*用例描述" label-width="120px">
                <el-input v-model="dataInfo.desc" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="*协议" label-width="120px">
                <el-select v-model="dataInfo.protocol" size="mini">
                  <el-option
                    v-for="item in protocolOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="由谁创建" label-width="120px">
                <el-input v-model="dataInfo.creatorName" size="mini" disabled></el-input>
              </el-form-item>
              <el-form-item label="创建时间" label-width="120px">
                <el-input v-model="dataInfo.createdTime" size="mini" disabled></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="执行配置" name="执行配置">
              <el-form-item label="*测试用例" label-width="120px">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <el-input
                      v-model="dataInfo.caseId"
                      readonly
                      @focus="openIfCaseList"
                      size="mini"
                      placeholder="请选择"
                    ></el-input>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="dataInfo.caseDesc"
                      readonly
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="*调度方式" label-width="120px">
                <el-select v-model="dataInfo.executeType" size="mini">
                  <el-option
                    v-for="item in executeTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="*执行次数" label-width="120px" v-if="dataInfo.executeType==0">
                <el-input-number size="mini" v-model="dataInfo.executeTimes" :min=1 :max=999999></el-input-number>
              </el-form-item>
              <el-form-item label="*截至时间" label-width="120px" v-if="dataInfo.executeType==1">
                <el-date-picker
                  v-model="dataInfo.executeEndTime"
                  type="datetime"
                  size="mini"
                  placeholder="选择截至时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="*执行间隔(s)" label-width="120px">
                <el-input-number size="mini" v-model="dataInfo.step" :min=1 :max=86400></el-input-number>
              </el-form-item>
              <el-form-item label="*出错停止" label-width="120px">
                <el-radio v-model="dataInfo.onErrorStop" :label="0">是</el-radio>
                <el-radio v-model="dataInfo.onErrorStop" :label="1">否</el-radio>
              </el-form-item>
              <el-form-item label="*失败停止" label-width="120px">
                <el-radio v-model="dataInfo.onFailedStop" :label="0">是</el-radio>
                <el-radio v-model="dataInfo.onFailedStop" :label="1">否</el-radio>
              </el-form-item>
              <el-form-item label="*运行环境" label-width="120px">
                <el-select v-model="dataInfo.runEnv" size="mini">
                  <el-option
                    v-for="item in runEnvOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="其它配置" name="其它配置">
              <el-form-item label="收件人" label-width="120px">
                <el-select
                  v-model="dataInfo.emailAddress"
                  placeholder="请选择"
                  size="mini"
                  style="width:100%"
                  value-key="item"
                  clearable
                >
                  <el-option
                    v-for="item in emailList"
                    :key="item"
                    :label="item"
                    :value="item"
                    size="mini"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日志记录内容" label-width="120px">
                <el-select v-model="dataInfo.logRecordContent" size="mini" style="width:100%" clearable>
                  <el-option
                    v-for="item in logRecordContentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              </el-tab-pane>
          </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="handleEdit" size="mini"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        title="添加"
        :visible.sync="addDialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="dataAdd">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="基本信息">
              <el-form-item label="*用例描述" label-width="120px">
                <el-input v-model="dataAdd.desc" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="*协议" label-width="120px">
                <el-select v-model="dataAdd.protocol" size="mini">
                  <el-option
                    v-for="item in protocolOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="执行配置" name="执行配置">
              <el-form-item label="*测试用例" label-width="120px">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <el-input
                      v-model="dataAdd.caseId"
                      readonly
                      @focus="openIfCaseList"
                      size="mini"
                      placeholder="请选择"
                    ></el-input>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      placeholder="仅执行请求和断言，前置用例、请求参数缓存、响应数据缓存将会被忽略"
                      v-model="dataAdd.caseDesc"
                      readonly
                      size="mini"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="*调度方式" label-width="120px">
                <el-select v-model="dataAdd.executeType" size="mini">
                  <el-option
                    v-for="item in executeTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="*执行次数" label-width="120px" v-if="dataAdd.executeType==0">
                <el-input-number size="mini" v-model="dataAdd.executeTimes" :min=1 :max=999999></el-input-number>
              </el-form-item>
              <el-form-item label="*截至时间" label-width="120px" v-if="dataAdd.executeType==1">
                <el-date-picker
                  v-model="dataAdd.executeEndTime"
                  type="datetime"
                  size="mini"
                  placeholder="选择截至时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="*执行间隔(s)" label-width="120px">
                <el-input-number size="mini" v-model="dataAdd.step" :min=1 :max=86400 @change="forceUpdate"></el-input-number>
              </el-form-item>
              <el-form-item label="*出错停止" label-width="120px">
                <el-radio v-model="dataAdd.onErrorStop" :label="0" @change="forceUpdate">是</el-radio>
                <el-radio v-model="dataAdd.onErrorStop" :label="1" @change="forceUpdate">否</el-radio>
              </el-form-item>
              <el-form-item label="*失败停止" label-width="120px">
                <el-radio v-model="dataAdd.onFailedStop" :label="0" @change="forceUpdate">是</el-radio>
                <el-radio v-model="dataAdd.onFailedStop" :label="1" @change="forceUpdate">否</el-radio>
              </el-form-item>
              <el-form-item label="*运行环境" label-width="120px">
                <el-select v-model="dataAdd.runEnv" size="mini">
                  <el-option
                    v-for="item in runEnvOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="其它配置" name="其它配置">
              <el-form-item label="收件人" label-width="120px">
                <el-select
                  v-model="dataAdd.emailAddress"
                  placeholder="请选择"
                  size="mini"
                  style="width:100%"
                  value-key="item"
                  clearable
                >
                  <el-option
                    v-for="item in emailList"
                    :key="item"
                    :label="item"
                    :value="item"
                    size="mini"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日志记录内容" label-width="120px">
                <el-select v-model="dataAdd.logRecordContent" size="mini" style="width:100%" clearable>
                  <el-option
                    v-for="item in logRecordContentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              </el-tab-pane>
          </el-tabs>
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


    <el-dialog
      title="接口用例列表"
      :visible.sync="selectIfCaseDialogFormVisible"
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
        @row-click="handleSelectIfCase"
        style="width: 100%"
      >
        </el-table-column>
        <el-table-column
          property="caseId"
          label="用例编号"
          min-width="13%"
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
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {
  findAllEmail,
  listInterfaceCase,
  saveStabilityCase,
  modifyStabilityCase,
  findStabilityCaseById,
  findStabilityCaseList,
  removeStabilityCaseById,
  executeStabilityCaseById
} from "@/api/getData";
export default {
  data() {
    return {
      activeName: '执行配置',
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      dataAdd: {},
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      protocolOptions: [
        {
          value: 0,
          label: "http(s)"
        },
        // {
        //   value: 1,
        //   label: "ws(s)"
        // },
        // {
        //   value: 2,
        //   label: "dubbo"
        // }
      ],
      executeTypeOptions: [
        {
          value: 0,
          label: "按执行次数"
        },
        {
          value: 1,
          label: "按截至时间"
        },
      ],
      runEnvOptions: [
        {
          value: 4,
          label: "调试 DEBUG"
        },
        {
          value: 0,
          label: "开发 DEV"
        },
        {
          value: 1,
          label: "测试 TEST"
        },
        {
          value: 2,
          label: "预发 STG"
        },
        {
          value: 3,
          label: "线上 PROD"
        }
      ],
      logRecordContentOptions: [
        {
          value: 0,
          label: "Headers"
        },
        {
          value: 1,
          label: "Body"
        },
        {
          value: 2,
          label: "Headers + Body"
        },
      ],

      // 选择接口测试用例
      selectIfCaseDialogFormVisible: false,
      caseQueryForm: {},
      caseTotal: 0,
      casePageSize: 10,
      casePageNum: 1,
      caseList: [],
      emailList: []
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectStabilityCaseList(this.queryForm);
  },
  methods: {
    async selectStabilityCaseList(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      const res = await findStabilityCaseList(queryForm);
      if (res.code == 200) {
        this.total = res.data.total;
        this.dataList = res.data.list;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleExecute(id) {
      const res = await executeStabilityCaseById(id);
      if (res.code == 200) {
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
      }
    },
    async handleAdd() {
      const res = await saveStabilityCase(this.dataAdd);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.addDialogFormVisible = false;
        this.selectStabilityCaseList({});
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    async openEdit(dbId) {
      const res = await findStabilityCaseById(dbId);
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
    async handleDelete(dbId, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await removeStabilityCaseById(dbId);
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
    async handleEdit() {
      const res = await modifyStabilityCase(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
        this.selectStabilityCaseList(this.queryForm);
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
      this.selectStabilityCaseList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectStabilityCaseList(this.queryForm);
    },
    async openAdd() {
      this.getAllEmail();
      this.addDialogFormVisible = true;
      this.dataAdd = {};
      this.dataAdd.protocol = 0;
      this.dataAdd.step = 1;
      this.dataAdd.onErrorStop = 0;
      this.dataAdd.onFailedStop = 0;
    },
    async resetForm() {
      this.queryForm = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.selectStabilityCaseList(this.queryForm);
    },


    // 接口测试用例相关
    async openIfCaseList() {
      this.selectIfCaseDialogFormVisible = true;
      this.getCaseList();
    },
    async getCaseList() {
      this.caseQueryForm["pageSize"] = this.casePageSize;
      this.caseQueryForm["pageNum"] = this.casePageNum;
      const res = await listInterfaceCase(this.caseQueryForm);
      if (res.code == 200) {
        this.caseList = [];
        this.caseTotal = res.data.total;
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
    async handleSelectIfCase(row) {
      this.selectIfCaseDialogFormVisible= false;
      this.dataInfo.caseId= row.caseId;
      this.dataInfo.caseDesc= row.desc;
      this.dataAdd.caseId= row.caseId;
      this.dataAdd.caseDesc= row.desc;
    },
    async getAllEmail() {
      const res = await findAllEmail();
      if (res.code == 200) {
        this.emailList = res.data;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    forceUpdate() {
      this.$forceUpdate();
    },
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
