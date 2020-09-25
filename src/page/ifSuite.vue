<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="名称">
          <el-input v-model="queryForm.suiteName" placeholder="名称" size='small'></el-input>
        </el-form-item>
        <el-form-item label="执行方式">
          <el-select v-model="queryForm.executeType" clearable placeholder="请选择"  size='small'>
            <el-option
              v-for="item in executeTypeOptions"
              :key="item.value"
              size='small'
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="queryForm.desc" placeholder="描述"  size='small'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="selectSuiteList(queryForm)">查询</el-button>
          <el-button type="primary" size="small" @click="resetForm">重置</el-button>
          <el-button type="primary" size="small" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="suiteId" label="编号" min-width="10%"></el-table-column>
        <el-table-column property="suiteName" label="名称" min-width="15%"></el-table-column>
        <el-table-column property="desc" label="描述" min-width="15%"></el-table-column>
        <el-table-column property="creator" label="创建人" min-width="15%"></el-table-column>
        <el-table-column property="createdTime" label="创建时间" min-width="15%"></el-table-column>
        <el-table-column property="executeType" label="执行方式" min-width="10%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.executeTypeStyle"
              disable-transitions>{{scope.row.executeType}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="20%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.suiteId)"
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleManager(scope.row.suiteId)"
              type="primary"
              size="small"
              icon="el-icon-s-management"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.suiteId, scope.$index)"
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
<!-- 
      <el-dialog title="编辑" :visible.sync="editDialogFormVisible">
        <el-form :model="dataInfo">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataInfo.name" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*类型" label-width="100px">
            <el-select v-model="dataInfo.type" size='small'>
              <el-option
                v-for="item in dbTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*URL" label-width="100px">
            <el-input v-model="dataInfo.url" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*帐号" label-width="100px">
            <el-input v-model="dataInfo.username" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*密码" label-width="100px">
            <el-input v-model="dataInfo.password" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-radio-group v-model="dataInfo.status" size='small'>
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="dataInfo.desc" size='small'></el-input>
          </el-form-item>  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="updateDb" size="small">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible">
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataAdd.name" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*类型" label-width="100px">
            <el-select v-model="dataAdd.type" size='small'>
              <el-option
                v-for="item in dbTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*URL" label-width="100px">
            <el-input v-model="dataAdd.url" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*帐号" label-width="100px">
            <el-input v-model="dataAdd.username" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*密码" label-width="100px">
            <el-input v-model="dataAdd.password" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-radio-group v-model="dataAdd.status" size='small'>
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="dataAdd.desc" size='small'></el-input>
          </el-form-item>  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="handleAdd()" size="small">确 定</el-button>
        </div>
      </el-dialog> -->
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { saveInterfaceCaseSuite,modifyInterfaceCaseSuite,removeInterfaceCaseSuiteById,findInterfaceCaseSuiteById,findInterfaceCaseSuite,saveSuiteCase,removeSuiteCase,findSuiteCaseList,executeSuiteCase } from "@/api/getData";
export default {
  data() {
    return {
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
      ]
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
        const res = await saveDb(this.dataAdd);
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

    async handleEdit(dbId) {
      const res = await findDbById(dbId);
      if (res.code == 200) {
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
    async handleDelete(dbId, index) {
      const res = await removeDb(dbId);
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
    async updateDb() {
      const res = await modifyDb(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = true;
      }
      this.selectSuiteList(this.queryForm);
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
      this.addDialogFormVisible = true;
      this.dataAdd = {};
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectSuiteList(this.queryForm)
    }
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
