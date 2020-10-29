<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="query">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
        <el-form-item label="数据源名称">
          <el-input v-model="queryForm.name" placeholder="名称" size='small'></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryForm.type" clearable placeholder="请选择"  size='small'>
            <el-option
              v-for="item in dbTypeOptions"
              :key="item.value"
              size='small'
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="queryForm.desc" placeholder="描述"  size='small'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="selectDbList(queryForm)">查询</el-button>
          <el-button type="primary" size="small" @click="resetForm">重置</el-button>
          <el-button type="primary" size="small" @click="openAdd" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table :data="dataList" stripe highlight-current-row style="width: 100%">
        <el-table-column property="id" label="编号" min-width="10%"></el-table-column>
        <el-table-column property="name" label="名称" min-width="13%"></el-table-column>
        <el-table-column property="type" label="类型" min-width="13%"></el-table-column>
        <el-table-column property="desc" label="描述" min-width="13%" show-overflow-tooltip></el-table-column>
        <el-table-column property="createdTime" label="创建时间" min-width="20%"></el-table-column>
        <el-table-column property="status" label="状态" min-width="10%">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.statusStyle"
              disable-transitions>{{scope.row.status}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button 
              @click="handleCheck(scope.row.id)"
              type="success"
              size="small" 
              icon="el-icon-check" 
              circle>
            </el-button>
            <el-button
              @click="handleEdit(scope.row.id)"
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="handleDelete(scope.row.id, scope.$index)"
              type="danger"
              size="small"
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

      <el-dialog title="编辑" :visible.sync="editDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataInfo">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataInfo.name" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*类型" label-width="100px">
            <el-select v-model="dataInfo.type" size='small'>
              <el-option
                v-for="item in dbTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*调试环境" label-width="100px">
            <el-row>
              <el-col :span="4"><el-input v-model="dataInfo.username" size='small' placeholder="*用户名"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataInfo.password" size='small' placeholder="*密码"></el-input></el-col>
              <el-col :span="16"><el-input v-model="dataInfo.url" size='small' placeholder="*连接地址"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*开发环境" label-width="100px">
            <el-row>
              <el-col :span="4"><el-input v-model="dataInfo.devUsername" size='small' placeholder="*用户名"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataInfo.devPassword" size='small' placeholder="*密码"></el-input></el-col>
              <el-col :span="16"><el-input v-model="dataInfo.devUrl" size='small' placeholder="*连接地址"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*测试环境" label-width="100px">
            <el-row>
              <el-col :span="4"><el-input v-model="dataInfo.testUsername" size='small' placeholder="*用户名"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataInfo.testPassword" size='small' placeholder="*密码"></el-input></el-col>
              <el-col :span="16"><el-input v-model="dataInfo.testUrl" size='small' placeholder="*连接地址"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*预发环境" label-width="100px">
            <el-row>
              <el-col :span="4"><el-input v-model="dataInfo.stgUsername" size='small' placeholder="*用户名"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataInfo.stgPassword" size='small' placeholder="*密码"></el-input></el-col>
              <el-col :span="16"><el-input v-model="dataInfo.stgUrl" size='small' placeholder="*连接地址"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*线上环境" label-width="100px">
            <el-row>
              <el-col :span="4"><el-input v-model="dataInfo.prodUsername" size='small' placeholder="*用户名"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataInfo.prodPassword" size='small' placeholder="*密码"></el-input></el-col>
              <el-col :span="16"><el-input v-model="dataInfo.prodUrl" size='small' placeholder="*连接地址"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-radio-group v-model="dataInfo.status" size='small'>
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="dataInfo.desc" size='small'></el-input>
          </el-form-item>  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="updateDb" size="small">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加" :visible.sync="addDialogFormVisible" :close-on-click-modal=false>
        <el-form :model="dataAdd" ref="dataAdd">
          <el-form-item label="*名称" label-width="100px">
            <el-input v-model="dataAdd.name" size='small'></el-input>
          </el-form-item>
          <el-form-item label="*类型" label-width="100px">
            <el-select v-model="dataAdd.type" size='small'>
              <el-option
                v-for="item in dbTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*调试环境" label-width="100px">
            <el-row>
              <el-col :span="4"><el-input v-model="dataAdd.username" size='small' placeholder="*用户名"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataAdd.password" size='small' placeholder="*密码"></el-input></el-col>
              <el-col :span="16"><el-input v-model="dataAdd.url" size='small' placeholder="*连接地址"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*开发环境" label-width="100px">
            <el-row>
              <el-col :span="4"><el-input v-model="dataAdd.devUsername" size='small' placeholder="*用户名"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataAdd.devPassword" size='small' placeholder="*密码"></el-input></el-col>
              <el-col :span="16"><el-input v-model="dataAdd.devUrl" size='small' placeholder="*连接地址"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*测试环境" label-width="100px">
            <el-row>
              <el-col :span="4"><el-input v-model="dataAdd.testUsername" size='small' placeholder="*用户名"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataAdd.testPassword" size='small' placeholder="*密码"></el-input></el-col>
              <el-col :span="16"><el-input v-model="dataAdd.testUrl" size='small' placeholder="*连接地址"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*预发环境" label-width="100px">
            <el-row>
              <el-col :span="4"><el-input v-model="dataAdd.stgUsername" size='small' placeholder="*用户名"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataAdd.stgPassword" size='small' placeholder="*密码"></el-input></el-col>
              <el-col :span="16"><el-input v-model="dataAdd.stgUrl" size='small' placeholder="*连接地址"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*线上环境" label-width="100px">
            <el-row>
              <el-col :span="4"><el-input v-model="dataAdd.prodUsername" size='small' placeholder="*用户名"></el-input></el-col>
              <el-col :span="4"><el-input v-model="dataAdd.prodPassword" size='small' placeholder="*密码"></el-input></el-col>
              <el-col :span="16"><el-input v-model="dataAdd.prodUrl" size='small' placeholder="*连接地址"></el-input></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="*状态" label-width="100px">
            <el-radio-group v-model="dataAdd.status" size='small'>
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" label-width="100px">
            <el-input v-model="dataAdd.desc" size='small'></el-input>
          </el-form-item>  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="handleAdd()" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { saveDb, modifyDb, findDbById, findDbList, removeDb, checkDb } from "@/api/getData";
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
      dbTypeOptions:[
        {
          value: 0,
          label: 'MySQL'
        },
        {
          value: 1,
          label: 'Oracle'
        },
        {
          value: 2,
          label: 'SQL Server'
        },
      ],
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.selectDbList(this.queryForm);
  },
  methods: {
    async selectDbList(queryForm){
      queryForm['pageNum'] = this.pageNum
      queryForm['pageSize'] = this.pageSize
      this.dataList = []
      const res = await findDbList(queryForm)
      if (res.code == 200) {
          this.total = res.data.total
          res.data.list.forEach(element => {
            if (element.type == 0) {
              element.type = 'MySQL'
            } else if (element.type == 1) {
              element.type = 'Oracle'
            } else if (element.type == 2) {
              element.type = 'SQL Server'
            } else {
              type = 'Others'
            }
            this.dataList.push({
                id: element.id,
                name: element.name,
                type: element.type,
                desc: element.desc,
                createdTime: element.createdTime,
                statusStyle: element.status == 0?'success':'danger',
                status: element.status == 0?'启用':'禁用'
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
            this.selectDbList({});
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
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
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
      })
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
        this.selectDbList(this.queryForm);
      } else {
        this.$message({
          type: "error",
          center: true,
          message: res.msg
        });
        this.editDialogFormVisible = true;
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.selectDbList(this.queryForm);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.selectDbList(this.queryForm);
    },
    async openAdd() {
      this.addDialogFormVisible = true;
      this.dataAdd = {};
      this.dataAdd.status = 0
    },
    async resetForm() {
      this.queryForm = {}
      this.pageSize = 10
      this.pageNum = 1
      this.selectDbList(this.queryForm)
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
</style>
