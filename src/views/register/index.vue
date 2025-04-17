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

// 引入注册接口
import { register } from '@/api/index.js'
const submitForm = async () => {
  console.log(form.value);

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
        console.log(data);
        await register(data).then(res => {
          console.log(res);
        })
      console.log('submit!')
    } else {
      ElMessage.error('请输入正确的用户名和密码')
      return false
    }
  })
}

const tologin = () => {
  router.push('/login')
}

</script>
<template>
  <div class="registerBody">
    <div class="formBody">
      <div class="formTitle">欢迎注册</div>
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
        <el-button type="primary" @click="submitForm()" style="width: 200px; margin: 0 auto; display: block">注册</el-button>
        <div class="text">已有账号？<span @click="tologin()">前往登录</span></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.registerBody {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/registerBackgroundImg.jpg') no-repeat;
  background-size: 100% 100%;
  .formBody {
    width: 400px;
    height: 500px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    .formTitle {
      text-align: center;
      font-size: 20px;
      font-weight: 900;
      margin-top: 20px;
    }
    .formBox {
      width: 300px;
      background: #fff;
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
