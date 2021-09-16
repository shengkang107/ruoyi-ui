<template>
  <div class="common-banner">
    <img class="logo" src="@/assets/image/logo.png" @click="toIndex()"/>
    <label class="b-link" v-show="type == 'index'">
      <span class="active">首页</span>
      <span @click="toService()">服务中心</span>
      <span @click="toYouanfresh()">B2B商城</span>
    </label>
    <el-dropdown class="b-user avatar-container right-menu-item hover-effect" trigger="click">
      <div class="avatar-wrapper">
        <span class="b-user-img"></span> 
        {{userInfo.userName}} 
        <i class="el-icon-arrow-right color99"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/user/profile">
          <el-dropdown-item>个人中心</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="logout">
          <span>退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  props: ["type"],
  data() {
    return {
      userInfo: {}
    }
  },
  created() {
    this.userInfo = this.$store.state.user.info;
  },
  methods: {
    toYouanfresh() {
      //跳转B2B商场
      window.location.href = "http://www.youanfresh.com";
    },
    toIndex() {
      this.$router.push("/index");
    },
    toService() {
      this.$router.push("/kill/review/index");
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.common-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  line-height: 56px;
  background: #fff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  z-index: 222;
  padding: 0 30px;
  .logo {
    height: 39px;
    vertical-align: middle;
    margin-top: -6px;
    cursor: pointer;
  }
  .b-link {
    margin-left: 70px;
    font-weight: 500;
    span {
      margin-right: 60px;
      font-size: 16px;
      color: #3D4F3D;
      cursor: pointer;
      &.active {
        color: #20B235;
        border-bottom: 3px solid #20B235;
        padding-bottom: 16px;
      }
    }
  }
  .b-user {
    font-weight: 500;
    float: right;
    cursor: pointer;
    .b-user-img {
      width: 24px;
      height: 24px;
      background: rgba(#D4D7D9, 0.45);
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
  }
}
</style>