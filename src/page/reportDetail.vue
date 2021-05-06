<template>
  <div class="fillcontain">
    <div class="query" style="padding-left:30px">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="项目名称">
          <el-input v-model="queryForm.projectName" placeholder="项目名称" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="模块名称">
          <el-input v-model="queryForm.moduleName" placeholder="模块名称" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="用例描述">
          <el-input v-model="queryForm.caseDesc" placeholder="用例描述" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" size='mini' style="width:100px">
              <el-option v-for="item in logStatusOptions"
                  :key="item.label"
                  size='mini'
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>   
        <el-form-item label="重跑">
          <el-select v-model="queryForm.isFailedRetry" size='mini' style="width:100px">
              <el-option v-for="item in retryOptions"
                  :key="item.label"
                  size="mini"
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>   
        <el-form-item label="展示依赖">
          <el-select v-model="queryForm.showDetail" size='mini' style="width:100px">
              <el-option v-for="item in showDetailOptions"
                  :key="item.label"
                  size="mini"
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>          
        <el-form-item>
          <el-button circle type="primary" size="mini" icon="el-icon-search" @click="selectInterfaceCaseExecuteLogList(queryForm)"></el-button>
          <el-button circle type="primary" size="mini" icon="el-icon-refresh" @click="resetForm"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table 
      :data="dataList" 
      stripe highlight-current-row 
      style="width: 100%;padding-left:20px">
        <el-table-column type="expand">
        <template slot-scope="props">
            <el-row>
              <el-col :span="18">
                <el-input :value="props.row.responseBody" readonly size="mini" type="textarea" :autosize="{ minRows: 3, maxRows: 20 }"></el-input>
              </el-col>
              <el-col :span="6">
              </el-col>
            </el-row>
        </template>
        </el-table-column>
        <el-table-column property="id" label="编号" min-width="7%"></el-table-column>
        <el-table-column property="projectName" label="项目名称" min-width="12%" show-overflow-tooltip></el-table-column>
        <el-table-column property="moduleName" label="模块名称" min-width="12%" show-overflow-tooltip></el-table-column>
        <el-table-column property="caseDesc" label="用例描述" min-width="20%" show-overflow-tooltip></el-table-column>
        <el-table-column property="executer" label="执行人" min-width="10%"></el-table-column>
        <el-table-column property="runTime" label="耗时" min-width="8%"></el-table-column>
        <el-table-column property="status" label="状态" min-width="8%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="mini"
              :type="scope.row.style"
              disable-transitions>{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="isFailedRetry" label="失败重跑" min-width="8%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="mini"
              :type="scope.row.isFailedRetryStyle"
              disable-transitions>{{scope.row.isFailedRetryValue}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="isRelyCaseValue" label="用例依赖" min-width="8%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="mini"
              :type="scope.row.isRelyCaseStyle"
              disable-transitions>{{scope.row.isRelyCaseValue}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="8%">
          <template slot-scope="scope">
            <el-button
              @click="handleDetail(scope.row)"
              type="primary"
              icon="el-icon-more"
              size="mini"
              circle
            ></el-button>
            <el-button
              @click="handleChain(scope.row)"
              type="danger"
              icon="el-icon-view"
              size="mini"
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
      <el-dialog title="详情" :visible.sync="detailDialogFormVisible">
        <el-form :model="dataInfo">
        <el-tabs value="first">
          <el-tab-pane label="基本信息" name="first">
          <el-form-item label="用例编号" label-width="100px">
            <el-input v-model="dataInfo.caseId" readonly size='mini'></el-input>
          </el-form-item>
          <el-form-item label="用例描述" label-width="100px">
            <el-input v-model="dataInfo.caseDesc" readonly size='mini'></el-input>
          </el-form-item>
          <el-form-item label="执行用时(ms)" label-width="100px">
            <el-input v-model="dataInfo.runTime" readonly size='mini'></el-input>
          </el-form-item> 
          <el-form-item label="执行人" label-width="100px">
            <el-input v-model="dataInfo.executer" readonly size='mini'></el-input>
          </el-form-item> 
          <el-form-item label="执行时间" label-width="100px">
            <el-input v-model="dataInfo.createdTime" readonly size='mini'></el-input>
          </el-form-item> 
          <el-form-item label="执行编号" label-width="100px">
            <el-input v-model="dataInfo.suiteLogNo" readonly size='mini'></el-input>
          </el-form-item> 
          <el-form-item label="异常信息" label-width="100px" v-if="dataInfo.status=='错误'">
            <el-input v-model="dataInfo.errorMessage" readonly size="mini" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
          </el-form-item> 
          <el-form-item label="执行状态" label-width="100px">
            <template>
              <el-tag
                effect="dark"
                size="mini"
                :type="dataInfo.statusStyle"
                disable-transitions>{{dataInfo.status}}</el-tag>
            </template>
          </el-form-item> 
          <el-form-item label="失败重跑" label-width="100px">
            <template>
              <el-tag
                effect="dark"
                size="mini"
                :type="dataInfo.isFailedRetryStyle"
                disable-transitions>{{dataInfo.isFailedRetryValue}}</el-tag>
            </template>
          </el-form-item> 
          </el-tab-pane>
          <el-tab-pane label="请求信息" name="second">
          <el-form-item label="url" label-width="100px">
            <el-input v-model="dataInfo.caseUrl" readonly size="mini"></el-input>
          </el-form-item>          
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="headers" label-width="100px">
              <el-input v-model="dataInfo.requestHeaders" readonly size="mini" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-show="!isReqHeadersBeauty"></el-input>
              <!-- <json-viewer :value="dataInfo.requestHeaders" :expand-depth=5 copyable v-show="isReqHeadersBeauty"/> -->
            </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button @click="showRawRequestHeaders" type="primary" icon="el-icon-thumb" size="mini" circle></el-button>
              <!-- <el-button @click="clickReqHeaders" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button> -->
            </el-col>
          </el-row>  
          <el-row :gutter="25" v-if=isShowRawRequestHeaders>
            <el-col :span="22">
            <el-form-item label="rawHeaders" label-width="100px">
              <el-input v-model="dataInfo.rawRequestHeaders" readonly size="mini"  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
          </el-row> 
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="params" label-width="100px">
              <el-input v-model="dataInfo.requestParams" readonly size="mini" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-show="!isReqParamsBeauty"></el-input>
              <!-- <json-viewer :value="dataInfo.requestParams" :expand-depth=5 copyable v-show="isReqParamsBeauty"/> -->
            </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button @click="showRawRequestParams" type="primary" icon="el-icon-thumb" size="mini" circle></el-button>
              <!-- <el-button @click="clickReqParams" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button> -->
            </el-col>
          </el-row>  
          <el-row :gutter="25" v-if=isShowRawRequestParams>
            <el-col :span="22">
            <el-form-item label="rawParams" label-width="100px">
              <el-input v-model="dataInfo.rawRequestParams" readonly size="mini"  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
          </el-row> 
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="data" label-width="100px">
              <el-input v-model="dataInfo.requestData" readonly size="mini" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-show="!isReqDataBeauty"></el-input>
              <!-- <json-viewer :value="dataInfo.requestData" :expand-depth=5 copyable v-show="isReqDataBeauty"/> -->
            </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button @click="showRawRequestData" type="primary" icon="el-icon-thumb" size="mini" circle></el-button>
              <!-- <el-button @click="clickReqData" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button> -->
            </el-col>
          </el-row>  
          <el-row :gutter="25" v-if=isShowRawRequestData>
            <el-col :span="22">
            <el-form-item label="rawData" label-width="100px">
              <el-input v-model="dataInfo.rawRequestData" readonly size="mini" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
          </el-row> 
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="json" label-width="100px">
              <el-input v-model="dataInfo.requestJson" readonly size="mini" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-show="!isReqJsonBeauty"></el-input>
              <!-- <json-viewer :value="dataInfo.requestJson" :expand-depth=5 copyable v-show="isReqJsonBeauty"/> -->
            </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button @click="showRawRequestJson" type="primary" icon="el-icon-thumb" size="mini" circle></el-button>
              <!-- <el-button @click="clickReqJson" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button> -->
            </el-col>
          </el-row>  
          <el-row :gutter="25" v-if=isShowRawRequestJson>
            <el-col :span="22">
            <el-form-item label="rawJson" label-width="100px">
              <el-input v-model="dataInfo.rawRequestJson" readonly size="mini"  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
          </el-row> 
          </el-tab-pane>
          <el-tab-pane label="响应信息" name="third">
          <el-form-item label="code" label-width="100px">
            <el-input v-model="dataInfo.responseCode" readonly  size='mini'></el-input>
          </el-form-item> 
          <el-row :gutter="25">
            <el-col :span="24">
            <el-form-item label="headers" label-width="100px">
              <el-input v-model="dataInfo.responseHeaders" readonly size="mini" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-show="!isResHeadersBeauty"></el-input>
              <!-- <json-viewer :value="dataInfo.responseHeaders" :expand-depth=5 copyable v-show="isResHeadersBeauty"/> -->
            </el-form-item>
            </el-col>
            <!-- <el-col :span="2">
              <el-button @click="clickResHeaders" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button>
            </el-col> -->
          </el-row>
          <el-row :gutter="25">
            <el-col :span="24">
            <el-form-item label="body" label-width="100px">
              <el-input v-model="dataInfo.responseBody" readonly size="mini" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-show="!isResBodyBeauty"></el-input>
              <!-- <json-viewer :value="dataInfo.responseBody" :expand-depth=5 copyable v-show="isResBodyBeauty"/> -->
            </el-form-item>
            </el-col>
            <!-- <el-col :span="2">
              <el-button @click="clickResBody" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button>
            </el-col> -->
          </el-row>       
          </el-tab-pane>
          <el-tab-pane label="断言信息" name="fourth">
            <el-table :data="assertInfo" stripe highlight-current-row style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="right">
                    <el-form-item label="提取方式" label-width="100px">
                      <el-input :value="props.row.type" readonly size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="提取表达式" label-width="100px">
                      <el-input :value="props.row.expression" readonly size="mini"></el-input>
                    </el-form-item>
                    <el-row :gutter="25">
                      <el-col :span="22">
                      <el-form-item label="预期结果" label-width="100px">
                        <el-input :value="props.row.exceptedResult" size="mini"  readonly  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
                      </el-form-item>
                      </el-col>
                      <el-col :span="2">
                        <el-button @click="showRawExceptedResult" type="primary" icon="el-icon-thumb" size="mini" circle></el-button>
                      </el-col>
                    </el-row> 
                    <el-row :gutter="25" v-if=isShowRawExceptedResult>
                      <el-col :span="22">
                      <el-form-item label="原始预期结果" label-width="100px">
                        <el-input :value="props.row.rawExceptedResult" size="mini"  readonly  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
                      </el-form-item>
                      </el-col>
                    </el-row>  
                    <el-form-item label="比较类型" label-width="100px">
                      <el-input :value="props.row.operator" readonly size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="实际结果" label-width="100px">
                      <el-input :value="props.row.actualResult" size="mini" readonly  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
                    </el-form-item>
                    <el-form-item label="错误信息" label-width="100px" v-if="props.row.errorMessage!=null">
                      <el-input :value="props.row.errorMessage" size="mini" readonly  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column property="order" label="排序" min-width="5%"></el-table-column>
              <el-table-column property="assertName" label="断言名称" min-width="10%"></el-table-column>
              <el-table-column property="status" label="状态" min-width="10%">
                <template slot-scope="scope">
                  <el-tag
                    effect="dark"
                    size="mini"
                    :type="scope.row.assertStatusStyle"
                    disable-transitions>{{scope.row.status}}</el-tag>
                </template>
              </el-table-column>
              <!-- <el-table-column property="errorMessage" label="备注" min-width="10%"></el-table-column> -->
            </el-table>
            </el-tab-pane> 
          </el-tabs>        
        </el-form>
      </el-dialog>
      <el-dialog title="链路跟踪" :visible.sync="chainDialogFormVisible">
        <div class="block">
          <el-timeline>
            <el-timeline-item 
            :key="chain.id" 
            :timestamp="chain.typeDesc + ' 执行于 ' + chain.date + ' 耗时 ' + chain.time" 
            :color="chain.color"
            placement="top" 
            v-for="chain in chainList">
              <el-card>
                <el-row>
                  <el-col :span="22">
                    <div>
                      <el-row :gutter="10">
                        <h4>
                          <el-col :span="3"><el-tag effect="dark" type="primary" disable-transitions size="mini">{{chain.desc}}</el-tag></el-col>
                          <el-col :span="19"><span>{{chain.name}}</span></el-col>
                          <el-col :span="2" v-if="chain.type=='INTERFACE_JSON' || 
                          chain.type=='INTERFACE_HTML'|| chain.type=='INTERFACE_HEADER' || chain.type=='PRE_CASE_END' || chain.type=='CASE_END'">
                            <el-button 
                            plain 
                            size="mini" 
                            @click="handleDetail(chain.id)"
                            style="background-color: #FFFFFF; color: #324057; border:none;font-size: 14px;">详情
                            </el-button>
                          </el-col>
                        </h4>
                      </el-row>
                      <el-row :gutter="10">
                        <br/>
                        <el-col :span="24"><p>{{chain.value}}</p></el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  findInterfaceCaseExecuteLogForReportList,
  findInterfaceCaseExecuteLog,
  caseExecuteLogChain,
} from "@/api/getData";
export default {
  data() {
    return {
      suiteLogNo: this.$route.query.suiteLogNo,  
      isResHeadersBeauty: false,
      isResBodyBeauty: false,

      isReqHeadersBeauty: false,
      isReqParamsBeauty: false,
      isReqDataBeauty: false,
      isReqJsonBeauty: false,

      chainDialogFormVisible: false,
      chainActive: 0,
      chainList: [],

      detailDialogFormVisible: false,
      queryForm: {
        showDetail: 1
      },
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      assertInfo: [],
      retryOptions: [
          {
              value: 0,
              label: '是'
          },
          {
              value: 1,
              label: '否'
          },
      ],
      showDetailOptions: [
          {
              value: 0,
              label: '是'
          },
          {
              value: 1,
              label: '否'
          },
      ],
      logStatusOptions: [
          {
              value: 0,
              label: '成功'
          },
          {
              value: 1,
              label: '失败'
          },
          {
              value: 2,
              label: '错误'
          },
      ],

      
      isShowRawExceptedResult: false,
      isShowRawRequestHeaders: false,
      isShowRawRequestParams: false,
      isShowRawRequestData: false,
      isShowRawRequestJson: false,
    };
  },
  components: {

  },
  mounted() {
    this.selectInterfaceCaseExecuteLogList(this.queryForm);
  },
  methods: {
    async clickResHeaders() {
      this.isResHeadersBeauty = !this.isResHeadersBeauty
      if (this.dataInfo.responseHeaders != null) {
        if (this.isResHeadersBeauty) {
          if (typeof(this.dataInfo.responseHeaders) == 'string') {
            this.dataInfo.responseHeaders = JSON.parse(this.dataInfo.responseHeaders)
          }
        } else {
          if (typeof(this.dataInfo.responseHeaders) == 'object') {
            this.dataInfo.responseHeaders = JSON.stringify(this.dataInfo.responseHeaders)
          }
        }
      }
    },
    async clickResBody() {
      this.isResBodyBeauty = !this.isResBodyBeauty
      if (this.dataInfo.responseBody != null) {
        if (this.isResBodyBeauty) {
          if (typeof(this.dataInfo.responseBody) == 'string') {
            this.dataInfo.responseBody = JSON.parse(this.dataInfo.responseBody)
          }
        } else {
          if (typeof(this.dataInfo.responseBody) == 'object') {
            this.dataInfo.responseBody = JSON.stringify(this.dataInfo.responseBody)
          }
        }
      }
    },
    async clickReqHeaders() {
      this.isReqHeadersBeauty = !this.isReqHeadersBeauty
      if (this.dataInfo.requestHeaders != null) {
      if (this.isReqHeadersBeauty) {
        if (typeof(this.dataInfo.requestHeaders) == 'string') {
          this.dataInfo.requestHeaders = JSON.parse(this.dataInfo.requestHeaders)
        }
      } else {
        if (typeof(this.dataInfo.requestHeaders) == 'object') {
          this.dataInfo.requestHeaders = JSON.stringify(this.dataInfo.requestHeaders)
        }
      }
      }

    },
    async clickReqParams() {
      this.isReqParamsBeauty = !this.isReqParamsBeauty
      if (this.dataInfo.requestParams != null) {
        if (this.isReqParamsBeauty) {
          if (typeof(this.dataInfo.requestParams) == 'string') {
            this.dataInfo.requestParams = JSON.parse(this.dataInfo.requestParams)
          }
        } else {
          if (typeof(this.dataInfo.requestParams) == 'object') {
            this.dataInfo.requestParams = JSON.stringify(this.dataInfo.requestParams)
          }
        }
      }
    },
    async clickReqData() {
      this.isReqDataBeauty = !this.isReqDataBeauty
      if (this.dataInfo.requestData != null) {
        if (this.isReqDataBeauty) {
          if (typeof(this.dataInfo.requestData) == 'string') {
            this.dataInfo.requestData = JSON.parse(this.dataInfo.requestData)
          }
        } else {
          if (typeof(this.dataInfo.requestData) == 'object') {
            this.dataInfo.requestData = JSON.stringify(this.dataInfo.requestData)
          }
        }
      }
    },
    async clickReqJson() {
      this.isReqJsonBeauty = !this.isReqJsonBeauty
      if (this.JsonInfo.requestJson != null) {
        if (this.isReqJsonBeauty) {
          if (typeof(this.JsonInfo.requestJson) == 'string') {
            this.JsonInfo.requestJson = JSON.parse(this.JsonInfo.requestJson)
          }
        } else {
          if (typeof(this.JsonInfo.requestJson) == 'object') {
            this.JsonInfo.requestJson = JSON.stringify(this.JsonInfo.requestJson)
          }
        }
      }
    },
    async selectInterfaceCaseExecuteLogList(queryForm) {
      queryForm["suiteLogNo"] = this.suiteLogNo
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      const res = await findInterfaceCaseExecuteLogForReportList(queryForm);
      if (res.code == 200) {
        this.dataList = []
        this.total = res.data.total;
        res.data.list.forEach(element => {
            if (element.status == 0) {
                element.style = "success"
                element.status = '成功'
            } else if (element.status == 1) {
                element.style = "warning"
                element.status = '失败'
            } else {
                element.style = "danger"
                element.status = '错误'
            }
            if (element.isFailedRetry == 0) {
                element.isFailedRetryStyle = "danger"
                element.isFailedRetryValue = '是'
            } else if (element.isFailedRetry == 1) {
                element.isFailedRetryStyle = "primary"
                element.isFailedRetryValue = '否'
            } else {
                element.isFailedRetryStyle = "primary"
                element.isFailedRetryValue = 'UNKNOW'
            }
            if (element.suiteLogNo != null) {
                element.isRelyCaseStyle = "primary"
                element.isRelyCaseValue = '否'
            } else {
                element.isRelyCaseStyle = "danger"
                element.isRelyCaseValue = '是'
            }
            element.runTime = element.runTime + 'ms'
            this.dataList.push(element)
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleDetail(row) {
      this.isShowRawExceptedResult = false
      this.isShowRawRequestHeaders = false
      this.isShowRawRequestParams = false
      this.isShowRawRequestData = false
      this.isShowRawRequestJson = false
      
      let relyId = row.id
      this.isResHeadersBeauty = false
      this.isResBodyBeauty = false

      this.isReqHeadersBeauty = false
      this.isReqParamsBeauty = false
      this.isReqDataBeauty = false
      this.isReqJsonBeauty = false

      const res = await findInterfaceCaseExecuteLog(relyId)
      if (res.code == 200) {
          let data = res.data
          res.data.assertList.forEach(assert => {
            // 断言执行状态
            if (assert.status == 0) {
                assert.assertStatusStyle = "success"
                assert.status = '成功'
            } else if (assert.status == 1) {
                assert.assertStatusStyle = "warning"
                assert.status = '失败'
            } else {
                assert.assertStatusStyle = "danger"
                assert.status = '错误'
            }
            // 断言提取方式
            if (assert.type == 0) {
                assert.type = 'jsonpath'
            } else if (assert.type == 1) {
                assert.type = 'xpath'
            } else if (assert.type == 2) {
                assert.type = 'header'
            } else if (assert.type == 3) {
                assert.type = 'httpCode'
            } else {
                assert.type = 'unknow'
            }
            // 操作符
            // 操作符0/=、1/< 、2/>、3/<=、4/>=、5/in、6/!=、7/re
            if (assert.operator == 0) {
                assert.operator = '='
            } else if (assert.operator == 1) {
                assert.operator = '<'
            } else if (assert.operator == 2) {
                assert.operator = '>'
            } else if (assert.operator == 3) {
                assert.operator = '<='
            } else if (assert.operator == 4) {
                assert.operator = '>='
            } else if (assert.operator == 5) {
                assert.operator = 'in'
            } else if (assert.operator == 6) {
                assert.operator = '!='
            } else if (assert.operator == 7) {
                assert.operator = 're'
            } else if (assert.operator == 8) {
                assert.operator = 'isNull'
            } else if (assert.operator == 9) {
                assert.operator = 'notNull'
            } else if (assert.operator == 10) {
                assert.operator = 'contains'
            } else {
                assert.operator = 'unknow'
            }             
          });
          this.assertInfo = res.data.assertList
          this.detailDialogFormVisible = true
          // 失败重跑
          if (data.isFailedRetry == 0) {
              data.isFailedRetryStyle = 'danger'
              data.isFailedRetryValue = "是"
          } else if (data.isFailedRetry == 1) {
              data.isFailedRetryStyle = 'primary'
              data.isFailedRetryValue = "否"
          } else {
              data.status = 'UNKNOW'
              data.statusStyle = "primary"
          }
          if (data.status == 0) {
              data.status = '成功'
              data.statusStyle = "success"
          } else if (data.status == 1) {
              data.status = '失败'
              data.statusStyle = "warning"
          } else {
              data.status = '错误'
              data.statusStyle = "danger"
          }
          this.dataInfo = data
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        })
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectInterfaceCaseExecuteLogList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectInterfaceCaseExecuteLogList(this.queryForm);
    },
    async resetForm() {
      this.queryForm = {}
      this.queryForm.showDetail = 1 
      this.pageSize = 10
      this.pageNum = 1
      this.selectInterfaceCaseExecuteLogList(this.queryForm)

      this.isShowRawExceptedResult = false
      this.isShowRawRequestHeaders = false
      this.isShowRawRequestParams = false
      this.isShowRawRequestData = false
      this.isShowRawRequestJson = false
    },
    async handleChain(row) {
      let id = row.id
      this.active = 0
      this.chainDialogFormVisible = true
      this.chainList = []
      const res = await caseExecuteLogChain(id)
      if (res.code == 200) {
        res.data.forEach(element => {
          let data = {}
          data.name = element.name
          data.id = element.id
          data.type = element.type
          data.value = element.value
          data.desc = element.desc
          data.date = element.date
          data.typeDesc = element.typeDesc
          data.expression = element.expression
          data.time = element.time + 'ms'
          data.status = "success"
          data.color = "#67C23A"
          this.chainActive ++ 
          this.chainList.push(data)
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        })
      }
    },
    showRawExceptedResult() {
      this.isShowRawExceptedResult = ! this.isShowRawExceptedResult
    },
    showRawRequestHeaders() {
      this.isShowRawRequestHeaders = ! this.isShowRawRequestHeaders
    },
    showRawRequestParams() {
      this.isShowRawRequestParams = ! this.isShowRawRequestParams
    },
    showRawRequestData() {
      this.isShowRawRequestData = ! this.isShowRawRequestData
    },
    showRawRequestJson() {
      this.isShowRawRequestJson = ! this.isShowRawRequestJson
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
}
</style>
