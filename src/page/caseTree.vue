<template>
  <div class="fillcontain">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="30%" style="padding-right:20px">
        <el-input
          size="mini"
          style="padding-top:15px;border:0px;padding-left:10px"
          placeholder="输入关键字搜索"
          v-model="filterText"
        >
        </el-input>
        <div style="padding:10px">
                <el-button
                  v-has="'interface:case:add'"
                  type="primary"
                  size="mini"
                  @click="openAdd"
                  plain
                  >新增</el-button
                >
                <el-button
                  v-has="'interface:case:generate'"
                  type="primary"
                  size="mini"
                  @click="openGenerator"
                  plain
                  >生成</el-button
                >
                <el-button
                  v-has="'interface:case:import'"
                  type="primary"
                  size="mini"
                  @click="openImport"
                  plain
                  >导入</el-button
                >
                <el-button type="primary" size="mini" @click="handleTree" plain
                  >切换视图</el-button
                >
                </div>
        <el-tree
          :props="props"
          :load="loadNode"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          @node-click="clickNode"
          lazy
          :filter-node-method="filterNode"
          ref="tree"
        >
        </el-tree>
      </el-aside>

      <el-container>
        <el-main v-if="editDialogFormVisible">
          <div height=50%>
        <el-form :model="dataInfo" ref="dataInfo">
          <el-tabs v-model="defaultTab">
            <el-tab-pane label="前置用例" name="前置用例">
              <el-button
                @click.prevent="addPreCase"
                icon="el-icon-circle-plus-outline"
                circle
                type="primary"
                size="mini"
              ></el-button>
              <el-form-item
                v-for="(preCaseItem, index) in preCaseList"
                :index="index"
                :key="index"
              >
                <el-row :gutter="10">
                  <el-col :span="1">
                    <el-checkbox
                      v-model="preCaseItem.status"
                      :true-label="0"
                      :false-label="1"
                    ></el-checkbox>
                  </el-col>
                  <el-col :span="2">
                    <el-input
                      v-model="preCaseItem.order"
                      placeholder="排序"
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-input
                      v-model="preCaseItem.preCaseId"
                      placeholder="前置用例编号"
                      disabled
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="14">
                    <el-input
                      v-model="preCaseItem.preCaseDesc"
                      readonly
                      placeholder="请选择"
                      @focus="handlePreCaseList(index)"
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="1">
                    <el-button
                      @click.prevent="openViewProcessor(preCaseItem.preCaseId)"
                      type="primary"
                      icon="el-icon-more"
                      circle
                      size="mini"
                    ></el-button>
                  </el-col>
                  <el-col :span="1">
                    <el-button
                      @click.prevent="removePreCase(preCaseItem)"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                    ></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="基本信息" name="基本信息">
              <el-form-item label="*项目名称" label-width="100px">
                <el-input
                  readonly
                  v-model="dataInfo.projectName"
                  @focus="handleProjectModuleList"
                  size="mini"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="*模块名称" label-width="100px">
                <el-input
                  readonly
                  v-model="dataInfo.moduleName"
                  @focus="handleProjectModuleList"
                  size="mini"
                  placeholder="请点击选择"
                ></el-input>
              </el-form-item>
              <el-form-item label="*用例描述" label-width="100px">
                <el-input v-model="dataInfo.desc" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="接口文档地址" label-width="100px">
                <el-input v-model="dataInfo.doc" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="*用例等级" label-width="100px">
                <el-select
                  v-model="dataInfo.level"
                  placeholder="请选择"
                  size="mini"
                >
                  <el-option
                    v-for="item in levelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="*创建人" label-width="100px">
                <el-input
                  v-model="dataInfo.creater"
                  size="mini"
                  disabled
                ></el-input>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="请求信息" name="请求信息">
              <el-row :gutter="20">
                <el-col :span="4">
                  <el-select
                    v-model="dataInfo.method"
                    placeholder="Method"
                    size="mini"
                    @change="changeMethod"
                  >
                    <el-option
                      v-for="item in requestMethodOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="20">
                  <el-input
                    v-model="dataInfo.url"
                    size="mini"
                    placeholder="Enter request path"
                  ></el-input>
                </el-col>
              </el-row>

              <el-tabs>
                <el-tab-pane label="Headers">
                  <el-form-item
                    v-for="(headerItem, index) in dataAddHeaders"
                    :index="index"
                    :key="headerItem.key"
                  >
                    <el-row :gutter="10">
                      <el-col :span="1">
                        <el-checkbox v-model="headerItem.checked"></el-checkbox>
                      </el-col>
                      <el-col :span="5">
                        <el-input
                          v-model="headerItem.name"
                          placeholder="Key"
                          size="mini"
                          @blur="addHeader(headerItem)"
                        ></el-input>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-model="headerItem.value"
                          placeholder="Value"
                          size="mini"
                        ></el-input>
                      </el-col>
                      <el-col :span="6">
                        <el-input
                          v-model="headerItem.desc"
                          placeholder="Description"
                          size="mini"
                        ></el-input>
                      </el-col>
                      <el-col :span="2">
                        <el-button
                          @click.prevent="removeHeader(headerItem)"
                          type="danger"
                          icon="el-icon-delete"
                          circle
                          size="mini"
                        ></el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-tab-pane>

                <el-tab-pane label="Params">
                  <el-form-item
                    v-for="(paramsItem, index) in dataAddParams"
                    :index="index"
                    :key="index"
                  >
                    <el-row :gutter="10">
                      <el-col :span="1">
                        <el-checkbox v-model="paramsItem.checked"></el-checkbox>
                      </el-col>
                      <el-col :span="5">
                        <el-input
                          v-model="paramsItem.name"
                          placeholder="Key"
                          size="mini"
                          @blur="addParams(paramsItem)"
                        ></el-input>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-model="paramsItem.value"
                          placeholder="Value"
                          size="mini"
                        ></el-input>
                      </el-col>
                      <el-col :span="6">
                        <el-input
                          v-model="paramsItem.desc"
                          placeholder="Description"
                          size="mini"
                        ></el-input>
                      </el-col>
                      <el-col :span="2">
                        <el-button
                          @click.prevent="removeParams(paramsItem)"
                          type="danger"
                          icon="el-icon-delete"
                          circle
                          size="mini"
                        ></el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-tab-pane>

                <el-tab-pane label="Body">
                  <el-radio-group
                    v-model="dataInfo.bodyType"
                    @change="forceUpdate"
                  >
                    <el-radio :label="9">none</el-radio>
                    <el-radio :label="0">form-data</el-radio>
                    <el-radio :label="1">x-www-form-encoded</el-radio>
                    <el-radio :label="2">raw</el-radio>
                  </el-radio-group>
                  <el-select
                    v-model="dataInfo.rawType"
                    placeholder="请选择"
                    v-if="dataInfo.bodyType == 2"
                    size="mini"
                    style="width:10%"
                    @change="forceUpdate"
                  >
                    <el-option
                      v-for="item in rawTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <div v-if="dataInfo.bodyType == 0">
                    <el-form-item
                      v-for="(dataItem, index) in dataAddFormData"
                      :index="index"
                      :key="index"
                    >
                      <el-row :gutter="10">
                        <el-col :span="1">
                          <el-checkbox v-model="dataItem.checked"></el-checkbox>
                        </el-col>
                        <el-col :span="5">
                          <el-input
                            v-model="dataItem.name"
                            placeholder="Key"
                            size="mini"
                            @blur="addDataForm(dataItem)"
                          ></el-input>
                        </el-col>
                        <el-col :span="10">
                          <el-input
                            v-model="dataItem.value"
                            placeholder="Value"
                            size="mini"
                          ></el-input>
                        </el-col>
                        <el-col :span="6">
                          <el-input
                            v-model="dataItem.desc"
                            placeholder="Description"
                            size="mini"
                          ></el-input>
                        </el-col>
                        <el-col :span="2">
                          <el-button
                            @click.prevent="removeDataForm(dataItem)"
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            size="mini"
                          ></el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>
                  <div v-else-if="dataInfo.bodyType == 1">
                    <el-form-item
                      v-for="(dataItem, index) in dataAddFormDataEncoded"
                      :index="index"
                      :key="index"
                    >
                      <el-row :gutter="10">
                        <el-col :span="1">
                          <el-checkbox v-model="dataItem.checked"></el-checkbox>
                        </el-col>
                        <el-col :span="5">
                          <el-input
                            v-model="dataItem.name"
                            placeholder="Key"
                            size="mini"
                            @blur="addDataFormEncoded(dataItem)"
                          ></el-input>
                        </el-col>
                        <el-col :span="10">
                          <el-input
                            v-model="dataItem.value"
                            placeholder="Value"
                            size="mini"
                          ></el-input>
                        </el-col>
                        <el-col :span="6">
                          <el-input
                            v-model="dataItem.desc"
                            placeholder="Description"
                            size="mini"
                          ></el-input>
                        </el-col>
                        <el-col :span="2">
                          <el-button
                            @click.prevent="removeDataFormEncoded(dataItem)"
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            size="mini"
                          ></el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>
                  <div v-else-if="dataInfo.bodyType == 2">
                    <el-input
                      v-model="dataInfo.raw"
                      size="mini"
                      type="textarea"
                      :rows="6"
                      @input="forceUpdate"
                    ></el-input>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>

            <el-tab-pane label="请求参数缓存" name="请求参数缓存">
              <el-button
                @click.prevent="addPreProcessor"
                icon="el-icon-circle-plus-outline"
                circle
                type="primary"
                size="mini"
              ></el-button>
              <el-form-item
                v-for="(preProcessorItem, index) in preProcessorList"
                :index="index"
                :key="index"
              >
                <el-row :gutter="20">
                  <el-col :span="4">
                    <el-input
                      v-model="preProcessorItem.name"
                      placeholder="名称"
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="5">
                    <el-select v-model="preProcessorItem.type" size="mini">
                      <el-option
                        v-for="item in preProcessorTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="preProcessorItem.haveDefaultValue == 0 ? 6 : 10">
                    <el-input
                      v-model="preProcessorItem.expression"
                      placeholder="提取表达式"
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-input
                      v-model="preProcessorItem.defaultValue"
                      placeholder="默认值"
                      size="mini"
                      v-if="preProcessorItem.haveDefaultValue == 0"
                    ></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-switch
                      v-model="preProcessorItem.haveDefaultValue"
                      :active-value="0"
                      :inactive-value="1"
                    >
                    </el-switch>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      @click.prevent="removePreProcessor(preProcessorItem)"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                    ></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="断言信息" name="断言信息">
              <el-button
                @click.prevent="addAssert"
                icon="el-icon-circle-plus-outline"
                circle
                type="primary"
                size="mini"
              ></el-button>
              <el-form-item
                v-for="(assertItem, index) in assertList"
                :index="index"
                :key="index"
              >
                <el-row :gutter="20">
                  <el-col :span="2">
                    <el-input
                      v-model="assertItem.order"
                      placeholder="排序"
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-input
                      v-model="assertItem.assertName"
                      placeholder="描述"
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-select v-model="assertItem.type" size="mini">
                      <el-option
                        v-for="item in assertTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <el-input
                      v-model="assertItem.expression"
                      placeholder="提取表达式"
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-select v-model="assertItem.operator" size="mini">
                      <el-option
                        v-for="item in assertOperatorOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <el-input
                      v-model="assertItem.exceptedResult"
                      placeholder="预期结果"
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      @click.prevent="removeAssert(assertItem)"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                    ></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="响应数据缓存" name="响应数据缓存">
              <el-button
                @click.prevent="addPostProcessor"
                icon="el-icon-circle-plus-outline"
                circle
                type="primary"
                size="mini"
              ></el-button>
              <el-form-item
                v-for="(postProcessorItem, index) in postProcessorList"
                :index="index"
                :key="index"
              >
                <el-row :gutter="20">
                  <el-col :span="4">
                    <el-input
                      v-model="postProcessorItem.name"
                      placeholder="名称"
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="5">
                    <el-select v-model="postProcessorItem.type" size="mini">
                      <el-option
                        v-for="item in postProcessorTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="postProcessorItem.haveDefaultValue == 0 ? 6 : 10">
                    <el-input
                      v-model="postProcessorItem.expression"
                      placeholder="提取表达式"
                      size="mini"
                    ></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-input
                      v-model="postProcessorItem.defaultValue"
                      placeholder="默认值"
                      size="mini"
                      v-if="postProcessorItem.haveDefaultValue == 0"
                    ></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-switch
                      v-model="postProcessorItem.haveDefaultValue"
                      :active-value="0"
                      :inactive-value="1"
                    >
                    </el-switch>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      @click.prevent="removePostProcessor(postProcessorItem)"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                    ></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <div padding-top:100px>
          <el-button @click="editDialogFormVisible = false" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="handleEdit" size="mini"
            >确 定</el-button
          >
        </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { baseUrl } from "../config/env";
