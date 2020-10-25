<template>
  	<div class="login_page fillcontain">
		<div style="float:right" v-if="formFlag == 0">
			<el-button 
			plain 
			size="small" 
			type="info" 
			 @click="change"
			style="background-color: #324057; color: #fff; border:none">No account?</el-button>
		</div>
		<div style="float:right" v-else-if="formFlag == 1">
			<el-button 
			plain 
			size="small" 
			type="info" 
			 @click="change"
			style="background-color: #324057; color: #fff; border:none">To Login</el-button>
		</div>
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer">
		  		<div class="manage_tip">
		  			<p>Alex</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="formFlag == 0 ? loginRules : registerRules" ref="loginForm">
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" size='small' placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码"  size='small' v-model="loginForm.password"></el-input>
					</el-form-item>
					<el-form-item prop="realName" v-if="formFlag == 1">
						<el-input placeholder="真实姓名"  size='small' v-model="loginForm.realName"></el-input>
					</el-form-item>
					<el-form-item v-if="formFlag == 0">
				    	<el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">Go</el-button>
				  	</el-form-item>
					<el-form-item v-else-if="formFlag == 1">
				    	<el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">Register</el-button>
				  	</el-form-item>
		    	</el-form>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
	import {login, registerUser} from '@/api/getData'

	export default {
	    data(){
			return {
				formFlag: 0, // 0 登录 1注册
      			addDialogFormVisible: false,
				loginForm: {
					username: '',
					password: '',
				},
				loginRules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
				},
				registerRules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
					realName: [
						{ required: true, message: '请输入真实姓名', trigger: 'blur' }
					],
				},
			}
		},
		methods: {
			async submitForm(formName) {
				if (this.formFlag == 0) {			
					this.$refs[formName].validate(async (valid) => {
						if (valid) {
							const res = await login(this.loginForm)
							if (res.code == 200) {
								sessionStorage.setItem("isLogin", true);
								let userInfo = JSON.stringify(res.data)
								sessionStorage.setItem("userInfo", userInfo);
								this.$router.push('analysis');
							}else{
								this.$message({
									message: res.msg,
									center: true,
									type: 'error',
								});
							}
						}
					});
				} else if (this.formFlag == 1) {
					this.$refs[formName].validate(async (valid) => {
						if (valid) {
							const res = await registerUser(this.loginForm)
							if (res.code == 200) {
								this.$message({
									message: res.msg,
									center: true,
									type: 'success',
								});
								this.formFlag = 0
							}else{
								this.$message({
									message: res.msg,
									center: true,
									type: 'error',
								});
							}
						}
					});
				}
			},
			async change() {
				if (this.formFlag == 0) {
					this.formFlag = 1
				} else if (this.formFlag == 1) {
					this.formFlag = 0
				}
			},
		},
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.login_page{
		background-color: #324057;
	}
	.manage_tip{
		position: absolute;
		width: 100%;
		top: -100px;
		left: 0;
		p{
			font-size: 34px;
			color: #fff;
		}
	}
	.form_contianer{
		.wh(320px, 210px);
		.ctp(320px, 210px);
		padding: 25px;
		border-radius: 5px;
		text-align: center;
		background-color: #fff;
		.submit_btn{
			width: 100%;
			font-size: 16px;
		}
	}
	.tip{
		font-size: 12px;
		color: red;
	}
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
</style>
