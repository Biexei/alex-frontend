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
        <el-form-item label="状态">
          <el-select
            v-model="queryForm.status"
            clearable
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              size="mini"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="解决方案">
          <el-select
            v-model="queryForm.solution"
            clearable
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in solutionOptions"
              :key="item.value"
              size="mini"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-has="'feedback:my:find'"
            type="primary"
            size="mini"
            @click="selectFeedbackList(queryForm)"
            >查询</el-button
          >
          <el-button
            v-has="'feedback:my:find'"
            type="primary"
            size="mini"
            @click="resetForm"
            >重置</el-button
          >
          <el-button
            v-has="'feedback:my:add'"
            type="primary"
            size="mini"
            @click="openAdd"
            plain
            >新增</el-button
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
          min-width="10%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column property="rate" label="评分" min-width="15%">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.rate"
              class="tb_rate"
              disabled
            ></el-rate>
          </template>
        </el-table-column>
        <el-table-column
          property="content"
          label="反馈内容"
          min-width="30%"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          property="statusLabel"
          label="状态"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          property="solutionLabel"
          label="解决方案"
          min-width="10%"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="medium"
              :type="scope.row.solutionTagType"
            >
              <span>{{ scope.row.solutionLabel }}</span>
              <!-- <i :class="scope.row.solutionIcon"></i> -->
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          property="createdTime"
          label="创建时间"
          min-width="15%"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="10%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.id)"
              v-has="'feedback:my:modify'"
              type="primary"
              size="mini"
              icon="el-icon-more"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.id, scope.$index)"
              v-has="'feedback:my:remove'"
              type="danger"
              size="mini"
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

      <el-dialog
        title="详情"
        :visible.sync="editDialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="dataInfo">
          <el-divider content-position="center">我的评价</el-divider>
          <el-form-item label="时间" label-width="100px">
            <el-input
              v-model="dataInfo.createdTime"
              readonly
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item label="评分" label-width="100px">
            <el-rate v-model="dataInfo.rate" class="rate" disabled></el-rate>
          </el-form-item>
          <el-form-item label="内容" label-width="100px">
            <el-input
              v-model="dataInfo.content"
              readonly
              size="mini"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 6 }"
            ></el-input>
          </el-form-item>
          <el-divider content-position="center">官方回复</el-divider>
          <el-form-item label="时间" label-width="100px">
            <el-input
              v-model="dataInfo.replyTime"
              size="mini"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="内容" label-width="100px">
            <el-input
              v-model="dataInfo.reply"
              size="mini"
              type="textarea"
              readonly
              :autosize="{ minRows: 1, maxRows: 6 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="解决方案" label-width="100px">
            <el-select v-model="dataInfo.solution" disabled size="mini">
              <el-option
                v-for="item in solutionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini"
            >取 消</el-button
          >
          <!-- <el-button type="primary" @click="updateFeedback" size="mini">确 定</el-button> -->
        </div>
      </el-dialog>

      <el-dialog
        title="添加"
        :visible.sync="addDialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*打个分" label-width="100px">
            <el-rate v-model="dataAdd.rate" class="rate"></el-rate>
          </el-form-item>
          <el-form-item label="*吐个槽" label-width="100px">
            <el-input
              v-model="dataAdd.content"
              size="mini"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="handleAdd()" size="mini"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {
  modifyFeedback,
  findMyFeedback,
  findMyFeedbackById,
  removeFeedback,
  saveFeedback
} from "@/api/getData";
export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      dataAdd: {},
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      iconClasses: ["icon-rate-face-1", "icon-rate-face-2", "icon-rate-face-3"],

      statusOptions: [
        {
          value: 0,
          label: "未读"
        },
        {
          value: 1,
          label: "已读待回"
        },
        {
          value: 2,
          label: "已回待阅"
        },
        {
          value: 3,
          label: "已回已阅"
        }
      ],

      solutionOptions: [
        {
          value: 0,
          label: "不予调整"
        },
        {
          value: 1,
          label: "延期解决"
        },
        {
          value: 2,
          label: "已经解决"
        },
        {
          value: 3,
          label: "暂未答复"
        }
      ]
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectFeedbackList(this.queryForm);
  },
  methods: {
    async selectFeedbackList(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      const res = await findMyFeedback(queryForm);
      if (res.code == 200) {
        this.dataList = [];
        this.total = res.data.total;
        this.dataList = res.data.list;
        res.data.list.map(element => {
          if (element.status == 0) {
            element.statusLabel = "未读";
          } else if (element.status == 1) {
            element.statusLabel = "已读待回";
          } else if (element.status == 2) {
            element.statusLabel = "已回待阅";
          } else {
            element.statusLabel = "已回已阅";
          }
          if (element.solution == 0) {
            element.solutionLabel = "不予解决";
            element.solutionIcon = "el-icon-close";
            element.solutionTagType = "info";
          } else if (element.solution == 1) {
            element.solutionLabel = "延期解决";
            element.solutionIcon = "el-icon-star-on";
            element.solutionTagType = "warning";
          } else if (element.solution == 2) {
            element.solutionLabel = "已经解决";
            element.solutionIcon = "el-icon-check";
            element.solutionTagType = "success";
          } else {
            element.solutionLabel = "暂未答复";
            element.solutionIcon = "el-icon-phone-outline";
            element.solutionTagType = "";
          }
          return element;
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    async handleEdit(id) {
      const res = await findMyFeedbackById(id);
      if (res.code == 200) {
        this.dataInfo = res.data;
        this.editDialogFormVisible = true;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleDelete(id, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await removeFeedback(id);
        if (res.code == 200) {
          this.$message({
            type: "success",
            center: true,
            message: res.msg
          });
          this.total--;
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

    async handleAdd() {
      const res = await saveFeedback(this.dataAdd);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: "感谢您提出宝贵的建议~"
        });
        this.addDialogFormVisible = false;
        this.selectFeedbackList({});
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    async updateFeedback() {
      const res = await modifyFeedback(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: "感谢您提出宝贵的建议~"
        });
        this.editDialogFormVisible = false;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = true;
      }
      this.selectFeedbackList(this.queryForm);
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectFeedbackList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectFeedbackList(this.queryForm);
    },

    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
    },

    async resetForm() {
      this.queryForm = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.selectFeedbackList(this.queryForm);
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
.rate {
  position: relative;
  left: -1px;
  top: 10px;
}
.tb_rate {
  position: relative;
  left: -1px;
  top: 3px;
}
</style>