import {
  findInterfaceCaseExecuteLog,
  findInterfaceCaseExecuteLogList,
  findInterfaceCaseSuiteAll,
  downloadTemplate,
  findProjectModuleList,
  listInterfaceCase,
  saveInterfaceCase,
  modifyInterfaceCase,
  removeInterfaceCase,
  findInterfaceCaseByCaseId,
  caseTree,
  executeInterfaceCase
} from "@/api/getData";
export default {
  data() {
    return {
      defaultTab: "请求信息",

      dataImport: {
        type: 1
      },
      suiteOptions: [],

      importHeader: {
        Token: ""
      },
      importUrl: baseUrl + "/interface/case/import",
      downloadUrl: baseUrl + "/interface/template/download/",

      importDialogFormVisible: false,
      importTypeOptions: [
        {
          value: 5,
          label: "har"
        },
        {
          value: 3,
          label: "json"
        },
        {
          value: 4,
          label: "yaml"
        },
        {
          value: 1,
          label: "excel"
        },
        {
          value: 2,
          label: "csv"
        }
      ],

      caseGenerator: {
        genRule: 1,
        dataType: 2
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
          label: "GET"
        },
        {
          value: 1,
          label: "POST"
        },
        // 后端不支持此请求方式
        // {
        //   value: 2,
        //   label: "PATCH",
        // },
        {
          value: 3,
          label: "PUT"
        },
        {
          value: 4,
          label: "DELETE"
        },
        {
          value: 5,
          label: "HEAD"
        },
        {
          value: 6,
          label: "OPTIONS"
        },
        {
          value: 7,
          label: "TRACE"
        }
      ],
      levelOptions: [
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
      preCaseIndex: null,

      //header
      dataAddHeaders: [
        {
          checked: true,
          desc: null,
          name: null,
          value: null
        }
      ],

      //params
      dataAddParams: [
        {
          checked: true,
          desc: null,
          name: null,
          value: null
        }
      ],

      //form-data
      dataAddFormData: [
        {
          checked: true,
          desc: null,
          name: null,
          value: null
        }
      ],

      //form-data-Encoded
      dataAddFormDataEncoded: [
        {
          checked: true,
          desc: null,
          name: null,
          value: null
        }
      ],

      assertList: [],
      assertIndex: 0,
      assertOperatorOptions: [
        {
          value: 0,
          label: "="
        },
        {
          value: 1,
          label: "<"
        },
        {
          value: 2,
          label: ">"
        },
        {
          value: 3,
          label: "<="
        },
        {
          value: 4,
          label: ">="
        },
        {
          value: 5,
          label: "in"
        },
        {
          value: 6,
          label: "!="
        },
        {
          value: 7,
          label: "re"
        },
        {
          value: 8,
          label: "isNull"
        },
        {
          value: 9,
          label: "notNull"
        },
        {
          value: 10,
          label: "contains"
        }
      ],
      assertTypeOptions: [
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
        },
        {
          value: 3,
          label: "code"
        },
        {
          value: 4,
          label: "time(ms)"
        }
      ],

      preProcessorList: [],
      preProcessorTypeOptions: [
        {
          value: 3,
          label: "header"
        },
        {
          value: 4,
          label: "params"
        },
        {
          value: 5,
          label: "data"
        },
        {
          value: 6,
          label: "json"
        }
      ],
      postProcessorList: [],
      postProcessorTypeOptions: [
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
      ],

      rawTypeOptions: [
        {
          value: "Text",
          label: "Text"
        },
        {
          value: "JSON",
          label: "JSON"
        },
        {
          value: "HTML",
          label: "HTML"
        },
        {
          value: "XML",
          label: "XML"
        }
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
      isShowRawRequestBody: false,
      assertInfo: [],

      // 查看前置用例的处理器列表
      viewProcessorDialogFormVisible: false,
      // 前置用例处理器列表
      preCaseProcessorArray: [],
      // 树型数据
      props: {
        label: "label",
        children: "children",
        isLeaf: "leaf"
      },
      // 搜索框绑定值
      filterText: ""
    };
  },
  components: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.selectInterfaceCase(this.queryForm);
    this.initToken();
  },
  methods: {
    removeHeader(item) {
      if (this.dataAddHeaders.length == 1) {
        this.dataAddHeaders = [];
        this.dataAddHeaders.push({
          checked: true,
          desc: null,
          name: null,
          value: null
        });
      } else {
        var index = this.dataAddHeaders.indexOf(item);
        if (index !== -1) {
          this.dataAddHeaders.splice(index, 1);
        }
      }
    },
    addHeader(item) {
      var index = this.dataAddHeaders.indexOf(item);
      if (index == this.dataAddHeaders.length - 1) {
        this.dataAddHeaders.push({
          checked: true,
          desc: null,
          name: null,
          value: null
        });
      }
    },
    removeParams(item) {
      if (this.dataAddParams.length == 1) {
        this.dataAddParams = [];
        this.dataAddParams.push({
          checked: true,
          desc: null,
          name: null,
          value: null
        });
      } else {
        var index = this.dataAddParams.indexOf(item);
        if (index !== -1) {
          this.dataAddParams.splice(index, 1);
        }
      }
    },
    addParams(item) {
      var index = this.dataAddParams.indexOf(item);
      if (index == this.dataAddParams.length - 1) {
        this.dataAddParams.push({
          checked: true,
          desc: null,
          name: null,
          value: null
        });
      }
    },
    removeDataForm(item) {
      if (this.dataAddFormData.length == 1) {
        this.dataAddFormData = [];
        this.dataAddFormData.push({
          checked: true,
          desc: null,
          name: null,
          value: null
        });
      } else {
        var index = this.dataAddFormData.indexOf(item);
        if (index !== -1) {
          this.dataAddFormData.splice(index, 1);
        }
      }
    },
    addDataForm(item) {
      var index = this.dataAddFormData.indexOf(item);
      if (index == this.dataAddFormData.length - 1) {
        this.dataAddFormData.push({
          checked: true,
          desc: null,
          name: null,
          value: null
        });
      }
    },

    removeDataFormEncoded(item) {
      if (this.dataAddFormDataEncoded.length == 1) {
        this.dataAddFormDataEncoded = [];
        this.dataAddFormDataEncoded.push({
          checked: true,
          desc: null,
          name: null,
          value: null
        });
      } else {
        var index = this.dataAddFormDataEncoded.indexOf(item);
        if (index !== -1) {
          this.dataAddFormDataEncoded.splice(index, 1);
        }
      }
    },
    addDataFormEncoded(item) {
      var index = this.dataAddFormDataEncoded.indexOf(item);
      if (index == this.dataAddFormDataEncoded.length - 1) {
        this.dataAddFormDataEncoded.push({
          checked: true,
          desc: null,
          name: null,
          value: null
        });
      }
    },

    addAssert() {
      this.assertList.push({
        assertName: "",
        type: 0,
        expression: "",
        operator: 0,
        exceptedResult: "",
        order: this.assertIndex++
      });
    },
    addPreCase() {
      this.preCaseList.push({
        order: 1,
        preCaseId: null,
        preCaseDesc: "",
        status: 0
      });
    },
    removePreCase(item) {
      var index = this.preCaseList.indexOf(item);
      this.preCaseList.splice(index, 1);
    },
    removeAssert(item) {
      var index = this.assertList.indexOf(item);
      let maxIndex = 0;
      let assertInfo = [];
      if (index !== -1) {
        this.assertList.splice(index, 1);
        this.assertIndex--;
      }
      this.assertList.forEach(element => {
        if (this.assertIndex < element.order) {
          element.order--;
        }
        maxIndex = element.order;
        assertInfo.push(element);
        this.assertIndex = maxIndex + 1;
        this.assertList = assertInfo;
      });
    },

    addPostProcessor() {
      this.postProcessorList.push({
        name: null,
        type: null,
        expression: null,
        defaultValue: null,
        haveDefaultValue: 1
      });
    },
    removePostProcessor(item) {
      var index = this.postProcessorList.indexOf(item);
      this.postProcessorList.splice(index, 1);
    },

    addPreProcessor() {
      this.preProcessorList.push({
        name: null,
        type: null,
        expression: null,
        defaultValue: null,
        haveDefaultValue: 1
      });
    },
    removePreProcessor(item) {
      var index = this.preProcessorList.indexOf(item);
      this.preProcessorList.splice(index, 1);
    },

    async importInterfaceCase(formdata) {
      let data = {
        type: 1
      };
      const res = await importInterfaceCase(data, formdata);
    },

    async selectInterfaceCase(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      const res = await listInterfaceCase(queryForm);
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
          // 请求方式
          if (element.method == 0) {
            element.methodStyle = "warning";
            element.method = "GET";
          } else if (element.method == 1) {
            element.methodStyle = "warning";
            element.method = "POST";
          } else if (element.method == 2) {
            element.methodStyle = "warning";
            element.method = "PATCH";
          } else if (element.method == 3) {
            element.methodStyle = "warning";
            element.method = "PUT";
          } else if (element.method == 4) {
            element.methodStyle = "warning";
            element.method = "DELETE";
          } else if (element.method == 5) {
            element.methodStyle = "warning";
            element.method = "HEAD";
          } else if (element.method == 6) {
            element.methodStyle = "warning";
            element.method = "OPTIONS";
          } else if (element.method == 7) {
            element.methodStyle = "warning";
            element.method = "TRACE";
          } else {
            element.methodStyle = "warning";
            element.method = "UNKNOW";
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
    async handleCheck(caseId) {
      const res = await executeInterfaceCase(caseId);
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
    },
    async handleDelete(caseId, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await removeInterfaceCase(caseId);
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

    async handleAdd() {
      let method = this.dataAdd.method;
      let headers = {};
      let params = {};
      let formData = {};
      let formDataEncoded = {};
      // 处理header
      let headerStr = JSON.stringify(
        this.dataAddHeaders.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (headerStr == "[]" || headerStr == "") {
        this.dataAdd.headers = null;
      } else {
        this.dataAdd.headers = headerStr;
      }
      // 处理params
      let paramsStr = JSON.stringify(
        this.dataAddParams.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (paramsStr == "[]" || paramsStr == "") {
        this.dataAdd.params = null;
      } else {
        this.dataAdd.params = paramsStr;
      }
      // 处理form-data
      let dataStr = JSON.stringify(
        this.dataAddFormData.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (dataStr == "[]" || dataStr == "") {
        this.dataAdd.formData = null;
      } else {
        this.dataAdd.formData = dataStr;
      }
      // 处理x-www-form-encoded
      let dataEncodedStr = JSON.stringify(
        this.dataAddFormDataEncoded.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (dataEncodedStr == "[]" || dataEncodedStr == "") {
        this.dataAdd.formDataEncoded = null;
      } else {
        this.dataAdd.formDataEncoded = dataEncodedStr;
      }
      // raw无需特别处理

      // 添加断言
      this.dataAdd.asserts = this.assertList;
      this.dataAdd.preCases = this.preCaseList;
      // 添加后置处理器
      this.dataAdd.postProcessors = this.preProcessorList.concat(
        this.postProcessorList
      );
      const res = await saveInterfaceCase(this.dataAdd);
      if (res.code == 200) {
        this.addDialogFormVisible = false;
        this.selectInterfaceCase({});
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
    async handleEdit() {
      let method = this.dataInfo.method;
      let headers = {};
      let params = {};
      let formData = {};
      let formDataEncoded = {};

      // 处理header
      let headerStr = JSON.stringify(
        this.dataAddHeaders.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (headerStr == "[]" || headerStr == "") {
        this.dataInfo.headers = null;
      } else {
        this.dataInfo.headers = headerStr;
      }

      // 处理params
      let paramsStr = JSON.stringify(
        this.dataAddParams.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (paramsStr == "[]" || paramsStr == "") {
        this.dataInfo.params = null;
      } else {
        this.dataInfo.params = paramsStr;
      }

      // 处理form-data
      let dataStr = JSON.stringify(
        this.dataAddFormData.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (dataStr == "[]" || dataStr == "") {
        this.dataInfo.formData = null;
      } else {
        this.dataInfo.formData = dataStr;
      }

      // 处理x-www-form-encoded
      let dataEncodedStr = JSON.stringify(
        this.dataAddFormDataEncoded.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (dataEncodedStr == "[]" || dataEncodedStr == "") {
        this.dataInfo.formDataEncoded = null;
      } else {
        this.dataInfo.formDataEncoded = dataEncodedStr;
      }

      // raw无需特别处理

      this.dataInfo.asserts = this.assertList;
      this.dataInfo.preCases = this.preCaseList;
      this.dataInfo.postProcessors = this.preProcessorList.concat(
        this.postProcessorList
      );
      const res = await modifyInterfaceCase(this.dataInfo);
      if (res.code == 200) {
        this.editDialogFormVisible = false;
        this.selectInterfaceCase({});
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

    async handleCopy() {
      let method = this.dataInfo.method;
      let headers = {};
      let params = {};
      let formData = {};
      let formDataEncoded = {};

      // 处理header
      let headerStr = JSON.stringify(
        this.dataAddHeaders.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (headerStr == "[]" || headerStr == "") {
        this.dataInfo.headers = null;
      } else {
        this.dataInfo.headers = headerStr;
      }

      // 处理params
      let paramsStr = JSON.stringify(
        this.dataAddParams.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (paramsStr == "[]" || paramsStr == "") {
        this.dataInfo.params = null;
      } else {
        this.dataInfo.params = paramsStr;
      }

      // 处理form-data
      let dataStr = JSON.stringify(
        this.dataAddFormData.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (dataStr == "[]" || dataStr == "") {
        this.dataInfo.formData = null;
      } else {
        this.dataInfo.formData = dataStr;
      }

      // 处理x-www-form-encoded
      let dataEncodedStr = JSON.stringify(
        this.dataAddFormDataEncoded.filter(item => {
          return item.name != null && item.name != "";
        })
      );
      if (dataEncodedStr == "[]" || dataEncodedStr == "") {
        this.dataInfo.formDataEncoded = null;
      } else {
        this.dataInfo.formDataEncoded = dataEncodedStr;
      }

      // raw无需特别处理

      this.dataInfo.asserts = this.assertList;
      this.dataInfo.preCases = this.preCaseList;
      this.dataInfo.postProcessors = this.preProcessorList.concat(
        this.postProcessorList
      );
      const res = await saveInterfaceCase(this.dataInfo);
      if (res.code == 200) {
        this.copyDialogFormVisible = false;
        this.selectInterfaceCase({});
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

    async selectProjetModule() {
      this.projectModuleQuery["pageSize"] = this.projectModulePageSize;
      this.projectModuleQuery["pageNum"] = this.projectModulePageNum;
      const res = await findProjectModuleList(this.projectModuleQuery);
      if (res.code == 200) {
        this.projectModuleTable = [];
        this.projectModulePageTotal = res.data.total;
        this.projectModuleTable = res.data.list;
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
    handleProjectModuleSizeChange(pageSize) {
      this.projectModulePageSize = pageSize;
      this.selectProjetModule(this.projectModuleQuery);
    },
    handleProjectModuleCurrentChange(pageNum) {
      this.projectModulePageNum = pageNum;
      this.selectProjetModule(this.projectModuleQuery);
    },
    async handleSelectProjetModule(row) {
      this.selectProjectModuleDialogFormVisible = false;
      this.dataInfo.moduleId = row.moduleId;
      this.dataInfo.moduleName = row.moduleName;
      this.dataInfo.projectId = row.projectId;
      this.dataInfo.projectName = row.projectName;

      this.dataAdd.moduleId = row.moduleId;
      this.dataAdd.moduleName = row.moduleName;
      this.dataAdd.projectId = row.projectId;
      this.dataAdd.projectName = row.projectName;

      this.dataImport.moduleId = row.moduleId;
      this.dataImport.moduleName = row.moduleName;
      this.dataImport.projectId = row.projectId;
      this.dataImport.projectName = row.projectName;
    },
    async resetForm() {
      this.queryForm = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.selectInterfaceCase(this.queryForm);
    },
    async openImport() {
      this.importDialogFormVisible = true;
      this.dataImport = {};
      this.dataImport.type = 5;
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      this.dataAdd.creater = userInfo.realName;
      this.dataAdd.createrRealName = userInfo.realName;
      // 初始化header
      (this.dataAddHeaders = [
        {
          checked: true,
          desc: null,
          name: null,
          value: null
        }
      ]),
        // 初始化params
        (this.dataAddParams = [
          {
            checked: true,
            desc: null,
            name: null,
            value: null
          }
        ]),
        (this.dataAddFormData = [
          {
            checked: true,
            desc: null,
            name: null,
            value: null
          }
        ]),
        (this.dataAddFormDataEncoded = [
          {
            checked: true,
            desc: null,
            name: null,
            value: null
          }
        ]);

      // 初始化body
      this.dataAdd.bodyType = 9; // none
      this.dataAdd.rawType = null;
      this.dataAdd.raw = null;

      // 初始化断言
      this.assertList = [];
      this.assertIndex = 0;
      // 初始化后置处理器
      this.preProcessorList = [];
      // 初始化后置处理器
      this.postProcessorList = [];
      // 初始化前置用例列表
      this.preCaseList = [];
    },
    async openEdit(row) {
      let caseId = row.caseId;
      let projectName = row.projectName;
      let moduleName = row.moduleName;
      const res = await findInterfaceCaseByCaseId(caseId);
      if (res.code == 200) {
        // headers置空并处理
        this.dataAddHeaders = [];
        let headers = [];
        try {
          headers = JSON.parse(res.data.headers);
          if (headers == null) {
            headers = [];
          }
        } catch (error) {
          headers = [];
        }
        for (let key of headers) {
          this.dataAddHeaders.push({
            name: key["name"],
            value: key["value"],
            checked: key["checked"],
            desc: key["desc"]
          });
        }
        if (this.dataAddHeaders.length == 0) {
          this.dataAddHeaders.push({
            checked: true,
            desc: null,
            name: null,
            value: null
          });
        }
        this.dataAddHeadersStr = JSON.stringify(this.dataAddHeaders);

        // params置空并处理
        this.dataAddParams = [];
        let params = [];
        try {
          params = JSON.parse(res.data.params);
          if (params == null) {
            params = [];
          }
        } catch (error) {
          params = [];
        }
        for (let key of params) {
          this.dataAddParams.push({
            name: key["name"],
            value: key["value"],
            checked: key["checked"],
            desc: key["desc"]
          });
        }
        if (this.dataAddParams.length == 0) {
          this.dataAddParams.push({
            checked: true,
            desc: null,
            name: null,
            value: null
          });
        }
        this.dataAddParamsStr = JSON.stringify(this.dataAddParams);

        // data置空并处理
        this.dataAddFormData = [];
        let data = [];
        try {
          data = JSON.parse(res.data.formData);
          if (data == null) {
            data = [];
          }
        } catch (error) {
          data = [];
        }
        for (let key of data) {
          this.dataAddFormData.push({
            name: key["name"],
            value: key["value"],
            checked: key["checked"],
            desc: key["desc"]
          });
        }
        if (this.dataAddFormData.length == 0) {
          this.dataAddFormData.push({
            checked: true,
            desc: null,
            name: null,
            value: null
          });
        }
        this.dataAddFormStr = JSON.stringify(this.dataAddFormData);

        // dataEncoded置空并处理
        this.dataAddFormDataEncoded = [];
        let dataEncoded = [];
        try {
          dataEncoded = JSON.parse(res.data.formDataEncoded);
          if (dataEncoded == null) {
            dataEncoded = [];
          }
          if (dataEncoded == null) {
            dataEncoded = [];
          }
        } catch (error) {
          dataEncoded = [];
        }
        for (let key of dataEncoded) {
          this.dataAddFormDataEncoded.push({
            name: key["name"],
            value: key["value"],
            checked: key["checked"],
            desc: key["desc"]
          });
        }
        if (this.dataAddFormDataEncoded.length == 0) {
          this.dataAddFormDataEncoded.push({
            checked: true,
            desc: null,
            name: null,
            value: null
          });
        }
        this.dataAddFormEncodedStr = JSON.stringify(
          this.dataAddFormDataEncoded
        );

        // raw置空并处理

        this.editDialogFormVisible = true;
        this.dataInfo = res.data;
        this.dataInfo.projectName = projectName;
        this.dataInfo.moduleName = moduleName;

        this.assertList = res.data.asserts;
        this.preCaseList = res.data.preCases;
        if (res.data.asserts.length != 0) {
          this.assertIndex =
            this.assertList[this.assertList.length - 1].order + 1;
        } else {
          this.assertIndex = 1;
        }

        this.preProcessorList = [];
        this.postProcessorList = [];
        res.data.postProcessors.forEach(element => {
          if (element.type <= 2) {
            this.postProcessorList.push(element);
          } else {
            this.preProcessorList.push(element);
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
      let caseId = row.caseId;
      let projectName = row.projectName;
      let moduleName = row.moduleName;
      const res = await findInterfaceCaseByCaseId(caseId);
      if (res.code == 200) {
        let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        res.data.creater = userInfo.realName;
        res.data.createrRealName = userInfo.realName;

        // headers置空并处理
        this.dataAddHeaders = [];
        let headers = [];
        try {
          headers = JSON.parse(res.data.headers);
          if (headers == null) {
            headers = [];
          }
        } catch (error) {
          headers = [];
        }
        for (let key of headers) {
          this.dataAddHeaders.push({
            name: key["name"],
            value: key["value"],
            checked: key["checked"],
            desc: key["desc"]
          });
        }
        if (this.dataAddHeaders.length == 0) {
          this.dataAddHeaders.push({
            checked: true,
            desc: null,
            name: null,
            value: null
          });
        }
        this.dataAddHeadersStr = JSON.stringify(this.dataAddHeaders);

        // params置空并处理
        this.dataAddParams = [];
        let params = [];
        try {
          params = JSON.parse(res.data.params);
          if (params == null) {
            params = [];
          }
        } catch (error) {
          params = [];
        }
        for (let key of params) {
          this.dataAddParams.push({
            name: key["name"],
            value: key["value"],
            checked: key["checked"],
            desc: key["desc"]
          });
        }
        if (this.dataAddParams.length == 0) {
          this.dataAddParams.push({
            checked: true,
            desc: null,
            name: null,
            value: null
          });
        }
        this.dataAddParamsStr = JSON.stringify(this.dataAddParams);

        // data置空并处理
        this.dataAddFormData = [];
        let data = [];
        try {
          data = JSON.parse(res.data.formData);
          if (data == null) {
            data = [];
          }
        } catch (error) {
          data = [];
        }
        for (let key of data) {
          this.dataAddFormData.push({
            name: key["name"],
            value: key["value"],
            checked: key["checked"],
            desc: key["desc"]
          });
        }
        if (this.dataAddFormData.length == 0) {
          this.dataAddFormData.push({
            checked: true,
            desc: null,
            name: null,
            value: null
          });
        }
        this.dataAddFormStr = JSON.stringify(this.dataAddFormData);

        // dataEncoded置空并处理
        this.dataAddFormDataEncoded = [];
        let dataEncoded = [];
        try {
          dataEncoded = JSON.parse(res.data.formDataEncoded);
          if (dataEncoded == null) {
            dataEncoded = [];
          }
        } catch (error) {
          dataEncoded = [];
        }
        for (let key of dataEncoded) {
          this.dataAddFormDataEncoded.push({
            name: key["name"],
            value: key["value"],
            checked: key["checked"],
            desc: key["desc"]
          });
        }
        if (this.dataAddFormDataEncoded.length == 0) {
          this.dataAddFormDataEncoded.push({
            checked: true,
            desc: null,
            name: null,
            value: null
          });
        }
        this.dataAddFormEncodedStr = JSON.stringify(
          this.dataAddFormDataEncoded
        );

        // raw置空并处理

        this.copyDialogFormVisible = true;
        this.dataInfo = res.data;
        this.dataInfo.projectName = projectName;
        this.dataInfo.moduleName = moduleName;

        this.assertList = res.data.asserts;
        this.preCaseList = res.data.preCases;
        if (res.data.asserts.length != 0) {
          this.assertIndex =
            this.assertList[this.assertList.length - 1].order + 1;
        } else {
          this.assertIndex = 1;
        }

        this.preProcessorList = [];
        this.postProcessorList = [];
        res.data.postProcessors.forEach(element => {
          if (element.type <= 2) {
            this.postProcessorList.push(element);
          } else {
            this.preProcessorList.push(element);
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
      this.projectModulePageSize = 5;
      this.projectModulePageNum = 1;
      this.projectModuleQuery = {};
      this.selectProjetModule();
      this.selectProjectModuleDialogFormVisible = true;
    },
    async resetProjectModuleQuery() {
      this.projectModulePageSize = 5;
      this.projectModulePageNum = 1;
      this.projectModuleQuery = {};
      this.selectProjetModule(this.projectModuleQuery);
    },
    // 前置用例
    async selectPreCase(preCaseQuery) {
      this.preCaseQuery["pageSize"] = this.preCasePageSize;
      this.preCaseQuery["pageNum"] = this.preCasePageNum;
      const res = await listInterfaceCase(this.preCaseQuery);
      if (res.code == 200) {
        this.preCaseTable = [];
        this.preCasePageTotal = res.data.total;
        this.preCaseTable = res.data.list;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handlePreCaseList(index) {
      this.preCaseIndex = index;
      this.preCasePageSize = 5;
      this.preCasePageNum = 1;
      this.preCaseQuery = {};
      this.selectPreCase();
      this.selectPreCaseDialogFormVisible = true;
    },
    async resetPreCaseQuery() {
      this.preCasePageSize = 5;
      this.preCasePageNum = 1;
      this.preCaseQuery = {};
      this.selectPreCase(this.preCaseQuery);
    },
    handlePreCaseSizeChange(pageSize) {
      this.preCasePageSize = pageSize;
      this.selectPreCase(this.preCaseQuery);
    },
    handlePreCaseCurrentChange(pageNum) {
      this.preCasePageNum = pageNum;
      this.selectPreCase(this.preCaseQuery);
    },
    async handleSelectPreCase(row) {
      this.selectPreCaseDialogFormVisible = false;
      this.preCaseList[this.preCaseIndex].preCaseId = row.caseId;
      this.preCaseList[this.preCaseIndex].preCaseDesc = row.desc;
    },
    // 初始化文件上传参数
    initToken() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
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
      };
      this.$refs.upload.clearFiles();
    },

    async selectSuiteList() {
      this.suiteOptions = [];
      const res = await findInterfaceCaseSuiteAll({});
      if (res.code == 200) {
        let dataList = res.data;
        dataList.forEach((item, index) => {
          this.suiteOptions.push({
            label: item.suiteName,
            value: item.suiteId,
            index: index
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

    async handleSelectSuite(suiteId) {
      this.dataImport["suiteId"] = suiteId;
    },

    // 文件上传成功回调
    handleUploadSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message:
            "总记录数：" +
            response.data.total +
            " 成功数：" +
            response.data.success +
            " 失败数：" +
            response.data.failed
        });
        this.importDialogFormVisible = false;
        // 初始化
        this.dataImport = {
          type: 1
        };
        // 刷新列表
        this.selectInterfaceCase({});
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
    handleImport() {
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
        genRule: 1,
        dataType: 2
      };
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
        this.generatorDialogFormVisible = false;
        // 初始化
        this.caseGenerator = {
          genRule: 1,
          dataType: 2
        };
        this.$refs.uploadGenerator.clearFiles();

        /**
         * 将后端给的json写入文件
         */
        var data = JSON.stringify(response.data, null, "\t");
        //encodeURIComponent解决中文乱码
        let uri =
          "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(data);
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
    handleGenerator() {
      this.$refs.uploadGenerator.submit();
    },
    async openGenerator() {
      this.generatorDialogFormVisible = true;
    },

    // 查看近10次执行日志
    async handleLastTenLog(row) {
      this.lastTenLogList = [];
      let queryObject = {};
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
          element.runTime = element.runTime + "ms";
          this.lastTenLogList.push(element);
        });
        this.lastTenLogVisible = true;
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
      this.isShowRawExceptedResult = false;
      this.isShowRawRequestHeaders = false;
      this.isShowRawRequestParams = false;
      this.isShowRawRequestBody = false;

      const res = await findInterfaceCaseExecuteLog(logId);
      if (res.code == 200) {
        let data = res.data;
        res.data.assertList.forEach(assert => {
          // 断言执行状态
          if (assert.status == 0) {
            assert.assertStatusStyle = "success";
            assert.status = "成功";
          } else if (assert.status == 1) {
            assert.assertStatusStyle = "warning";
            assert.status = "失败";
          } else {
            assert.assertStatusStyle = "danger";
            assert.status = "错误";
          }
          // 断言提取方式
          if (assert.type == 0) {
            assert.type = "json";
          } else if (assert.type == 1) {
            assert.type = "html";
          } else if (assert.type == 2) {
            assert.type = "header";
          } else if (assert.type == 3) {
            assert.type = "code";
          } else if (assert.type == 4) {
            assert.type = "time(ms)";
          } else {
            assert.type = "unknow";
          }
          // 操作符
          // 操作符0/=、1/< 、2/>、3/<=、4/>=、5/in、6/!=、7/re
          if (assert.operator == 0) {
            assert.operator = "=";
          } else if (assert.operator == 1) {
            assert.operator = "<";
          } else if (assert.operator == 2) {
            assert.operator = ">";
          } else if (assert.operator == 3) {
            assert.operator = "<=";
          } else if (assert.operator == 4) {
            assert.operator = ">=";
          } else if (assert.operator == 5) {
            assert.operator = "in";
          } else if (assert.operator == 6) {
            assert.operator = "!=";
          } else if (assert.operator == 7) {
            assert.operator = "re";
          } else if (assert.operator == 8) {
            assert.operator = "isNull";
          } else if (assert.operator == 9) {
            assert.operator = "notNull";
          } else if (assert.operator == 10) {
            assert.operator = "contains";
          } else {
            assert.operator = "unknow";
          }
        });
        this.assertInfo = res.data.assertList;
        this.logDetailDialogFormVisible = true;
        if (data.status == 0) {
          data.status = "成功";
          data.statusStyle = "success";
        } else if (data.status == 1) {
          data.status = "失败";
          data.statusStyle = "warning";
        } else {
          data.status = "错误";
          data.statusStyle = "danger";
        }

        // 失败重跑
        if (data.isFailedRetry == 0) {
          data.isFailedRetryStyle = "danger";
          data.isFailedRetryValue = "是";
        } else if (data.isFailedRetry == 1) {
          data.isFailedRetryStyle = "primary";
          data.isFailedRetryValue = "否";
        } else {
          data.status = "UNKNOW";
          data.statusStyle = "primary";
        }
        this.logInfo = data;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    showRawExceptedResult() {
      this.isShowRawExceptedResult = !this.isShowRawExceptedResult;
    },
    showRawRequestHeaders() {
      this.isShowRawRequestHeaders = !this.isShowRawRequestHeaders;
    },
    showRawRequestParams() {
      this.isShowRawRequestParams = !this.isShowRawRequestParams;
    },
    showRawRequestBody() {
      this.isShowRawRequestBody = !this.isShowRawRequestBody;
    },
    forceUpdate() {
      this.$forceUpdate();
    },
    changeMethod(method) {
      if (method == 0) {
        this.dataAdd.bodyType = 9;
        this.dataInfo.bodyType = 9;
      }
    },
    // 切换到列表视图
    handleTree() {
      const { href } = this.$router.resolve({
        path: "/ifCase"
      });
      window.open(href, "_blank");
    },
    // 查看前置用例的处理器
    async openViewProcessor(caseId) {
      if (caseId != null) {
        const res = await findInterfaceCaseByCaseId(caseId);
        if (res.code == 200) {
          this.viewProcessorDialogFormVisible = true;
          res.data.postProcessors.map(element => {
            let type = element.type;
            if (type == 0) {
              element.scope = "Response";
              element.way = "Json";
            } else if (type == 1) {
              element.scope = "Response";
              element.way = "Html";
            } else if (type == 2) {
              element.scope = "Response";
              element.way = "Header";
            } else if (type == 3) {
              element.scope = "Request";
              element.way = "Header";
            } else if (type == 4) {
              element.scope = "Request";
              element.way = "Params";
            } else if (type == 5) {
              element.scope = "Request";
              element.way = "Data";
            } else if (type == 6) {
              element.scope = "Request";
              element.way = "Json";
            } else {
              this.$message({
                type: "error",
                center: true,
                message: "unknow type"
              });
            }
          });
          this.preCaseProcessorArray = res.data.postProcessors;
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          });
        }
      }
    },

    // 懒加载用例节点
    async loadNode(node, resolve) {
      if (node.level == 0) {
        let data = await this.getTreeCase({ level: node.level, id: null });
        return resolve(data);
      } else if (node.level == 1) {
        let data = await this.getTreeCase({
          level: node.level,
          id: node.number
        });
        return resolve(data);
      } else if (node.level == 2) {
        let data = await this.getTreeCase({
          level: node.level,
          id: node.number
        });
        return resolve(data);
      } else {
        return resolve([]);
      }
    },
    // 懒加载接口
    async getTreeCase(qry) {
      const res = await caseTree(qry);
      if (res.code == 200) {
        return res.data;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: "节点加载失败"
        });
      }
    },
    // 查找树
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击节点
    clickNode(data, node, self) {
        if (data.scope == 'case') {
            this.openEdit({caseId:data.number, projectName:data.projectName, moduleName:data.moduleName});
        }
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 10px;
}
.query {
  padding: 10px;
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.right {
  position: absolute;
  right: 10px;
}
.el-main {
  padding-top: 10px;
  padding-left: 10px;
}
</style>
