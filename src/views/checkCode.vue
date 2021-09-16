<template>
  <div class="checkCode-warp">
    <public-hearder></public-hearder>
    <div class="checkCode-content">
      <div class="notice-link" @click="toIndex()">
        <span><i class="el-icon-arrow-left"></i> 返回首页</span>
      </div>
      <div class="checkCode-title">华辰优安防疫消杀查验报告查询</div>
      <div class="check-code-tips">
        <div class="tips-style">
          <i class="el-icon-info"></i> 可查询2021年1月19日起的信息！
        </div>
      </div>
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" class="check-code-form">
        <el-form-item prop="number">
          <el-input
            v-model="formData.number"
            placeholder="请输入箱柜号/核酸检测证明编号/消杀证明编号"
            clearable
          ></el-input>
          <div style="color: #c9c9c9; margin-left: 17px;">
            建议使用箱柜号查询
          </div>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="formData.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          </el-input>
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </el-form-item>
        <el-form-item size="large" label-width="25%">
          <el-button type="success" @click="submitForm">立即查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-dropdown @command="handleCommand" v-if="msgDrop">
        <span
          class="el-dropdown-link"
          style="color: #00afff; font-weight: bolder"
          >下拉选择日期<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" align="center">
          <el-dropdown-item
            v-for="msg in AllMsg"
            :key="msg"
            v-text="'预约时间:' + msg.date"
            :command="msg.id"
          ></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tabs type="border-card" v-if="tabShow">
        <el-tab-pane label="核酸检测">
          <div class="msg-div">
            <div class="msg-title">
              <span>货柜基本信息</span>
            </div>
            <div class="msg-td">
              <div class="left">箱柜号</div>
              <div class="right">{{ this.form.cabinetNumber }}</div>
            </div>
            <div class="msg-td">
              <div class="left">产品名称</div>
              <div class="right">{{ this.form.productName }}</div>
            </div>
            <div class="msg-td">
              <div class="left">公司名称</div>
              <div class="right">{{ this.form.companyName }}</div>
            </div>
            <div class="msg-td">
              <div class="left">国家</div>
              <div class="right">{{ this.form.country }} </div>
            </div>
          </div>
          <div class="msg-div">
            <div class="msg-title">
              <span>核酸检测信息</span>
            </div>
            <div class="msg-td">
              <div class="left">报告编号</div>
              <div class="right">{{ this.form.quarantineNumber }}</div>
            </div>
            <div class="msg-td">
              <div class="left">核酸检测机构</div>
              <div class="right">{{ checkCompanyFormat(this.form) }}</div>
            </div>
            <div class="msg-td">
              <div class="left">采样时间</div>
              <div class="right">{{ this.form.pickDate }}</div>
            </div>
          </div>
          <p style="color: red" v-if="this.form.reportUrl">
            *请使用手机或者电脑浏览器访问下载，
            <br />访问地址：https://cx.youanfresh.com/checkCode
          </p>
          <el-button
            type="warning"
            style="display: block; margin: 0 auto"
            v-if="this.form.reportUrl"
            @click="handleOpenReport(form.reportUrl)"
          >
            下载核酸PDF
          </el-button>
        </el-tab-pane>
        <el-tab-pane label="防疫消杀">
          <div class="msg-div">
            <div class="msg-title">
              <span>货柜基本信息</span>
            </div>
            <div class="msg-td">
              <div class="left">箱柜号</div>
              <div class="right">{{ this.form.cabinetNumber }} </div>
            </div>
            <div class="msg-td">
              <div class="left">产品名称</div>
              <div class="right">{{ this.form.productName }} </div>
            </div>
            <div class="msg-td">
              <div class="left">公司名称</div>
              <div class="right">{{ this.form.companyName }} </div>
            </div>
            <div class="msg-td">
              <div class="left">国家</div>
              <div class="right">{{ this.form.country }} </div>
            </div>
          </div>
          <div class="msg-div">
            <div class="msg-title">
              <span>消杀信息</span>
            </div>
            <div class="msg-td">
              <div class="left">消毒证明编号</div>
              <div class="right">{{ this.form.certifyCode }}</div>
            </div>
            <div class="msg-td">
              <div class="left">消杀时间</div>
              <div class="right">{{ this.form.outDate }} </div>
            </div>
            <div class="msg-td">
              <div class="left">件数(箱)</div>
              <div class="right">{{ this.form.count }} </div>
            </div>
            <div class="msg-td">
              <div class="left">重量(千克)</div>
              <div class="right">{{ this.form.weight }} </div>
            </div>
          </div>
          <p style="color: red" v-if="this.form.certifyUrl">
            *请使用手机或者电脑浏览器访问下载，
            <br />访问地址：https://cx.youanfresh.com/checkCode
          </p>
          <el-button
            type="warning"
            style="display: block; margin: 0 auto"
            v-if="this.form.certifyUrl"
            @click="handleOpenReport(form.certifyUrl)"
          >
            下载消杀PDF
          </el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { getCodeImg } from "@/api/login";
