<template>
    <div class="header_container">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/analysis' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta.path" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="btn-div">
			<el-dropdown @command="handleCommand">
			<span>
				<el-avatar src="../../static/avatar.jpg" size="small"></el-avatar>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="changePwd" icon="el-icon-wind-power">修改密码</el-dropdown-item>
				<el-dropdown-item command="logout" icon="el-icon-switch-button">注销登录</el-dropdown-item>
				<el-dropdown-item command="jsonFormatter" icon="el-icon-sunny">Json美化</el-dropdown-item>
				<el-dropdown-item command="xmlFormatter" icon="el-icon-sunset">Xml美化</el-dropdown-item>
			</el-dropdown-menu>
			</el-dropdown>

			<el-dialog title="修改密码" :visible.sync="pwdDialogFormVisible" :close-on-click-modal=true>
				<el-form :model="passwordData" ref="passwordData">
				<el-form-item label="*旧密码" label-width="100px">
					<el-input v-model="passwordData.oldPwd" type="password" show-password placeholder="旧密码" size='mini'></el-input>
				</el-form-item> 
				<el-form-item label="*新密码" label-width="100px">
					<el-input v-model="passwordData.newPwd" type="password" show-password placeholder="新密码" size='mini'></el-input>
					</el-select>
				</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="pwdDialogFormVisible = false" size="mini">取 消</el-button>
					<el-button type="primary" @click="handleChangePwd()" size="mini">确 定</el-button>
				</div>
			</el-dialog>
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
	import { logout, changePwd } from "@/api/getData";

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

				passwordData: {},
				pwdDialogFormVisible:false,
    		}
		},
		components: {

		},
		mounted() {
			this.getUserRealName();
		},
		methods:{
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
			},
			async handleCommand(command) {
				if (command == 'logout') {
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
				} else if (command == 'changePwd') {
					this.passwordData = {}
					this.pwdDialogFormVisible = true
				} else if (command == 'jsonFormatter') {
					this.showJsonDrawer = true
				} else if (command == 'xmlFormatter') {
					this.showXmlDrawer = true
				}
			},

			async handleChangePwd() {
				const res = await changePwd(this.passwordData)
					if (res.code == 200) {
						this.$message({
						type: "success",
						center: true,
						message: res.msg
						})
						this.pwdDialogFormVisible = false
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
