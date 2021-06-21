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
        <el-form-item label="名称">
          <el-input
            v-model="queryForm.name"
            placeholder="名称"
            size="mini"
          ></el-input>
        </el-form-item>
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
        <el-form-item label="描述">
          <el-input
            v-model="queryForm.desc"
            placeholder="描述"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-has="'setting:proxy:find'"
            type="primary"
            size="mini"
            @click="selectSettingList(queryForm)"
            >查询</el-button
          >
          <el-button
            v-has="'setting:proxy:find'"
            type="primary"
            size="mini"
            @click="resetForm"
            >重置</el-button
          >
          <el-button
            v-has="'setting:proxy:add'"
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
          property="settingId"
          label="编号"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          property="name"
          label="名称"
          min-width="15%"
        ></el-table-column>
        <el-table-column
          property="value"
          label="代理地址"
          min-width="15%"
        ></el-table-column>
        <el-table-column
          property="createdTime"
          label="创建时间"
          min-width="15%"
        ></el-table-column>
        <el-table-column property="status" label="状态" min-width="10%">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="updateSettingStatus(scope.row)"
              :active-value="0"
              :inactive-value="1"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="10%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.settingId)"
              v-has="'setting:proxy:modify'"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.settingId, scope.$index)"
              v-has="'setting:proxy:remove'"
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
        title="编辑"
        :visible.sync="editDialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="dataInfo">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataInfo.name" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*地址" label-width="100px">
            <el-input v-model="dataInfo.host" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*端口" label-width="100px">
            <el-input v-model="dataInfo.port" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-select v-model="dataInfo.status" size="mini">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="dataInfo.desc" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="updateSetting" size="mini"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        title="添加"
        :visible.sync="addDialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataAdd.name" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*地址" label-width="100px">
            <el-input v-model="dataAdd.host" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*端口" label-width="100px">
            <el-input v-model="dataAdd.port" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="dataAdd.desc" size="mini"></el-input>
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
  findHttpSettingById,
  findHttpSetting,
  saveHttpSetting,
  modifyHttpSetting,
  removeHttpSettingById
} from "@/api/getData";
export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {
        name: "",
        value: "",
        desc: "",
        status: null,
        type: 0,
        host: "",
        port: null
      },
      dataAdd: {},
      editDialogFormVisible: false,
      addDialogFormVisible: false,

      statusOptions: [
        {
          value: 0,
          label: "启用"
        },
        {
          value: 1,
          label: "禁用"
        }
      ]
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectSettingList(this.queryForm);
  },
  methods: {
    async selectSettingList(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      queryForm["type"] = 0;
      const res = await findHttpSetting(queryForm);
      if (res.code == 200) {
        this.dataList = [];
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
    async handleAdd() {
      this.dataAdd["type"] = 0;
      this.dataAdd["value"] = this.dataAdd.host + ":" + this.dataAdd.port;
      const res = await saveHttpSetting(this.dataAdd);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.addDialogFormVisible = false;
        this.selectSettingList({});
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    async handleEdit(settingId) {
      const res = await findHttpSettingById(settingId);
      if (res.code == 200) {
        let temp = res.data.value.split(":");
        this.dataInfo.host = temp[0];
        this.dataInfo.port = temp[1];
        this.dataInfo.name = res.data.name;
        this.dataInfo.desc = res.data.desc;
        this.dataInfo.type = res.data.type;
        this.dataInfo.status = res.data.status;
        this.dataInfo.settingId = res.data.settingId;
        this.editDialogFormVisible = true;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleDelete(settingId, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await removeHttpSettingById(settingId);
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
    async updateSetting() {
      this.dataInfo["value"] =
        this.dataInfo["host"] + ":" + this.dataInfo["port"];
      const res = await modifyHttpSetting(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
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
      this.selectSettingList(this.queryForm);
    },
    async updateSettingStatus(row) {
      const res = await modifyHttpSetting(row);
      if (res.code == 200) {
        this.editDialogFormVisible = false;
        this.selectSettingList(this.queryForm);
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
      this.selectSettingList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectSettingList(this.queryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
      this.dataAdd["type"] = 0;
    },
    async resetForm() {
      this.queryForm = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.type = 0;
      this.selectSettingList(this.queryForm);
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
