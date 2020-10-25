<template>
    <div class="header_container">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/analysis' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta.path" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="btn-div">
		<el-tooltip effect="dark" content="Json格式化" placement="left-end">
			<el-button @click=handleBeautyJson size="mini" type="primary" circle icon="el-icon-magic-stick"></el-button>
		</el-tooltip>
		<!-- <el-tooltip effect="dark" content="XML格式化" placement="left-end">
			<el-button @click=handleBeautyXml size="mini" type="primary"  plain>XML</el-button>
		</el-tooltip> -->
		<el-tooltip effect="dark" content="注销" placement="left-end">
			 <el-button type="danger" icon="el-icon-switch-button" circle size="mini" @click=logout></el-button>
		</el-tooltip>
		</div>
		<el-drawer title="Json格式化" 
		direction="ltr"
		size="50%"
		:visible.sync="showJsonDrawer">
		<el-input v-model="jsonText" @input="json2object" clearable></el-input>
		<json-viewer
		:value="jsonObject"
		:expand-depth=5
		copyable>
		</json-viewer>
		</el-drawer>

		<el-drawer title="xml格式化" 
		direction="ltr"
		size="50%"
		:visible.sync="showXmlDrawer">
		<el-input v-model="xmlText" @input="xml2beauty" clearable></el-input>
		 <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 1000 }"  v-model="xmlBeautyText"></el-input>
		</el-drawer>
    </div>
</template>

<script>
	import {baseImgPath} from '@/config/env'
	import vkbeautify from 'vkbeautify'
	import { logout } from "@/api/getData";

    export default {
    	data(){
    		return {
				showJsonDrawer: false,
				showXmlDrawer: false,
				baseImgPath,
				jsonText: "",
				jsonObject: {},
				xmlText: '',
				xmlBeautyText: '',
				userRealName: "",
    		}
		},
		components: {

		},
		mounted() {
			this.getUserRealName();
		},
		methods:{
			async handleBeautyJson() {
				this.showJsonDrawer = true
			},
			async handleBeautyXml() {
				this.showXmlDrawer = true
			},
			async json2object() {
				this.jsonObject = JSON.parse(this.jsonText)
			},
			async xml2beauty() {
				this.xmlBeautyText = vkbeautify.xml(this.xmlText)
			},
			async getUserRealName() {
				let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
				if (userInfo) {
					this.userRealName  = userInfo.realName
				}
			},
			async logout() {
				const res = await logout()
				if (res.code == 200) {
					this.$router.push('/');
				} else {
					this.$message({
					type: "error",
					center: true,
					message: res.msg
					})
				}
			}
		},
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
	}
	.btn-div{
		margin-right: 37px;
		float: right;
	}
	.el-dropdown-menu__item{
        text-align: center;
	}
    .el-drawer{
    	overflow: scroll
    }
</style>
