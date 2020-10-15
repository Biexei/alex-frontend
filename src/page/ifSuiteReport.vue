<template>
	<div class="body">
      <div class="header_container">
        <div class="report_name"><p style="margin: 0 auto; font-weight: 600; font-size: 12px;">Alex</p></div>
        <div style="margin:0 auto;width:500px;text-align:center;font-weight: 600; font-size: 12px; align: center;">ReportNo {{suiteLogNo}}</div>
      </div>
      <div class="report_body">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple ">
            <div>
              <div style="padding-left: 15px;padding-top: 15px;">Tests</div>
              <div class="graph">
                <ve-ring :data="chartData" :settings="chartSettings" :extend="chartExtend" height="160px"></ve-ring>
              </div>
              <div style="padding-left: 15px;padding-top: 15px;">
                <span>
                  <span style="font-weight:bold;">{{suiteLog.totalCase}}</span> total
                </span>
              </div>
              <div style="padding-left: 15px;padding-top: 15px;">
                <span>
                  <span style="font-weight:bold;">{{suiteLog.totalRunCase}}</span> run
                  <span style="font-weight:bold;">{{suiteLog.totalSuccess}}</span> pass
                  <span style="font-weight:bold;">{{suiteLog.totalFailed}}</span> failed
                  <span style="font-weight:bold;">{{suiteLog.totalError}}</span> error
                  <span style="font-weight:bold;">{{suiteLog.totalSkip}}</span> skip
                </span>
              </div>
            </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
            <div>
              <div style="padding-left: 15px;padding-top: 15px;">Asserts</div>
              <div class="graph">
                <ve-ring :data="chartData" :settings="chartSettings" :extend="chartExtend" height="160px"></ve-ring>
              </div>
              <div style="padding-left: 15px;padding-top: 15px;">
                <span>
                  <span style="font-weight:bold;">22</span> run
                </span>
              </div>
              <div style="padding-left: 15px;padding-top: 15px;">
                <span>
                  <span style="font-weight:bold;">22</span> pass
                  <span style="font-weight:bold;">22</span> failed
                  <span style="font-weight:bold;">22</span> error
                </span>
              </div>
            </div>
            </div>
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

      chartSettings: {
        radius: ["50px", "30px"],
        label: {
          normal: {
            show: false,
            position: "inside"
          }
        },
      },
      chartExtend: {        
	      series: {
          center: ['50%', '60%'],
        },
        color: ['#67C23A', '#E6A23C', '#F56C6C', '#909399']
      },
      chartData: {
        columns: ['type', 'count'],
        rows: []
      }
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
      }
      this.chartData.rows.push({"type":"pass", "count":res.data.totalSuccess})
      this.chartData.rows.push({"type":"failed", "count":res.data.totalFailed})
      this.chartData.rows.push({"type":"error", "count":res.data.totalError})
      this.chartData.rows.push({"type":"skip", "count":res.data.totalSkip})  
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
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 3px;
    min-height: 36px;
  }
  .row-bg {
    padding: 0;
    background-color: #f9fafc;
  }
</style>
