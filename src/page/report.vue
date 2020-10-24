<template>
    <div class="manage_page fillcontain">
      <div class="header">
        <div class="report_name"><p style="margin: 0 auto; font-weight: 600; font-size: 12px;">Alex</p></div>
        <div style="margin:0 auto;width:500px;text-align:center;font-weight: 600; font-size: 12px; align: center;">{{suiteLogNo}}</div>
      </div>
        <el-row style="height: 100%;">
	  		<el-col :span="1" class="menu-color" style="min-height: 100%" >
				<el-menu :default-active="defaultActive" style="min-height: 100%;"  @select="anchor">
					<el-menu-item index="reportSummary" class="menu-color"><i class="el-icon-s-data"></i></el-menu-item>
					<el-menu-item index="reportChannel" class="menu-color"><i class="el-icon-monitor"></i></el-menu-item>
				</el-menu>
			</el-col>
            <el-col :span="23" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        computed: {
            defaultActive: function(){
                return this.$route.path.replace('/', '');
            }
        },
        mounted() {
            this.initSuiteLogNo()
        },
    	data(){
    		return {
                suiteLogNo:""
    		}
        },
        methods: {
            anchor(index, indexPath) {
                this.$router.push({
                    name: index,
                    query: {
                        suiteLogNo: this.suiteLogNo,
                    },
                })
            },
            initSuiteLogNo() {
                this.suiteLogNo = this.$route.query.suiteLogNo
            }
        } 
    }
</script>
<style lang="less" scoped>
	@import '../style/mixin';
	.menu-color{
		background-color: #324057
	}
	.title-color{
		color: #bfcbd9
    }
	.header{
        color: #F5F5F5;
        background-color: #324057;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
	.report_name{
		background-color: #1565C0;
        height: 50px;
        width: 4.1%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
    }
</style>