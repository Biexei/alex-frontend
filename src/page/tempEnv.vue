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
        <el-form-item label="key">
          <el-input
            v-model="queryForm.key"
            placeholder="key"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-has="'data_center:temp_env:find'"
            type="primary"
            size="mini"
            @click="findAllTempValue(queryForm)"
            >查询</el-button
          >
          <el-button
            v-has="'data_center:temp_env:find'"
            type="primary"
            size="mini"
            @click="resetForm"
            >重置</el-button
          >
          <el-button
            v-has="'data_center:temp_env:clear'"
            type="danger"
            size="mini"
            @click="handleDeleteAll"
            >清空</el-button
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
          property="key"
          label="key"
          min-width="20%"
        ></el-table-column>
        <el-table-column
          property="value"
          label="value"
          min-width="72%"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="8%">
          <template slot-scope="scope">
            <el-button
              @click="handleDelete(scope.row.key, scope.$index)"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {
  findAllTempValue,
  removeTempValue,
  removeAllTempValue
} from "@/api/getData";
export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      dataList: []
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.findAllTempValue();
  },
  methods: {
    async findAllTempValue(queryForm) {
      const res = await findAllTempValue(queryForm);
      if (res.code == 200) {
        this.dataList = res.data;
        this.total = res.data.length;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleDelete(key, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await removeTempValue(key);
        if (res.code == 200) {
          this.$message({
            type: "success",
            center: true,
            message: res.msg
          });
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
    async handleDeleteAll() {
      this.$confirm("此操作将清除全部临时变量, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await removeAllTempValue();
        if (res.code == 200) {
          this.$message({
            type: "success",
            center: true,
            message: res.msg
          });
          this.dataList = [];
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          });
        }
      });
    },
    async resetForm() {
      this.queryForm = {};
      this.findAllTempValue();
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
