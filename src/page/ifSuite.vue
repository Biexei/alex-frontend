<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="名称">
          <el-input v-model="queryForm.suiteName" placeholder="名称" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="执行方式">
          <el-select v-model="queryForm.executeType" clearable placeholder="请选择"  size='mini'>
            <el-option
              v-for="item in executeTypeOptions"
              :key="item.value"
              size='mini'
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运行环境">
          <el-select v-model="queryForm.runDev" clearable placeholder="请选择"  size='mini'>
            <el-option
              v-for="item in runDevOptions"
              :key="item.value"
              size='mini'
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="queryForm.desc" placeholder="描述"  size='mini'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="selectSuiteList(queryForm)">查询</el-button>
          <el-button type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button type="primary" size="mini" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table 
      :data="dataList" 
      @row-dblclick="handleLog"
      stripe highlight-current-row style="width: 100%">
        <el-table-column property="suiteId" label="编号" min-width="5%"></el-table-column>
        <el-table-column property="suiteName" label="名称" min-width="15%"></el-table-column>
        <el-table-column property="desc" label="描述" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column property="creator" label="创建人" min-width="10%"></el-table-column>
        <el-table-column property="createdTime" label="创建时间" min-width="15%" ></el-table-column>
        <el-table-column property="executeType" label="执行方式" min-width="6%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="small"
              :type="scope.row.executeTypeStyle"
              disable-transitions>{{scope.row.executeType}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="runDevType" label="运行环境" min-width="6%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="small"
              :type="scope.row.runDevStyle"
              disable-transitions>{{scope.row.runDevType}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="runDevType" label="失败重跑" min-width="7%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="small"
              :type="scope.row.isRetry"
              disable-transitions>{{scope.row.isRetryType}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="20%">
          <template slot-scope="scope">
            <el-button
              @click="handleManager(scope.row.suiteId)"
              type="info"
              size="mini"
              icon="el-icon-star-off"
              circle
            ></el-button>
            <el-button
              @click="handleExecute(scope.row.suiteId)"
              type="success"
              size="mini"
              :icon="executeIconStyle"
              circle
            ></el-button>
            <el-button
              @click="handleEdit(scope.row.suiteId)"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleCopy(scope.row.suiteId)"
              type="warning"
              size="mini"
              icon="el-icon-copy-document"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.suiteId, scope.$index)"
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
        <el-collapse>
          <el-collapse-item title="前置处理器">
                <el-form-item>
                      <el-tabs>
                        <el-tab-pane label="Global Headers">
                              <el-form-item
                                  v-for="(preProcessorHeaders, index) in addPreProcessorHeadersList"
                                  :index="index"
                                  :key="preProcessorHeaders.key">
                                <el-row :gutter="20">
                                    <el-col :span="7">
                                        <el-input v-model="preProcessorHeaders.name" placeholder="name" size='mini' @blur=addPreProcessorHeadersItem(preProcessorHeaders)></el-input>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-input v-model="preProcessorHeaders.value" placeholder="value" size='mini'></el-input>
                                    </el-col> 
                                    <el-col :span="2">
                                        <el-button @click.prevent="removePreProcessorHeadersItem(preProcessorHeaders)" type="danger" icon="el-icon-delete" circle size="mini" :disabled="addPreProcessorHeadersList.length==1"></el-button>
                                    </el-col>
                                </el-row>
                              </el-form-item> 
                        </el-tab-pane> 
                        <el-tab-pane label="Global Params">
                              <el-form-item
                                  v-for="(preProcessorParams, index) in addPreProcessorParamsList"
                                  :index="index"
                                  :key="preProcessorParams.key">
                                <el-row :gutter="20">
                                    <el-col :span="7">
                                        <el-input v-model="preProcessorParams.name" placeholder="name" size='mini' @blur=addPreProcessorParamsItem(preProcessorParams)></el-input>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-input v-model="preProcessorParams.value" placeholder="value" size='mini'></el-input>
                                    </el-col> 
                                    <el-col :span="2">
                                        <el-button @click.prevent="removePreProcessorParamsItem(preProcessorParams)" type="danger" icon="el-icon-delete" circle size="mini" :disabled="addPreProcessorParamsList.length==1"></el-button>
                                    </el-col>
                                </el-row>
                              </el-form-item> 
                        </el-tab-pane> 
                        <el-tab-pane label="Global Data">
                              <el-form-item
                                  v-for="(preProcessorData, index) in addPreProcessorDataList"
                                  :index="index"
                                  :key="preProcessorData.key">
                                <el-row :gutter="20">
                                    <el-col :span="7">
                                        <el-input v-model="preProcessorData.name" placeholder="name" size='mini' @blur=addPreProcessorDataItem(preProcessorData)></el-input>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-input v-model="preProcessorData.value" placeholder="value" size='mini'></el-input>
                                    </el-col> 
                                    <el-col :span="2">
                                        <el-button @click.prevent="removePreProcessorDataItem(preProcessorData)" type="danger" icon="el-icon-delete" circle size="mini" :disabled="addPreProcessorDataList.length==1"></el-button>
                                    </el-col>
                                </el-row>
                              </el-form-item> 
                        </el-tab-pane> 
                        <el-tab-pane label="Execute Rely">
                                <el-input v-model="addPreProcessorExecuteRelyValue" placeholder="value" size='mini'></el-input>
                        </el-tab-pane> 
                      </el-tabs>
                </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="基本信息">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataInfo.suiteName" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*执行方式" label-width="100px">
            <el-select v-model="dataInfo.executeType" size='mini'>
              <el-option
                v-for="item in executeTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*运行环境" label-width="100px">
            <el-select v-model="dataInfo.runDev" size='mini'>
              <el-option
                v-for="item in runDevOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*失败重跑" label-width="100px">
            <el-switch
              v-model="dataInfo.isRetry"
              :active-value=0
              :inactive-value=1>
            </el-switch>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="dataInfo.desc" size='mini'></el-input>
          </el-form-item>  
          <el-form-item label="创建人" label-width="100px">
            <el-input v-model="dataInfo.creator" size='mini' disabled></el-input>
          </el-form-item>
        </el-collapse-item>

          <el-collapse-item title="后置处理器">
                <el-form-item>
                      <el-tabs>
                        <el-tab-pane label="Execute Rely">
                                <el-input v-model="addPostProcessorExecuteRelyValue" placeholder="value" size='mini'></el-input>
                        </el-tab-pane> 
                      </el-tabs>
                </el-form-item>
          </el-collapse-item>

        </el-collapse>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="updateSuite" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataAdd" ref="dataAdd">
        <el-collapse>
          <el-collapse-item title="前置处理器">
                <el-form-item>
                      <el-tabs>
                        <el-tab-pane label="Global Headers">
                              <el-form-item
                                  v-for="(preProcessorHeaders, index) in addPreProcessorHeadersList"
                                  :index="index"
                                  :key="preProcessorHeaders.key">
                                <el-row :gutter="20">
                                    <el-col :span="7">
                                        <el-input v-model="preProcessorHeaders.name" placeholder="name" size='mini' @blur=addPreProcessorHeadersItem(preProcessorHeaders)></el-input>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-input v-model="preProcessorHeaders.value" placeholder="value" size='mini'></el-input>
                                    </el-col> 
                                    <el-col :span="2">
                                        <el-button @click.prevent="removePreProcessorHeadersItem(preProcessorHeaders)" type="danger" icon="el-icon-delete" circle size="mini" :disabled="addPreProcessorHeadersList.length==1"></el-button>
                                    </el-col>
                                </el-row>
                              </el-form-item> 
                        </el-tab-pane> 
                        <el-tab-pane label="Global Params">
                              <el-form-item
                                  v-for="(preProcessorParams, index) in addPreProcessorParamsList"
                                  :index="index"
                                  :key="preProcessorParams.key">
                                <el-row :gutter="20">
                                    <el-col :span="7">
                                        <el-input v-model="preProcessorParams.name" placeholder="name" size='mini' @blur=addPreProcessorParamsItem(preProcessorParams)></el-input>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-input v-model="preProcessorParams.value" placeholder="value" size='mini'></el-input>
                                    </el-col> 
                                    <el-col :span="2">
                                        <el-button @click.prevent="removePreProcessorParamsItem(preProcessorParams)" type="danger" icon="el-icon-delete" circle size="mini" :disabled="addPreProcessorParamsList.length==1"></el-button>
                                    </el-col>
                                </el-row>
                              </el-form-item> 
                        </el-tab-pane> 
                        <el-tab-pane label="Global Data">
                              <el-form-item
                                  v-for="(preProcessorData, index) in addPreProcessorDataList"
                                  :index="index"
                                  :key="preProcessorData.key">
                                <el-row :gutter="20">
                                    <el-col :span="7">
                                        <el-input v-model="preProcessorData.name" placeholder="name" size='mini' @blur=addPreProcessorDataItem(preProcessorData)></el-input>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-input v-model="preProcessorData.value" placeholder="value" size='mini'></el-input>
                                    </el-col> 
                                    <el-col :span="2">
                                        <el-button @click.prevent="removePreProcessorDataItem(preProcessorData)" type="danger" icon="el-icon-delete" circle size="mini" :disabled="addPreProcessorDataList.length==1"></el-button>
                                    </el-col>
                                </el-row>
                              </el-form-item> 
                        </el-tab-pane> 
                        <el-tab-pane label="Execute Rely">
                                <el-input v-model="addPreProcessorExecuteRelyValue" placeholder="value" size='mini'></el-input>
                        </el-tab-pane> 
                      </el-tabs>
                </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="基本信息">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataAdd.suiteName" size='mini'></el-input>
          </el-form-item>
          <el-form-item label="*执行方式" label-width="100px">
            <el-select v-model="dataAdd.executeType" size='mini'>
              <el-option
                v-for="item in executeTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*运行环境" label-width="100px">
            <el-select v-model="dataAdd.runDev" size='mini'>
              <el-option
                v-for="item in runDevOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*失败重跑" label-width="100px">
            <el-switch
              v-model="dataAdd.isRetry"
              :active-value=0
              :inactive-value=1>
            </el-switch>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="dataAdd.desc" size='mini'></el-input>
          </el-form-item>  
          <el-form-item label="创建人" label-width="100px">
            <el-input v-model="dataAdd.creator" size='mini' disabled></el-input>
          </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="后置处理器">
                <el-form-item>
                      <el-tabs>
                        <el-tab-pane label="Execute Rely">
                                <el-input v-model="addPostProcessorExecuteRelyValue" placeholder="value" size='mini'></el-input>
                        </el-tab-pane> 
                      </el-tabs>
                </el-form-item>
          </el-collapse-item>

        </el-collapse>  
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
import {copyInterfaceCaseSuiteById, saveInterfaceCaseSuite,modifyInterfaceCaseSuite,removeInterfaceCaseSuiteById,findInterfaceCaseSuiteById,findInterfaceCaseSuite,saveSuiteCase,removeSuiteCase,findSuiteCaseList,executeSuiteCase } from "@/api/getData";
export default {
  data() {
    return {
      executeIconStyle: 'el-icon-check',
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      dataAdd:{},
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      executeTypeOptions:[
          {
              value:0,
              label:'并行',
          },
          {
              value:1,
              label:'串行',
          },
      ],
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
      isRetryOptions:[
          {
              value:0,
              label:'是',
          },
          {
              value:1,
              label:'否',
          },
      ],

      suiteProcessors:[],
      addPreProcessorHeadersList:[],
      addPreProcessorParamsList:[],
      addPreProcessorDataList:[],
      addPreProcessorExecuteRelyValue:null,

      addPostProcessorExecuteRelyValue:null,
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectSuiteList(this.queryForm);
  },
  methods: {
    async selectSuiteList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      this.dataList = []
      const res = await findInterfaceCaseSuite(queryForm)
      if (res.code == 200) {
          this.total = res.data.total
          res.data.list.forEach(element => {
              if (element.executeType == 0) {
                  element.executeType = "并行"
                  element.executeTypeStyle = 'danger'
              } else {
                  element.executeType = "串行"
                  element.executeTypeStyle = ''
              }
              if (element.isRetry == 0) {
                  element.isRetryType = "是"
              } else {
                  element.isRetryType = "否"
              }
              if (element.runDev == 4) {
                  element.runDevType = "调试"
                  element.runDevStyle = 'info'
              } else if (element.runDev == 3) {
                  element.runDevType = "线上"
                  element.runDevStyle = 'danger'
              } else if (element.runDev == 2) {
                  element.runDevType = "预发"
                  element.runDevStyle = 'warning'
              } else if (element.runDev == 1) {
                  element.runDevType = "测试"
                  element.runDevStyle = 'success'
              } else if (element.runDev == 0) {
                  element.runDevType = "开发"
                  element.runDevStyle = 'primary'
              } else {
                  element.runDevType = "UNKNOW"
                  element.runDevStyle = ''
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
    async handleAdd() {
        // 前置处理器
        let preSuiteProcessors = []
        // 添加headers
        let preHeaders = {}
        this.addPreProcessorHeadersList.forEach(element => {
          if (element.name != null || element.name == '') {
            preHeaders[element.name] = element.value
          }
        });
        // 添加params
        let preParams = {}
        this.addPreProcessorParamsList.forEach(element => {
          if (element.name != null || element.name == '') {
            preParams[element.name] = element.value
          }
        });
        // 添加data
        let preData = {}
        this.addPreProcessorDataList.forEach(element => {
          if (element.name != null || element.name == '') {
            preData[element.name] = element.value
          }
        });
        let preHeadersStr = JSON.stringify(preHeaders)
        let preParamsStr = JSON.stringify(preParams)
        let preDataStr = JSON.stringify(preData)
        if (preHeadersStr != '{}') {
          preSuiteProcessors.push({
            "processorType":0,
            "type":1,
            "value": preHeadersStr
          })
        }
        if (preParamsStr != '{}') {
          preSuiteProcessors.push({
            "processorType":0,
            "type":2,
            "value": preParamsStr
          })
        }
        if (preDataStr != '{}') {
          preSuiteProcessors.push({
            "processorType":0,
            "type":3,
            "value": preDataStr
          })
        }
        if (this.addPreProcessorExecuteRelyValue != null) {
          // 添加rely
          preSuiteProcessors.push({
            "processorType":0,
            "type":0,
            "value": this.addPreProcessorExecuteRelyValue
          })
        }
        
        // 后置处理器
        let postSuiteProcessors = []
        if (this.addPostProcessorExecuteRelyValue != null) {
          // 添加rely
          postSuiteProcessors.push({
            "processorType":1,
            "type":0,
            "value": this.addPostProcessorExecuteRelyValue
          })
        }
        let arr = preSuiteProcessors.concat(postSuiteProcessors)
        this.dataAdd.suiteProcessors = arr

        const res = await saveInterfaceCaseSuite(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectSuiteList({});
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },

    async handleEdit(suiteId) {
      this.addPreProcessorHeadersList = []
      this.addPreProcessorParamsList = []
      this.addPreProcessorDataList = []
      this.addPreProcessorExecuteRelyValue = null
      const res = await findInterfaceCaseSuiteById(suiteId);
      if (res.code == 200) {
        this.dataInfo.createdTime = res.data.createdTime;
        this.dataInfo.creator = res.data.creator;
        this.dataInfo.desc = res.data.desc;
        this.dataInfo.executeType = res.data.executeType;
        this.dataInfo.isRetry = res.data.isRetry;
        this.dataInfo.runDev = res.data.runDev;
        this.dataInfo.suiteId = res.data.suiteId;
        this.dataInfo.suiteName = res.data.suiteName;
        this.dataInfo.updateTime = res.data.updateTime;
        let suiteProcessors = res.data.suiteProcessors;
        suiteProcessors.forEach(element => {
          let processorType = element.processorType
          let type = element.type
          let value = element.value
          if (processorType == 0) {
            if (type == 0) {
              this.addPreProcessorExecuteRelyValue = element.value
            } else if (type == 1) {
              let headers = JSON.parse(value)
              for(let name in headers) {
                this.addPreProcessorHeadersList.push({
                  "name":name,
                  "value":headers[name]
                })
              }
            } else if (type == 2) {
              let params = JSON.parse(value)
              for(let name in params) {
                this.addPreProcessorParamsList.push({
                  "name":name,
                  "value":params[name]
                })
              }
            } else if (type == 3) {
              let data = JSON.parse(value)
              for(let name in data) {
                this.addPreProcessorDataList.push({
                  "name":name,
                  "value":data[name]
                })
              }
            }
          } else if (processorType == 1) {
            if (type == 0) {
              this.addPostProcessorExecuteRelyValue = element.value
            }
          }
        });
        this.addPreProcessorHeadersList.push(
          {
            "name": null,
            "value": null
          },
        )
        this.addPreProcessorParamsList.push(
          {
            "name": null,
            "value": null
          },
        )
        this.addPreProcessorDataList.push(
          {
            "name": null,
            "value": null
          },
        )
        this.editDialogFormVisible = true;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleDelete(suiteId, index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await removeInterfaceCaseSuiteById(suiteId);
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
    async handleExecute(suiteId, index) {
      this.executeIconStyle = 'el-icon-loading'
      this.$message({
        type: "warning",
        center: true,
        message: '开始执行测试套件...'
      });
      const res = await executeSuiteCase(suiteId);
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
      this.executeIconStyle = 'el-icon-check'
    },
    async handleManager(suiteId) {
      this.$router.push({
        name: 'ifSuiteCaseList',
        query: {
          suiteId: suiteId,
        },
      })
    },
    async updateSuite() {
      // 前置处理器
      let preSuiteProcessors = []
      // 添加headers
      let preHeaders = {}
      this.addPreProcessorHeadersList.forEach(element => {
        if (element.name != null || element.name == '') {
          preHeaders[element.name] = element.value
        }
      });
      // 添加params
      let preParams = {}
      this.addPreProcessorParamsList.forEach(element => {
        if (element.name != null || element.name == '') {
          preParams[element.name] = element.value
        }
      });
      // 添加data
      let preData = {}
      this.addPreProcessorDataList.forEach(element => {
        if (element.name != null || element.name == '') {
          preData[element.name] = element.value
        }
      });
      let preHeadersStr = JSON.stringify(preHeaders)
      let preParamsStr = JSON.stringify(preParams)
      let preDataStr = JSON.stringify(preData)
      if (preHeadersStr != '{}') {
        preSuiteProcessors.push({
          "processorType":0,
          "type":1,
          "value": preHeadersStr
        })
      }
      if (preParamsStr != '{}') {
        preSuiteProcessors.push({
          "processorType":0,
          "type":2,
          "value": preParamsStr
        })
      }
      if (preDataStr != '{}') {
        preSuiteProcessors.push({
          "processorType":0,
          "type":3,
          "value": preDataStr
        })
      }
      if (this.addPreProcessorExecuteRelyValue != null) {
        // 添加rely
        preSuiteProcessors.push({
          "processorType":0,
          "type":0,
          "value": this.addPreProcessorExecuteRelyValue
        })
      }
      
      // 后置处理器
      let postSuiteProcessors = []
      if (this.addPostProcessorExecuteRelyValue != null) {
        // 添加rely
        postSuiteProcessors.push({
          "processorType":1,
          "type":0,
          "value": this.addPostProcessorExecuteRelyValue
        })
      }
      let arr = preSuiteProcessors.concat(postSuiteProcessors)
      this.dataInfo.suiteProcessors = arr
      const res = await modifyInterfaceCaseSuite(this.dataInfo);
      if (res.code == 200) {
        this.editDialogFormVisible = false;
        this.selectSuiteList(this.queryForm);
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
      this.selectSuiteList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectSuiteList(this.queryForm);
    },
    async openAdd() {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.addDialogFormVisible = true;
      this.dataAdd = {};
      this.dataAdd.creator = userInfo.realName

      this.processorList = []
      this.addPreProcessorHeadersList = [
        {
          "name": null,
          "value": null
        },
      ]
      this.addPreProcessorParamsList = [
        {
          "name": null,
          "value": null
        },
      ]
      this.addPreProcessorDataList = [
        {
          "name": null,
          "value": null
        },
      ]
      this.addPreProcessorExecuteRelyValue = null

      this.addPostProcessorExecuteRelyValue = null
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectSuiteList(this.queryForm)
    },
    async handleLog(row) {
      this.$router.push({
        name: 'ifSuiteLog',
        query: {
          suiteId: row.suiteId,
        },
      })
    },
    async handleCopy(suiteId) {
      this.$confirm('此操作将复制旗下所有的用例，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await copyInterfaceCaseSuiteById(suiteId)
        if (res.code == 200) {
          this.$message({
            type: "success",
            center: true,
            message: '复制测试用例' + res.data.copyCaseCount + '个'
          });
          this.resetForm()
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          });
        }
      })  
    },
    removePreProcessorHeadersItem(item) {
      var index = this.addPreProcessorHeadersList.indexOf(item)
      this.addPreProcessorHeadersList.splice(index, 1)
    },
    removePreProcessorParamsItem(item) {
      var index = this.addPreProcessorParamsList.indexOf(item)
      this.addPreProcessorParamsList.splice(index, 1)
    },
    removePreProcessorDataItem(item) {
      var index = this.addPreProcessorHeadersList.indexOf(item)
      this.addPreProcessorDataList.splice(index, 1)
    },
    addPreProcessorHeadersItem(item) {
      var index = this.addPreProcessorHeadersList.indexOf(item)
      if (index == this.addPreProcessorHeadersList.length - 1) {
        this.addPreProcessorHeadersList.push({
          "name":null,
          "value":null,
        })
      }
    },
    addPreProcessorParamsItem(item) {
      var index = this.addPreProcessorParamsList.indexOf(item)
      if (index == this.addPreProcessorParamsList.length - 1) {
        this.addPreProcessorParamsList.push({
          "name":null,
          "value":null,
        })
      }
    },
    addPreProcessorDataItem(item) {
      var index = this.addPreProcessorDataList.indexOf(item)
      if (index == this.addPreProcessorDataList.length - 1) {
        this.addPreProcessorDataList.push({
          "name":null,
          "value":null,
        })
      }
    },

    removePostProcessorHeadersItem(item) {
      var index = this.addPostProcessorHeadersList.indexOf(item)
      this.addPostProcessorHeadersList.splice(index, 1)
    },
    removePostProcessorParamsItem(item) {
      var index = this.addPostProcessorParamsList.indexOf(item)
      this.addPostProcessorParamsList.splice(index, 1)
    },
    removePostProcessorDataItem(item) {
      var index = this.addPostProcessorHeadersList.indexOf(item)
      this.addPostProcessorDataList.splice(index, 1)
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
