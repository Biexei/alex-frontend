<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="输入关键字"
            size = "mini"
            v-model="filterText">
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button v-has="'permission:add_top'" @click="addTopDialogFormVisible = true" type="primary" plain size="mini">添加顶级节点</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table_container">
      <el-tree
        :props="props"
        :data="permission"
        node-key="id"
        highlight-current
        ref="tree"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :render-content="renderContent"
        @check-change="handleCheckChange">
      </el-tree>

      <el-dialog title="编辑" :visible.sync="editDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataInfo" ref="dataInfo">
            <el-form-item label="编号" label-width="100px">
              <el-input v-model="dataInfo.id" size='mini' disabled></el-input>
            </el-form-item> 
            <el-form-item label="权限代码" label-width="100px">
              <el-input v-model="dataInfo.permissionCode" size='mini' @input="change($event)"></el-input>
            </el-form-item> 
            <el-form-item label="权限名称" label-width="100px">
              <el-input v-model="dataInfo.permissionName" size='mini' @input="change($event)"></el-input>
            </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="handleEdit()" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataAdd" ref="dataAdd">
            <el-divider content-position="center">父节点</el-divider>
            <el-form-item label="编号" label-width="100px">
              <el-input v-model="dataAdd.parentId" size='mini' disabled></el-input>
            </el-form-item> 
            <el-form-item label="权限代码" label-width="100px">
              <el-input v-model="dataAdd.parentPermissionCode" size='mini' disabled></el-input>
            </el-form-item> 
            <el-form-item label="权限名称" label-width="100px">
              <el-input v-model="dataAdd.parentPermissionName" size='mini' disabled></el-input>
            </el-form-item> 
            <el-divider content-position="center">添加</el-divider>
            <el-form-item label="权限代码" label-width="100px">
              <el-input v-model="dataAdd.permissionCode" size='mini' ></el-input>
            </el-form-item> 
            <el-form-item label="权限名称" label-width="100px">
              <el-input v-model="dataAdd.permissionName" size='mini' ></el-input>
            </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="handleAdd()" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加顶级节点" :visible.sync="addTopDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataAddTop" ref="dataAddTop">
            <el-form-item label="权限代码" label-width="100px">
              <el-input v-model="dataAddTop.permissionCode" size='mini' ></el-input>
            </el-form-item> 
            <el-form-item label="权限名称" label-width="100px">
              <el-input v-model="dataAddTop.permissionName" size='mini' ></el-input>
            </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addTopDialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="handleAddTop()" size="mini">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { findAllPermission, savePermission, modifyPermission, removePermissionById, findPermissionById} from "@/api/getData";
export default {
  data() {
    return {
      dataAdd:{},
      dataAddTop:{},
      dataInfo:{},
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      addTopDialogFormVisible: false,

      props: {
        children: 'nodeList',
        label: 'permissionName'
      },

      filterText: '',
      permission: [],

    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectAllPermission();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    async selectAllPermission(){
      this.permission = []
      const res = await findAllPermission()
      if (res.code == 200) {
          this.permission = res.data
      } else {
        this.$message({
          type:"error",
          center: true,
          message:res.msg
        });
      }
    },
    async handleAdd() {
        const res = await savePermission(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectAllPermission();
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },

    async handleAddTop(){
        this.dataAddTop.parentId = null
        const res = await savePermission(this.dataAddTop);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addTopDialogFormVisible = false;
            this.dataAddTop = {}
            this.selectAllPermission();
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },

    async handleEdit() {
      const res = await modifyPermission(this.dataInfo);
      if (res.code == 200) {
        this.dataInfo = res.data;
        this.editDialogFormVisible = false;
        this.editDialogFormVisible = false;
        this.selectAllPermission();
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    handleCheckChange() {

    },

    // 节点查找
    filterNode(value, data) {
      if (!value) return true;
      return data.permissionName.indexOf(value) !== -1;
    },
    append(data) {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
      this.dataAdd.parentPermissionCode = data.permissionCode
      this.dataAdd.parentPermissionName = data.permissionName
      this.dataAdd.parentId = data.id
    },
    edit(data) {
      this.editDialogFormVisible = true;
      this.dataInfo = {};
      this.dataInfo["permissionCode"] = data.permissionCode
      this.dataInfo["permissionName"] = data.permissionName
      this.dataInfo["id"] = data.id
      this.dataInfo["parentId"] = data.parentId
    },
    remove(node, data) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await removePermissionById(data.id);
        if (res.code == 200) {
          this.$message({
            type: "success",
            center: true,
            message: res.msg
          });
          this.selectAllPermission();
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          });
        }
      })  
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span class="right">
            <el-button  size="mini" type="text" plain on-click={ () => this.append(data) }>添加</el-button>
            <el-button  size="mini" type="text" plain on-click={ () => this.edit(data) }>编辑</el-button>
            <el-button  size="mini" type="text" plain on-click={ () => this.remove(node, data) }>删除</el-button>
          </span>
        </span>);
    },
    // 解决无法编辑框无法输入的问题
    change(e) {
      this.$forceUpdate()
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
.right {
    position: absolute;
    right: 0px;
    width: 300px; 
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
  font-size: 14px;
  padding-right: 8px;
}
</style>
