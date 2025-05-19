<script setup>
import { DArrowLeft, Plus } from "@element-plus/icons-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();

import userStore from '@/stores/models/user';
const user = userStore()

let userInfo = user.getUser();
let isChange = ref(true)

let imgUrl = ref(user.getUser().avatar);
let fileName = ref('');

const handleAvatarSuccess = (res) => {
  imgUrl.value = res.data.url;
  fileName.value = res.data.filename;
  console.log(fileName.value);
  ElMessage.success('上传成功');
}

const goback = () => {
  router.back();
}

import { updateUser } from "@/api/user";
// 提交编辑
const submitForm = async() => {
  console.log(userInfo);
  let params = {
    avatar: imgUrl.value,
    ...userInfo
  }
  console.log(params);
  await updateUser(params).then(res => {
    user.setUser(res.data);
  })

  isChange.value = true;
}


// 取消编辑
import { deleteFile } from "@/api/file";
const cancel = () => {
  isChange.value = true;
  if(fileName.value){
    deleteFile(fileName.value).then(res => {
      console.log(res);
    })
  }else{
    return
  }

}

</script>
<template>
  <div>
    <div class="pageContainer">
      <div class="goback">
        <el-button type="primary" @click="goback"><el-icon><DArrowLeft /></el-icon>返回</el-button>
      </div>
      <div class="userContaiiner">
        <div class="avatarBox">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:3000/api/file/upload"
            :show-file-list="false"
            :disabled="isChange"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
        <div class="userInfoBox">
          <el-form :model="userInfo" label-width="100">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="用户名:">
                  <el-input v-model="userInfo.username" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="昵称:">
                  <el-input v-model="userInfo.nickname" :disabled="isChange"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="用户描述:">
                  <el-input v-model="userInfo.text" maxlength="100"
                  :disabled="isChange" show-word-limit type="textarea"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="footer">
            <el-button type="primary" v-show="isChange" @click="isChange = false">编辑</el-button>
            <el-button type="primary" v-show="!isChange" @click="cancel">取消</el-button>
            <el-button type="primary" v-show="!isChange" @click="submitForm">提交</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.userContaiiner{
  width: 100%;
  height: 100%;
  .avatarBox{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .userInfoBox{
    width: 100%;
    height: 100%;
    margin-top: 30px;
  }
  .footer{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
