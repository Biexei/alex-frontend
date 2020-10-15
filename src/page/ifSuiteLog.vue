<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="执行编号">
          <el-input v-model="queryForm.suiteLogNo" placeholder="执行编号" size='small'></el-input>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker
            v-model="queryForm.createdStartTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            size='small'
            placeholder="选择起始时间"
            align="right">
          </el-date-picker>
        </el-form-item>  
        <el-form-item label="截止时间">
          <el-date-picker
            v-model="queryForm.createdEndTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            size='small'
            placeholder="选择截止时间"
            align="right">
          </el-date-picker>
        </el-form-item>  
        <el-form-item>
          <el-button type="primary" size="small" @click="selectSuiteLogList(queryForm)">查询</el-button>
          <el-button type="primary" size="small" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="suiteId" label="套件编号" min-width="7%"></el-table-column>
        <el-table-column property="suiteName" label="套件名称" min-width="15%"></el-table-column>
        <el-table-column property="suiteLogNo" label="执行编号" min-width="19%"></el-table-column>
        <el-table-column property="totalCase" label="用例总数" min-width="8%"></el-table-column>
        <el-table-column property="totalRunCase" label="运行总数" min-width="8%"></el-table-column>
        <el-table-column property="totalSkip" label="跳过" min-width="7%"></el-table-column>
        <el-table-column property="totalSuccess" label="成功" min-width="7%"></el-table-column>
        <el-table-column property="totalFailed" label="失败" min-width="7%"></el-table-column>
        <el-table-column property="totalError" label="错误" min-width="7%"></el-table-column>
        <el-table-column property="runTime" label="耗时" min-width="10%"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="5%">
          <template slot-scope="scope">
            <el-button 
              @click="handleReport(scope.row)"
              type="primary"
              size="small" 
              icon="el-icon-view" 
              circle>
            </el-button>
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
import { findIfSuiteLog,findIfSuiteLogByNo,findIfSuiteLogById } from "@/api/getData";
export default {
  data() {
    return {
      suiteId: this.$route.query.suiteId,
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.queryForm = {
         suiteId: this.suiteId,
    }
    this.selectSuiteLogList(this.queryForm);
  },
  methods: {
    async selectSuiteLogList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      this.dataList = []
      const res = await findIfSuiteLog(queryForm)
      if (res.code == 200) {
          this.total = res.data.total
          //this.dataList = res.data.list
          res.data.list.forEach(element => {
              let runTime = element.runTime
              if (runTime < 1000) {
                  element.runTime = runTime + 'ms'
              } else if  ( 1000 <= runTime && runTime < 60000 ) {
                  let s = parseInt(runTime/1000)
                  let ms = (runTime%1000)
                  if (ms != 0){
                      element.runTime = s + 's ' + ms + 'ms'
                  } else {
                      element.runTime = s + 's'
                  }
                  
              } else if (runTime >= 60000){
                  let min = parseInt(runTime/60000)
                  let s = parseInt((runTime-min*60000)/1000)
                  let ms = parseInt((runTime-min*60000)%1000)
                  if (ms != 0){
                      element.runTime = min + 'min ' + s + 's ' + ms + 'ms'
                  } else {
                      element.runTime = min + 'min ' + s + 's'
                  }
                  
              }
          });  
          this.dataList = res.data.list       
      } else {
        this.$message({
          type:"error",
          center: true,
          message:res.msg
        });
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectSuiteLogList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectSuiteLogList(this.queryForm);
    },
    handleReport(row) {
      this.$router.push({
        name: 'ifSuiteReport',
        query: {
          suiteLogNo: row.suiteLogNo,
        },
      })
    },
    async resetForm() {
      this.queryForm = {}
      this.queryForm = {
          suiteId: this.suiteId
      }
      this.pageSize = 10
      this.pageNum = 1
      this.selectSuiteLogList(this.queryForm)
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
