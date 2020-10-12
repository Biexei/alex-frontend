<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="项目名称">
          <el-input v-model="queryForm.projectName" placeholder="项目名称" size='small'></el-input>
        </el-form-item>
        <el-form-item label="模块名称">
          <el-input v-model="queryForm.moduleName" placeholder="模块名称" size='small'></el-input>
        </el-form-item>
        <el-form-item label="用例描述">
          <el-input v-model="queryForm.caseDesc" placeholder="用例描述" size='small'></el-input>
        </el-form-item>
        <el-form-item label="执行编号">
          <el-input v-model="queryForm.suiteLogNo" placeholder="执行编号" size='small'></el-input>
        </el-form-item>
        <el-form-item label="执行状态">
          <el-select v-model="queryForm.status" placeholder="请选择" size='small'>
              <el-option v-for="item in logStatusOptions"
                  :key="item.label"
                  size='small'
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>  
        <el-form-item label="起始时间">
          <el-date-picker
            v-model="queryForm.createdStartTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            size='small'
            placeholder="选择起始时间"
            align="right">
          </el-date-picker>
        </el-form-item>  
        <el-form-item label="截止时间">
          <el-date-picker
            v-model="queryForm.createdEndTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            size='small'
            placeholder="选择截止时间"
            align="right">
          </el-date-picker>
        </el-form-item>                
        <el-form-item>
          <el-button type="primary" size="small" @click="selectInterfaceCaseExecuteLogList(queryForm)">查询</el-button>
          <el-button type="primary" size="small" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column type="expand">
        <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="创建时间">
              <el-label>{{props.row.createdTime}}</el-label>
            </el-form-item>
            </el-form>
        </template>
        </el-table-column>
        <el-table-column property="id" label="编号" min-width="5%"></el-table-column>
        <el-table-column property="suiteLogNo" label="执行编号" min-width="21%"></el-table-column>
        <el-table-column property="projectName" label="项目名称" min-width="10%"></el-table-column>
        <el-table-column property="moduleName" label="模块名称" min-width="10%"></el-table-column>
        <el-table-column property="caseDesc" label="用例描述" min-width="23%"></el-table-column>
        <el-table-column property="executer" label="执行人" min-width="10%"></el-table-column>
        <el-table-column property="runTime" label="执行用时" min-width="7%"></el-table-column>
        <el-table-column property="status" label="执行状态" min-width="7%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.style"
              disable-transitions>{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="7%">
          <template slot-scope="scope">
            <el-button
              @click="handleDetail(scope.row.id)"
              type="primary"
              icon="el-icon-more"
              size="small"
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
        <el-collapse>
        <el-form :model="dataInfo">
          <el-collapse-item title="基本信息">
          <el-form-item label="用例编号" label-width="100px">
            <el-input v-model="dataInfo.caseId" readonly size='small'></el-input>
          </el-form-item>
          <el-form-item label="用例描述" label-width="100px">
            <el-input v-model="dataInfo.caseDesc" readonly size='small'></el-input>
          </el-form-item>
          <el-form-item label="执行用时(ms)" label-width="100px">
            <el-input v-model="dataInfo.runTime" readonly size='small'></el-input>
          </el-form-item> 
          <el-form-item label="执行人" label-width="100px">
            <el-input v-model="dataInfo.executer" readonly size='small'></el-input>
          </el-form-item> 
          <el-form-item label="执行编号" label-width="100px">
            <el-input v-model="dataInfo.suiteLogNo" readonly size='small'></el-input>
          </el-form-item> 
          <el-form-item label="异常信息" label-width="100px" v-if="dataInfo.status=='错误'">
            <el-input v-model="dataInfo.errorMessage" readonly  type="textarea" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
          </el-form-item> 
          <el-form-item label="执行状态" label-width="100px">
            <template>
              <el-tag
                effect="dark"
                :type="dataInfo.statusStyle"
                disable-transitions>{{dataInfo.status}}</el-tag>
            </template>
          </el-form-item> 
          </el-collapse-item>
          <el-collapse-item title="请求信息">
          <el-form-item label="url" label-width="100px">
            <el-input v-model="dataInfo.caseUrl" readonly></el-input>
          </el-form-item>          
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="headers" label-width="100px">
              <el-input v-model="dataInfo.requestHeaders" readonly  type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" v-show="!isReqHeadersBeauty"></el-input>
              <json-viewer :value="dataInfo.requestHeaders" :expand-depth=5 copyable v-show="isReqHeadersBeauty"/>
            </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button @click="clickReqHeaders" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button>
            </el-col>
          </el-row>  
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="params" label-width="100px">
              <el-input v-model="dataInfo.requestParams" readonly  type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" v-show="!isReqParamsBeauty"></el-input>
              <json-viewer :value="dataInfo.requestParams" :expand-depth=5 copyable v-show="isReqParamsBeauty"/>
            </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button @click="clickReqParams" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button>
            </el-col>
          </el-row>  
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="data" label-width="100px">
              <el-input v-model="dataInfo.requestData" readonly  type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" v-show="!isReqDataBeauty"></el-input>
              <json-viewer :value="dataInfo.requestData" :expand-depth=5 copyable v-show="isReqDataBeauty"/>
            </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button @click="clickReqData" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button>
            </el-col>
          </el-row>  
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="json" label-width="100px">
              <el-input v-model="dataInfo.requestJson" readonly  type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" v-show="!isReqJsonBeauty"></el-input>
              <json-viewer :value="dataInfo.requestJson" :expand-depth=5 copyable v-show="isReqJsonBeauty"/>
            </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button @click="clickReqJson" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button>
            </el-col>
          </el-row>  
          </el-collapse-item>
          <el-collapse-item title="响应信息">
          <el-form-item label="code" label-width="100px">
            <el-input v-model="dataInfo.responseCode" readonly  size='small'></el-input>
          </el-form-item> 
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="headers" label-width="100px">
              <el-input v-model="dataInfo.responseHeaders" readonly  type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" v-show="!isResHeadersBeauty"></el-input>
              <json-viewer :value="dataInfo.responseHeaders" :expand-depth=5 copyable v-show="isResHeadersBeauty"/>
            </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button @click="clickResHeaders" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button>
            </el-col>
          </el-row>
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="body" label-width="100px">
              <el-input v-model="dataInfo.responseBody" readonly  type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" v-show="!isResBodyBeauty"></el-input>
              <json-viewer :value="dataInfo.responseBody" :expand-depth=5 copyable v-show="isResBodyBeauty"/>
            </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button @click="clickResBody" type="danger" icon="el-icon-magic-stick" size="mini" circle></el-button>
            </el-col>
          </el-row>       
          </el-collapse-item>
          <el-collapse-item title="断言信息">
            <el-table :data="assertInfo" stripe highlight-current-row style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="提取方式:">
                      <span>{{ props.row.type }}</span>
                    </el-form-item><br/>
                    <el-form-item label="提取表达式:">
                      <span>{{ props.row.expression }}</span>
                    </el-form-item><br/>
                    <el-form-item label="预期结果:">
                      <el-input :value="props.row.exceptedResult" readonly  type="textarea" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
                    </el-form-item><br/>
                    <el-form-item label="比较类型:">
                      <span>{{ props.row.operator }}</span>
                    </el-form-item><br/>
                    <el-form-item label="实际结果:">
                      <el-input :value="props.row.actualResult" readonly  type="textarea" :autosize="{ minRows: 3, maxRows: 6 }"></el-input>
                    </el-form-item>
                    <br />
                    <el-form-item label="错误信息:" v-if="props.row.status=='错误'">
                        <span>{{ props.row.errorMessage }}</span>
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
                    :type="scope.row.assertStatusStyle"
                    disable-transitions>{{scope.row.status}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column property="errorMessage" label="备注" min-width="10%"></el-table-column>
            </el-table>
          </el-collapse-item>           
        </el-form>
      </el-collapse>  
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {
  findInterfaceCaseExecuteLogList,
  findInterfaceCaseExecuteLog,
} from "@/api/getData";
export default {
  data() {
    return {
      isResHeadersBeauty: false,
      isResBodyBeauty: false,

      isReqHeadersBeauty: false,
      isReqParamsBeauty: false,
      isReqDataBeauty: false,
      isReqJsonBeauty: false,

      detailDialogFormVisible: false,
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      assertInfo: [],
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
    };
  },
  components: {
    headTop
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
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      this.dataList = []
      const res = await findInterfaceCaseExecuteLogList(queryForm);
      if (res.code == 200) {
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
    async handleDetail(relyId) {
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
            } else {
                assert.operator = 'unknow'
            }            
          });
          this.assertInfo = res.data.assertList
          this.detailDialogFormVisible = true
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
      this.pageSize = 10
      this.pageNum = 1
      this.selectInterfaceCaseExecuteLogList(this.queryForm)
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
