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
        <el-form-item label="依赖名称">
          <el-input
            v-model="queryForm.name"
            placeholder="依赖名称"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="SQL语句">
          <el-input
            v-model="queryForm.value"
            placeholder="SQL语句"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-has="'data_center:rely_sql_data:find'"
            type="primary"
            size="mini"
            @click="selectRelyDataList(queryForm)"
            >查询</el-button
          >
          <el-button
            v-has="'data_center:rely_sql_data:find'"
            type="primary"
            size="mini"
            @click="resetForm"
            >重置</el-button
          >
          <el-button
            v-has="'data_center:rely_sql_data:add'"
            type="primary"
            size="mini"
            @click="openAdd"
            plain
            >新增</el-button
          >&nbsp;&nbsp;
          <el-popover
            placement="top-start"
            title="小提示"
            width="300"
            trigger="hover"
            content="当依赖为新增语句时，返回自增主键。当依赖为查询语句时，第一个参数为json path表达式。如依赖名称[InterfaceCaseTable]，
            sql语句=[select * from t_interface_case where case_id = ?]。${InterfaceCaseTable('$..url','277')}，可查询case_id==277的url字段。其他类型则返回空字符串"
          >
            <el-button slot="reference" size="mini" type="primary"
              >Tips</el-button
            >
          </el-popover>
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
          property="id"
          label="编号"
          min-width="5%"
        ></el-table-column>
        <el-table-column
          property="name"
          label="名称"
          min-width="15%"
        ></el-table-column>
        <el-table-column
          property="value"
          label="SQL"
          min-width="30%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="desc"
          label="描述"
          min-width="30%"
        ></el-table-column>
        <el-table-column property="type" label="类型" min-width="10%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="small"
              :type="scope.row.style"
              disable-transitions
              >{{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="10%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.id)"
              v-has="'data_center:rely_sql_data:modify'"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.id, scope.$index)"
              v-has="'data_center:rely_sql_data:remove'"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
              :disabled="!scope.row.deleteable"
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
        title="选择数据源"
        :visible.sync="selectDbDialogFormVisible"
        append-to-body
      >
        <el-form
          :inline="true"
          :model="dbQueryForm"
          class="demo-form-inline"
          ref="queryForm"
        >
          <el-form-item label="数据源名称">
            <el-input
              v-model="dbQueryForm.name"
              placeholder="数据源名称"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select
              v-model="dbQueryForm.type"
              clearable
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in dbTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="dbQueryForm.desc"
              placeholder="描述"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              circle
              @click="selectDbList(dbQueryForm)"
              size="mini"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-refresh"
              circle
              @click="resetDbForm"
              size="mini"
            ></el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dbList"
          stripe
          highlight-current-row
          @row-click="handleSelectDb"
          style="width: 100%"
        >
          <el-table-column
            property="id"
            label="编号"
            min-width="13%"
          ></el-table-column>
          <el-table-column
            property="name"
            label="名称"
            min-width="13%"
          ></el-table-column>
          <el-table-column
            property="type"
            label="类型"
            min-width="13%"
          ></el-table-column>
          <el-table-column
            property="desc"
            label="描述"
            min-width="13%"
          ></el-table-column>
        </el-table>
        <div class="pagination" style="text-align: left;margin-top: 10px;">
          <el-pagination
            @size-change="handleDbSizeChange"
            @current-change="handleDbCurrentChange"
            :current-page="dbPageNum"
            :page-sizes="[5, 10, 20]"
            :page-size="dbPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dbTotal"
          ></el-pagination>
        </div>
      </el-dialog>

      <el-dialog
        title="编辑"
        :visible.sync="editDialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="dataInfo">
          <el-form-item label="*类型/名称" label-width="120px">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-select
                  v-model="dataInfo.type"
                  @change="handleChangeType"
                  :disabled="disableModifyType"
                  size="mini"
                >
                  <el-option
                    v-for="item in writeTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :disabled="item.isDisable"
                    size="mini"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="dataInfo.name"
                  :disabled="disableModifyName"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*数据源" label-width="120px">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-input
                  v-model="dataInfo.datasourceId"
                  readonly
                  @focus="handleDbList"
                  size="mini"
                  placeholder="请选择"
                ></el-input>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="dataInfo.dbName"
                  disabled
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*SQL" label-width="120px" v-if="showValue">
            <el-row :gutter="10">
              <el-col :span="23">
                <el-input
                  v-model="dataInfo.value"
                  size="mini"
                  type="textarea"
                  :rows="6"
                  placeholder="如需运行多条语句，请回车换行"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*设置" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="5">
                <el-checkbox
                  v-model="dataInfo.enableReturn"
                  :true-label="0"
                  :false-label="1"
                  v-if="dataInfo.type == 3 && showValue"
                  >返回自增主键</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="dataInfo.analysisRely"
                  :true-label="0"
                  :false-label="1"
                  >解析依赖</el-checkbox
                >
              </el-col>
              <el-col :span="5">
                <el-checkbox
                  v-model="dataInfo.othersModifiable"
                  :true-label="0"
                  :false-label="1"
                  :disabled="userId != dataInfo.creatorId"
                  >允许他人修改</el-checkbox
                >
              </el-col>
              <el-col :span="5">
                <el-checkbox
                  v-model="dataInfo.othersDeletable"
                  :true-label="0"
                  :false-label="1"
                  :disabled="userId != dataInfo.creatorId"
                  >允许他人删除</el-checkbox
                >
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*描述" label-width="120px">
            <el-row :gutter="10">
              <el-col :span="23">
                <el-input v-model="dataInfo.desc" size="mini"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="创建人" label-width="120px">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-input
                  v-model="dataInfo.creatorId"
                  size="mini"
                  disabled
                ></el-input>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="dataInfo.creatorName"
                  size="mini"
                  disabled
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="updateRelyData" size="mini"
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
          <el-form-item label="*类型/名称" label-width="120px">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-select
                  v-model="dataAdd.type"
                  @change="handleChangeType"
                  :disabled="disableModifyType"
                  size="mini"
                >
                  <el-option
                    v-for="item in writeTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :disabled="item.isDisable"
                    size="mini"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="dataAdd.name"
                  :disabled="disableModifyName"
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*数据源" label-width="120px">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-input
                  v-model="dataAdd.datasourceId"
                  readonly
                  @focus="handleDbList"
                  size="mini"
                  placeholder="请选择"
                ></el-input>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="dataAdd.dbName"
                  disabled
                  size="mini"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*SQL" label-width="120px" v-if="showValue">
            <el-row :gutter="10">
              <el-col :span="23">
                <el-input
                  v-model="dataAdd.value"
                  size="mini"
                  type="textarea"
                  :rows="6"
                  placeholder="如需运行多条语句，请回车换行"
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*设置" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="5">
                <el-checkbox
                  v-model="dataAdd.enableReturn"
                  :true-label="0"
                  :false-label="1"
                  v-if="dataAdd.type == 3 && showValue"
                  >返回自增主键</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="dataAdd.analysisRely"
                  :true-label="0"
                  :false-label="1"
                  >解析依赖</el-checkbox
                >
              </el-col>
              <el-col :span="5">
                <el-checkbox
                  v-model="dataAdd.othersModifiable"
                  :true-label="0"
                  :false-label="1"
                  >允许他人修改</el-checkbox
                >
              </el-col>
              <el-col :span="5">
                <el-checkbox
                  v-model="dataAdd.othersDeletable"
                  :true-label="0"
                  :false-label="1"
                  >允许他人删除</el-checkbox
                >
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*描述" label-width="120px">
            <el-row :gutter="10">
              <el-col :span="23">
                <el-input v-model="dataAdd.desc" size="mini"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
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
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {
  saveRelyData,
  modifyRelyData,
  findRelyDataById,
  findRelyDataList,
  removeRelyData,
  findDbList
} from "@/api/getData";
export default {
  data() {
    return {
      userId: null,
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      dataAdd: {},
      type: 2,
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      typeOptions: [
        {
          value: 0,
          label: "固定字符"
        },
        {
          value: 1,
          label: "预置方法"
        },
        {
          value: 2,
          label: "查询"
        },
        {
          value: 3,
          label: "新增"
        },
        {
          value: 4,
          label: "修改"
        },
        {
          value: 5,
          label: "删除"
        },
        {
          value: 6,
          label: "脚本"
        }
      ],
      writeTypeOptions: [
        // {
        //   value: 0,
        //   label: '固定字符',
        //   isDisable: false,
        // },
        // {
        //   value: 1,
        //   label: '预置方法',
        //   isDisable: true,
        // },
        {
          value: 2,
          label: "查询",
          isDisable: false
        },
        {
          value: 3,
          label: "新增",
          isDisable: false
        },
        {
          value: 4,
          label: "修改",
          isDisable: false
        },
        {
          value: 5,
          label: "删除",
          isDisable: false
        },
        {
          value: 6,
          label: "脚本",
          isDisable: false
        }
      ],
      showValue: true, //展示固定值/SQL
      showDbId: true, //展示数据源编号
      showDbName: true, //展示数据源名称
      disableModifyName: false, //能否修改名称
      disableModifyType: false, //能否修改类型

      selectDbDialogFormVisible: false,
      dbList: [],
      dbQueryForm: {},
      dbTotal: 0,
      dbPageSize: 5,
      dbPageNum: 1,
      dbTypeOptions: [
        {
          value: 0,
          label: "MySQL"
        },
        {
          value: 1,
          label: "Oracle"
        },
        {
          value: 2,
          label: "SQL Server"
        }
      ]
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectRelyDataList(this.queryForm);
    this.getUserId();
  },
  methods: {
    async selectRelyDataList(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      queryForm["type"] = this.type;
      const res = await findRelyDataList(this.queryForm);
      if (res.code == 200) {
        this.dataList = [];
        this.total = res.data.total;
        res.data.list.forEach(element => {
          if (element.type == 0) {
            element.type = "固定字符";
            element.style = "";
            element["deleteable"] = true;
          } else if (element.type == 1) {
            element.type = "预置方法";
            element.style = "success";
            element["deleteable"] = false;
          } else if (element.type == 2) {
            element.type = "查询";
            element.style = "primary";
            element["deleteable"] = true;
          } else if (element.type == 3) {
            element.type = "新增";
            element.style = "success";
            element["deleteable"] = true;
          } else if (element.type == 4) {
            element.type = "修改";
            element.style = "info";
            element["deleteable"] = true;
          } else if (element.type == 5) {
            element.type = "删除";
            element.style = "warning";
            element["deleteable"] = true;
          } else if (element.type == 6) {
            element.type = "脚本";
            element.style = "danger";
            element["deleteable"] = true;
          } else {
            element["deleteable"] = true;
            type = "其它";
          }
          this.dataList.push({
            id: element.id,
            name: element.name,
            value: element.value,
            type: element.type,
            desc: element.desc,
            deleteable: element.deleteable,
            style: element.style
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
    async handleSelectDb(row) {
      this.selectDbDialogFormVisible = false;
      this.dataInfo.datasourceId = row.id;
      this.dataInfo.dbName = row.name;
      this.dataAdd.datasourceId = row.id;
      this.dataAdd.dbName = row.name;
    },
    async setTypeOption(value) {
      if (value == 0) {
        // 固定值
        this.showValue = true;
        this.showDbId = false;
        this.showDbName = false;
        this.disableModifyName = false;
        this.disableModifyType = false;
        // 清空其它字段
        this.dataInfo.datasourceId = null;
        this.dataInfo.dbName = null;
      } else if (value == 1) {
        //内置方法
        this.showValue = true;
        this.showDbId = false;
        this.showDbName = false;
        this.disableModifyName = true;
        this.disableModifyType = true;
        // 清空其它字段
        this.dataInfo.datasourceId = null;
        this.dataInfo.dbName = null;
      } else if (value == 2) {
        //SQL
        this.showValue = true;
        this.showDbId = true;
        this.showDbName = true;
        this.disableModifyName = false;
        this.disableModifyType = false;
      }
    },
    async selectDbList(dbQueryForm) {
      this.dbQueryForm["pageNum"] = this.dbPageNum;
      this.dbQueryForm["pageSize"] = this.dbPageSize;
      this.dbList = [];
      const res = await findDbList(this.dbQueryForm);
      if (res.code == 200) {
        this.dbTotal = res.data.total;
        res.data.list.forEach(element => {
          if (element.type == 0) {
            element.type = "MySQL";
          } else if (element.type == 1) {
            element.type = "Oracle";
          } else if (element.type == 2) {
            element.type = "SQL Server";
          } else {
            tyoe = "Others";
          }
          this.dbList.push({
            id: element.id,
            name: element.name,
            type: element.type,
            desc: element.desc,
            createdTime: element.createdTime,
            status: element.status == 0 ? "启用" : "禁用"
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
    async handleDbList() {
      this.selectDbList();
      this.dbQueryForm = {};
      this.selectDbDialogFormVisible = true;
    },
    async handleChangeType(value) {
      this.setTypeOption(value);
    },
    async handleAdd() {
      const res = await saveRelyData(this.dataAdd);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.addDialogFormVisible = false;
        this.selectRelyDataList({});
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    async handleEdit(relyId) {
      const res = await findRelyDataById(relyId);
      if (res.code == 200) {
        // 预置方法名称不允许修改
        if (res.data.type == 1) {
          this.disableModifyName = true;
        } else {
          this.disableModifyName = false;
        }
        this.setTypeOption(res.data.type);
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
    async handleDelete(relyId, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await removeRelyData(relyId);
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
    async updateRelyData() {
      const res = await modifyRelyData(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
        this.selectRelyDataList(this.queryForm);
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
      this.selectRelyDataList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectRelyDataList(this.queryForm);
    },
    handleDbSizeChange(pageSize) {
      this.dbPageSize = pageSize;
      this.selectDbList(this.caseQueryForm);
    },
    handleDbCurrentChange(pageNum) {
      this.dbPageNum = pageNum;
      this.selectDbList(this.caseQueryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd.othersDeletable = 1;
      this.dataAdd.othersModifiable = 1;
      this.dataAdd.analysisRely = 1;
      this.dataAdd.enableReturn = 1;
      this.showValue = true;
      this.showDbId = true;
      this.showDbName = true;
      this.disableModifyName = false; //能否修改名称
      this.disableModifyType = false; //能否修改类型
    },
    async resetForm() {
      this.queryForm = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.selectRelyDataList(this.queryForm);
    },
    async resetDbForm() {
      this.dbQueryForm = {};
      this.dbPageSize = 10;
      this.dbPageNum = 1;
      this.selectDbList(this.dbQueryForm);
    },
    // 获取用户ID
    getUserId() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      this.userId = userInfo.userId;
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
