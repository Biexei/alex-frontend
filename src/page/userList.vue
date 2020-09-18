<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="query" class="demo-form-inline" ref="queryForm">
        <el-form-item label="用户名">
          <el-input v-model="query.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.isEnable" placeholder="状态">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserList(query)">查询</el-button>
          <el-button type="primary" @click="query = {}">重置</el-button>
          <el-button type="primary" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="tableData" stripe highlight-current-row style="width: 100%">
        <el-table-column property="userId" label="用户编号" min-width="15%"></el-table-column>
        <el-table-column property="username" label="用户名" min-width="15%"></el-table-column>
        <el-table-column property="sex" label="性别" min-width="15%"></el-table-column>
        <el-table-column property="realName" label="真实姓名" min-width="15%"></el-table-column>
        <el-table-column property="createdTime" label="注册时间" min-width="15%"></el-table-column>
        <el-table-column property="isEnable" label="状态" min-width="15%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.isEnableStyle"
              disable-transitions>{{scope.row.isEnable}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="20%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.userId)"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.userId, scope.$index)"
              type="danger"
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

      <el-dialog title="编辑" :visible.sync="editDialogFormVisible">
        <el-form :model="userInfo">
          <el-form-item label="*用户名" label-width="100px">
            <el-input v-model="userInfo.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="*密码" label-width="100px">
            <el-input v-model="userInfo.password"></el-input>
          </el-form-item>
          <el-form-item label="工号" label-width="100px">
            <el-input v-model="userInfo.jobNumber"></el-input>
          </el-form-item>
          <el-form-item label="*真实姓名" label-width="100px">
            <el-input v-model="userInfo.realName"></el-input>
          </el-form-item>
          <el-form-item label="*性别" label-width="100px">
            <el-radio-group v-model="userInfo.sex">
              <el-radio :label="0">女</el-radio>
              <el-radio :label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-radio-group v-model="userInfo.isEnable">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="新增" :visible.sync="addDialogFormVisible">
        <el-form :model="addForm" ref="addForm">
          <el-form-item label="*用户名" label-width="100px" prop="username">
            <el-input v-model="addForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="*密码" label-width="100px" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="工号" label-width="100px" prop="jobNumber">
            <el-input v-model="addForm.jobNumber"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" label-width="100px" prop="realName">
            <el-input v-model="addForm.realName"></el-input>
          </el-form-item>
          <el-form-item label="*性别" label-width="100px" prop="sex">
            <el-radio-group v-model="addForm.sex">
              <el-radio :label="0">女</el-radio>
              <el-radio :label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd()">确 定</el-button>
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
  addUser
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
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.getUserList(this.query);
  },
  methods: {
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
    async handleDelete(userId, index) {
      const res = await deleteUser(userId);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.total --;
        this.tableData.splice(index, 1);
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
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
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = true;
      }
      this.getUserList(this.query);
    },
    async getUserList(query) {
      query["pageNum"] = this.pageNum;
      query["pageSize"] = this.pageSize;
      const res = await userList(query);
      console.log(res);
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
        console.log(res.msg);
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
