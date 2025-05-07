<script setup>
import { RouterView, useRouter } from 'vue-router';
import { ref } from 'vue';
import { ArrowUp, ArrowDown, User, Close } from '@element-plus/icons-vue';


const router = useRouter()

let menuList = ref([
  {
    name: "统计图表",
    path: "/statistics"
  },
  {
    name: "明细数据",
    path: "/allAccounting"
  },
])


const isShow = ref(false)

const showUserDom = () => {
  isShow.value = !isShow.value
}

const routerTo = (path) => {
  router.push(path)
}
</script>
<template>
  <div class="title">
    <div class="logoAndName">
      <div class="logoBox">
        <img src="@/assets/png/logo.png" alt="" class="logo">
      </div>
      <div class="nameBox">
        小记本
      </div>
    </div>

    <div class="menuBox">
      <div class="menu" v-for="item in menuList" :key="item.name">
        <div class="menu-item" @click="routerTo(item.path)">{{  item.name }}</div>
      </div>
    </div>
    <div class="userBox">
      <div class="userImg">
        <img src="@/assets/png/userImg.png" alt="">
      </div>
      <div class="userName">
        <div class="nameBox">
          用户名
          <div class="icon" @click="showUserDom">
            <el-icon v-show="isShow"><ArrowUp /></el-icon>
            <el-icon v-show="!isShow"><ArrowDown /></el-icon>
          </div>
        </div>
      </div>
      <div class="userDom" v-show="isShow">
      <div class="user-item">
          <el-icon><User /></el-icon>
          个人中心</div>
      <div class="user-item">
          <el-icon><Close /></el-icon>
          退出登录</div>
    </div>
    </div>

  </div>
  <div class="content">
    <RouterView></RouterView>
  </div>
</template>
<style lang="scss" scoped>
.title{
  display: flex;
  height: 50px;
  border-bottom: 1px solid #ccc;
  justify-content: space-around;

  .logoAndName{
    height: 50px;
    line-height: 50px;
    display: flex;

    .logoBox{
    height: 40px;
    border-radius: 50%;
    margin-top: 5px;
    line-height: 40px;

      img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .nameBox{
      margin-left: 10px;
    }
  }
  .menuBox{
    display: flex;
    height: 50px;
    line-height: 50px;

    .menu{
      height: 50px;
      line-height: 50px;
      margin-left: 10px;
      .menu-item{
        height: 45px;
        line-height: 50px;
        padding: 0 10px;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        &:hover{
          border-bottom: 2px solid #409eff;
        }
      }
    }

  }
  .userBox{
    position: relative;
    height: 50px;
    width: 150px;
    justify-content: space-between;
    line-height: 50px;
    display: flex;
    .userImg{
      width: 40px;
      height: 40px;
      margin-top: 5px;
      img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .userName{
      margin-left: 10px;
      .nameBox{
        display: flex;
        align-items: center;
        .el-icon{
          margin-left: 5px;
        }
      }
    }
    .userDom{
    position: absolute;
    top: 51px;
    left: 0;
    background: #fff;
    border: 1px solid #ccc;
    z-index: 9999;
    .user-item{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 150px;
      margin: 0 auto;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
      .el-icon{
        height: 24px;
        margin-right: 10px;
      }
      &:hover{
        background: #409eff;
        color: #fff
      }
    }
  }
  }

}
</style>
