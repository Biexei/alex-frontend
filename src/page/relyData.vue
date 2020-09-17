<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="依赖名称">
          <el-input v-model="queryForm.name" placeholder="依赖名称"></el-input>
        </el-form-item>
        <el-form-item label="固定值/方法声明/SQL">
          <el-input v-model="queryForm.value" placeholder="固定值/方法声明/SQL"></el-input>
        </el-form-item>                
        <el-form-item label="类型">
          <el-select v-model="queryForm.type" clearable placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectRelyDataList(queryForm)">查询</el-button>
          <el-button type="primary" @click="queryForm = {}">重置</el-button>
          <el-button type="primary" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="id" label="编号" min-width="5%"></el-table-column>
        <el-table-column property="name" label="名称" min-width="10%"></el-table-column>
        <el-table-column property="type" label="类型" min-width="10%"></el-table-column>
        <el-table-column property="value" label="固定值/方法声明/SQL" min-width="25%"></el-table-column>
        <el-table-column property="desc" label="描述" min-width="30%"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="20%">
          <template slot-scope="scope">
            <el-button 
              @click="handleCheck(scope.row.id)"
              type="success" 
              icon="el-icon-check" 
              circle>
            </el-button>
            <el-button
              @click="handleEdit(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.id, scope.$index)"
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
<!-- 
      <el-dialog title="编辑" :visible.sync="editDialogFormVisible">
        <el-form :model="dataInfo">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="*类型" label-width="100px">
            <el-select v-model="dataInfo.type">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*URL" label-width="100px">
            <el-input v-model="dataInfo.url"></el-input>
          </el-form-item>
          <el-form-item label="*帐号" label-width="100px">
            <el-input v-model="dataInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="*密码" label-width="100px">
            <el-input v-model="dataInfo.password"></el-input>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-radio-group v-model="dataInfo.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="dataInfo.desc"></el-input>
          </el-form-item>  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateDb">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible">
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataAdd.name"></el-input>
          </el-form-item>
          <el-form-item label="*类型" label-width="100px">
            <el-select v-model="dataAdd.type">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*URL" label-width="100px">
            <el-input v-model="dataAdd.url"></el-input>
          </el-form-item>
          <el-form-item label="*帐号" label-width="100px">
            <el-input v-model="dataAdd.username"></el-input>
          </el-form-item>
          <el-form-item label="*密码" label-width="100px">
            <el-input v-model="dataAdd.password"></el-input>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-radio-group v-model="dataAdd.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="dataAdd.desc"></el-input>
          </el-form-item>  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd()">确 定</el-button>
        </div>
      </el-dialog> -->
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { saveRelyData, modifyRelyData, findRelyDataById, findRelyDataList, removeRelyData } from "@/api/getData";
export default {
  data() {
    return {
      queryForm: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dataList: [],
      dataInfo: {},
      dataAdd:{},
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      typeOptions:[
        {
          value: 0,
          label: '固定值'
        },
        {
          value: 1,
          label: '预置方法'
        },
        {
          value: 2,
          label: 'SQL'
        },
      ],
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectRelyDataList(this.queryForm);
  },
  methods: {
    async selectRelyDataList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      this.dataList = []
      const res = await findRelyDataList(this.queryForm)
      if (res.code == 200) {
          this.total = res.data.total
          res.data.list.forEach(element => {
            if (element.type == 0) {
              element.type = '固定值'
            } else if (element.type == 1) {
              element.type = '预置方法'
            } else if (element.type == 2) {
              element.type = 'SQL'
            } else {
              tyoe = '其它'
            }
            this.dataList.push({
                id: element.id,
                name: element.name,
                value: element.value,
                type: element.type,
                desc: element.desc,
            })
          });
          //this.dataList = res.data.list
      } else {
        this.$message({
          type:"error",
          center: true,
          message:res.msg
        });
      }
    },
    async handleCheck(dbId) {
        const res = await checkDb(dbId)
        if (res.code == 200) {
          if(res.msg === '连接成功'){
            this.$message({
              type: "success",
              center: true,
              message: res.msg
            })
          } else {
            this.$message({
              type: "info",
              center: true,
              message: res.msg
            })
          }
        } else {
          this.$message({
            type: "error",
            center: true,
            message: res.msg
          })
        }
    },
    async handleAdd() {
        const res = await saveDb(this.dataAdd);
        if (res.code == 200) {
            this.$message({
            type: "success",
            center: true,
            message: res.msg
            });
            this.addDialogFormVisible = false;
            this.selectRelyDataList({});
        } else {
            this.$message({
            type: "error",
            center: true,
            message: res.msg
            });
        }
    },

    async handleEdit(dbId) {
      const res = await findDbById(dbId);
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
    async handleDelete(dbId, index) {
      const res = await removeDb(dbId);
      if (res.code == 200) {
        this.$message({
          type: "success",
          center: true,
          message: res.msg
        });
        this.total --;
        this.dataList.splice(index, 1);
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
      }
    },
    async updateDb() {
      const res = await modifyDb(this.dataInfo);
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
      this.selectRelyDataList(this.queryForm);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectRelyDataList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectRelyDataList(this.queryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
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
