<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%; ">
	  		<el-col :span="4" class="left-color" style="min-height: 100%">
				<el-menu :default-active="defaultActive" style="min-height: 100%"  class="left-color" router>
					<el-menu-item index="userList" class="left-color"><i class="el-icon-s-custom"></i><span slot="title">用户管理</span></el-menu-item>
					<el-menu-item index="projectList" class="left-color"><i class="el-icon-s-flag"></i><span slot="title">项目管理</span></el-menu-item>
					<el-menu-item index="moduleList" class="left-color"><i class="el-icon-potato-strips"></i><span slot="title">模块管理</span></el-menu-item>
					<el-menu-item index="dbList" class="left-color"><i class="el-icon-coin"></i><span slot="title">数据源中心</span></el-menu-item>
					<el-submenu index="1">
						<template slot="title"><i class="el-icon-plus"></i><span slot="title">数据中心</span></template>
						<el-menu-item index="ifRelyData"><span slot="title">接口依赖</span></el-menu-item>
						<el-menu-item index="relyData"><span slot="title">自定义依赖</span></el-menu-item>
					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
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
    }
</script>
<style lang="less" scoped>
	@import '../style/mixin';
	.left-color{
		background-color: #324057
	}
	.title-color{
		color: #bfcbd9
	}
</style>
