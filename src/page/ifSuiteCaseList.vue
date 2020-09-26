<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="用例编号">
          <el-input v-model="queryForm.caseId" placeholder="用例编号" size='small'></el-input>
        </el-form-item>
        <el-form-item label="用例名称">
          <el-input v-model="queryForm.caseDesc" placeholder="用例名称" size='small'></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="queryForm.url" placeholder="URL" size='small'></el-input>
        </el-form-item>
        <el-form-item label="用例等级">
          <el-select v-model="queryForm.level" clearable placeholder="请选择"  size='small'>
            <el-option
              v-for="item in levelTypeOptions"
              :key="item.value"
              size='small'
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.caseStatusOptions" clearable placeholder="请选择"  size='small'>
            <el-option
              v-for="item in levelTypeOptions"
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
          <el-button type="primary" size="small" @click="selectSuiteCaseList(queryForm)">查询</el-button>
          <el-button type="primary" size="small" @click="resetForm">重置</el-button>
          <el-button type="primary" size="small" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="id" label="编号" min-width="8%"></el-table-column>
        <el-table-column property="order" label="排序" min-width="8%">
          <template slot-scope="scope">
            <el-input v-model="scope.row.order" size='small' @blur='handleEdit(scope.row)'></el-input>
          </template>
        </el-table-column>
        <el-table-column property="suiteName" label="测试套件" min-width="10%"></el-table-column>
        <el-table-column property="caseId" label="用例编号" min-width="10%"></el-table-column>
        <el-table-column property="caseDesc" label="用例名称" min-width="20%"></el-table-column>
        <el-table-column property="url" label="URL" min-width="24%"></el-table-column>
        <el-table-column property="level" label="等级" min-width="10%">
          <template slot-scope="scope">
            <el-tag effect="dark" :type="scope.row.levelStyle" disable-transitions>{{scope.row.level}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="caseStatus" label="状态" min-width="10%">
          <template slot-scope="scope">
          <el-switch
            v-model="scope.row.caseStatus"
            @change='handleEdit(scope.row)'
            :active-value=0
            :inactive-value=1>
          </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              @click="handleDelete(scope.row.id)"
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
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { modifySuiteCase,saveInterfaceCaseSuite,modifyInterfaceCaseSuite,removeInterfaceCaseSuiteById,findInterfaceCaseSuiteById,findInterfaceCaseSuite,saveSuiteCase,removeSuiteCase,findSuiteCaseList,executeSuiteCase } from "@/api/getData";
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
      suiteId: this.$route.query.suiteId,
      levelTypeOptions:[
          {
              value:0,
              label:'高',
          },
          {
              value:1,
              label:'中',
          },
          {
              value:2,
              label:'低',
          },
      ],
      caseStatusOptions:[
          {
              value:0,
              label:'启用',
          },
          {
              value:1,
              label:'禁用',
          },
      ]
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.queryForm = {
         suiteId: this.suiteId,
    }
    this.selectSuiteCaseList(this.queryForm);
  },
  methods: {
    async selectSuiteCaseList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      this.dataList = []
      const res = await findSuiteCaseList(queryForm)
      if (res.code == 200) {
          this.total = res.data.total
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
              console.log(element.caseStatus)
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
    async handleDelete(suiteId, index) {
      const res = await removeSuiteCase(suiteId);
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
    async handleEdit(row) {
      const res = await modifySuiteCase(row);
      if (res.code == 200) {
        this.dataInfo = res.data;
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
      this.selectSuiteCaseList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectSuiteCaseList(this.queryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
    },
    async resetForm() {
    this.queryForm = {
         suiteId: this.suiteId
    }
      this.pageSize = 10
      this.pageNum = 1
      this.selectSuiteCaseList(this.queryForm)
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
