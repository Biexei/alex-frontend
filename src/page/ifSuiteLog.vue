<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="执行编号">
          <el-input v-model="queryForm.suiteLogNo" placeholder="执行编号" size='small'></el-input>
        </el-form-item>
        <el-form-item label="运行方式">
          <el-select v-model="queryForm.runDev" clearable placeholder="请选择"  size='small'>
            <el-option
              v-for="item in runDevOptions"
              :key="item.value"
              size='small'
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
      <el-table 
      :data="dataList" 
      @row-dblclick="handleReport"
      stripe highlight-current-row style="width: 100%">
        <el-table-column property="suiteId" label="套件编号" min-width="7%"></el-table-column>
        <el-table-column property="suiteName" label="套件名称" min-width="15%"></el-table-column>
        <el-table-column property="suiteLogNo" label="执行编号" min-width="18%"></el-table-column>
        <el-table-column property="totalCase" label="用例数" min-width="6%"></el-table-column>
        <el-table-column property="totalRunCase" label="运行数" min-width="6%"></el-table-column>
        <el-table-column property="totalSkip" label="跳过" min-width="6%"></el-table-column>
        <el-table-column property="totalSuccess" label="成功" min-width="6%"></el-table-column>
        <el-table-column property="totalFailed" label="失败" min-width="6%"></el-table-column>
        <el-table-column property="totalError" label="错误" min-width="6%"></el-table-column>
        <el-table-column property="runTime" label="耗时" min-width="10%"></el-table-column>
        <el-table-column property="executeType" label="执行方式" min-width="7%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.executeTypeStyle"
              disable-transitions>{{scope.row.executeType}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="runDevType" label="运行环境" min-width="7%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.runDevStyle"
              disable-transitions>{{scope.row.runDevType}}
            </el-tag>
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
      executeTypeOptions:[
          {
              value:0,
              label:'并行',
          },
          {
              value:1,
              label:'串行',
          },
      ],
      runDevOptions:[
          {
              value:4,
              label:'调试 DEBUG',
          },
          {
              value:0,
              label:'开发 DEV',
          },
          {
              value:1,
              label:'测试 TEST',
          },
          {
              value:2,
              label:'预发 STG',
          },
          {
              value:3,
              label:'线上 PROD',
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
              if (element.executeType == 0) {
                  element.executeType = "并行"
                  element.executeTypeStyle = 'danger'
              } else if (element.executeType == 1) {
                  element.executeType = "串行"
                  element.executeTypeStyle = ''
              } else {
                  element.executeType = "UNKNOW"
                  element.executeTypeStyle = ''
              }
              if (element.runDev == 4) {
                  element.runDevType = "调试"
                  element.runDevStyle = 'info'
              } else if (element.runDev == 3) {
                  element.runDevType = "线上"
                  element.runDevStyle = 'danger'
              } else if (element.runDev == 2) {
                  element.runDevType = "预发"
                  element.runDevStyle = 'warning'
              } else if (element.runDev == 1) {
                  element.runDevType = "测试"
                  element.runDevStyle = 'success'
              } else if (element.runDev == 0) {
                  element.runDevType = "开发"
                  element.runDevStyle = 'primary'
              } else {
                  element.runDevType = "UNKNOW"
                  element.runDevStyle = ''
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
