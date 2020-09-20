<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="用例编号">
          <el-input v-model="queryForm.caseId" placeholder="用例编号"  size='small'></el-input>
        </el-form-item>
        <el-form-item label="项目编号">
          <el-input v-model="queryForm.projectId" placeholder="项目编号"  size='small'></el-input>
        </el-form-item>
        <el-form-item label="模块编号">
          <el-input v-model="queryForm.moduleId" placeholder="模块编号"  size='small'></el-input>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="queryForm.projectName" placeholder="项目名称"  size='small'></el-input>
        </el-form-item>
        <el-form-item label="模块名称">
          <el-input v-model="queryForm.moduleName" placeholder="模块名称"  size='small'></el-input>
        </el-form-item>
        <el-form-item label="用例名称">
          <el-input v-model="queryForm.desc" placeholder="用例名称"  size='small'></el-input>
        </el-form-item>      
        <el-form-item label="请求方式">
          <el-select v-model="queryForm.method" placeholder="请求方式"  size='small'>
            <el-option
              v-for="item in requestMethodOptions"
              :key="item.label"
              size='small'
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>          
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="queryForm.level" placeholder="级别"  size='small'>
            <el-option
              v-for="item in levelOptions"
              size='small'
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
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
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker
            v-model="queryForm.createdEndTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            size='small'
            placeholder="选择截止时间"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="selectInterfaceCase(queryForm)">查询</el-button>
          <el-button type="primary" size="small" @click="resetForm">重置</el-button>
          <el-button type="primary" size="small" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">

        <el-table-column type="expand">
        <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="项目名称:">
                <el-label>{{props.row.projectName}}</el-label>
            </el-form-item>
            <br />
            <el-form-item label="模块名称:">
                <el-label>{{props.row.moduleName}}</el-label>
            </el-form-item>
            <br/>
             <el-form-item label="创建人:">
                <el-label>{{props.row.creater}}</el-label>
            </el-form-item>
            </el-form>
        </template>
        </el-table-column>
        <el-table-column property="caseId" label="用例编号" min-width="8%"></el-table-column>
        <el-table-column property="desc" label="用例名称" min-width="25%"></el-table-column>
        <el-table-column property="url" label="请求地址" min-width="20%"></el-table-column>
        <el-table-column property="method" label="请求方式" min-width="8%">
          <template slot-scope="scope">
            <el-tag effect="dark" :type="scope.row.methodStyle" disable-transitions>{{scope.row.method}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="level" label="级别" min-width="8%">
          <template slot-scope="scope">
            <el-tag effect="dark" :type="scope.row.levelStyle" disable-transitions>{{scope.row.level}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="createdTime" label="创建时间" min-width="15%"></el-table-column>  
        <el-table-column fixed="right" label="操作" min-width="16%">
            <template slot-scope="scope">
                <el-button 
                @click="handleCheck(scope.row.caseId)"
                type="success"
                size="small" 
                icon="el-icon-check" 
                circle>
                </el-button>
                <el-button
                @click="handleEdit(scope.row.caseId)"
                type="primary"
                size="small"
                icon="el-icon-edit"
                circle
                ></el-button>
                <el-button
                @click="handleDelete(scope.row.caseId, scope.$index)"
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
      
      <el-dialog title="添加" :visible.sync="addDialogFormVisible">
        <el-form :model="dataAdd" ref="dataAdd">
        <el-collapse>
        <el-collapse-item title="基本信息">
          <el-form-item label="*项目编号" label-width="100px">
            <el-input readonly v-model="dataAdd.projectId" @focus='handleProjectModuleList' size="small" placeholder="请点击选择"></el-input>
          </el-form-item>
          <el-form-item label="*项目名称" label-width="100px">
            <el-input readonly v-model="dataAdd.projectName" @focus='handleProjectModuleList' size="small" placeholder="请点击选择"></el-input>
          </el-form-item>
          <el-form-item label="*模块编号" label-width="100px">
            <el-input readonly v-model="dataAdd.moduleId" @focus='handleProjectModuleList' size="small" placeholder="请点击选择"></el-input>
          </el-form-item>
          <el-form-item label="*模块名称" label-width="100px">
            <el-input readonly v-model="dataAdd.moduleName" @focus='handleProjectModuleList' size="small" placeholder="请点击选择"></el-input>
          </el-form-item>
          <el-form-item label="*用例名称" label-width="100px">
            <el-input v-model="dataAdd.desc" size="small"></el-input>
          </el-form-item>
          <el-form-item label="接口文档地址" label-width="100px">
            <el-input v-model="dataAdd.doc" size="small"></el-input>
          </el-form-item>
          <el-form-item label="*用例等级" label-width="100px">
            <el-select v-model="dataAdd.level" placeholder="请选择"  size="small">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*创建人" label-width="100px">
            <el-input v-model="dataAdd.creater"  size="small"></el-input>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="请求信息">
          <el-row :gutter="20">
          <el-col :span="4">
            <el-select v-model="dataAdd.method" placeholder="method"  size="small" @change="handleChangeMethod">
              <el-option
                v-for="item in requestMethodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="20">
            <el-input v-model="dataAdd.url"  size="small" placeholder="Enter request url"></el-input>
          </el-col> 
          </el-row>  

        <el-tabs >
            <!-- header -->
            <el-tab-pane label="Headers">
                <el-radio v-model="headerTypeFlag" :label="0" @change="handleChangeHeaderType">key-value</el-radio>
                <el-radio v-model="headerTypeFlag" :label="1" @change="handleChangeHeaderType">object</el-radio> 
                <el-button v-if="headerTypeFlag==0" @click.prevent="addHeader" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <div v-if="headerTypeFlag==0">
                <el-form-item
                    v-for="(headerItem, index) in dataAddHeaders"
                    :index="index"
                    :key="headerItem.key">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-input v-model="headerItem.name" placeholder="name"></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="headerItem.value" placeholder="value"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeHeader(headerItem)" type="danger" icon="el-icon-delete" circle size="small"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>
                <div v-if="headerTypeFlag==1">
                    <el-input v-model="dataAddHeadersStr" size="small" type="textarea" :rows="6" placeholder="header json string"></el-input>
                </div>  
            </el-tab-pane>

            <!-- params -->
            <el-tab-pane label="Params">
                <el-radio v-model="paramsTypeFlag" :label="0" @change="handleChangeParamsType">key-value</el-radio>
                <el-radio v-model="paramsTypeFlag" :label="1" @change="handleChangeParamsType">object</el-radio> 
                <el-button v-if="paramsTypeFlag==0" @click.prevent="addParams" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <div v-if="paramsTypeFlag==0">
                <el-form-item
                    v-for="(paramsItem, index) in dataAddParams"
                    :index="index"
                    :key="paramsItem.key">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-input v-model="paramsItem.name" placeholder="name"></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="paramsItem.value" placeholder="value"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeParams(paramsItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>
                <div v-if="paramsTypeFlag==1">
                    <el-input v-model="dataAddParamsStr" size="small" type="textarea" :rows="6" placeholder="params json string"></el-input>
                </div>            
            </el-tab-pane>

            <!-- body -->
            <el-tab-pane label="Body">
                <el-radio v-model="bodyTypeFlag" :label="0" @change="handleChangeBodyType">form-data</el-radio>
                <el-radio v-model="bodyTypeFlag" :label="3" @change="handleChangeBodyType">raw</el-radio>
                <el-radio v-model="bodyTypeFlag" :label="1" @change="handleChangeBodyType">form-object</el-radio>
                <el-radio v-model="bodyTypeFlag" :label="2" @change="handleChangeBodyType">json</el-radio>
                <el-button v-if="bodyTypeFlag==0" @click.prevent="addDataForm" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>

                <div v-if="bodyTypeFlag==0">
                <el-form-item
                    v-for="(dataItem, index) in dataAddFormData"
                    :index="index"
                    :key="dataItem.key">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-input v-model="dataItem.name" placeholder="name"></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="dataItem.value" placeholder="value"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeDataForm(dataItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>

                <div v-if="bodyTypeFlag==1">
                    <el-input v-model="dataAddFormStr" size="small" type="textarea" :rows="6" placeholder="form-data json string"></el-input>
                </div>   
                <div v-if="bodyTypeFlag==2">
                    <el-input v-model="dataAddJsonStr" size="small" type="textarea" :rows="6" placeholder="json string"></el-input>
                </div>   
                <div v-if="bodyTypeFlag==3">
                    <el-input v-model="dataAddFormRaw" size="small" type="textarea" :rows="6" placeholder="form-data raw"></el-input>
                </div>   
            </el-tab-pane>
        </el-tabs>

          <!-- <el-form-item label="header" label-width="100px">
            <el-switch
                v-model="headerSwitch"
                :active-value="true"
                :inactive-value="false">
            </el-switch>
          </el-form-item>  
          <el-form-item label="" label-width="100px" v-if="headerSwitch">
            <el-input v-model="dataAdd.header" size="small" type="textarea" :rows="6"></el-input>
          </el-form-item> 

          <el-form-item label="params" label-width="100px"  v-if="showParams">
            <el-switch
                v-model="paramsSwitch"
                :active-value="true"
                :inactive-value="false">
            </el-switch>
          </el-form-item>  
          <el-form-item label="" label-width="100px" v-if="showParams & paramsSwitch">
            <el-input v-model="dataAdd.params" size="small" type="textarea" :rows="6"></el-input>
          </el-form-item> 

          <el-form-item label="data" label-width="100px"  v-if="showData">
            <el-switch
                v-model="dataSwitch"
                :active-value="true"
                :inactive-value="false">
            </el-switch>
          </el-form-item>  
          <el-form-item label="" label-width="100px"  v-if="showData & dataSwitch">
            <el-input v-model="dataAdd.data" size="small" type="textarea" :rows="6"></el-input>
          </el-form-item> 

          <el-form-item label="json" label-width="100px"  v-if="showJson">
            <el-switch
                v-model="jsonSwitch"
                :active-value="true"
                :inactive-value="false">
            </el-switch>
          </el-form-item>  
          <el-form-item label="" label-width="100px" v-if="showJson & jsonSwitch">
            <el-input v-model="dataAdd.json" size="small" type="textarea" :rows="6"></el-input>
          </el-form-item> -->

          </el-collapse-item>
      </el-collapse>
      </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogFormVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="handleAdd()" size="small">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="选择项目、模块" :visible.sync="selectProjectModuleDialogFormVisible" append-to-body>
        <el-form :inline="true" :model="projectModuleQuery" class="demo-form-inline" ref="queryForm">
          <el-form-item label="项目编号">
            <el-input v-model="projectModuleQuery.projectId" placeholder="项目名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input v-model="projectModuleQuery.projectName" placeholder="项目名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="模块编号">
            <el-input v-model="projectModuleQuery.moduleId" placeholder="模块编号" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="模块名称">
            <el-input v-model="projectModuleQuery.moduleName" placeholder="模块名称"  size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" circle @click="selectProjetModule" size="mini"></el-button>
            <el-button type="primary" icon="el-icon-refresh" circle @click="resetProjectModuleQuery" size="mini"></el-button>
          </el-form-item>
        </el-form>
        <el-table 
        :data="projectModuleTable" 
        stripe 
        highlight-current-row 
        @row-click="handleSelectProjetModule"
        style="width: 100%">
          <el-table-column property="projectId" label="项目编号" min-width="50%"></el-table-column>
          <el-table-column property="projectName" label="项目名称" min-width="50%"></el-table-column>
          <el-table-column property="moduleId" label="模块编号" min-width="50%"></el-table-column>
          <el-table-column property="moduleName" label="模块名称" min-width="50%"></el-table-column>
        </el-table>
        <div class="pagination" style="text-align: left;margin-top: 10px;">
          <el-pagination
            @size-change="handleProjectModuleSizeChange"
            @current-change="handleProjectModuleCurrentChange"
            :current-page="projectModulePageNum"
            :page-sizes="[5, 10, 20]"
            :page-size="projectModulePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="projectModulePageTotal"
          ></el-pagination>
        </div>
      </el-dialog>


    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {findProjectModuleList, listInterfaceCase,saveInterfaceCase,modifyInterfaceCase,removeInterfaceCase,findInterfaceCaseByCaseId,executeInterfaceCase } from "@/api/getData";
export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      requestMethodOptions: [
        {
          value: 0,
          label: "GET",
        },
        {
          value: 1,
          label: "POST",
        },
        {
          value: 2,
          label: "UPDATE",
        },
        {
          value: 3,
          label: "PUT",
        },
        {
          value: 4,
          label: "DELETE",
        },
      ],
      levelOptions: [
        {
          value: 0,
          label: "高",
        },
        {
          value: 1,
          label: "中",
        },
        {
          value: 2,
          label: "低",
        },
      ],
      dataAdd: {},
      dataInfo: {},
      projectModuleQuery: {},
      projectModuleTable: [],
      projectModulePageSize: 5,
      projectModulePageNum: 1,
      projectModulePageTotal: 0,
      selectProjectModuleDialogFormVisible: false,
      addDialogFormVisible: false,

      headerMerge:false,
      paramsMerge:false,
      dataMerge:false,
      showParams:false,
      showData:false,
      showJson:false,
      headerSwitch:false,
      paramsSwitch:false,
      dataSwitch:false,
      jsonSwitch:false,

      dataAddHeaders: [], // key-value形式头数组
      dataAddHeadersStr: "", // json字符串形式header

      dataAddParams: [], // key-value形式params数组
      dataAddParamsStr: "", // json字符串形式params

      dataAddFormData: [], // key-value形式data数组
      dataAddFormStr: "", // json字符串形式params
      dataAddJsonStr:"",// json字符串
      dataAddFormRaw:"", //key=value&key=value格式


      headerTypeFlag:0, // 0:key-value 1:object
      paramsTypeFlag:0, // 0:key-value 1:object
      bodyTypeFlag:0, // 0:form-data  1:form-raw 2:json 3：key=value&key=value格式
    };
  },
  components: {
    headTop,
  },
  mounted() {
    this.selectInterfaceCase(this.queryForm);
  },
  methods: {
    removeHeader(item) {
    var index = this.dataAddHeaders.indexOf(item)
    if (index !== -1) {
        this.dataAddHeaders.splice(index, 1)
    }
    },
    addHeader() {
    this.dataAddHeaders.push({
        name: '',
        value: '',
        key: Date.now()
    });
    },
    removeParams(item) {
    var index = this.dataAddParams.indexOf(item)
    if (index !== -1) {
        this.dataAddParams.splice(index, 1)
    }
    },
    addParams() {
    this.dataAddParams.push({
        name: '',
        value: '',
        key: Date.now()
    });
    },
    removeDataForm(item) {
    var index = this.dataAddFormData.indexOf(item)
    if (index !== -1) {
        this.dataAddFormData.splice(index, 1)
    }
    },
    addDataForm() {
    this.dataAddFormData.push({
        name: '',
        value: '',
        key: Date.now()
    });
    },
    async selectInterfaceCase(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      this.dataList = [];
      const res = await listInterfaceCase(queryForm);
      if (res.code == 200) {
        this.total = res.data.total;
        res.data.list.forEach((element) => {
          if (element.level == 0) {
            element.levelStyle = "danger";
            element.level = "高";
          } else if (element.status == 1) {
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
          } else if (element.type == 1) {
            element.methodStyle = "";
            element.method = "POST";
          } else if (element.type == 2) {
            element.methodStyle = "";
            element.method = "UPDATE";
          } else if (element.type == 3) {
            element.methodStyle = "";
            element.method = "PUT";
          } else if (element.type == 4) {
            element.methodStyle = "";
            element.method = "DELETE";
          } else {
            element.methodStyle = "";
            element.method = "UNKNOW";
          } 
          this.dataList.push(element);
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg,
        });
      }
    },
    handleChangeMethod(method) {
        console.log(this.dataAdd.method)
        if(method == 0) { // get
            this.showParams = true
            this.showData = false
            this.showJson = false
            this.dataAdd.data = null
            this.dataSwitch = false
            this.jsonSwitch = false
            this.dataInfo.data = null
        } else if (method == 1) { //post
            this.showParams = true
            this.showData = true
            this.showJson = true            
        } else if (method == 2) { //update
            this.showParams = true
            this.showData = true
            this.showJson = true              
        } else if (method == 3) { //put
            this.showParams = true
            this.showData = true
            this.showJson = true              
        } else if (method == 4) { //delete
            this.showParams = true
            this.showData = true
            this.showJson = true              
        } else { // 默认状态
            this.showParams = false
            this.showData = false
            this.showJson = false
        }
    },
    async handleCheck(caseId) {
        const res = await executeInterfaceCase(caseId)
        if (res.code == 200) {
            this.$message({
                type: "success",
                center: true,
                message: res.msg
            })
        } else {
            if (res.msg === '测试用例执行失败') {
                this.$message({
                type: "warning",
                center: true,
                message: res.msg
                })
            } else {
                this.$message({
                type: "error",
                center: true,
                message: res.msg
                })
            }
        }
    },
    async handleDelete(caseId, index) {
      const res = await removeInterfaceCase(caseId);
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
    
    async handleAdd(){
        let method = this.dataAdd.method
        let header = {}
        let params = {}
        let data = {}
        let json = {}

        console.log(this.dataAddHeaders)
        console.log(this.dataAddHeadersStr)
        // 对请求头进行处理  headerTypeFlag 0:key-value 1:object
        if (this.headerTypeFlag == 0) {
            this.dataAddHeaders.forEach(element => {
                header[element.name] = element.value
            });
            this.dataAdd.header = header
        } else {
            header = this.dataAddHeadersStr
            this.dataAdd.header = header
        }
        // 对params 统一处理 所有请求都可能存在params
        if (this.paramsTypeFlag == 0) { // 对params进行处理 paramsTypeFlag 0:key-value 1:object
            this.dataAddParams.forEach(element => {
                params[element.name] = element.value
            });
            this.dataAdd.params = params
        } else {
            params = this.dataAddParamsStr
            this.dataAdd.params = params
        }
        if (method != 0) { //非get请求目前统一考虑成为post请求
            if (this.bodyTypeFlag == 0) { // 对body进行处理 0:form-data  1:form-raw 2:json 3：key=value&key=value格式
                this.dataAddFormData.forEach(element => {
                    data[element.name] = element.value
                });
                this.dataAdd.data = data
            } else if (this.bodyTypeFlag == 1) {
                this.dataAdd.data = this.dataAddFormStr
            } else if (this.bodyTypeFlag == 2) {
                this.dataAdd.json = this.dataAddJsonStr
            } else {
                let kv = this.dataAddFormRaw.split("&")
                kv.forEach(item => {
                    let keyValue = item.split("=")
                    data[keyValue[0]] = keyValue[1]
                });
                this.dataAdd.data = data
            }
        } 
        const res = saveInterfaceCase(this.dataAdd)
    },
    
    async selectProjetModule() {
      this.projectModuleQuery['pageSize'] = this.projectModulePageSize 
      this.projectModuleQuery['pageNum'] = this.projectModulePageNum 
      const res = await findProjectModuleList(this.projectModuleQuery)
      if (res.code == 200) {
        this.projectModuleTable = []
        this.projectModulePageTotal = res.data.total
        this.projectModuleTable = res.data.list
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
      this.selectInterfaceCase(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectInterfaceCase(this.queryForm);
    },
    handleProjectModuleSizeChange (pageSize) {
      this.projectModulePageSize = pageSize;
      this.selectProjetModule(this.projectModuleQuery);
    },
    handleProjectModuleCurrentChange(pageNum) {
      this.projectModulePageNum = pageNum;
      this.selectProjetModule(this.projectModuleQuery);
    },
    async handleSelectProjetModule(row){
      console.log(row)
      this.selectProjectModuleDialogFormVisible = false
      this.dataInfo.moduleId = row.moduleId;
      this.dataInfo.moduleName = row.moduleName;
      this.dataInfo.projectId = row.projectId;
      this.dataInfo.projectName = row.projectName;

      this.dataAdd.moduleId = row.moduleId;
      this.dataAdd.moduleName = row.moduleName;
      this.dataAdd.projectId = row.projectId;
      this.dataAdd.projectName = row.projectName;
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectInterfaceCase(this.queryForm)
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
      // 头置空
      this.headerTypeFlag = 0
      this.dataAddHeaders = []
      this.dataAddHeadersStr = ""
      // 初始化params 方式
      this.paramsTypeFlag = 0
      this.dataAddParams = []
      this.dataAddParamsStr = ""
      // 初始化body
      this.bodyTypeFlag = 0
      this.dataAddFormData = []
      this.dataAddFormStr = ""
      this.dataAddJsonStr = ""      
      
      this.headerMerge = false
      this.paramsMerge = false
      this.dataMerge = false
      this.showParams = false
      this.showData = false
      this.showJson = false
      this.headerSwitch = false
      this.paramsSwitch = false
      this.dataSwitch = false
      this.jsonSwitch = false
    },
    async handleProjectModuleList() {
      this.selectProjetModule()
      this.projectModuleQuery = {}
      this.selectProjectModuleDialogFormVisible = true
    },
    async resetProjectModuleQuery() {
      this.projectModuleQuery = {}
      this.projectModulePageSize = 5
      this.projectModulePageNum = 1
      this.selectProjetModule(this.projectModuleQuery)
    },
    // 切换header radio时将之前的清空
    async handleChangeHeaderType() {
        if (this.headerTypeFlag == 0) {
            this.dataAddHeaders = []
        } else {
            this.dataAddHeadersStr = ""
        }
    },
    // 切换params radio时将之前的清空
    async handleChangeParamsType() {
        if (this.paramsTypeFlag == 0) {
            this.dataAddParams = []
        } else {
            this.dataAddParamsStr = ""
        }
    },
    // 切换body radio时将之前的情况
    async handleChangeBodyType() {
        if (this.bodyTypeFlag == 0) {
           this.dataAddFormStr = ""
           this.dataAddJsonStr = ""
           this.dataAddFormRaw = ""
        } else if (this.bodyTypeFlag == 1) {
           this.dataAddFormData = []
           this.dataAddJsonStr = ""
           this.dataAddFormRaw = ""
        } else if (this.bodyTypeFlag == 2) {
           this.dataAddFormStr = ""
           this.dataAddFormData = []
           this.dataAddFormRaw = ""
        } else {
           this.dataAddFormData = []
           this.dataAddFormStr = ""
           this.dataAddJsonStr = ""
        }
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
