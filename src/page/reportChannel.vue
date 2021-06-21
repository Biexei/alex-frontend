<template>
  <div>
    <el-tabs
      tab-position="top"
      style="height:100%;"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="item in chainTitleList"
        :key="item.id"
        :label="item.caseDesc + '  ' + item.caseId"
      >
        <el-row :gutter="10">
          <el-col :span="12"> </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { findReportChain } from "@/api/getData";
export default {
  data() {
    return {
      suiteLogNo: this.$route.query.suiteLogNo,
      isResHeadersBeauty: false,
      isResBodyBeauty: false,

      isReqHeadersBeauty: false,
      isReqParamsBeauty: false,
      isReqDataBeauty: false,
      isReqJsonBeauty: false,

      detailDialogFormVisible: false,

      chainTitleList: []
    };
  },
  components: {},
  mounted() {
    this.findReportChain();
  },
  methods: {
    async clickResHeaders() {
      this.isResHeadersBeauty = !this.isResHeadersBeauty;
      if (this.dataInfo.responseHeaders != null) {
        if (this.isResHeadersBeauty) {
          if (typeof this.dataInfo.responseHeaders == "string") {
            this.dataInfo.responseHeaders = JSON.parse(
              this.dataInfo.responseHeaders
            );
          }
        } else {
          if (typeof this.dataInfo.responseHeaders == "object") {
            this.dataInfo.responseHeaders = JSON.stringify(
              this.dataInfo.responseHeaders
            );
          }
        }
      }
    },
    async clickResBody() {
      this.isResBodyBeauty = !this.isResBodyBeauty;
      if (this.dataInfo.responseBody != null) {
        if (this.isResBodyBeauty) {
          if (typeof this.dataInfo.responseBody == "string") {
            this.dataInfo.responseBody = JSON.parse(this.dataInfo.responseBody);
          }
        } else {
          if (typeof this.dataInfo.responseBody == "object") {
            this.dataInfo.responseBody = JSON.stringify(
              this.dataInfo.responseBody
            );
          }
        }
      }
    },
    async clickReqHeaders() {
      this.isReqHeadersBeauty = !this.isReqHeadersBeauty;
      if (this.dataInfo.requestHeaders != null) {
        if (this.isReqHeadersBeauty) {
          if (typeof this.dataInfo.requestHeaders == "string") {
            this.dataInfo.requestHeaders = JSON.parse(
              this.dataInfo.requestHeaders
            );
          }
        } else {
          if (typeof this.dataInfo.requestHeaders == "object") {
            this.dataInfo.requestHeaders = JSON.stringify(
              this.dataInfo.requestHeaders
            );
          }
        }
      }
    },
    async clickReqParams() {
      this.isReqParamsBeauty = !this.isReqParamsBeauty;
      if (this.dataInfo.requestParams != null) {
        if (this.isReqParamsBeauty) {
          if (typeof this.dataInfo.requestParams == "string") {
            this.dataInfo.requestParams = JSON.parse(
              this.dataInfo.requestParams
            );
          }
        } else {
          if (typeof this.dataInfo.requestParams == "object") {
            this.dataInfo.requestParams = JSON.stringify(
              this.dataInfo.requestParams
            );
          }
        }
      }
    },
    async clickReqData() {
      this.isReqDataBeauty = !this.isReqDataBeauty;
      if (this.dataInfo.requestData != null) {
        if (this.isReqDataBeauty) {
          if (typeof this.dataInfo.requestData == "string") {
            this.dataInfo.requestData = JSON.parse(this.dataInfo.requestData);
          }
        } else {
          if (typeof this.dataInfo.requestData == "object") {
            this.dataInfo.requestData = JSON.stringify(
              this.dataInfo.requestData
            );
          }
        }
      }
    },
    async clickReqJson() {
      this.isReqJsonBeauty = !this.isReqJsonBeauty;
      if (this.JsonInfo.requestJson != null) {
        if (this.isReqJsonBeauty) {
          if (typeof this.JsonInfo.requestJson == "string") {
            this.JsonInfo.requestJson = JSON.parse(this.JsonInfo.requestJson);
          }
        } else {
          if (typeof this.JsonInfo.requestJson == "object") {
            this.JsonInfo.requestJson = JSON.stringify(
              this.JsonInfo.requestJson
            );
          }
        }
      }
    },
    async findReportChain() {
      const res = await findReportChain(this.suiteLogNo);
      let tempList = [];
      if (res.code == 200) {
        res.data.forEach(element => {
          if (element.caseDesc.length >= 10) {
            element.caseDesc = element.caseDesc.substring(0, 10) + "...";
            tempList.push(element);
          } else {
            tempList.push(element);
          }
        });
        this.chainTitleList = tempList;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    handleTabClick(data) {
      console.log(data);
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
</style>