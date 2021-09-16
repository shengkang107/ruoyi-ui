<template>
  <div class="login">
    <div class="login-left">
      <div class="welcome-font">欢迎登录华辰优安管理系统@</div>
      <div class="english-font">S I G N I N .</div>
    </div>
    <div class="login-form">
      <el-image class="login-logo" :src="require('@/assets/image/logo.png')" fit="contain"></el-image>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" v-if="login_Register == 'login'">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img"/>
          </div>
        </el-form-item>
        <div class="login-checkBox">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          <label class="fr">
            <span class="register-btn" @click.stop="findPass = true">忘记密码</span> | 
            <span class="register-btn" @click.stop="open">免费注册</span>
          </label>
        </div>
        <el-form-item style="width:100%;">
          <el-button
            class="login-btn"
            :loading="loading"
            size="medium"
            type="success"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 注册 -->
      <el-form ref="elForm" :model="formData" :rules="rules" v-if="login_Register == 'register'">
        <el-form-item prop="userName">
          <el-input
            v-model="formData.userName"
            placeholder="请输入用户名"
            clearable
            prefix-icon='el-icon-user-solid'
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            clearable
            prefix-icon='el-icon-lock'
            show-password
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phoneNumber">
          <el-input
            v-model="formData.phoneNumber"
            placeholder="请输入手机号"
            :maxlength="11"
            show-word-limit
            clearable
            prefix-icon='el-icon-mobile-phone'
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
        <el-form-item prop="smsCode">
          <el-input 
            v-model="formData.smsCode"
            placeholder="请输入验证码" 
            :maxlength="6"
            clearable
            :style="{width: 'calc(100% - 120px)'}"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
          </el-input>
          <el-button class="sms-code" :disabled="smsCodeLoading" @click="getSmsCode(1)">{{codeText}}</el-button>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            clearable
            prefix-icon='el-icon-message'
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button
            class="login-btn"
            :loading="registerLoading"
            size="medium"
            type="success"
            @click="handelConfirm"
          >
            <span v-if="registerLoading">注册中...</span>
            <span v-else>立即注册</span>
          </el-button>
        </el-form-item>
        <div class="font12 fr">
          已有账号？ <span class="green-text-btn" @click="login_Register = 'login'">去登录</span>
        </div>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2021-2022 youanfresh.com All Rights Reserved.</span>
    </div>
    <!-- 忘记密码 -->
    <el-dialog class="register" title="忘记密码" width="600px" :visible.sync="findPass">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="formData.phoneNumber" placeholder="请输入手机号" :maxlength="11" show-word-limit clearable
                    :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="smsCode">
          <el-input 
            v-model="formData.smsCode"
            placeholder="请输入验证码" 
            :maxlength="6"
            clearable
            :style="{width: 'calc(100% - 120px)'}"
          >
          </el-input>
          <el-button class="sms-code" :disabled="smsCodeLoading" @click="getSmsCode(2)">{{codeText}}</el-button>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            clearable
            show-password
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPass">
          <el-input 
            v-model="formData.confirmPass"
            placeholder="请输入密码"
            clearable
            show-password
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="findPass = false">取消</el-button>
        <el-button type="success" @click="findPassConfirm">
          <span>提交</span>
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>


<script>
import { getCodeImg, smsCode } from "@/api/login";
import { register, findPass } from "@/api/system/user";
import Cookies from "js-cookie";
import {encrypt, decrypt} from '@/utils/jsencrypt'

export default {
  inheritAttrs: false,
  components: {},
  props: [],
  name: "Login",
  data() {
    const equalToPass = (rule, value, callback) => {
      if (this.formData.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        userName: undefined,
        password: '',
        phoneNumber: undefined,
        email: undefined,
        smsCode: undefined
      },
      rules: {
        userName: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }, {
          pattern: /^[a-zA-Z0-9_-]{4,16}$/,
          message: '最少4个字符(可以是字母或数字)',
          trigger: 'blur'
        }],
        password: [{
          required: true, 
          trigger: "blur", 
          message: "请输入密码"
        }],
        confirmPass: [{
          required: true,
          message: "请输入确认密码",
          trigger: "blur" 
        },{
          required: true,
          validator: equalToPass,
          trigger: "blur"
        }],
        phoneNumber: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        smsCode: [{
          required: true,
          message: '请输入验证码',
          trigger: 'change'
        }],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
          message: '邮箱格式错误',
          trigger: 'blur'
        }]
      },
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          {required: true, trigger: "blur", message: "用户名不能为空"}
        ],
        password: [
          {required: true, trigger: "blur", message: "密码不能为空"}
        ],
        code: [{required: true, trigger: "change", message: "验证码不能为空"}]
      },
      login_Register: "login",
      loading: false,
      registerLoading: false,
      redirect: undefined,
      smsCodeLoading: false,
      codeText: "获取验证码", //获取验证码的按钮
      findPass: false,
      //手机验证码字典
      CodeOptions: {}
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.codeText = "获取验证码";
    this.getCode();
    this.getCookie();
    //字典
    this.getDicts('template_code').then(response => {
      response.data.map(item => {
        if (item.dictValue == '1') {
          //注册
          this.CodeOptions["registerCode"] = item.dictLabel;
        } else if (item.dictValue == '2') {
          //找回密码
          this.CodeOptions["passCode"] = item.dictLabel;
        }
      })
    })
  },
  mounted() {
    if (navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      require('../assets/styles/mobile.scss');
    } else {
      require('../assets/styles/pc.scss');
    }
  },
  methods: {
    open() {
      this.formData = {};
      this.login_Register = 'register';
    },
    handelConfirm() {
      //注册
      this.$refs['elForm'].validate(valid => {
        if (!valid) {
          return
        }else {
          this.registerLoading = true
          register(this.formData).then(response => {
            if (response.code === 200) {
              this.msgSuccess("注册成功");
              //注册之后的一些处理
              this.$refs['elForm'].resetFields();
              this.registerLoading = false;
              this.login_Register = 'login';
            }
          }).catch(() => {
            this.registerLoading = false;
          });
        }

      })
    },
    findPassConfirm() {
      //找回密码
      this.$refs['elForm'].validate(valid => {
        if (!valid) {
          return
        }else {
          findPass(this.formData).then(response => {
            if (response.code == 200) {
              this.msgSuccess("密码更改成功");
              this.findPass = false;
              this.$refs['elForm'].resetFields();
            }
          }).catch(() => {
            // this.findPassLoading = false;
          });
        }

      })
    },
    getSmsCode(type) {
      //获取验证码
      this.$refs['elForm'].validateField('phoneNumber', (err) => {
        if (err) {
          return;
        } else {
          this.gotTime();
          let params = {
            phoneNumbers: this.formData.phoneNumber,
            templateCode: type == 2 ? this.CodeOptions.passCode : this.CodeOptions.registerCode,
            type: type //1-注册，2-忘记密码
          }
          smsCode(params).then(response => {
            if (response.code == 200) {
              this.formData.smsUuid = response.data;
            }
          })
        }
      })
    },
    gotTime() {
      //倒计时
      let time = 60;
      let timer = setInterval(() => {
        if(time == 0){
          clearInterval(timer);
          this.codeText = '获取验证码';
          this.smsCodeLoading = false;
        }else{
          this.smsCodeLoading = true;
          this.codeText = time + '秒后重试';
          time--;
        }
      }, 1000);
    },
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, {expires: 30});
            Cookies.set("password", encrypt(this.loginForm.password), {expires: 30});
            Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 30});
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({path: this.redirect || "/"});
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
