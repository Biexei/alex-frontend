<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form
        :inline="true"
        :model="query"
        class="demo-form-inline"
        ref="queryForm"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="query.username"
            placeholder="用户名"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.isEnable" placeholder="状态" size="mini">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-has="'user:find'"
            type="primary"
            size="mini"
            @click="getUserList(query)"
            >查询</el-button
          >
          <el-button
            v-has="'user:find'"
            type="primary"
            size="mini"
            @click="resetForm"
            >重置</el-button
          >
          <el-button
            v-has="'user:add'"
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
        :data="tableData"
        stripe
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          property="userId"
          label="用户编号"
          min-width="20%"
        ></el-table-column>
        <el-table-column
          property="username"
          label="用户名"
          min-width="20%"
        ></el-table-column>
        <el-table-column
          property="realName"
          label="昵称"
          min-width="20%"
        ></el-table-column>
        <el-table-column
          property="createdTime"
          label="注册时间"
          min-width="20%"
        ></el-table-column>
        <el-table-column property="isEnable" label="状态" min-width="20%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              size="small"
              :type="scope.row.isEnableStyle"
              disable-transitions
              >{{ scope.row.isEnable }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.userId)"
              v-has="'user:modify'"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.userId, scope.$index)"
              v-has="'user:remove'"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
            <el-button
              @click="handleResetPwd(scope.row.userId)"
              v-has="'user:reset'"
              type="info"
              size="mini"
              icon="el-icon-refresh-right"
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
        @open="selectRole"
      >
        <el-form :model="userInfo">
          <el-form-item label="*用户名" label-width="100px">
            <el-input
              v-model="userInfo.username"
              auto-complete="off"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item label="工号" label-width="100px">
            <el-input v-model="userInfo.jobNumber" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*昵称" label-width="100px">
            <el-input v-model="userInfo.realName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*性别" label-width="100px">
            <el-radio-group v-model="userInfo.sex" size="mini">
              <el-radio :label="0">女</el-radio>
              <el-radio :label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-radio-group v-model="userInfo.isEnable" size="mini">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="*角色" label-width="100px" prop="name">
            <el-select
              v-model="userInfo.roleId"
              @change="handleSelectRole"
              size="mini"
            >
              <el-option
                size="mini"
                v-for="item in roleOptions"
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
          <el-button type="primary" @click="updateUser" size="mini"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        title="新增"
        :visible.sync="addDialogFormVisible"
        :close-on-click-modal="false"
        @open="selectRole"
      >
        <el-form :model="addForm" ref="addForm">
          <el-form-item label="*用户名" label-width="100px" prop="username">
            <el-input
              v-model="addForm.username"
              auto-complete="off"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item label="*密码" label-width="100px" prop="password">
            <el-input
              v-model="addForm.password"
              size="mini"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="工号" label-width="100px" prop="jobNumber">
            <el-input v-model="addForm.jobNumber" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*昵称" label-width="100px" prop="realName">
            <el-input v-model="addForm.realName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*性别" label-width="100px" prop="sex">
            <el-radio-group v-model="addForm.sex" size="mini">
              <el-radio :label="0">女</el-radio>
              <el-radio :label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="*角色" label-width="100px" prop="name">
            <el-select
              v-model="addForm.roleId"
              @change="handleSelectRole"
              size="mini"
            >
              <el-option
                size="mini"
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
  userList,
  deleteUser,
  getUserInfo,
  modifyUserInfo,
  addUser,
  pwdReset,
  findAllRole
} from "@/api/getData";
export default {
  data() {
    return {
      query: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      tableData: [],
      userInfo: {},
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      addForm: {},
      roleOptions: []
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.getUserList(this.query);
  },
  methods: {
    async selectRole() {
      this.roleOptions = [];
      const res = await findAllRole({ status: 0 });
      if (res.code == 200) {
        let dataList = res.data;
        dataList.forEach((item, index) => {
          this.roleOptions.push({
            label: item.roleName,
            value: item.roleId,
            index: index
          });
        });
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
      this.getUserList(this.query);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getUserList(this.query);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.addForm = {};
    },
    async handleResetPwd(userId) {
      this.$confirm("此操作将重置密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await pwdReset(userId);
        if (res.code == 200) {
          this.$message({
            type: "success",
            center: true,
            message: res.msg
          });
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
      this.query = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.getUserList(this.query);
    },
    async handleAdd() {
      const res = await addUser(this.addForm);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.addDialogFormVisible = false;
        this.getUserList({});
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async handleEdit(userId) {
      const res = await getUserInfo(userId);
      if (res.code == 200) {
        this.userInfo = res.data;
        this.editDialogFormVisible = true;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    handleDelete(userId, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let res = await deleteUser(userId);
        if (res.code == 200) {
          this.$message({
            type: "success",
            center: true,
            message: res.msg
          });
          this.total--;
          this.tableData.splice(index, 1);
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          });
        }
      });
    },
    async updateUser() {
      const res = await modifyUserInfo(this.userInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
        this.getUserList(this.query);
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = true;
      }
    },
    async handleSelectRole(roleId) {
      this.userInfo["roleId"] = roleId;
      this.addForm["roleId"] = roleId;
    },
    async getUserList(query) {
      query["pageNum"] = this.pageNum;
      query["pageSize"] = this.pageSize;
      const res = await userList(query);
      if (res.code == 200) {
        this.tableData = [];
        this.total = res.data.total;
        res.data.list.forEach(element => {
          const user = {};
          user.userId = element.userId;
          user.username = element.username;
          user.sex = element.sex == 0 ? "女" : "男";
          user.isEnableStyle = element.isEnable == 1 ? "success" : "danger";
          user.isEnable = element.isEnable == 1 ? "启用" : "禁用";
          user.createdTime = element.createdTime;
          user.realName = element.realName;
          this.tableData.push(user);
        });
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
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
