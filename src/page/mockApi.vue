<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="编号">
          <el-input v-model="queryForm.apiId" placeholder="编号" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="queryForm.port" placeholder="端口" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="Url">
          <el-input v-model="queryForm.url" placeholder="Url" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="请求方式">
          <el-input v-model="queryForm.desc" placeholder="请求方式" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" clearable placeholder="请选择"  size='mini'>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              size='mini'
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-has="'mock:node:find'" type="primary" size="mini" @click="selectMockApiList(queryForm)">查询</el-button>
          <el-button v-has="'mock:node:find'" type="primary" size="mini" @click="resetForm">重置</el-button>
          <el-button v-has="'mock:node:add'" type="primary" size="mini" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="apiId" label="编号" min-width="12%"></el-table-column>
        <el-table-column property="method" label="请求地址" min-width="30%" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-row :gutter="10">
              <el-col :span="4"><el-tag effect="dark" disable-transitions size="mini">{{scope.row.method}}</el-tag></el-col>
              <el-col :span="20"><span>{{scope.row.url}}</span></el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column property="desc" label="描述" min-width="15%"></el-table-column>
        <el-table-column property="status" label="状态" min-width="20%"></el-table-column>
        <el-table-column property="creatorName" label="创建人" min-width="20%"></el-table-column>
        <el-table-column property="createdTime" label="创建时间" min-width="17%"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="18%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.serverId)"
              v-has="'mock:node:modify'"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.serverId, scope.$index)"
              v-has="'mock:node:remove'"
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

      <el-dialog title="编辑" :visible.sync="editDialogFormVisible"  :close-on-click-modal=false>
        <el-form :model="dataInfo">
          <el-form-item label="Port" label-width="110px">
            <el-input v-model="dataInfo.port"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="转发地址" label-width="110px">
            <el-input v-model="dataInfo.remoteHost"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="转发端口" label-width="110px">
            <el-input v-model="dataInfo.remotePort"  size='mini'></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="110px">
            <el-input v-model="dataInfo.desc"  size='mini'></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="updateMockApi" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataAdd" ref="dataAdd">
          <el-collapse>

            <el-collapse-item title="基本信息">
              <el-form-item label="选择节点" label-width="110px">
                <el-select v-model="dataAdd.serverId" placeholder="请选择"  size="mini" >
                  <el-option
                    v-for="item in mockServerList"
                    :key="item.serverId"
                    :label="item.domain"
                    :value="item.serverId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="接口描述" label-width="110px">
                <el-input v-model="dataAdd.desc" size="mini"></el-input>
              </el-form-item>
            </el-collapse-item>

            <el-collapse-item title="响应信息">
              <el-form-item label="响应延时" label-width="110px">
                <el-input v-model="dataAdd.responseDelay" placeholder="响应延时(ms)" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="解析依赖" label-width="110px">
                <el-checkbox v-model="dataAdd.responseHeadersEnableRely" true-label="0" false-label="1">Header</el-checkbox>
                <el-checkbox v-model="dataAdd.responseBodyEnableRely" true-label="0" false-label="1">Body</el-checkbox>
              </el-form-item>
              <el-form-item label="Code" label-width="110px">
                <el-input v-model="dataAdd.responseCode" placeholder="状态码" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="Header" label-width="110px">
                <el-input v-model="dataAdd.responseHeaders" placeholder="响应头" size="mini" type="textarea" :autosize="{ minRows: 3, maxRows: 10 }"></el-input>
              </el-form-item>
              <el-form-item label="Body" label-width="110px">
                <el-input v-model="dataAdd.responseBody" placeholder="响应正文" size="mini"  type="textarea" :autosize="{ minRows: 3, maxRows: 10 }"></el-input>
              </el-form-item>
              <el-form-item label="ContentType" label-width="110px">
                <el-select v-model="dataAdd.responseBodyType" placeholder="请选择"  size="mini" >
                  <el-option
                    v-for="item in responseBodyTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-collapse-item>

          <el-collapse-item title="命中策略">
                <el-row :gutter="20">
                <el-col :span="3">
                  <el-input v-model="dataAdd.method"  size="mini" placeholder="Method"></el-input>
                </el-col>
                <el-col :span="21">
                  <el-input v-model="dataAdd.url"  size="mini" placeholder="Enter request url"></el-input>
                </el-col> 
                </el-row> 
                <el-button @click.prevent="addPolicy" icon="el-icon-circle-plus-outline" circle type="primary" size="mini" style="margin-top:10px"></el-button>
                <el-form-item
                    v-for="(policyItem, index) in policyList"
                    :index="index"
                    :key="index">
                  <el-row :gutter="20">
                    <el-col :span="3">
                        <el-select v-model="policyItem.matchScope" size='mini'>
                          <el-option
                            v-for="item in matchScopeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="3">
                        <el-select v-model="policyItem.matchType" size='mini'>
                          <el-option
                            v-for="item in matchTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> 
                    <el-col :span="3">
                        <el-input v-model="policyItem.name" placeholder="name"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="11">
                        <el-input v-model="policyItem.value" placeholder="value"  size="mini"></el-input>
                    </el-col> 
                    <el-col :span="2">
                        <el-switch
                          v-model="policyItem.status"
                          :active-value=0
                          :inactive-value=1>
                        </el-switch>
                    </el-col> 
                    <el-col :span="2">
                        <el-button @click.prevent="removePolicy(policyItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
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
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { baseUrl } from '../config/env';
import { saveMockApiAndPolicy,modifyMockApiAndPolicy,findMockApiList,findMockApiById,removeMockApiById,findAllMockServer} from "@/api/getData";

