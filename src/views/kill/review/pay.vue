<template>
  <div class="kill-pay">
    <div class="pay-msg" v-if="!paySuc">
      <div class="k-content">
        <div class="t-tips">订单状态</div>
        <div class="kill-msg">
          <div class="k-left">
            <div class="status">
              <span class="el-icon-success"></span>请尽快完成付款，以免影响预约。
            </div>
            <div class="tips">请在车辆入园前完成支付，如果长时间未支付，系统将自动取消订单。</div>
            <div class="pay-amount">
              需支付金额
              <div class="amount"><span class="font12">¥ </span>{{ payDetail.orderPrice }}</div>
            </div>
          </div>
          <div class="k-right">
            <div class="line">
              <span class="l-title">箱柜号：</span>
              <span>{{ payDetail.cabinetNumber }}</span>
            </div>
            <div class="line">
              <span class="l-title">预约订单号：</span>
              <span>{{ payDetail.orderNumber }}</span>
            </div>
            <div class="line">
              <span class="l-title">服务内容：</span>
              <span>{{ payDetail.productName }}</span>
            </div>
            <div class="line">
              <span class="l-title">预约日期：</span>
              <span>{{ payDetail.date }}</span>
            </div>
            <div class="line">
              <span class="l-title">客户电话：</span>
              <span>{{ payDetail.phone }}</span>
            </div>
            <div class="line">
              <span class="l-title">开票信息：</span>
              <span>{{ payDetail.isInvoice == '0' ? '不开票' : payDetail.invoiceHeadType == '1' ? '个人' : '公司' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="k-content">
        <div class="t-tips">支付方式</div>
        <div class="k-pay-content">
          <div class="pay-type">
            <el-radio-group v-model="choiceType">
              <el-radio-button :label="0">
                <img class="c-icon" src="@/assets/image/kill/pay-online.png" alt> 在线支付
                <img class="radio-check" v-if="choiceType == 0" src="@/assets/image/kill/radio-check.png" />
              </el-radio-button>
              <el-radio-button :label="1">
                <img class="c-icon" src="@/assets/image/kill/pay-other.png" alt> 其他支付
                <img class="radio-check" v-if="choiceType == 1" src="@/assets/image/kill/radio-check.png" />
              </el-radio-button>
            </el-radio-group>
          </div>
          <!-- 在线支付 -->
          <div class="pay-child" v-if="choiceType == 0">
            <div class="type">
              <el-radio v-model="payType" :label="1">
                <span class="p-label">
                  <img style="height: 23px;" src="@/assets/image/kill/pay-zfb.png" alt>
                </span>
              </el-radio>
              <el-radio v-model="payType" :label="2">
                <span class="p-label">
                  <img style="height: 23px;" src="@/assets/image/kill/pay-wx.png" alt>
                </span>
              </el-radio>
            </div>
            <div class="pay-other-msg">
              <div class="cancel-pay">
                <el-button @click="closePay()">取 消</el-button>
                <el-button type="success" @click.stop="toOnlinePay(payType)">确 定</el-button>
              </div>
            </div>
          </div>
          <!-- 其他支付 -->
          <div class="pay-child" v-if="choiceType == 1">
            <div class="type">
              <el-radio v-model="payType" :label="3">
                <span class="p-label"><img style="height: 15px;" src="@/assets/image/kill/pay-other0.png" /> 线下转账</span>
                <div class="pay-other0-tips">付款摘要请备注箱柜号</div>
              </el-radio>
              <!-- <el-radio v-model="payType" :label="4">
                <span class="p-label"><img style="height: 15px;" src="@/assets/image/kill/pay-other1.png" /> 预支付</span>
              </el-radio> -->
            </div>
            <div class="pay-other-msg">
              <div class="p-o-tips">转账信息</div>
              <div class="company-info color66">
                <span>公司名称：{{ payDetail.companyName }}</span>
                <span>箱柜号：{{ payDetail.cabinetNumber }}</span>
              </div>
              <div class="pay-voucher">
                <label class="p-o-tips">上传凭证</label>
                <el-upload
                  class="upload-url"
                  accept="image/*"
                  list-type="picture-card"
                  :headers="upload.headers"
                  :action="upload.url"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="upload.fileUrl" :src="upload.fileUrl" class="avatar">
                  <i v-else class="el-icon-plus"></i>
                </el-upload>
              </div>
            </div>
            <div class="cancel-pay">
              <el-button @click="closePay()">取 消</el-button>
              <el-button type="success" :loading="loading" @click="toOtherPay(payType)">确 定</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pay-suc" v-if="paySuc">
      <div class="content">
        <img src="@/assets/image/kill/order-pay-suc.png" />
        <div class="logo-title">待审核</div>
        <div class="pay-suc-tips">
          <div class="color66">订单已提交，等待审核中</div>
          <div class="look-btn">
            将在<span>{{countdown}}s </span>后跳转至 <span class="font-green" @click.stop="closePay()">预约记录</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 微信支付 -->
    <el-dialog :title="''" class="wx-pay-dialog" center :visible.sync="wxPayOpen" width="60%" append-to-body>
      <div class="wx-pay-content">
        <div class="w-p-logo">
          <img src="@/assets/image/kill/pay-wx.png" />
        </div>
        <div class="w-p-msg" v-if="!wxSuc">
          <div class="w-p-tips">
            支付金额<span class="w-p-amount">￥{{ payDetail.orderPrice }}</span>，请使用微信扫描下方二维码完成支付。
          </div>
          <div class="w-p-left">
            <div class="qrcode" id="qrcode" ref="qrCodeUrl"></div>
          </div>
          <div class="w-p-right">
            <p>订单金额：{{ payDetail.orderPrice }}</p>
            <p>预约单号：{{ payDetail.orderNumber }}</p>
            <p>箱柜号：{{ payDetail.cabinetNumber }}</p>
          </div>
        </div>
        <div class="wx-pay-suc-msg" v-if="wxSuc">
          支付成功，<span>{{countdown}}s </span>后跳转至 <span class="font-green" @click.stop="$router.go(-1)">预约消杀记录</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import { getKill,killOtherPay, wxPaySuc } from '@/api/system/kill';
import { getToken } from "@/utils/auth";
import QRCode from 'qrcodejs2';
export default {
  data() {
    return {
      payDetail: {},
      visible: true,
      loading: false,
      paySuc: false,
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/oss/oss/uploadFile",
        fileUrl: null
      },
      choiceType: 0,
      payType: null,
      wxPayOpen: false,
      timer: null,
      wxSuc: false,
      countdown: 5
    };
  },
  created() {
    this.detailData();
  },
  methods: {
    detailData() {
      //详情
      const id = this.$route.query.id;
      getKill(id).then(response => {
        this.payDetail = response.data;
        if (this.payDetail.payState == '1' || this.payDetail.payState == '3') {
          this.paySuc = true;
        } else {
          this.paySuc = false;
        }
      })
    },
    toOnlinePay(type) {
      //1支付宝 2微信
      let params = {
        subject: "消杀订单，预约单号:" + this.payDetail.orderNumber,
        body: "箱柜号:"+this.payDetail.cabinetNumber,
        orderPrice: this.payDetail.orderPrice,
        businessNo: this.payDetail.orderNumber, //订单号
        price: this.payDetail.orderPrice //实际支付金额
      }
      if (type == "1") {
        //---支付宝支付
        request({
          url: "/pay/pay/toPay.html?detailsId=AliPay&wayTrade=PAGE",
          method: "get",
          params: params,
        }).then((resAlipay) => {
          // 避免时间间隙造成的用户误操作，尽管拿到数据了仍然显示loading...直到跳转到支付宝的提供的页面
          // this.$toast.loading({
          //   mask: true,
          //   message: '加载中...'
          // });
          // 取回来的是支付宝提供的一段自执行的form表单代码
          // 这里我把这段代码插入页面中，并手动触发
          const div = document.createElement("div");
          div.innerHTML = resAlipay.data;
          document.body.appendChild(div);
          document.forms[0].submit();
        });
      } else if (type == "2") {
        //---微信支付
        this.wxPayOpen = true;
        clearInterval(this.timer);
        request({
          url: "/pay/pay/getQrPay.json?detailsId=WxPay&wayTrade=NATIVE",
          method: "get",
          params: params,
        }).then((msg) => {
          document.getElementById("qrcode").innerHTML = ""; //清空
          //生成二维码
          var qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: msg.data.qr_code,
            width: 150,
            height: 150,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          })
          //定时器
          this.timer = setInterval(() => {
            this.wxPaySuc(msg.data.out_trade_no);
          }, 1000);
        });
      } else {
        this.$message.warning(`请选择支付方式`);
      }
    },
    wxPaySuc(code) {
      // 监控微信支付是否成功
      wxPaySuc(code).then(response => {
        if (response.data == 1) {
          //1支付成功
          clearInterval(this.timer);
          this.wxSuc = true;
          this.setTimeFive();
        }
      })
    },
    setTimeFive() {
      //倒计时
      if (this.countdown == 0) {
        //返回上一级
        this.closePay();
        return
      }
      setTimeout(() => {
        this.countdown = this.countdown - 1;
        this.setTimeFive();
      },1000);
    },
    beforeAvatarUpload() {},
    handleAvatarSuccess(response, file, fileList) {
      this.upload.fileUrl = response.data.url;
    },
    toOtherPay(type) {
      //---其他支付
      if ((!this.upload.fileUrl || this.upload.fileUrl == '') && localStorage.getItem("isV") == '0') {
        this.$message.warning(`请上传凭证`);
        return
      }
      if (type == "3") {
        this.loading = true;
        let params = {
          subject: "消杀订单，预约单号:" + this.payDetail.orderNumber,
          body: "箱柜号:"+this.payDetail.cabinetNumber,
          orderPrice: this.payDetail.orderPrice,
          businessNo: this.payDetail.orderNumber, //订单号
          payCertifyUrl: this.upload.fileUrl
        }
        killOtherPay(params).then(response => {
          this.loading = false;
          clearInterval(this.timer);
          this.paySuc = true;
          this.setTimeFive();
        });
      } else {
        this.$message.warning(`请选择支付方式`);
      }
    },
    closePay() {
      //取消付款
      //关闭当前路由标签
      this.$store.dispatch('tagsView/delView', this.$route);
      //返回上一级
      // this.$router.go(-1);
      //跳转至预约记录查询
      this.$router.push({path: '/kill/review/index'})
    }
  },
  destroyed() {
    //离开页面销毁定时器
    clearInterval(this.timer);
    this.wxSuc = false;
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.kill-pay {
  min-height: calc(100vh - 85px);
  background: #f3f7f9;
  padding: 15px 20px;
  font-size: 14px;
  .t-tips {
    color: #333;
    font-size: 16px;
    border-left: 2px solid #{$themeGreen};
    padding-left: 10px;
    font-weight: bold;
  }
  .k-content {
    background: #fff;
    padding: 15px 0;
    margin-bottom: 15px;
  }
  .kill-msg {
    display: flex;
    padding: 20px 30px 10px;
    .k-left,
    .k-right {
      flex: 1;
      margin-left: 120px;
      text-align: left;
    }
    .k-left {
      .status {
        font-size: 20px;
        color: #333;
        font-weight: 500;
        .el-icon-success {
          margin-right: 5px;
          color: #{$themeGreen};
        }
      }
      .tips {
        margin-top: 8px;
        font-size: 12px;
        color: #666;
      }
      .pay-amount {
        margin-top: 35px;
        .amount {
          margin-top: 5px;
          color: #{$amountRed};
          font-weight: bold;
          font-size: 26px;
        }
      }
    }
    .k-right {
      .line {
        height: 22px;
        line-height: 22px;
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #666;
        .l-title {
          float: left;
          width: 90px;
          color: #333;
          font-weight: 500;
        }
      }
    }
  }
  .k-pay-content {
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.09);
    margin: 20px 15px 0;
    .pay-type {
      background-color: rgba(#20B32E, 0.05);
      padding: 20px;
      /deep/ .el-radio-button {
        margin-right: 30px;
        .c-icon {
          vertical-align: middle;
          max-width: 22px;
          max-height: 20px;
          margin-right: 5px;
        }
        .el-radio-button__inner {
          height: 44px;
          line-height: 40px;
          padding: 0 20px;
        }
      }
    }
    .pay-child {
      padding: 30px 20px 45px;
      .type {
        .p-label {
          border: 1px solid #D9D9D9;
          border-radius: 1px;
          color: #333;
          text-align: center;
          margin-right: 30px;
          width: 150px;
          height: 44px;
          line-height: 44px;
          display: inline-block;
          cursor: pointer;
          img {
            vertical-align: middle;
            margin-right: 2px;
          }
        }
        .pay-other0-tips {
          font-size: 12px;
          color: #EC6A0D;
          padding-left: 24px;
          margin-top: 7px;
          font-weight: 400;
        }
      }
      .pay-other-msg {
        border-top: 1px solid rgba(#979797, 0.1);
        margin: 25px 0;
        padding: 20px 0;
        .p-o-tips {
          color: #000;
          font-weight: 500;
        }
        .company-info {
          padding: 30px 0;
          span {
            border-right: 1px solid rgba(#979797, 0.5);
            margin-right: 20px;
            padding-right: 20px;
            &:last-child {
              border-right: none;
            }
          }
        }
        .pay-voucher {
          .upload-url {
            margin-left: 20px;
          }
        }
      }
    }
  }
  .cancel-pay {
    margin-top: 40px;
    margin-right: 20px;
    text-align: right;
    span {
      color: #{$themeGreen};
      cursor: pointer;
    }
  }
  .pay-suc {
    position: relative;
    min-height: calc(100vh - 116px);
    background: #fff;
    text-align: center;
    font-size: 14px;
    .content {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-83%);
      img {
        width: 100px;
      }
      .logo-title {
        font-size: 22px;
        color: #333;
        margin-top: 10px;
        font-weight: 500;
      }
      .pay-suc-tips {
        width: 40%;
        margin: 0 auto;
        border-top: 1px solid rgba($color: #979797, $alpha: 0.4);
        margin-top: 45px;
        padding-top: 45px;
        .look-btn {
          padding-top: 8px;
          span {
            color: #ed5565;
            &.font-green {
              font-size: 16px;
              color: #20B32E;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
