<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import Verification from '@/components/verification/index.vue'
import { ElMessage } from 'element-plus'

let form = ref({
  username: '',
  password: '',
  verification: ''
})

let ruleForm = ref(null)
let formRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  verification: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ]
})

let VerifyCode = ref('')
const getVerifyCodeStr = (code) => {
  VerifyCode.value = code
}

import  userStore  from '@/stores/models/user.js'
let user = userStore()
console.log(user);

// 引入登录接口
import { login } from '@/api/index.js'
const submitForm = async () => {

  await ruleForm.value.validate( async (valid) => {
    if (valid) {
      if(form.value.verification !== VerifyCode.value){
        ElMessage.error('请输入正确的验证码')
        return false
      }
      let data = {
          username: form.value.username,
          password: form.value.password
      }
      await login(data).then(res => {
        user.login(res.data)
      })
      router.push('/')
      console.log('submit!')
    } else {
      ElMessage.error('请输入正确的用户名和密码')
      return false
    }
  })
}

const toRegister = () => {
  router.push('/register')
}

</script>
<template>
  <div class="loginBody">
    <div class="formBody">
      <div class="formTitle">欢迎登录</div>
      <div class="formBox">
        <el-form ref="ruleForm" :model="form" label-width="80px" :rules="formRules">
          <el-form-item prop="username" label="用户名：">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：">
            <el-input v-model="form.password" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item prop="verification" label="验证码：" >
            <el-input v-model="form.verification" style="width: 100px; margin-right: 20px;"></el-input>
            <Verification ref="verification" :canvas-height="30" :canvas-width="100" @getVerifyCodeStr="getVerifyCodeStr"></Verification>
          </el-form-item>
        </el-form>
      </div>
      <div class="formFooter">
        <el-button type="primary" @click="submitForm()" style="width: 200px; margin: 0 auto; display: block">登录</el-button>
        <div class="text">没有账号？<span @click="toRegister()">前往注册</span></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loginBody {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: url('@/assets/loginBackgroundImg.png') no-repeat;
  background-size: 100% 100%;
  .formBody{
    width: 400px;
    height: 400px;
    background: #fff;

    .formTitle{
      text-align: center;
      font-size: 20px;
      font-weight: 900;
      margin-top: 20px;
    }
    .formBox{
      width: 300px;
      margin: 20px auto;
    }
    .formFooter{
      width: 300px;
      margin: 0 auto;
      text-align: center;
      .text{
        margin-top: 20px;
        span{
          &:hover{
            cursor: pointer;
            color: #409EFF;
          }
        }
      }
    }
  }
}
</style>
