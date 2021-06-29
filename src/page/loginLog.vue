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
        <el-form-item label="用户编号">
          <el-input
            v-model="queryForm.userId"
            placeholder="用户编号"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="queryForm.userName"
            placeholder="用户名"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="Ip">
          <el-input
            v-model="queryForm.ip"
            placeholder="Ip"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker
            v-model="queryForm.loginStartTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            size="mini"
            placeholder="选择起始时间"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker
            v-model="queryForm.loginEndTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            size="mini"
            placeholder="选择截止时间"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            v-has="'setting:loginLog:find'"
            type="primary"
            size="mini"
            @click="selectUserLoginLogList(queryForm)"
            >查询</el-button
          >
          <el-button
            v-has="'setting:loginLog:find'"
            type="primary"
            size="mini"
            @click="resetForm"
            >重置</el-button
          >
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
          min-width="20%"
        ></el-table-column>
        <el-table-column
          property="userId"
          label="用户编号"
          min-width="20%"
        ></el-table-column>
        <el-table-column
          property="userName"
          label="用户名"
          min-width="20%"
        ></el-table-column>
        <el-table-column
          property="ip"
          label="Ip"
          min-width="20%"
        ></el-table-column>
        <el-table-column
          property="loginTime"
          label="登录时间"
          min-width="20%"
        ></el-table-column>
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
import {
  findUserLoginLogList
} from "@/api/getData";
export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectUserLoginLogList(this.queryForm);
  },
  methods: {
    async selectUserLoginLogList(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      const res = await findUserLoginLogList(queryForm);
      if (res.code == 200) {
        this.total = res.data.total;
        this.dataList = res.data.list;
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
      this.selectUserLoginLogList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectUserLoginLogList(this.queryForm);
    },
    async resetForm() {
      this.queryForm = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.selectUserLoginLogList(this.queryForm);
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
