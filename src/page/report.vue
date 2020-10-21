<template>
    <div class="manage_page fillcontain">
        <el-row style="height: 100%">
            <el-col :span="1" style="min-height: 100%">
                <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" background-color="#324057" text-color="#fff" style="min-height: 100%"  router>
                    <el-menu-item index="ifSuiteReport?suiteLogNo=20201021112510NIOVR64772">
                        <i class="el-icon-setting"></i>
                        <span slot="title"></span>
                    </el-menu-item>
                    <el-menu-item index="ifSuiteReport?suiteLogNo=20201021112510NIOVR64772">
                        <i class="el-icon-setting"></i>
                        <span slot="title"></span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="23">
                <div style="height: 100%;overflow: auto;">
                    <router-view></router-view>
                </div>
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