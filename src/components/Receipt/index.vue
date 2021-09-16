<template>
  <div class="kill-receipt">
    <div class="kill-receipt-tips">
      <span class="el-icon-info"></span>
      温馨提示：电子发票与纸质发票具有同等法律效力，可支持报销入账；同时根据增值税管理办法要求，如需为企业开具增值税发票，需提供纳税人识别号或统一社会信用代码，否则该发票无法作为税收凭证。
    </div>
    <el-form
      class="kill-receipt-form"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="发票">
        <el-radio v-model="form.invoiceMaterial" label="1">电子发票</el-radio>
        <el-radio v-model="form.invoiceMaterial" label="2">
          纸质发票
          <span class="t-tips">(纸质发票将随消杀证明一同交与司机)</span>
        </el-radio>
      </el-form-item>
      <!-- 电子发票不能选择增值税专属发票-start -->
      <div style="display: none">{{form.invoiceMaterial == '1' ? form.invoiceType = '1' : ''}}</div>
      <!-- end -->
      <el-form-item label="发票类型">
        <el-radio v-model="form.invoiceType" label="1">增值税普通发票</el-radio>
        <el-radio v-model="form.invoiceType" label="2" :disabled="form.invoiceMaterial == '1'">增值税专属发票</el-radio>
      </el-form-item>
      <el-form-item label="发票抬头">
        <el-radio v-model="form.invoiceHeadType" label="1">个人</el-radio>
        <el-radio v-model="form.invoiceHeadType" label="2">公司</el-radio>
      </el-form-item>
      <!-- 2-公司 -->
      <div v-if="form.invoiceHeadType == '2'">
        <el-form-item label="公司名称" prop="enterpriseName">
          <el-input
            v-model="form.enterpriseName"
            show-word-limit
            placeholder="请填写公司名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxpayerNumber">
          <el-input
            v-model="form.taxpayerNumber"
            show-word-limit
            placeholder="请填写纳税人识别号"
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="accountBank" :rules="form.invoiceType == '2' ? rules.accountBank:[{required: false}]">
          <el-input
            v-model="form.accountBank"
            placeholder="请填写开户行"
          ></el-input>
        </el-form-item>
        <el-form-item label="账户" prop="accountNumber" :rules="form.invoiceType == '2' ? rules.accountNumber:[{required: false}]">
          <el-input
            v-model="form.accountNumber"
            placeholder="请填写银行账户"
          ></el-input>
        </el-form-item>
        <div v-if="form.invoiceMaterial == '2'">
          <el-form-item label="公司地址" prop="enterpriseAddress" :rules="form.invoiceType == '2' ? rules.enterpriseAddress:[{required: false}]">
            <el-input
              v-model="form.enterpriseAddress"
              placeholder="请填写公司地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司电话" prop="enterprisePhone" :rules="form.invoiceType == '2' ? rules.enterprisePhone:[{required: false}]">
            <el-input
              v-model="form.enterprisePhone"
              placeholder="请填写公司电话"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="发票内容">
        <el-radio v-model="form.invoiceContent" label="消杀服务"
          >消杀服务</el-radio
        >
      </el-form-item>
      <el-form-item label="收票人姓名" prop="recipientName">
        <el-input
          v-model="form.recipientName"
          show-word-limit
          clearable
          placeholder="请填写收票人姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="收票人手机号" prop="recipientPhone">
        <el-input
          v-model="form.recipientPhone"
          :maxlength="11"
          show-word-limit
          clearable
          placeholder="请填写收票人手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="收票人地址" prop="recipientMail" v-if="form.invoiceMaterial == '2'">
        <el-input
          v-model="form.recipientMail"
          show-word-limit
          clearable
          placeholder="请填写收票人地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="收票人邮箱" prop="recipientMail" v-if="form.invoiceMaterial == '1'">
        <el-input
          v-model="form.recipientMail"
          show-word-limit
          clearable
          placeholder="请填写收票人邮箱"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <span class="get-info" @click="getReceipt" v-if="receiptStorage">获取上一次开票信息</span>
      <el-button @click="cancel">取 消</el-button>
      <el-button type="success" @click="submitForm">确 定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      open: false,
      form: {
        invoiceMaterial: "1",
        invoiceType: "1",
        invoiceHeadType: "1",
        enterpriseName: undefined,
        taxpayerNumber: undefined,
        accountBank: undefined,
        accountNumber: undefined,
        invoiceContent: "消杀服务",
        recipientName: undefined,
        recipientPhone: undefined,
        recipientMail: undefined,
      },
      rules: {
        enterpriseName: [
          {
            required: true,
            message: "请填写公司名称",
            trigger: "blur",
          },
        ],
        taxpayerNumber: [
          {
            required: true,
            message: "请填写纳税人识别号",
            trigger: "blur",
          },
        ],
        accountBank: [
          {
            required: true,
            message: "请填写开户行",
            trigger: "blur",
          },
        ],
        accountNumber: [
          {
            required: true,
            message: "请填写银行账户",
            trigger: "blur",
          },
        ],
        enterpriseAddress: [
          {
            required: true,
            message: "请填写公司地址",
            trigger: "blur",
          },
        ],
        enterprisePhone: [
          {
            required: true,
            message: "请填写公司电话",
            trigger: "blur",
          },
        ],
        recipientName: [
          {
            required: true,
            message: "请填写收票人姓名",
            trigger: "blur",
          },
        ],
        recipientPhone: [
          {
            required: true,
            message: "请填写收票人手机号",
            trigger: "blur",
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式错误",
            trigger: "blur",
          }
        ],
        recipientMail: [
          {
            required: true,
            message: "请填写收票人地址/邮箱",
            trigger: "blur",
          },
        ],
      },
      receiptStorage: JSON.parse(localStorage.getItem("receipt"))
    };
  },
  methods: {
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        this.$emit("receipt", this.form);
      });
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
    getReceipt() {
      this.receiptStorage = {};
      this.form = JSON.parse(localStorage.getItem("receipt"));
    },
    cancel() {
      this.$emit("cancel");
    },
  }
};
</script>
<style lang="scss" scoped>
.kill-receipt {
  .kill-receipt-tips {
    background: #fff5ed;
    color: #ff6000;
    padding: 10px 15px;
    font-size: 12px;
    line-height: 18px;
  }
  .t-tips {
    font-size: 12px;
    color: #ff6000;
  }
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
  /deep/ .el-form-item__error {
    height: 15px;
    position: static;
  }
  .kill-receipt-form {
    padding: 30px 20px;
    padding-right: 135px;
  }
  .dialog-footer {
    text-align: right;
    padding: 0 30px 30px;
    .get-info {
      margin-right: 20px;
      font-size: 12px;
      color: #20B32E;
      cursor: pointer;
    }
  }
}
</style>