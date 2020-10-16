<template>
  <div class="fillcontain">
    <head-top></head-top>
        <div><ve-pie :data="totalCount"></ve-pie></div>
      <el-row>
        <el-col :span="12"><div><ve-histogram :data="weekExecuteLog"></ve-histogram></div></el-col>
        <el-col :span="12"><div><ve-histogram :data="weekAssertLog"></ve-histogram></div></el-col>
      </el-row> 
      <el-row>
        <el-col :span="12"><div><ve-line :data="weekCase"></ve-line></div></el-col>
        <el-col :span="12"><div><ve-line :data="weekAssert"></ve-line></div></el-col>
      </el-row> 
      <el-row>
        <el-col :span="12"><div><ve-line :data="weekRegister"></ve-line></div></el-col>
        <el-col :span="12"><div><ve-line :data="weekSuite"></ve-line></div></el-col>
      </el-row> 
   </div>
</template>
<script>
import headTop from "../components/headTop";
import { countAll, registerWeek, caseWeek, assertWeek, suiteWeek,executeLogWeek,assertLogWeek } from "@/api/getData";
export default {
  data() {
    return {
        totalCount: {
          columns: ['类型', '总数'],
          rows: [],
        },
        weekRegister: {
          columns: ['日期', '新增用户'],
          rows: [],
        },
        weekCase: {
          columns: ['日期', '新增用例'],
          rows: [],
        },
        weekAssert: {
          columns: ['日期', '新增断言'],
          rows: [],
        },
        weekSuite: {
          columns: ['日期', '新增测试套件'],
          rows: [],
        },
        weekAssertLog: {
          columns: ['日期', '断言通过', '断言失败', '断言错误'],
          rows: [],
        },
        weekExecuteLog: {
          columns: ['日期', '执行通过', '执行失败', '执行错误'],
          rows: [],
        },        
    }

  },
  components: {
    headTop
  },
  mounted() {
    this.countAll();
    this.registerWeek();
    this.caseWeek();
    this.assertWeek();
    this.suiteWeek();
    this.assertLogWeek();
    this.executeLogWeek();
  },
  methods: {
    async countAll() {
        const res = await countAll();
        this.totalCount.rows = res.data
    },
    async registerWeek() {
        const res = await registerWeek();
        this.weekRegister.rows = res.data
    },
    async caseWeek() {
        const res = await caseWeek();
        this.weekCase.rows = res.data
    },
    async assertWeek() {
        const res = await assertWeek();
        this.weekAssert.rows = res.data
    },
    async suiteWeek() {
        const res = await suiteWeek();
        this.weekSuite.rows = res.data
    },
    async assertLogWeek() {
        const res = await assertLogWeek();
        this.weekAssertLog.rows = res.data
    },
    async executeLogWeek() {
        const res = await executeLogWeek();
        this.weekExecuteLog.rows = res.data
    },

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
