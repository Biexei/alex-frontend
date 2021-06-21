<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%; ">
      <el-col :span="4" class="left-color" style="min-height: 100%">
        <el-menu
          :default-active="defaultActive"
          style="min-height: 100%"
          class="left-color"
          router
        >
          <el-menu-item index="analysis" class="left-color"
            ><i class="el-icon-pie-chart"></i
            ><span slot="title" class="title-color">首页</span></el-menu-item
          >
          <!-- <el-menu-item index="manage" class="left-color"><i class="el-icon-pie-chart"></i><span slot="title" class="title-color">仪表盘</span></el-menu-item> -->
          <el-menu-item v-has="'user'" index="userList" class="left-color"
            ><i class="el-icon-s-custom"></i
            ><span slot="title" class="title-color"
              >用户管理</span
            ></el-menu-item
          >
          <el-menu-item v-has="'role'" index="role" class="left-color"
            ><i class="el-icon-place"></i
            ><span slot="title" class="title-color"
              >角色管理</span
            ></el-menu-item
          >
          <el-menu-item
            v-has="'permission'"
            index="permission"
            class="left-color"
            ><i class="el-icon-s-operation"></i
            ><span slot="title" class="title-color"
              >权限管理</span
            ></el-menu-item
          >
          <el-menu-item v-has="'project'" index="projectList" class="left-color"
            ><i class="el-icon-s-flag"></i
            ><span slot="title" class="title-color"
              >项目管理</span
            ></el-menu-item
          >
          <el-menu-item v-has="'module'" index="moduleList" class="left-color"
            ><i class="el-icon-potato-strips"></i
            ><span slot="title" class="title-color"
              >模块管理</span
            ></el-menu-item
          >
          <el-menu-item v-has="'db'" index="dbList" class="left-color"
            ><i class="el-icon-coin"></i
            ><span slot="title" class="title-color"
              >数据源中心</span
            ></el-menu-item
          >
          <el-menu-item v-has="'factory'" index="dataFactory" class="left-color"
            ><i class="el-icon-tickets"></i
            ><span slot="title" class="title-color"
              >数据工厂</span
            ></el-menu-item
          >
          <el-submenu v-has="'data_center'" index="1" class="left-color">
            <template slot="title" class="left-color"
              ><i class="el-icon-more"></i
              ><span slot="title" class="title-color">数据中心</span></template
            >
            <el-menu-item
              v-has="'data_center:temp_env'"
              index="tempEnv"
              class="left-color"
              ><i class="el-icon-position"></i
              ><span slot="title" class="title-color"
                >临时变量</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'data_center:if_rely'"
              index="ifRelyData"
              class="left-color"
              ><i class="el-icon-ice-cream-square"></i
              ><span slot="title" class="title-color"
                >接口依赖</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'data_center:rely_data'"
              index="relyData"
              class="left-color"
              ><i class="el-icon-ice-cream-round"></i
              ><span slot="title" class="title-color"
                >其它依赖</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'data_center:rely_sql_data'"
              index="relySqlData"
              class="left-color"
              ><i class="el-icon-cloudy"></i
              ><span slot="title" class="title-color"
                >SQL语句</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'data_center:rely_init_method'"
              index="relyInitMethodData"
              class="left-color"
              ><i class="el-icon-partly-cloudy"></i
              ><span slot="title" class="title-color"
                >预置方法</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'data_center:rely_fixed_data'"
              index="relyFixedData"
              class="left-color"
              ><i class="el-icon-cloudy-and-sunny"></i
              ><span slot="title" class="title-color"
                >环境变量</span
              ></el-menu-item
            >
          </el-submenu>
          <el-submenu v-has="'interface'" index="2" class="left-color">
            <template slot="title" class="left-color"
              ><i class="el-icon-suitcase-1"></i
              ><span slot="title" class="title-color">接口测试</span></template
            >
            <el-menu-item
              v-has="'interface:case'"
              index="ifCase"
              class="left-color"
              ><i class="el-icon-wallet"></i
              ><span slot="title" class="title-color"
                >测试用例</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'interface:suite'"
              index="ifSuite"
              class="left-color"
              ><i class="el-icon-folder"></i
              ><span slot="title" class="title-color"
                >测试套件</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'interface:assert_log'"
              index="ifReport"
              class="left-color"
              ><i class="el-icon-s-data"></i
              ><span slot="title" class="title-color"
                >测试报告</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'interface:case_log'"
              index="executeLog"
              class="left-color"
              ><i class="el-icon-zoom-in"></i
              ><span slot="title" class="title-color"
                >执行日志</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'interface:ifreport'"
              index="ifAssertLog"
              class="left-color"
              ><i class="el-icon-first-aid-kit"></i
              ><span slot="title" class="title-color"
                >断言日志</span
              ></el-menu-item
            >
          </el-submenu>
          <el-submenu v-has="'mock'" index="3" class="left-color">
            <template slot="title" class="left-color"
              ><i class="el-icon-odometer"></i
              ><span slot="title" class="title-color">Mocker</span></template
            >
            <el-menu-item
              v-has="'mock:node'"
              index="mockNode"
              class="left-color"
              ><i class="el-icon-s-opportunity"></i
              ><span slot="title" class="title-color"
                >节点管理</span
              ></el-menu-item
            >
            <el-menu-item v-has="'mock:api'" index="mockApi" class="left-color"
              ><i class="el-icon-attract"></i
              ><span slot="title" class="title-color"
                >接口管理</span
              ></el-menu-item
            >
          </el-submenu>
          <el-submenu v-has="'setting'" index="4" class="left-color">
            <template slot="title" class="left-color"
              ><i class="el-icon-setting"></i
              ><span slot="title" class="title-color">配置中心</span></template
            >
            <!-- 拆分为代理和邮箱两个类目 -->
            <!-- <el-menu-item index="httpSetting"  class="left-color"><i class="el-icon-s-tools"></i><span slot="title" class="title-color">全局配置</span></el-menu-item> -->
            <el-menu-item v-has="'setting:task'" index="task" class="left-color"
              ><i class="el-icon-alarm-clock"></i
              ><span slot="title" class="title-color"
                >定时任务</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'setting:email'"
              index="email"
              class="left-color"
              ><i class="el-icon-folder-opened"></i
              ><span slot="title" class="title-color"
                >邮箱管理</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'setting:proxy'"
              index="proxy"
              class="left-color"
              ><i class="el-icon-link"></i
              ><span slot="title" class="title-color"
                >代理配置</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'setting:timeout'"
              index="timeout"
              class="left-color"
              ><i class="el-icon-discover"></i
              ><span slot="title" class="title-color"
                >超时配置</span
              ></el-menu-item
            >
          </el-submenu>
          <el-submenu v-has="'feedback'" index="5" class="left-color">
            <template slot="title" class="left-color"
              ><i class="el-icon-info"></i
              ><span slot="title" class="title-color">反馈中心</span></template
            >
            <el-menu-item
              v-has="'feedback:list'"
              index="feedbackList"
              class="left-color"
              ><i class="el-icon-s-platform"></i
              ><span slot="title" class="title-color"
                >反馈列表</span
              ></el-menu-item
            >
            <el-menu-item
              v-has="'feedback:my'"
              index="myFeedback"
              class="left-color"
              ><i class="el-icon-position"></i
              ><span slot="title" class="title-color"
                >我的反馈</span
              ></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;">
        <router-view></router-view>
        <!-- 下面这种切换路由时不会刷新页面 -->
        <!-- <keep-alive>
				    <router-view></router-view>
				</keep-alive> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>
<style lang="less" scoped>
@import "../style/mixin";
.left-color {
  background-color: #324057;
}
.title-color {
  color: #bfcbd9;
}
</style>
