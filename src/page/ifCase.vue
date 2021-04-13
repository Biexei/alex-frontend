<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="用例编号">
          <el-input v-model="queryForm.caseId" placeholder="用例编号"  size='mini'></el-input>
        </el-form-item>
        <el-form-item label="项目编号">
          <el-input v-model="queryForm.projectId" placeholder="项目编号"  size='mini'></el-input>
        </el-form-item>
        <el-form-item label="模块编号">
          <el-input v-model="queryForm.moduleId" placeholder="模块编号"  size='mini'></el-input>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="queryForm.projectName" placeholder="项目名称"  size='mini'></el-input>
        </el-form-item>
        <el-form-item label="模块名称">
          <el-input v-model="queryForm.moduleName" placeholder="模块名称"  size='mini'></el-input>
        </el-form-item>
        <el-form-item label="用例名称">
          <el-input v-model="queryForm.desc" placeholder="用例名称"  size='mini'></el-input>
        </el-form-item>      
        <el-form-item label="请求方式">
          <el-select v-model="queryForm.method" placeholder="请求方式"  size='mini'>
            <el-option
              v-for="item in requestMethodOptions"
              :key="item.label"
              size='mini'
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>          
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="queryForm.level" placeholder="级别"  size='mini'>
            <el-option
              v-for="item in levelOptions"
              size='mini'
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
            size='mini'
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
            size='mini'
            placeholder="选择截止时间"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-has="'interface:case:find'" type="primary" size="mini" @click="selectInterfaceCase(queryForm)">查询</el-button>
          <el-button v-has="'interface:case:find'" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button v-has="'interface:case:add'" type="primary" size="mini" @click="openAdd" plain>新增</el-button>
          <el-button v-has="'interface:case:generate'" type="primary" size="mini" @click="openGenerator" plain>生成</el-button>
          <el-button v-has="'interface:case:import'" type="primary" size="mini" @click="openImport" plain>导入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table @row-dblclick="handleLastTenLog" :data="dataList" stripe highlight-current-row style="width: 100%">

        <el-table-column type="expand">
        <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用例来源">
                <el-input v-if="props.row.source==0" value="新增" readonly size="mini"></el-input>
                <el-input v-else-if="props.row.source==1" value="excel" readonly size="mini"></el-input>
                <el-input v-else-if="props.row.source==2" value="csv" readonly size="mini"></el-input>
                <el-input v-else-if="props.row.source==3" value="json" readonly size="mini"></el-input>
                <el-input v-else-if="props.row.source==4" value="yaml" readonly size="mini"></el-input>
            </el-form-item>
            <el-form-item label="导入批次">
                <el-input  :value="props.row.importNo" readonly size="mini"></el-input>
            </el-form-item>
             <el-form-item label="由谁创建">
                <el-input  :value="props.row.creater" readonly size="mini"></el-input>
            </el-form-item>
             <el-form-item label="创建时间">
                <el-input  :value="props.row.createdTime" readonly size="mini"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="项目编号">
                <el-input  :value="props.row.projectId" readonly size="mini"></el-input>
            </el-form-item>
            <el-form-item label="项目名称">
                <el-input  :value="props.row.projectName" readonly size="mini"></el-input>
            </el-form-item>
            <el-form-item label="模块编号">
                <el-input  :value="props.row.moduleId" readonly size="mini"></el-input>
            </el-form-item>
            <el-form-item label="模块名称">
                <el-input  :value="props.row.moduleName" readonly size="mini"></el-input>
            </el-form-item>
            </el-form>
        </template>
        </el-table-column>
        <el-table-column property="caseId" label="用例编号" min-width="10%"></el-table-column>
        <el-table-column property="projectName" label="项目名称" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column property="desc" label="用例名称" min-width="30%" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-row>
              <el-col :span="3"><el-tag effect="dark" :type="scope.row.levelStyle" disable-transitions size="mini">{{scope.row.level}}</el-tag></el-col>
              <el-col :span="21"><span>{{scope.row.desc}}</span></el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column property="method" label="请求地址" min-width="30%" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-row :gutter="10">
              <el-col :span="4"><el-tag effect="dark" :type="scope.row.methodStyle" disable-transitions size="mini">{{scope.row.method}}</el-tag></el-col>
              <el-col :span="20"><span>{{scope.row.url}}</span></el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
            <template slot-scope="scope">
                <el-button 
                @click="handleCheck(scope.row.caseId)"
                v-has="'interface:case:execute'"
                type="success"
                size="mini" 
                icon="el-icon-check" 
                circle>
                </el-button>
                <el-button
                @click="openEdit(scope.row)"
                v-has="'interface:case:modify'"
                type="primary"
                size="mini"
                icon="el-icon-edit"
                circle
                ></el-button>
                <el-button
                @click="openCopy(scope.row)"
                v-has="'interface:case:copy'"
                type="warning"
                size="mini"
                icon="el-icon-copy-document"
                circle
                ></el-button>                
                <el-button
                @click="handleDelete(scope.row.caseId, scope.$index)"
                v-has="'interface:case:remove'"
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

      <el-dialog @close="closeImportDialog" title="导入" :visible.sync="importDialogFormVisible" :close-on-click-modal="false" @open="selectSuiteList">
        <el-form :model="dataImport" ref="dataImport">
          <el-form-item label="*类型" label-width="100px">
            <el-select v-model="dataImport.type" size='mini'>
              <el-option
                v-for="item in importTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-link :href="downloadUrl + dataImport.type" type="primary" target="_blank" icon="el-icon-download" :underline="false">下载模版</el-link>
          </el-form-item>
          <el-form-item label="*选择文件" label-width="100px">
            <el-upload
              ref="upload"
              :action=importUrl
              :data=dataImport
              multiple
              :headers=importHeader
              :auto-upload=false
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              accept=".xls,.xlsx,.csv,.json,.yaml"
              :limit="1">
              <el-button size="mini" type="primary">立即上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="并导入" label-width="100px" prop="name">
            <el-select v-model="dataImport.suiteId" @change="handleSelectSuite"  size='mini'>
              <el-option
              size='mini'
              v-for="item in suiteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="importDialogFormVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="handleImport" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <!--自动生成用例-->
      <el-dialog @close="closeGeneratorDialog" title="生成" :visible.sync="generatorDialogFormVisible" :close-on-click-modal="false">
        <el-form :model="caseGenerator" ref="caseGenerator">
          <el-form-item label="约束示例" label-width="100px">
            <el-link :href="downloadUrl + 5" type="primary" target="_blank" icon="el-icon-download" :underline="false">约束示例</el-link>
          </el-form-item>
          <el-form-item label="介绍文档" label-width="100px">
            <el-link :href="downloadUrl + 6" type="primary" target="_blank" icon="el-icon-download" :underline="false">介绍文档</el-link>
          </el-form-item>
          <el-form-item label="*选择文件" label-width="100px">
            <el-upload
              ref="uploadGenerator"
              :action=generatorUrl
              :data=caseGenerator
              multiple
              :headers=importHeader
              :auto-upload=false
              :on-success="handleGeneratorUploadSuccess"
              :on-error="handleGeneratorUploadError"
              accept=".json"
              :limit="1">
              <el-button size="mini" type="primary">上传约束</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="*生成策略" label-width="100px">
            <el-checkbox  disabled checked>等价类</el-checkbox>
            <el-checkbox  disabled checked>边界值</el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-radio-group v-model="caseGenerator.type" size='mini'>
              <el-radio :label="1">正交法</el-radio>
              <el-radio :label="2">穷举法</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="generatorDialogFormVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="handleGenerator" size="mini">确 定</el-button>
        </div>
      </el-dialog>


      <el-dialog title="添加" :visible.sync="addDialogFormVisible" :close-on-click-modal="false">
        <el-form :model="dataAdd" ref="dataAdd">
        <el-collapse>

          <el-collapse-item title="前置用例">
                <el-button @click.prevent="addPreCase" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(preCaseItem, index) in preCaseList"
                    :index="index"
                    :key="index">
                <el-row :gutter="10">
                    <el-col :span="2">
                        <el-input v-model="preCaseItem.order" placeholder="排序" size="mini"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model="preCaseItem.preCaseId" placeholder="前置用例编号" disabled size="mini"></el-input>
                    </el-col>
                    <el-col :span="14">
                        <el-input v-model="preCaseItem.preCaseDesc" readonly placeholder="前置用例描述，请点击选择" @focus='handlePreCaseList(index)' size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-switch
                          v-model="preCaseItem.status"
                          :active-value=0
                          :inactive-value=1>
                        </el-switch>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removePreCase(preCaseItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>


        <el-collapse-item title="*基本信息">
          <el-form-item label="*项目名称" label-width="100px">
            <el-input readonly v-model="dataAdd.projectName" @focus='handleProjectModuleList' size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="*模块名称" label-width="100px">
            <el-input readonly v-model="dataAdd.moduleName" @focus='handleProjectModuleList' size="mini" placeholder="请点击选择"></el-input>
          </el-form-item>
          <el-form-item label="*用例名称" label-width="100px">
            <el-input v-model="dataAdd.desc" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="接口文档地址" label-width="100px">
            <el-input v-model="dataAdd.doc" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*用例等级" label-width="100px">
            <el-select v-model="dataAdd.level" placeholder="请选择"  size="mini" >
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*创建人" label-width="100px">
            <el-input v-model="dataAdd.createrRealName"  size="mini" disabled></el-input>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="*请求信息">
          <el-row :gutter="20">
          <el-col :span="4">
            <el-select v-model="dataAdd.method" placeholder="method"  size="mini" @change="handleChangeMethod">
              <el-option
                v-for="item in requestMethodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="20">
            <el-input v-model="dataAdd.url"  size="mini" placeholder="Enter request url"></el-input>
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
                        <el-input v-model="headerItem.name" placeholder="name" size='mini'></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="headerItem.value" placeholder="value" size='mini'></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeHeader(headerItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>
                <div v-if="headerTypeFlag==1">
                    <el-input v-model="dataAddHeadersStr" size="mini" type="textarea" :rows="6" placeholder="header json string"></el-input>
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
                        <el-input v-model="paramsItem.name" placeholder="name" size='mini'></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="paramsItem.value" placeholder="value" size='mini'></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeParams(paramsItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>
                <div v-if="paramsTypeFlag==1">
                    <el-input v-model="dataAddParamsStr" size="mini" type="textarea" :rows="6" placeholder="params json string"></el-input>
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
                        <el-input v-model="dataItem.name" placeholder="name" size='mini'></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="dataItem.value" placeholder="value" size='mini'></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeDataForm(dataItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>

                <div v-if="bodyTypeFlag==1">
                    <el-input v-model="dataAddFormStr" size="mini" type="textarea" :rows="6" placeholder="form-data json string"></el-input>
                </div>   
                <div v-if="bodyTypeFlag==2">
                    <el-input v-model="dataAddJsonStr" size="mini" type="textarea" :rows="6" placeholder="json string"></el-input>
                </div>   
                <div v-if="bodyTypeFlag==3">
                    <el-input v-model="dataAddFormRaw" size="mini" type="textarea" :rows="6" placeholder="form-data raw"></el-input>
                </div>   
            </el-tab-pane>
        </el-tabs>
          </el-collapse-item>



        <el-collapse-item title="请求参数缓存">
                <el-button @click.prevent="addPreProcessor" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(preProcessorItem, index) in preProcessorList"
                    :index="index"
                    :key="index">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-input v-model="preProcessorItem.name" placeholder="名称" size="mini" ></el-input>
                    </el-col>
                     <el-col :span="5">
                        <el-select v-model="preProcessorItem.type" size='mini'>
                          <el-option
                            v-for="item in preProcessorTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="6">
                        <el-input v-model="preProcessorItem.expression" placeholder="提取表达式"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-switch
                          v-model="preProcessorItem.haveDefaultValue"
                          :active-value=0
                          :inactive-value=1>
                        </el-switch>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="preProcessorItem.defaultValue" placeholder="默认值"  size="mini" v-if="preProcessorItem.haveDefaultValue==0"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removePreProcessor(preProcessorItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>



          <el-collapse-item title="断言信息">
                <el-button @click.prevent="addAssert" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(assertItem, index) in assertList"
                    :index="index"
                    :key="index">
                <el-row :gutter="20">
                    <el-col :span="2">
                        <el-input v-model="assertItem.order" placeholder="排序" size="mini"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model="assertItem.assertName" placeholder="描述"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="3">
                        <el-select v-model="assertItem.type" size='mini'>
                          <el-option
                            v-for="item in assertTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="assertItem.expression" placeholder="提取表达式"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="3">
                        <el-select v-model="assertItem.operator" size='mini'>
                          <el-option
                            v-for="item in assertOperatorOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="assertItem.exceptedResult" placeholder="预期结果"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeAssert(assertItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>

        <el-collapse-item title="响应数据缓存">
                <el-button @click.prevent="addPostProcessor" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(postProcessorItem, index) in postProcessorList"
                    :index="index"
                    :key="index">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-input v-model="postProcessorItem.name" placeholder="名称" size="mini" ></el-input>
                    </el-col>
                     <el-col :span="5">
                        <el-select v-model="postProcessorItem.type" size='mini'>
                          <el-option
                            v-for="item in postProcessorTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="6">
                        <el-input v-model="postProcessorItem.expression" placeholder="提取表达式"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-switch
                          v-model="postProcessorItem.haveDefaultValue"
                          :active-value=0
                          :inactive-value=1>
                        </el-switch>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="postProcessorItem.defaultValue" placeholder="默认值"  size="mini" v-if="postProcessorItem.haveDefaultValue==0"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removePostProcessor(postProcessorItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>


      </el-collapse>
      </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogFormVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="handleAdd()" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="选择" :visible.sync="selectProjectModuleDialogFormVisible" append-to-body>
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


      <el-dialog title="日志详情" :visible.sync="logDetailDialogFormVisible">
        <el-collapse>
        <el-form :model="logInfo">
          <el-collapse-item title="基本信息">
          <el-form-item label="用例编号" label-width="100px">
            <el-input v-model="logInfo.caseId" readonly size='mini'></el-input>
          </el-form-item>
          <el-form-item label="用例描述" label-width="100px">
            <el-input v-model="logInfo.caseDesc" readonly size='mini'></el-input>
          </el-form-item>
          <el-form-item label="执行用时(ms)" label-width="100px">
            <el-input v-model="logInfo.runTime" readonly size='mini'></el-input>
          </el-form-item> 
          <el-form-item label="执行人" label-width="100px">
            <el-input v-model="logInfo.executer" readonly size='mini'></el-input>
          </el-form-item> 
          <el-form-item label="执行时间" label-width="100px">
            <el-input v-model="logInfo.createdTime" readonly size='mini'></el-input>
          </el-form-item> 
          <el-form-item label="执行编号" label-width="100px">
            <el-input v-model="logInfo.suiteLogNo" readonly size='mini'></el-input>
          </el-form-item> 
          <el-form-item label="异常信息" label-width="100px" v-if="logInfo.status=='错误'">
            <el-input v-model="logInfo.errorMessage" readonly size="mini" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
          </el-form-item> 
          <el-form-item label="执行状态" label-width="100px">
            <template>
              <el-tag
                effect="dark"
                size="mini"
                :type="logInfo.statusStyle"
                disable-transitions>{{logInfo.status}}</el-tag>
            </template>
          </el-form-item> 
          <el-form-item label="失败重跑" label-width="100px">
            <template>
              <el-tag
                effect="dark"
                size="mini"
                :type="logInfo.isFailedRetryStyle"
                disable-transitions>{{logInfo.isFailedRetryValue}}</el-tag>
            </template>
          </el-form-item> 
          </el-collapse-item>
          <el-collapse-item title="请求信息">
          <el-form-item label="url" label-width="100px">
            <el-input v-model="logInfo.caseUrl" readonly size="mini"></el-input>
          </el-form-item>          
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="headers" label-width="100px">
              <el-input v-model="logInfo.requestHeaders" readonly size="mini"  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button @click="showRawRequestHeaders" type="primary" icon="el-icon-thumb" size="mini" circle></el-button>
            </el-col>
          </el-row>  
          <el-row :gutter="25" v-if=isShowRawRequestHeaders>
            <el-col :span="22">
            <el-form-item label="rawHeaders" label-width="100px">
              <el-input v-model="logInfo.rawRequestHeaders" readonly size="mini"  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
          </el-row> 
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="params" label-width="100px">
              <el-input v-model="logInfo.requestParams" readonly  type="textarea" size="mini" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button @click="showRawRequestParams" type="primary" icon="el-icon-thumb" size="mini" circle></el-button>
            </el-col>
          </el-row>  
          <el-row :gutter="25" v-if=isShowRawRequestParams>
            <el-col :span="22">
            <el-form-item label="rawParams" label-width="100px">
              <el-input v-model="logInfo.rawRequestParams" readonly size="mini"  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
          </el-row> 
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="data" label-width="100px">
              <el-input v-model="logInfo.requestData" readonly  type="textarea" size="mini" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button @click="showRawRequestData" type="primary" icon="el-icon-thumb" size="mini" circle></el-button>
            </el-col>
          </el-row>  
          <el-row :gutter="25" v-if=isShowRawRequestData>
            <el-col :span="22">
            <el-form-item label="rawData" label-width="100px">
              <el-input v-model="logInfo.rawRequestData" readonly size="mini"  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
          </el-row> 
          <el-row :gutter="25">
            <el-col :span="22">
            <el-form-item label="json" label-width="100px">
              <el-input v-model="logInfo.requestJson" readonly size="mini"  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button @click="showRawRequestJson" type="primary" icon="el-icon-thumb" size="mini" circle></el-button>
            </el-col>
          </el-row>  
          <el-row :gutter="25" v-if=isShowRawRequestJson>
            <el-col :span="22">
            <el-form-item label="rawJson" label-width="100px">
              <el-input v-model="logInfo.rawRequestJson" readonly size="mini"  type="textarea" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
          </el-row> 
          </el-collapse-item>
          <el-collapse-item title="响应信息">
          <el-form-item label="code" label-width="100px">
            <el-input v-model="logInfo.responseCode" readonly  size='mini'></el-input>
          </el-form-item> 
          <el-row :gutter="25">
            <el-col :span="24">
            <el-form-item label="headers" label-width="100px">
              <el-input v-model="logInfo.responseHeaders" readonly  type="textarea" size="mini" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="2">
            </el-col>
          </el-row>
          <el-row :gutter="25">
            <el-col :span="24">
            <el-form-item label="body" label-width="100px">
              <el-input v-model="logInfo.responseBody" readonly  type="textarea" size="mini" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="2">
            </el-col>
          </el-row>       
          </el-collapse-item>
          <el-collapse-item title="断言信息">
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
            </el-table>
          </el-collapse-item>           
        </el-form>
      </el-collapse>  
      </el-dialog>

<!--执行近况-->
      <el-dialog title="执行近况" :visible.sync="lastTenLogVisible">
        <div class="block">
          <el-timeline v-if="lastTenLogList!=0">
            <el-timeline-item  v-for="log in lastTenLogList" :key="log.id" placement="top" :color="log.color">
              <el-card>
                <el-row>
                  <el-col :span="21">
                      <p>{{log.executer}} 执行于 {{log.createdTime}} 耗时 {{log.runTime}}</p>
                  </el-col>
                  <el-col :span="3">
                    <el-button 
                    v-has="'interface:case:logInfo'"
                    plain 
                    size="mini" 
                    @click="handleLogDetail(log.id)"
                    style="background-color: #FFFFFF; color: #324057; border:none;font-size: 14px;">详情
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-card v-else>
              <p align="center">暂无执行记录</p>
          </el-card>
        </div>
      </el-dialog>

<!-- 1111111111 -->
      <el-dialog title="编辑" :visible.sync="editDialogFormVisible" :close-on-click-modal="false">
        <el-form :model="dataInfo" ref="dataInfo">
        <el-collapse>

          <el-collapse-item title="前置用例">
                <el-button @click.prevent="addPreCase" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(preCaseItem, index) in preCaseList"
                    :index="index"
                    :key="index">
                <el-row :gutter="10">
                    <el-col :span="2">
                        <el-input v-model="preCaseItem.order" placeholder="排序" size="mini"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model="preCaseItem.preCaseId" placeholder="前置用例编号" disabled size="mini"></el-input>
                    </el-col>
                    <el-col :span="14">
                        <el-input v-model="preCaseItem.preCaseDesc" readonly placeholder="前置用例描述，请点击选择" @focus='handlePreCaseList(index)'  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-switch
                          v-model="preCaseItem.status"
                          :active-value=0
                          :inactive-value=1>
                        </el-switch>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removePreCase(preCaseItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>


        <el-collapse-item title="*基本信息">
          <el-form-item label="*项目名称" label-width="100px">
            <el-input readonly v-model="dataInfo.projectName" @focus='handleProjectModuleList' size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="*模块名称" label-width="100px">
            <el-input readonly v-model="dataInfo.moduleName" @focus='handleProjectModuleList' size="mini"  placeholder="请点击选择"></el-input>
          </el-form-item>
          <el-form-item label="*用例名称" label-width="100px">
            <el-input v-model="dataInfo.desc" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="接口文档地址" label-width="100px">
            <el-input v-model="dataInfo.doc" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*用例等级" label-width="100px">
            <el-select v-model="dataInfo.level" placeholder="请选择"  size="mini">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*创建人" label-width="100px">
            <el-input v-model="dataInfo.creater"  size="mini" disabled></el-input>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="*请求信息">
          <el-row :gutter="20">
          <el-col :span="4">
            <el-select v-model="dataInfo.method" placeholder="method"  size="mini" @change="handleChangeMethod">
              <el-option
                v-for="item in requestMethodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="20">
            <el-input v-model="dataInfo.url"  size="mini" placeholder="Enter request url"></el-input>
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
                        <el-input v-model="headerItem.name" placeholder="name" size='mini'></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="headerItem.value" placeholder="value" size='mini'></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeHeader(headerItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>
                <div v-if="headerTypeFlag==1">
                    <el-input v-model="dataAddHeadersStr" size="mini" type="textarea" :rows="6" placeholder="header json string"></el-input>
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
                        <el-input v-model="paramsItem.name" placeholder="name" size='mini'></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="paramsItem.value" placeholder="value" size='mini'></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeParams(paramsItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>
                <div v-if="paramsTypeFlag==1">
                    <el-input v-model="dataAddParamsStr" size="mini" type="textarea" :rows="6" placeholder="params json string"></el-input>
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
                        <el-input v-model="dataItem.name" placeholder="name" size='mini'></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="dataItem.value" placeholder="value" size='mini'></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeDataForm(dataItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>

                <div v-if="bodyTypeFlag==1">
                    <el-input v-model="dataAddFormStr" size="mini" type="textarea" :rows="6" placeholder="form-data json string"></el-input>
                </div>   
                <div v-if="bodyTypeFlag==2">
                    <el-input v-model="dataAddJsonStr" size="mini" type="textarea" :rows="6" placeholder="json string"></el-input>
                </div>   
                <div v-if="bodyTypeFlag==3">
                    <el-input v-model="dataAddFormRaw" size="mini" type="textarea" :rows="6" placeholder="form-data raw"></el-input>
                </div>   
            </el-tab-pane>
        </el-tabs>
      </el-collapse-item>


        <el-collapse-item title="请求参数缓存">
                <el-button @click.prevent="addPreProcessor" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(preProcessorItem, index) in preProcessorList"
                    :index="index"
                    :key="index">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-input v-model="preProcessorItem.name" placeholder="名称" size="mini" ></el-input>
                    </el-col>
                     <el-col :span="5">
                        <el-select v-model="preProcessorItem.type" size='mini'>
                          <el-option
                            v-for="item in preProcessorTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="6">
                        <el-input v-model="preProcessorItem.expression" placeholder="提取表达式"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-switch
                          v-model="preProcessorItem.haveDefaultValue"
                          :active-value=0
                          :inactive-value=1>
                        </el-switch>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="preProcessorItem.defaultValue" placeholder="默认值"  size="mini" v-if="preProcessorItem.haveDefaultValue==0"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removePreProcessor(preProcessorItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>


          </el-collapse-item>
          <el-collapse-item title="断言信息">
                <el-button @click.prevent="addAssert" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(assertItem, index) in assertList"
                    :index="index"
                    :key="index">
                <el-row :gutter="20">
                    <el-col :span="2">
                        <el-input v-model="assertItem.order" placeholder="排序" size="mini"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model="assertItem.assertName" placeholder="描述"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="3">
                        <el-select v-model="assertItem.type" size='mini'>
                          <el-option
                            v-for="item in assertTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="assertItem.expression" placeholder="提取表达式"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="3">
                        <el-select v-model="assertItem.operator" size='mini'>
                          <el-option
                            v-for="item in assertOperatorOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="assertItem.exceptedResult" placeholder="预期结果"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeAssert(assertItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>


        <el-collapse-item title="响应数据缓存">
                <el-button @click.prevent="addPostProcessor" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(postProcessorItem, index) in postProcessorList"
                    :index="index"
                    :key="index">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-input v-model="postProcessorItem.name" placeholder="名称" size="mini" ></el-input>
                    </el-col>
                     <el-col :span="5">
                        <el-select v-model="postProcessorItem.type" size='mini'>
                          <el-option
                            v-for="item in postProcessorTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="6">
                        <el-input v-model="postProcessorItem.expression" placeholder="提取表达式"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-switch
                          v-model="postProcessorItem.haveDefaultValue"
                          :active-value=0
                          :inactive-value=1>
                        </el-switch>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="postProcessorItem.defaultValue" placeholder="默认值"  size="mini" v-if="postProcessorItem.haveDefaultValue==0"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removePostProcessor(postProcessorItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>


      </el-collapse>
      </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogFormVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="handleEdit" size="mini">确 定</el-button>
        </div>
      </el-dialog>


      <el-dialog title="选择前置用例" :visible.sync="selectPreCaseDialogFormVisible" append-to-body>
        <el-form :inline="true" :model="preCaseQuery" class="demo-form-inline" ref="queryForm">
          <el-form-item label="项目名称">
            <el-input v-model="preCaseQuery.projectName" placeholder="项目名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="模块名称">
            <el-input v-model="preCaseQuery.moduleName" placeholder="项目名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="用例名称">
            <el-input v-model="preCaseQuery.desc" placeholder="用例名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" circle @click="selectPreCase" size="mini"></el-button>
            <el-button type="primary" icon="el-icon-refresh" circle @click="resetPreCaseQuery" size="mini"></el-button>
          </el-form-item>
        </el-form>
        <el-table 
        :data="preCaseTable" 
        stripe 
        highlight-current-row 
        @row-click="handleSelectPreCase"
        style="width: 100%">
          <el-table-column property="caseId" label="用例编号" min-width="10%" show-overflow-tooltip></el-table-column>
          <el-table-column property="projectName" label="项目名称" min-width="20%" show-overflow-tooltip></el-table-column>
          <el-table-column property="moduleName" label="模块名称" min-width="20%" show-overflow-tooltip></el-table-column>
          <el-table-column property="desc" label="用例名称" min-width="25%" show-overflow-tooltip></el-table-column>
          <el-table-column property="url" label="URL" min-width="25%" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="pagination" style="text-align: left;margin-top: 10px;">
          <el-pagination
            @size-change="handlePreCaseSizeChange"
            @current-change="handlePreCaseCurrentChange"
            :current-page="preCasePageNum"
            :page-sizes="[5, 10, 20]"
            :page-size="preCasePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="preCasePageTotal"
          ></el-pagination>
        </div>
      </el-dialog>




<!-- 222222222222222222222222222 -->
      <el-dialog title="复制" :visible.sync="copyDialogFormVisible" :close-on-click-modal="false">
        <el-form :model="dataInfo" ref="dataInfo">
        <el-collapse>

          <el-collapse-item title="前置用例">
                <el-button @click.prevent="addPreCase" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(preCaseItem, index) in preCaseList"
                    :index="index"
                    :key="index">
                <el-row :gutter="10">
                    <el-col :span="2">
                        <el-input v-model="preCaseItem.order" placeholder="排序" size="mini"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model="preCaseItem.preCaseId" placeholder="前置用例编号" disabled size="mini"></el-input>
                    </el-col>
                    <el-col :span="14">
                        <el-input v-model="preCaseItem.preCaseDesc" placeholder="前置用例描述,请点击选择" @focus='handlePreCaseList(index)' size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-switch
                          v-model="preCaseItem.status"
                          :active-value=0
                          :inactive-value=1>
                        </el-switch>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removePreCase(preCaseItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>

        <el-collapse-item title="*基本信息">
          <el-form-item label="*项目名称" label-width="100px">
            <el-input readonly v-model="dataInfo.projectName" @focus='handleProjectModuleList' size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item label="*模块名称" label-width="100px">
            <el-input readonly v-model="dataInfo.moduleName" @focus='handleProjectModuleList' size="mini" placeholder="请点击选择"></el-input>
          </el-form-item>
          <el-form-item label="*用例名称" label-width="100px">
            <el-input v-model="dataInfo.desc" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="接口文档地址" label-width="100px">
            <el-input v-model="dataInfo.doc" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*用例等级" label-width="100px">
            <el-select v-model="dataInfo.level" placeholder="请选择"  size="mini">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*创建人" label-width="100px">
            <el-input v-model="dataInfo.createrRealName"  size="mini" disabled></el-input>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="*请求信息">
          <el-row :gutter="20">
          <el-col :span="4">
            <el-select v-model="dataInfo.method" placeholder="method"  size="mini" @change="handleChangeMethod">
              <el-option
                v-for="item in requestMethodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="20">
            <el-input v-model="dataInfo.url"  size="mini" placeholder="Enter request url"></el-input>
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
                        <el-input v-model="headerItem.name" placeholder="name" size='mini'></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="headerItem.value" placeholder="value" size='mini'></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeHeader(headerItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>
                <div v-if="headerTypeFlag==1">
                    <el-input v-model="dataAddHeadersStr" size="mini" type="textarea" :rows="6" placeholder="header json string"></el-input>
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
                        <el-input v-model="paramsItem.name" placeholder="name" size='mini'></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="paramsItem.value" placeholder="value" size='mini'></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeParams(paramsItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>
                <div v-if="paramsTypeFlag==1">
                    <el-input v-model="dataAddParamsStr" size="mini" type="textarea" :rows="6" placeholder="params json string"></el-input>
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
                        <el-input v-model="dataItem.name" placeholder="name" size='mini'></el-input>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="dataItem.value" placeholder="value" size='mini'></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeDataForm(dataItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
                </div>

                <div v-if="bodyTypeFlag==1">
                    <el-input v-model="dataAddFormStr" size="mini" type="textarea" :rows="6" placeholder="form-data json string"></el-input>
                </div>   
                <div v-if="bodyTypeFlag==2">
                    <el-input v-model="dataAddJsonStr" size="mini" type="textarea" :rows="6" placeholder="json string"></el-input>
                </div>   
                <div v-if="bodyTypeFlag==3">
                    <el-input v-model="dataAddFormRaw" size="mini" type="textarea" :rows="6" placeholder="form-data raw"></el-input>
                </div>   
            </el-tab-pane>
        </el-tabs>
        </el-collapse-item>


        <el-collapse-item title="请求参数缓存">
                <el-button @click.prevent="addPostProcessor" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(preProcessorItem, index) in preProcessorList"
                    :index="index"
                    :key="index">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-input v-model="preProcessorItem.name" placeholder="名称" size="mini" ></el-input>
                    </el-col>
                     <el-col :span="5">
                        <el-select v-model="preProcessorItem.type" size='mini'>
                          <el-option
                            v-for="item in preProcessorTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="6">
                        <el-input v-model="preProcessorItem.expression" placeholder="提取表达式"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-switch
                          v-model="preProcessorItem.haveDefaultValue"
                          :active-value=0
                          :inactive-value=1>
                        </el-switch>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="preProcessorItem.defaultValue" placeholder="默认值"  size="mini" v-if="preProcessorItem.haveDefaultValue==0"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removePreProcessor(preProcessorItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>


          <el-collapse-item title="断言信息">
                <el-button @click.prevent="addAssert" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(assertItem, index) in assertList"
                    :index="index"
                    :key="index">
                <el-row :gutter="20">
                    <el-col :span="2">
                        <el-input v-model="assertItem.order" placeholder="排序" size="mini"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model="assertItem.assertName" placeholder="描述"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="3">
                        <el-select v-model="assertItem.type" size='mini'>
                          <el-option
                            v-for="item in assertTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="assertItem.expression" placeholder="提取表达式"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="3">
                        <el-select v-model="assertItem.operator" size='mini'>
                          <el-option
                            v-for="item in assertOperatorOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="assertItem.exceptedResult" placeholder="预期结果"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removeAssert(assertItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>


        <el-collapse-item title="响应数据缓存">
                <el-button @click.prevent="addPostProcessor" icon="el-icon-circle-plus-outline" circle type="primary" size="mini"></el-button>
                <el-form-item
                    v-for="(postProcessorItem, index) in postProcessorList"
                    :index="index"
                    :key="index">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-input v-model="postProcessorItem.name" placeholder="名称" size="mini" ></el-input>
                    </el-col>
                     <el-col :span="5">
                        <el-select v-model="postProcessorItem.type" size='mini'>
                          <el-option
                            v-for="item in postProcessorTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="6">
                        <el-input v-model="postProcessorItem.expression" placeholder="提取表达式"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-switch
                          v-model="postProcessorItem.haveDefaultValue"
                          :active-value=0
                          :inactive-value=1>
                        </el-switch>
                    </el-col> 
                    <el-col :span="5">
                        <el-input v-model="postProcessorItem.defaultValue" placeholder="默认值"  size="mini" v-if="postProcessorItem.haveDefaultValue==0"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removePostProcessor(postProcessorItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </el-col>
                </el-row> 
                </el-form-item>
          </el-collapse-item>


      </el-collapse>
      </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="copyDialogFormVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="handleCopy" size="mini">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { baseUrl } from '../config/env';
import {findInterfaceCaseExecuteLog, findInterfaceCaseExecuteLogList, findInterfaceCaseSuiteAll, downloadTemplate, findProjectModuleList, listInterfaceCase,saveInterfaceCase,modifyInterfaceCase,removeInterfaceCase,findInterfaceCaseByCaseId,executeInterfaceCase } from "@/api/getData";
export default {
  data() {
    return {

      dataImport:{
        type: 1,
      },
      suiteOptions: [],

      importHeader: {
        Token: "",
      },
      importUrl: baseUrl + "/interface/case/import",
      downloadUrl: baseUrl + "/interface/template/download/",

      importDialogFormVisible: false,
      importTypeOptions: [
        {
          value: 1,
          label: "excel",
        },
        {
          value: 2,
          label: "csv",
        },
        {
          value: 3,
          label: "json",
        },
        {
          value: 4,
          label: "yaml",
        },
      ],

      caseGenerator:{
        type: 1,
      },
      generatorUrl: baseUrl + "/interface/case/generator",
      generatorDialogFormVisible: false,

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
          label: "PATCH",
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
      addDialogFormVisible: false,


      projectModuleQuery: {},
      projectModuleTable: [],
      projectModulePageSize: 5,
      projectModulePageNum: 1,
      projectModulePageTotal: 0,
      selectProjectModuleDialogFormVisible: false,

      preCaseQuery: {},
      preCaseTable: [],
      preCasePageSize: 5,
      preCasePageNum: 1,
      preCasePageTotal: 0,
      selectPreCaseDialogFormVisible: false,
      // 用来确定选择前置用例后填充至哪个数组
      preCaseIndex:null,

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

      assertList:[],
      assertIndex:0,
      assertOperatorOptions: [
        {
          value: 0,
          label: "=",
        },
        {
          value: 1,
          label: "<",
        },
        {
          value: 2,
          label: ">",
        },
        {
          value: 3,
          label: "<=",
        },
        {
          value: 4,
          label: ">=",
        },
        {
          value: 5,
          label: "in",
        },
        {
          value: 6,
          label: "!=",
        },
        {
          value: 7,
          label: "re",
        }, 
        {
          value: 8,
          label: "isNull",
        },   
        {
          value: 9,
          label: "notNull",
        },          
      ],
    assertTypeOptions: [
        {
          value: 0,
          label: "json",
        },
        {
          value: 1,
          label: "html",
        },
        {
          value: 2,
          label: "header",
        },
        {
          value: 3,
          label: "code",
        },
        {
          value: 4,
          label: "time(ms)",
        },
    ],

    preProcessorList:[],
    preProcessorTypeOptions: [
        {
          value: 3,
          label: "header",
        },
        {
          value: 4,
          label: "params",
        },
        {
          value: 5,
          label: "data",
        },
        {
          value: 6,
          label: "json",
        },
    ],
    postProcessorList:[],
    postProcessorTypeOptions: [
        {
          value: 0,
          label: "json",
        },
        {
          value: 1,
          label: "html",
        },
        {
          value: 2,
          label: "header",
        },
    ],

    preCaseList: [], 

    dataInfo: {},
    editDialogFormVisible: false,
    copyDialogFormVisible: false,


    // 近10次执行记录
    lastTenLogList: [],
    lastTenLogVisible: false,

    // 日志相关属性
    logInfo: {},
    logDetailDialogFormVisible: false,
    isShowRawExceptedResult: false,
    isShowRawRequestHeaders: false,
    isShowRawRequestParams: false,
    isShowRawRequestData: false,
    isShowRawRequestJson: false,
    assertInfo: [],
    };
  },
  components: {
    headTop,
  },
  mounted() {
    this.selectInterfaceCase(this.queryForm);
    this.initToken();
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
    addAssert() {
    this.assertList.push({
        assertName: '',
        type: 0,
        expression: '',
        operator: 0,
        exceptedResult: '',
        order:this.assertIndex++
    });
    },
    addPreCase() {
    this.preCaseList.push({
        order: 1,
        preCaseId: null,
        preCaseDesc: '',
        status: 0,
    });
    },
    removePreCase(item) {
      var index = this.preCaseList.indexOf(item)
      this.preCaseList.splice(index, 1)
    },
    removeAssert(item) {
    var index = this.assertList.indexOf(item)
    let maxIndex = 0
    let assertInfo = []
    if (index !== -1) {
        this.assertList.splice(index, 1)
        this.assertIndex -- 
    }
    this.assertList.forEach(element => {
      if (this.assertIndex < element.order) {
        element.order --
      }
      maxIndex = element.order
      assertInfo.push(element)
      this.assertIndex = maxIndex + 1
      this.assertList = assertInfo
    });
    },

    addPostProcessor() {
      this.postProcessorList.push({
          name: null,
          type: null,
          expression: null,
          defaultValue: null,
          haveDefaultValue: 1,
      });
    },
    removePostProcessor(item) {
      var index = this.postProcessorList.indexOf(item)
      this.postProcessorList.splice(index, 1)
    },

    addPreProcessor() {
      this.preProcessorList.push({
          name: null,
          type: null,
          expression: null,
          defaultValue: null,
          haveDefaultValue: 1,
      });
    },
    removePreProcessor(item) {
      var index = this.preProcessorList.indexOf(item)
      this.preProcessorList.splice(index, 1)
    },

    async importInterfaceCase(formdata) {
      let data = {
        type: 1,
      }
      const res = await importInterfaceCase(data, formdata)
    },

    async selectInterfaceCase(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      const res = await listInterfaceCase(queryForm);
      if (res.code == 200) {
        this.dataList = [];
        this.total = res.data.total;
        res.data.list.forEach((element) => {
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
            element.method = "PATCH";
          } else if (element.method == 3) {
            element.methodStyle = "";
            element.method = "PUT";
          } else if (element.method == 4) {
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
        if(method == 0) { // get
            this.showParams = true
            this.showData = false
            this.showJson = false
            this.dataAdd.data = null
            this.dataSwitch = false
            this.jsonSwitch = false
        } else if (method == 1) { //post
            this.showParams = true
            this.showData = true
            this.showJson = true            
        } else if (method == 2) { //patch
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
            if (res.msg === '执行失败') {
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
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
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
      })  
    }, 
    
    async handleAdd(){
        let method = this.dataAdd.method
        let headers = {}
        let params = {}
        let data = {}
        let json = {}
        // 对请求头进行处理  headerTypeFlag 0:key-value 1:object
        if (this.headerTypeFlag == 0) {
            this.dataAddHeaders.forEach(element => {
                headers[element.name] = element.value
            });
            let headerStr = JSON.stringify(headers)
            if (headerStr == '{}' || headerStr == '') {
              this.dataAdd.headers = ''
            } else {
              this.dataAdd.headers = headerStr
            }

        } else {
            headers = this.dataAddHeadersStr
            if (headers == '{}' || headers == '') {
              this.dataAdd.headers = headers
            } else {
              this.dataAdd.headers = headers
            }
        }
        // 对params 统一处理 所有请求都可能存在params
        if (this.paramsTypeFlag == 0) { // 对params进行处理 paramsTypeFlag 0:key-value 1:object
            this.dataAddParams.forEach(element => {
                params[element.name] = element.value
            });
            let paramsStr = JSON.stringify(params)
            if (paramsStr == '{}' || paramsStr == '') {
              this.dataAdd.params = ''
            } else {
              this.dataAdd.params = paramsStr
            }
        } else {
            params = this.dataAddParamsStr
            if (params == '{}' || params == '') {
              this.dataAdd.params = params
            } else {
              this.dataAdd.params = params
            }
        }
        if (method != 0) { //非get请求目前统一考虑成为post请求
            if (this.bodyTypeFlag == 0) { // 对body进行处理 0:form-data  1:form-raw 2:json 3：key=value&key=value格式
                this.dataAddFormData.forEach(element => {
                    data[element.name] = element.value
                });
                this.dataAdd.json = null
                let dataStr = JSON.stringify(data)
                if (dataStr == '{}' || dataStr == '') {
                  this.dataAdd.data = ''
                } else {
                  this.dataAdd.data = dataStr
                }
            } else if (this.bodyTypeFlag == 1) {
                this.dataAdd.json = null
                this.dataAdd.data = this.dataAddFormStr
            } else if (this.bodyTypeFlag == 2) {
                this.dataAdd.data = null
                this.dataAdd.json = this.dataAddJsonStr
            } else {
                this.dataAdd.json = null
                let kv = this.dataAddFormRaw.split("&")
                kv.forEach(item => {
                    let keyValue = item.split("=")
                    data[keyValue[0]] = keyValue[1]
                });
                let dataStr = JSON.stringify(data)
                if (dataStr == '{}' || dataStr == '') {
                  this.dataAdd.data = ''
                } else {
                  this.dataAdd.data = dataStr
                }
            }
        } 
        // 添加断言
        this.dataAdd.asserts = this.assertList
        this.dataAdd.preCases = this.preCaseList
        // 添加后置处理器
        this.dataAdd.postProcessors = this.preProcessorList.concat(this.postProcessorList)
        const res = await saveInterfaceCase(this.dataAdd)
        if (res.code == 200 ) {
            this.addDialogFormVisible = false
            this.selectInterfaceCase({})
            this.$message({
              type: "success",
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
    },  
    async handleEdit() {
        let method = this.dataInfo.method
        let headers = {}
        let params = {}
        let data = {}
        let json = {}
        // 对请求头进行处理  headerTypeFlag 0:key-value 1:object
        if (this.headerTypeFlag == 0) {
            this.dataAddHeaders.forEach(element => {
                headers[element.name] = element.value
            });
            let headerStr = JSON.stringify(headers)
            if (headerStr == '{}' || headerStr == '') {
              this.dataInfo.headers = ''
            } else {
              this.dataInfo.headers = headerStr
            }
        } else {
            headers = this.dataAddHeadersStr
            if (headers == '{}' || headers == '') {
              this.dataInfo.headers = headers
            } else {
              this.dataInfo.headers = headers
            }
        }
        // 对params 统一处理 所有请求都可能存在params
        if (this.paramsTypeFlag == 0) { // 对params进行处理 paramsTypeFlag 0:key-value 1:object
            this.dataAddParams.forEach(element => {
                params[element.name] = element.value
            });
            let paramsStr = JSON.stringify(params)
            if (paramsStr == '{}' || paramsStr == '') {
              this.dataInfo.params = ''
            } else {
              this.dataInfo.params = paramsStr
            }
        } else {
            params = this.dataAddParamsStr
            if (params == '{}' || params == '') {
              this.dataInfo.params = params
            } else {
              this.dataInfo.params = params
            }
        }
        if (method != 0) { //非get请求目前统一考虑成为post请求
            if (this.bodyTypeFlag == 0) { // 对body进行处理 0:form-data  1:form-raw 2:json 3：key=value&key=value格式
                this.dataAddFormData.forEach(element => {
                    data[element.name] = element.value
                });
                this.dataInfo.json = null
                let dataStr = JSON.stringify(data)
                if (dataStr == '{}' || dataStr == '') {
                  this.dataInfo.data = ''
                } else {
                  this.dataInfo.data = dataStr
                }
            } else if (this.bodyTypeFlag == 1) {
                this.dataInfo.json = null
                this.dataInfo.data = this.dataAddFormStr
            } else if (this.bodyTypeFlag == 2) {
                this.dataInfo.data = null
                this.dataInfo.json = this.dataAddJsonStr
            } else {
                this.dataInfo.json = null
                let kv = this.dataAddFormRaw.split("&")
                kv.forEach(item => {
                    let keyValue = item.split("=")
                    data[keyValue[0]] = keyValue[1]
                });
                let dataStr = JSON.stringify(data)
                if (dataStr == '{}' || dataStr == '') {
                  this.dataInfo.data = ''
                } else {
                  this.dataInfo.data = dataStr
                }
            }
        } 
        this.dataInfo.asserts = this.assertList
        this.dataInfo.preCases = this.preCaseList
        this.dataInfo.postProcessors = this.preProcessorList.concat(this.postProcessorList)
        const res = await modifyInterfaceCase(this.dataInfo)
        if (res.code == 200 ) {
            this.editDialogFormVisible = false
            this.selectInterfaceCase({})
            this.$message({
              type: "success",
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
    }, 

    async handleCopy() {
        let method = this.dataInfo.method
        let headers = {}
        let params = {}
        let data = {}
        let json = {}
        // 对请求头进行处理  headerTypeFlag 0:key-value 1:object
        if (this.headerTypeFlag == 0) {
            this.dataAddHeaders.forEach(element => {
                headers[element.name] = element.value
            });
            let headerStr = JSON.stringify(headers)
            if (headerStr == '{}' || headerStr == '') {
              this.dataInfo.headers = ''
            } else {
              this.dataInfo.headers = headerStr
            }
        } else {
            headers = this.dataAddHeadersStr
            if (headers == '{}' || headers == '') {
              this.dataInfo.headers = headers
            } else {
              this.dataInfo.headers = headers
            }
        }
        // 对params 统一处理 所有请求都可能存在params
        if (this.paramsTypeFlag == 0) { // 对params进行处理 paramsTypeFlag 0:key-value 1:object
            this.dataAddParams.forEach(element => {
                params[element.name] = element.value
            });
            let paramsStr = JSON.stringify(params)
            if (paramsStr == '{}' || paramsStr == '') {
              this.dataInfo.params = ''
            } else {
              this.dataInfo.params = paramsStr
            }
        } else {
            params = this.dataAddParamsStr
            if (params == '{}' || params == '') {
              this.dataInfo.params = params
            } else {
              this.dataInfo.params = params
            }
        }
        if (method != 0) { //非get请求目前统一考虑成为post请求
            if (this.bodyTypeFlag == 0) { // 对body进行处理 0:form-data  1:form-raw 2:json 3：key=value&key=value格式
                this.dataAddFormData.forEach(element => {
                    data[element.name] = element.value
                });
                this.dataInfo.json = null
                let dataStr = JSON.stringify(data)
                if (dataStr == '{}' || dataStr == '') {
                  this.dataInfo.data = ''
                } else {
                  this.dataInfo.data = dataStr
                }
            } else if (this.bodyTypeFlag == 1) {
                this.dataInfo.json = null
                this.dataInfo.data = this.dataAddFormStr
            } else if (this.bodyTypeFlag == 2) {
                this.dataInfo.data = null
                this.dataInfo.json = this.dataAddJsonStr
            } else {
                this.dataInfo.json = null
                let kv = this.dataAddFormRaw.split("&")
                kv.forEach(item => {
                    let keyValue = item.split("=")
                    data[keyValue[0]] = keyValue[1]
                });
                let dataStr = JSON.stringify(data)
                if (dataStr == '{}' || dataStr == '') {
                  this.dataInfo.data = ''
                } else {
                  this.dataInfo.data = dataStr
                }
            }
        } 
        this.dataInfo.asserts = this.assertList
        this.dataInfo.preCases = this.preCaseList
        this.dataInfo.postProcessors = this.preProcessorList.concat(this.postProcessorList)
        const res = await saveInterfaceCase(this.dataInfo)
        if (res.code == 200 ) {
            this.copyDialogFormVisible = false
            this.selectInterfaceCase({})
            this.$message({
              type: "success",
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
    async openImport() {
      this.importDialogFormVisible = true;
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.dataAdd.creater = userInfo.realName
      this.dataAdd.createrRealName = userInfo.realName
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

      // 初始化断言
      this.assertList = []
      this.assertIndex = 0
      // 初始化后置处理器
      this.preProcessorList = []
      // 初始化后置处理器
      this.postProcessorList = []
      // 初始化前置用例列表
      this.preCaseList = []
    },
    async openEdit(row) {
      let caseId = row.caseId
      let projectName = row.projectName
      let moduleName = row.moduleName
      const res = await findInterfaceCaseByCaseId(caseId)
      if (res.code == 200) {
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

        this.editDialogFormVisible = true;
        this.dataInfo = res.data
        this.dataInfo.projectName = projectName
        this.dataInfo.moduleName = moduleName
        // 获取请求头
        this.headerTypeFlag = 1
        this.dataAddHeadersStr = res.data.headers
        // 获取params
        this.paramsTypeFlag = 1
        this.dataAddParamsStr = res.data.params
        // 是json还是data
        if (res.method != 0) { // get不用考虑
          if (res.data.data != null) {
            this.bodyTypeFlag = 1
            this.dataAddFormStr = res.data.data
          } else if (res.data.json != null) {
            this.bodyTypeFlag = 2
            this.dataAddJsonStr = res.data.json
          } else {
            this.bodyTypeFlag = 1
            this.dataAddFormData = res.data.data
          }
        }
        this.assertList = res.data.asserts
        this.preCaseList = res.data.preCases
        if (res.data.asserts.length != 0) {
            this.assertIndex = this.assertList[this.assertList.length-1].order + 1
        } else {
            this.assertIndex = 1
        }
        
        this.preProcessorList = []
        this.postProcessorList = []
        res.data.postProcessors.forEach(element => {
          if (element.type <= 2) {
            this.postProcessorList.push(element)
          } else {
            this.preProcessorList.push(element)
          }
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });       
      }
    },

    async openCopy(row) {
      let caseId = row.caseId
      let projectName = row.projectName
      let moduleName = row.moduleName
      const res = await findInterfaceCaseByCaseId(caseId)
      if (res.code == 200) {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        res.data.creater = userInfo.realName
        res.data.createrRealName = userInfo.realName
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

        this.copyDialogFormVisible = true;
        this.dataInfo = res.data
        this.dataInfo.projectName = projectName
        this.dataInfo.moduleName = moduleName
        // 获取请求头
        this.headerTypeFlag = 1
        this.dataAddHeadersStr = res.data.headers
        // 获取params
        this.paramsTypeFlag = 1
        this.dataAddParamsStr = res.data.params
        // 是json还是data
        if (res.method != 0) { // get不用考虑
          if (res.data.data != null) {
            this.bodyTypeFlag = 1
            this.dataAddFormStr = res.data.data
          } else if (res.data.json != null) {
            this.bodyTypeFlag = 2
            this.dataAddJsonStr = res.data.json
          } else {
            this.bodyTypeFlag = 1
            this.dataAddFormData = res.data.data
          }
        }
        this.assertList = res.data.asserts
        this.preCaseList = res.data.preCases
        if (res.data.asserts.length != 0) {
            this.assertIndex = this.assertList[this.assertList.length-1].order + 1
        } else {
            this.assertIndex = 1
        }

        this.preProcessorList = []
        this.postProcessorList = []
        res.data.postProcessors.forEach(element => {
          if (element.type <= 2) {
            this.postProcessorList.push(element)
          } else {
            this.preProcessorList.push(element)
          }
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });       
      }
    },

    async handleProjectModuleList() {
      this.projectModulePageSize = 5
      this.projectModulePageNum = 1
      this.projectModuleQuery = {}
      this.selectProjetModule()
      this.selectProjectModuleDialogFormVisible = true
    },
    async resetProjectModuleQuery() {
      this.projectModulePageSize = 5
      this.projectModulePageNum = 1
      this.projectModuleQuery = {}
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
           if (this.dataAddFormData == null) {
             this.dataAddFormData = []
           }
           this.dataAddFormStr = ""
           this.dataAddJsonStr = ""
           this.dataAddFormRaw = ""
        } else if (this.bodyTypeFlag == 1) {
           this.dataAddFormData = []
           this.dataAddJsonStr = ""
           this.dataAddFormStr = ""
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
    // 前置用例
    async selectPreCase(preCaseQuery) {
      this.preCaseQuery['pageSize'] = this.preCasePageSize 
      this.preCaseQuery['pageNum'] = this.preCasePageNum 
      const res = await listInterfaceCase(this.preCaseQuery)
      if (res.code == 200) {
        this.preCaseTable = []
        this.preCasePageTotal = res.data.total
        this.preCaseTable = res.data.list
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }    
    }, 
    async handlePreCaseList(index) {
      this.preCaseIndex = index
      this.preCasePageSize = 5
      this.preCasePageNum = 1
      this.preCaseQuery = {}
      this.selectPreCase()
      this.selectPreCaseDialogFormVisible = true
    },
    async resetPreCaseQuery() {
      this.preCasePageSize = 5
      this.preCasePageNum = 1
      this.preCaseQuery = {}
      this.selectPreCase(this.preCaseQuery)
    },
    handlePreCaseSizeChange (pageSize) {
      this.preCasePageSize = pageSize;
      this.selectPreCase(this.preCaseQuery);
    },
    handlePreCaseCurrentChange(pageNum) {
      this.preCasePageNum = pageNum;
      this.selectPreCase(this.preCaseQuery);
    },
    async handleSelectPreCase(row){
      this.selectPreCaseDialogFormVisible = false
      this.preCaseList[this.preCaseIndex].preCaseId = row.caseId;
      this.preCaseList[this.preCaseIndex].preCaseDesc = row.desc;
    },
    // 初始化文件上传参数
    initToken() {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if (userInfo) {
        this.importHeader.Token = userInfo.token;
      }
    },
    // 文件上传失败回调
    handleUploadError(response, file, fileList) {
      this.$message({
        type: "error",
        center: true,
        message: "文件上传失败 " + response.msg
      });
      // 初始化
      this.dataImport = {
        type: 1
      }
      this.$refs.upload.clearFiles();
    },

    async selectSuiteList(){
      this.suiteOptions = []
      const res = await findInterfaceCaseSuiteAll({})
      if (res.code == 200) {
          let dataList = res.data
          dataList.forEach((item, index) => {
            this.suiteOptions.push({
                label: item.suiteName,
                value: item.suiteId,
                index: index
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

    async handleSelectSuite(suiteId) {
      this.dataImport['suiteId'] = suiteId;
    },  

    // 文件上传成功回调
    handleUploadSuccess(response, file, fileList) {
      if(response.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: "总记录数：" + response.data.total + " 成功数：" + response.data.success + " 失败数：" + response.data.failed
        });
        this.importDialogFormVisible = false
        // 初始化
        this.dataImport = {
          type: 1
        }
        // 刷新列表
        this.selectInterfaceCase({})
      } else {
        this.$message({
          type: "error",
          center: true,
          message: response.msg
        });
      }
      this.$refs.upload.clearFiles();
    },
    // 关闭导入框回调
    closeImportDialog() {
      this.$refs.upload.clearFiles();
    },
    // 手动上传
    handleImport(){
      this.$refs.upload.submit();
    },

// 上传用例约束，自动生成用例
// 文件上传失败回调
    handleGeneratorUploadError(response, file, fileList) {
      this.$message({
        type: "error",
        center: true,
        message: "文件上传失败"
      });
      // 初始化
      this.caseGenerator = {
        type: 1
      }
      this.$refs.uploadGenerator.clearFiles();
    },

    // 文件上传成功回调
    handleGeneratorUploadSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: response.msg
        });
        this.generatorDialogFormVisible = false
        // 初始化
        this.caseGenerator = {
          type: 1
        }
        this.$refs.uploadGenerator.clearFiles();

        /**
         * 将后端给的json写入文件
         */
        var data = JSON.stringify(response.data, null, '\t')
        //encodeURIComponent解决中文乱码
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(data);
        //通过创建a标签实现
        let link = document.createElement("a");
        link.href = uri;
        //对下载的文件命名
        link.download = response.data.length + "条生成结果.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        this.$message({
          type: "error",
          center: true,
          message: response.msg + ", 请检查约束文件"
        });
        this.$refs.uploadGenerator.clearFiles();
      }
    },
    // 关闭导入框回调
    closeGeneratorDialog() {
      this.$refs.uploadGenerator.clearFiles();
    },
    // 手动上传
    handleGenerator(){
      this.$refs.uploadGenerator.submit();
    },
    async openGenerator() {
      this.generatorDialogFormVisible = true;
    },

    // 查看近10次执行日志
    async handleLastTenLog(row) {
      this.lastTenLogList = [];
      let queryObject = {}
      queryObject["caseId"] = row.caseId;
      queryObject["pageNum"] = 1;
      queryObject["pageSize"] = 5;
      const res = await findInterfaceCaseExecuteLogList(queryObject);
      if (res.code == 200) {
        res.data.list.forEach(element => {
          if (element.status == 0) {
              element.color = "#67C23A";
          } else if (element.status == 1) {
              element.color = "#E6A23C";
          } else {
              element.color = "#F56C6C";
          }
          element.runTime = element.runTime + 'ms';
          this.lastTenLogList.push(element);
        });
      this.lastTenLogVisible = true
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    // 查看用例的日志
    async handleLogDetail(logId) {
      this.isShowRawExceptedResult = false
      this.isShowRawRequestHeaders = false
      this.isShowRawRequestParams = false
      this.isShowRawRequestData = false
      this.isShowRawRequestJson = false

      const res = await findInterfaceCaseExecuteLog(logId)
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
                assert.type = 'json'
            } else if (assert.type == 1) {
                assert.type = 'html'
            } else if (assert.type == 2) {
                assert.type = 'header'
            } else if (assert.type == 3) {
                assert.type = 'code'
            } else if (assert.type == 4) {
                assert.type = 'time(ms)'
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
            } else {
                assert.operator = 'unknow'
            }            
          });
          this.assertInfo = res.data.assertList
          this.logDetailDialogFormVisible = true
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
          this.logInfo = data
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
