<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="执行日志编号">
          <el-input v-model="queryForm.executeLogId" placeholder="执行日志编号"  size='mini'></el-input>
        </el-form-item>
        <el-form-item label="断言名称">
          <el-input v-model="queryForm.assertName" placeholder="断言名称"  size='mini'></el-input>
        </el-form-item>
        <el-form-item label="断言方式">
          <el-select v-model="queryForm.type" placeholder="断言方式"  size='mini'>
            <el-option
              v-for="item in logTypeOptions"
              :key="item.label"
              size='mini'
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>          
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="状态"  size='mini'>
            <el-option
              v-for="item in logStatusOptions"
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
          <el-button type="primary" size="mini" @click="selectInterfaceAssertLog(queryForm)">查询</el-button>
          <el-button type="primary" size="mini" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column type="expand">
        <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="预期结果">
                <el-input
                :value="props.row.exceptedResult"
                readonly
                type="textarea"
                size="mini"
                :autosize="{ minRows: 0, maxRows: 6 }"
                ></el-input>
            </el-form-item>
            <br />
            <el-form-item label="原始预期">
                <el-input
                :value="props.row.rawExceptedResult"
                readonly
                type="textarea"
                size="mini"
                :autosize="{ minRows: 0, maxRows: 6 }"
                ></el-input>
            </el-form-item>
            <br />
            <el-form-item label="比较类型">
                <el-input  :value="props.row.operator" readonly size="mini"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="实际结果">
                <el-input
                :value="props.row.actualResult"
                readonly
                size="mini"
                type="textarea"
                :autosize="{ minRows: 0, maxRows: 6 }"
                ></el-input>
            </el-form-item>
            <br />
            <el-form-item label="错误信息" v-if="props.row.errorMessage!=null">
                <el-input
                :value="props.row.errorMessage"
                readonly
                type="textarea"
                size="mini"
                :autosize="{ minRows: 0, maxRows: 6 }"
                ></el-input>
            </el-form-item>
            </el-form>
        </template>
        </el-table-column>
        <el-table-column property="assertLogId" label="日志编号" min-width="10%"></el-table-column>
        <el-table-column property="executeLogId" label="执行日志编号" min-width="10%"></el-table-column>
        <el-table-column property="assertName" label="断言名称" min-width="15%"></el-table-column>
        <el-table-column property="expression" label="提取表达式" min-width="15%"></el-table-column>
        <el-table-column property="type" label="断言方式" min-width="10%">
          <template slot-scope="scope">
            <el-tag effect="dark" :type="scope.row.typeStyle" disable-transitions size="small">{{scope.row.type}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="order" label="排序" min-width="10%"></el-table-column>
        <el-table-column property="createdTime" label="创建时间" min-width="15%"></el-table-column>
        <el-table-column property="status" label="执行状态" min-width="10%">
          <template slot-scope="scope">
            <el-tag effect="dark" :type="scope.row.style" disable-transitions size="small">{{scope.row.status}}</el-tag>
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
import { listInterfaceAssertLog } from "@/api/getData";
export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      logStatusOptions: [
        {
          value: 0,
          label: "通过",
        },
        {
          value: 1,
          label: "失败",
        },
        {
          value: 2,
          label: "错误",
        },
      ],
      logTypeOptions: [
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
    };
  },
  components: {
    headTop,
  },
  mounted() {
    this.selectInterfaceAssertLog(this.queryForm);
  },
  methods: {
    async selectInterfaceAssertLog(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      this.dataList = [];
      const res = await listInterfaceAssertLog(queryForm);
      if (res.code == 200) {
        this.total = res.data.total;
        res.data.list.forEach((element) => {
          if (element.status == 0) {
            element.style = "success";
            element.status = "通过";
          } else if (element.status == 1) {
            element.style = "warning";
            element.status = "失败";
          } else {
            element.style = "danger";
            element.status = "错误";
          }
          // 断言提取类型
          if (element.type == 0) {
            element.typeStyle = "";
            element.type = "json";
          } else if (element.type == 1) {
            element.typeStyle = "success";
            element.type = "html";
          } else if (element.type == 2) {
            element.typeStyle = "danger";
            element.type = "header";
          } else if (element.type == 3) {
            element.typeStyle = "warning";
            element.type = "code";
          } else if (element.type == 4) {
            element.typeStyle = "info";
            element.type = "time";
          } else {
            element.typeStyle = "info";
            element.type = "unknow";
          }
        // 操作符
        // 操作符0/=、1/< 、2/>、3/<=、4/>=、5/in、6/!=、7/re
        if (element.operator == 0) {
            element.operator = '='
        } else if (element.operator == 1) {
            element.operator = '<'
        } else if (element.operator == 2) {
            element.operator = '>'
        } else if (element.operator == 3) {
            element.operator = '<='
        } else if (element.operator == 4) {
            element.operator = '>='
        } else if (element.operator == 5) {
            element.operator = 'in'
        } else if (element.operator == 6) {
            element.operator = '!='
        } else if (element.operator == 7) {
            element.operator = 're'
        } else if (element.operator == 8) {
            element.operator = 'isNull'
        } else if (element.operator == 9) {
            element.operator = 'notNull'
        } else {
            element.operator = 'unknow'
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
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectInterfaceAssertLog(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectInterfaceAssertLog(this.queryForm);
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectInterfaceAssertLog(this.queryForm)
    }
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
