<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="query">
            <el-form :inline="true" :model="query" class="demo-form-inline">
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
                </el-form-item>
            </el-form>
        </div>        
        <div class="table_container">
            <el-table
                :data="tableData"
                stripe
                highlight-current-row
                style="width: 100%">
                <el-table-column
                  property="userId"
                  label="用户编号"
                  min-width="15%">
                </el-table-column>
                <el-table-column
                  property="username"
                  label="用户名"
                  min-width="15%">
                </el-table-column>
                <el-table-column
                  property="sex"
                  label="性别"
                  min-width="15%">
                </el-table-column>
                <el-table-column
                  property="isEnable"
                  label="状态"
                  min-width="15%">
                </el-table-column>
                <el-table-column
                  property="createdTime"
                  label="注册时间"
                  min-width="15%">
                </el-table-column>
                <el-table-column
                  property="realName"
                  label="真实姓名"
                  min-width="15%">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  property="realName"
                  label="操作"
                  min-width="20%">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button @click="handleClick(scope.row)" type="primary" icon="el-icon-delete" circle></el-button>
                  </template>
                  </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 30]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {userList} from '@/api/getData'
    export default {
        data(){
            return {
                query: {},
                total: 0,
                pageSize: 10,
                pageNum: 1,
                tableData: [],
            }
        },
    	components: {
    		headTop,
    	},
        mounted(){
                this.getUserList(this.query);
        },
        methods: {
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.tableData = [];
                this.getUserList(this.query);
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.tableData = [];
                this.getUserList(this.query);
            },
            async getUserList(query){
                query["pageNum"] = this.pageNum;
                query["pageSize"] = this.pageSize;
                const res = await userList(query);
                console.log(res)
                if (res.code == 200) {
                    this.total = res.data.total
                    res.data.list.forEach(element => {
                        const user = {}
                        user.userId = element.userId
                        user.username = element.username
                        user.sex = element.sex == 0 ? "女" : "男"
                        user.isEnable = element.isEnable == 0 ? "启用" : "禁用"
                        user.createdTime = element.createdTime
                        user.realName = element.realName
                        this.tableData.push(user)
                    });
                } else {
                    console.log(res.msg)
                }
            }
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
    .table_container{
        //padding: 20px;
    }
    .query{
        padding: 20px;
    }
</style>