export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      dataAdd:{
      },
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      statusOptions:[
        {
          value: 0,
          label: '启用'
        },
        {
          value: 1,
          label: '禁用'
        },
      ],
      responseBodyTypeOptions:[
        {
          value: 0,
          label: '文本'
        },
        {
          value: 1,
          label: 'json'
        },
        {
          value: 2,
          label: 'xml'
        },
        {
          value: 3,
          label: 'html'
        },
      ],

      matchScopeOptions:[
        {
          value: 0,
          label: 'Header'
        },
        {
          value: 1,
          label: 'Params'
        },
        {
          value: 2,
          label: 'Body'
        },
      ],

      matchTypeOptions:[
        {
          value: 0,
          label: '全量匹配'
        },
        {
          value: 1,
          label: '正则表达式'
        },
        {
          value: 2,
          label: 'JsonChema'
        },
        {
          value: 3,
          label: 'Xpath'
        },
        {
          value: 4,
          label: 'JsonPath'
        },
        {
          value: 5,
          label: '包含'
        },
      ],
      mockServerList:[],
      policyList:[],
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectMockApiList(this.queryForm);
  },
  methods: {
    async selectMockApiList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      const res = await findMockApiList(this.queryForm)
      if (res.code == 200) {
          this.total = res.data.total
          let result = res.data.list
          this.dataList = result;
      } else {
        this.$message({
          type:"error",
          center: true,
          message:res.msg
        });
      }
    },
    async handleAdd() {
        this.dataAdd["status"] = 0
        this.dataAdd["policies"] = this.policyList
        const res = await saveMockApiAndPolicy(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectMockApiList({});
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },

    async handleEdit(apiId) {
      const res = await findMockApiById(apiId);
      if (res.code == 200) {
        this.policyList = []
        this.selectAllMockServer();
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

    async handleDelete(apiId, index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await removeMockApiById(apiId);
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
    async updateMockApi() {
      this.dataInfo["policies"] = this.policyList
      const res = await modifyMockApiAndPolicy(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
        this.selectMockApiList(this.queryForm);
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
      this.selectMockApiList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectMockApiList(this.queryForm);
    },
    openAdd() {
      this.selectAllMockServer();
      this.addDialogFormVisible = true;
      this.policyList = []
      this.initAddForm();
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectMockApiList(this.queryForm)
    },

    async selectAllMockServer() {
      this.mockServerList = []
      const res = await findAllMockServer();
      if (res.code == 200) {
        res.data.forEach(element => {
          let obj = {};
          let split = baseUrl.split(":")
          let protocolAndHost;
          let host;
          if (split.length == 1) {
            protocolAndHost = split[0]
          } else {
            protocolAndHost = split[1]
          }
          host = protocolAndHost.split("//")[1]
          obj["domain"] = host + ":" + element.port
          obj["serverId"] = element.serverId
          this.mockServerList.push(obj)
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    initAddForm() {
      this.dataAdd = {}
    },

    addPolicy() {
      this.policyList.push({
          matchScope: 2,
          matchType: 0,
          name: '',
          value: '',
          status: 0,
      })
    },

    removePolicy(item) {
      var index = this.policyList.indexOf(item)
      this.policyList.splice(index, 1)
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
.status {
  position: relative;
  left: -1px;
  top: -5px;
}
</style>