import request from "@/utils/request";
import publicHearder from "@/components/public/header";

export default {
  components: {
    publicHearder,
  },
  props: [],

  data() {
    return {
      checkCompanyOptions: [],
      msgDrop: false,
      tabShow: false,
      AllMsg: null,
      killMsg: null,
      codeUrl: "",
      formData: {
        code: "",
        number: "",
        uuid: "",
      },
      form: {},
      rules: {
        number: [
          {
            required: true,
            message: "请输入箱柜号/核酸检测证明编号/消杀证明编号",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, trigger: "change", message: "验证码不能为空" },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getCode();
    this.getDicts("kill_check_company").then((response) => {
      this.checkCompanyOptions = response.data;
    });
  },
  mounted() {},
  methods: {
    /**
     * 查看报告
     */
    handleOpenReport(reportUrl) {
      var tempwindow = window.open("_blank");
      tempwindow.location = reportUrl;
    },
    // 查验公司名称
    checkCompanyFormat(row, column) {
      return this.selectDictLabel(this.checkCompanyOptions, row.checkCompany);
    },
    handleCommand(command) {
      request({
        url: "/system/recordKill/checkCode/" + command,
        method: "get",
      }).then((response) => {
        this.msgDrop = false;
        this.form = response.data;
        this.tabShow = true;
      });
    },
    getCode() {
      getCodeImg().then((res) => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.formData.uuid = res.uuid;
      });
    },
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
        request({
          url: "/system/recordKill/recordKillForNumber",
          method: "get",
          params: this.formData,
        })
          .then((response) => {
            if (response.code === 200) {
              this.AllMsg = response.data;
              this.tabShow = false;
              this.reset();
              if (this.AllMsg.length !== 0) {
                this.msgDrop = true;
              } else {
                this.$message({
                  message: "未找到数据!",
                  showClose: true,
                  center: true,
                });
              }
            }
            this.getCode();
          })
          .catch((err) => {
            this.getCode();
          });
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        orderNumber: null,
        checkTime: null,
        inspectors: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
      this.reset();
      this.tabShow = false;
    },
    toIndex() {
      this.$router.push("/index");
    },
  },
};
</script>
<style lang="scss" scoped>
.checkCode-warp {
  background: #f7f8fa;
  height: 100%;
  padding: 20px 10px;
  font-size: 14px;
  .checkCode-content {
    margin-top: 52px;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.07);
    .notice-link {
      span {
        cursor: pointer;
        &:hover {
          color: #20b235;
        }
      }
    }
    .checkCode-title {
      padding-top: 15px;
      color: #292929;
      font-size: 24px;
      font-weight: 500;
      text-align: center;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(#979797, 0.3);
    }
    .check-code-tips {
      background-color: #fff5ed;
      border-radius: 2px;
      border: 1px solid #ff9600;
      margin: 20px auto;
      padding: 10px 14px;
      max-width: 960px;
      .tips-style {
        color: #323233;
        i {
          color: #ff9600;
        }
      }
    }
    .check-code-form {
      max-width: 496px;
      margin: auto;
      .login-code-img {
        width: 30%;
        max-width: 92px;
        vertical-align: middle;
        margin-left: 20px;
      }
    }
    .msg-div {
      display: inline-block;
      width: 100%;
      margin-bottom: 25px;
      .msg-title {
        margin: 10px 0;
        span {
          border-left: 2px solid #20B235;
          padding-left: 10px;
        }
      }
      .msg-td {
        float: left;
        width: 100%;
        line-height: 40px;
        border: 1px solid #EDEEEF;
        color: #323233;
        div.left {
          float: left;
          width: 120px;
          padding-left: 12px;
          background: #F9FAFB;
          border-right: 1px solid #EDEEEF;
        }
        div.right {
          padding-left: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
