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
            v-model="queryForm.roleName"
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
        <el-form-item>
          <el-button
            v-has="'role:find'"
            type="primary"
            size="mini"
            @click="selectRoleList(queryForm)"
            >查询</el-button
          >
          <el-button
            v-has="'role:find'"
            type="primary"
            size="mini"
            @click="resetForm"
            >重置</el-button
          >
          <el-button
            v-has="'role:add'"
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
          property="roleId"
          label="编号"
          min-width="20%"
        ></el-table-column>
        <el-table-column
          property="roleName"
          label="名称"
          min-width="50%"
        ></el-table-column>
        <el-table-column property="status" label="状态" min-width="15%">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="updateRoleStatus(scope.row)"
              :active-value="0"
              :inactive-value="1"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.row.roleId)"
              v-has="'role:modify'"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.roleId, scope.$index)"
              v-has="'role:remove'"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
            <el-button
              @click="handleAuthor(scope.row.roleId)"
              v-has="'role:permission'"
              type="warning"
              size="mini"
              icon="el-icon-s-operation"
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
            <el-input v-model="dataInfo.roleName" size="mini"></el-input>
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini"
            >取 消</el-button
          >
          <el-button type="primary" @click="updateRole" size="mini"
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
            <el-input v-model="dataAdd.roleName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-select v-model="dataAdd.status" size="mini">
              <el-option
                v-for="item in statusOptions"
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

      <el-dialog
        title="权限管理"
        :visible.sync="permissionDialogFormVisible"
        :close-on-click-modal="false"
      >
        <div class="el-dialog-div">
          <el-tree
            :props="props"
            :data="permission"
            node-key="id"
            highlight-current
            show-checkbox
            default-expand-all
            ref="tree"
            check-strictly
            :default-checked-keys="checkedPermissionArray"
            :expand-on-click-node="true"
            :filter-node-method="filterNode"
            @check-change="handleCheckChange"
          >
          </el-tree>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {
  findRoleById,
  findRole,
  saveRole,
  modifyRole,
  removeRoleById,
  findAllPermission,
  findPermissionIdArrayByRoleId,
  saveRolePermission,
  removeRolePermission
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
      permissionDialogFormVisible: false,

      statusOptions: [
        {
          value: 0,
          label: "启用"
        },
        {
          value: 1,
          label: "禁用"
        }
      ],

      props: {
        children: "nodeList",
        label: "permissionName"
      },

      filterText: "",
      permission: [],
      checkedPermissionArray: [],
      roleId: null,

      count: 1
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectRoleList(this.queryForm);
  },
  methods: {
    // 节点查找
    filterNode(value, data) {
      if (!value) return true;
      return data.permissionName.indexOf(value) !== -1;
    },
    async selectAllPermission() {
      this.permission = [];
      const res = await findAllPermission();
      if (res.code == 200) {
        this.permission = res.data;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    async selectRoleList(queryForm) {
      queryForm["pageNum"] = this.pageNum;
      queryForm["pageSize"] = this.pageSize;
      const res = await findRole(queryForm);
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
      const res = await saveRole(this.dataAdd);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.addDialogFormVisible = false;
        this.selectRoleList({});
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    async handleEdit(roleId) {
      const res = await findRoleById(roleId);
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
    async handleDelete(roleId, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await removeRoleById(roleId);
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
    async updateRole() {
      const res = await modifyRole(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = false;
        this.selectRoleList(this.queryForm);
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = true;
      }
    },
    async updateRoleStatus(row) {
      const res = await modifyRole(row);
      if (res.code == 200) {
        this.editDialogFormVisible = false;
        this.selectRoleList(this.queryForm);
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
      this.selectRoleList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectRoleList(this.queryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
      this.dataAdd["type"] = 2;
    },
    async resetForm() {
      this.queryForm = {};
      this.pageSize = 10;
      this.pageNum = 1;
      this.type = 2;
      this.selectRoleList(this.queryForm);
    },

    async handleAuthor(roleId) {
      this.roleId = roleId;
      this.selectAllPermission();
      const res = await findPermissionIdArrayByRoleId(roleId);
      if (res.code == 200) {
        this.checkedPermissionArray = res.data;
        this.permissionDialogFormVisible = true;
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },

    async handleCheckChange(data, checked) {
      let roleId = this.roleId;
      let permissionId = data.id;
      if (checked) {
        // 调用新增
        const result = await saveRolePermission({
          roleId: roleId,
          permissionId: permissionId
        });
        if (result.code != 200) {
          this.$message({
            type: "error",
            center: true,
            message: result.msg
          });
        }
      } else {
        //调用删除
        const result = await removeRolePermission({
          roleId: roleId,
          permissionId: permissionId
        });
        if (result.code != 200) {
          this.$message({
            type: "error",
            center: true,
            message: result.msg
          });
        }
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
.el-dialog-div {
  height: 70vh;
  overflow: auto;
}
/* 改变节点高度 */
.el-tree-node__content {
  height: 35px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding-right: 8px;
}
</style>
