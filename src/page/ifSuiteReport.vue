<template>
	<div class="body">
      <div class="header_container">
        <div class="report_name"><p style="margin: 0 auto; font-weight: 600; font-size: 12px;">Alex</p></div>
        <div style="margin:0 auto;width:500px;text-align:center;font-weight: 600; font-size: 12px; align: center;">ReportNo {{suiteLogNo}}</div>
      </div>
      <div class="report_body">
        <el-row :gutter="12">
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
            <div>
              <div class="title_position" v-if="suiteLog.executeType==1">Sync</div>
              <div class="title_position" v-else-if="suiteLog.executeType==0">Async</div>
              <div class="title_position" v-else>Unknow</div>
              <div class="graph">
                <ve-bar :data="chartSummaryData" :settings="chartSettings" :extend="chartSummaryExtend" height="160px" width="600px" style="padding-left: 100px;"></ve-bar>
              </div>
              <div class="title_position">
                <span>
                  <span style="font-weight:bold;"> {{suiteLog.suiteName}}</span>
                </span>
              </div>
              <div class="title_position">
                <span>
                  <span style="font-weight:bold;">{{passRate}}</span> pass/run
                  <span style="font-weight:bold;">{{runRate}}</span> run/total
                </span>
              </div>
            </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple ">
            <div>
              <div class="title_position">Test</div>
              <div class="graph">
                <ve-ring :data="chartTestData" :settings="chartSettings" :extend="chartTestExtend" height="160px"></ve-ring>
              </div>
              <div class="title_position">
                <span>
                  <span style="font-weight:bold;">{{suiteLog.totalRunCase}}</span> run
                </span>
              </div>
              <div class="title_position">
                <span>
                  <span style="font-weight:bold;">{{suiteLog.totalSuccess}}</span> pass
                  <span style="font-weight:bold;">{{suiteLog.totalFailed}}</span> failed
                  <span style="font-weight:bold;">{{suiteLog.totalError}}</span> error
                  <span style="font-weight:bold;">{{suiteLog.totalSkip}}</span> skip
                </span>
              </div>
            </div>
            </div>
          </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-card shadow="hover">
            <div>Env</div>
            <div class="card_content_position" v-if="suiteLog.runDev==0">Dev</div>
            <div class="card_content_position" v-else-if="suiteLog.runDev==1">Test</div>
            <div class="card_content_position" v-else-if="suiteLog.runDev==2">Stg</div>
            <div class="card_content_position" v-else-if="suiteLog.runDev==3">Prod</div>
            <div class="card_content_position" v-else>Unknow</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div>Time Taken</div>
            <div class="card_content_position">{{suiteLog.runTime}}ms</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div>Start</div>
            <div class="card_content_position">{{suiteLog.startTime}}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div>End</div>
            <div class="card_content_position">{{suiteLog.endTime}}</div>
          </el-card>
        </el-col>
      </el-row>
      </div>
	</div>
</template>
<script>
import {findIfSuiteLogByNo } from "@/api/getData";
export default {
  data() {
    return {

      suiteLogNo: this.$route.query.suiteLogNo,  
      suiteLog: {},
      passRate: "",
      runRate: "",

      chartSettings: {
        radius: ["50px", "40px"],
        label: {
          normal: {
            show: false,
            position: "inside"
          }
        },
      },
      chartTestExtend: {        
	      series: {
          center: ['50%', '60%'],
        },
        color: ['#67C23A', '#E6A23C', '#F56C6C', '#909399']
      },
      chartTestData: {
        columns: ['type', 'count'],
        rows: []
      },
      chartSummaryData: {
        // 饼图用
        // columns: ['type', 'count'],
        // 条形图用
        columns: ['type', 'total', 'run', 'skip'],
        rows: []
      },
      chartSummaryExtend: {        
	      series: {
          center: ['50%', '60%'],
        },

      },
	  }
  },
  components: {

  },
  mounted() {
    this.findIfSuiteLogByNo()
  },
  methods: {
    async findIfSuiteLogByNo() {
      const res = await findIfSuiteLogByNo(this.suiteLogNo)
      if (res.code == 200) {
        this.suiteLog = res.data
        this.passRate = (this.suiteLog.totalSuccess/this.suiteLog.totalRunCase).toFixed(4)*100 + '%'
        this.runRate = (this.suiteLog.totalRunCase/this.suiteLog.totalCase).toFixed(4)*100 + '%'
      }
      this.chartTestData.rows.push({"type":"pass", "count":res.data.totalSuccess})
      this.chartTestData.rows.push({"type":"failed", "count":res.data.totalFailed})
      this.chartTestData.rows.push({"type":"error", "count":res.data.totalError})
      this.chartTestData.rows.push({"type":"skip", "count":res.data.totalSkip})

      // 饼图用 
      // this.chartSummaryData.rows.push({"type":"run", "count":res.data.totalRunCase})  
      // this.chartSummaryData.rows.push({"type":"total", "count":res.data.totalCase})
      
      // 条形图用
      this.chartSummaryData.rows.push({"type":"", "total":res.data.totalRunCase, "run":res.data.totalRunCase, "skip":res.data.totalSkip})  
    }
  }
}
</script>

<style lang="less">
@import "../style/mixin";
	.header_container{
    color: #F5F5F5;
		background-color: #324057;
		height: 50px;
		display: flex;
		justify-content: space-between;
    align-items: center;
  }
	.report_name{
		background-color: #1565C0;
    height: 50px;
    width: 70px;
		display: flex;
		justify-content: space-between;
    align-items: center;
    text-align: center;
  }
  .report_body{
    font-size: 14px;
    background-color: #F6F6F6;
  }
  .title_position{
    padding-left: 15px;
    padding-top: 15px;
  }
  .card_content_position{
    text-align:right;
  }  
  .graph{
    max-height: 300px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple {
    background: #FFFFFF;
  }
  .bg-purple-light {
    background: #FFFFFF;
  }
  .grid-content {
    border-radius: 3px;
    min-height: 36px;
  }
  .row-bg {
    padding: 0;
    background-color: #f9fafc;
  }
  .left-color{
    margin: 0 auto; 
    font-weight: 600;
    font-size: 12px;
    color: #F5F5F5;
    background-color: #1565C0
  }
</style>
