<template>
  <div class="kill-receipt-detail" v-if="form">
    <el-form
      class="kill-receipt-form"
      ref="form"
      label-width="160px"
    >
      <el-form-item label="发票" style="border-top: none;">
        <span> {{form.invoiceMaterial == '1' ? "电子发票" : "纸质发票"}} </span>
      </el-form-item>
      <el-form-item label="发票类型">
        <span> {{form.invoiceType == '1' ? "增值税普通发票" : "增值税专属发票"}} </span>
      </el-form-item>
      <el-form-item label="发票抬头">
        <span> {{form.invoiceHeadType == '1' ? "个人" : "公司"}} </span>
      </el-form-item>
      <!-- 2-公司 -->
      <div v-if="form.invoiceHeadType == '2'">
        <el-form-item label="公司名称">
          <span>{{ form.enterpriseName }}</span>
        </el-form-item>
        <el-form-item label="纳税人识别号">
          <span>{{ form.taxpayerNumber }}</span>
        </el-form-item>
        <el-form-item label="开户行">
          <span>{{ form.accountBank }}</span>
        </el-form-item>
        <el-form-item label="银行账户">
          <span>{{ form.accountNumber }}</span>
        </el-form-item>
        <el-form-item label="公司地址">
          <span>{{ form.enterpriseAddress }}</span>
        </el-form-item>
        <el-form-item label="公司电话">
          <span>{{ form.enterprisePhone }}</span>
        </el-form-item>
      </div>
      <el-form-item label="发票内容">
        <span>消杀服务</span>
      </el-form-item>
      <el-form-item label="收票人姓名">
        <span>{{ form.recipientName }}</span>
      </el-form-item>
      <el-form-item label="收票人手机号">
        <span>{{ form.recipientPhone }}</span>
      </el-form-item>
      <el-form-item :label="form.invoiceMaterial == '2' ? '收票人地址':'收票人邮箱'">
        <span>{{ form.recipientMail }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { receiptDetail } from '@/api/system/receipt'
export default {
  props: ["orderNumber"],
  data() {
    return {
      form: {}
    };
  },
  methods: {
    receipt_detail() {
      this.form = {};
      //发票信息
      receiptDetail(this.orderNumber).then((response) => {
        if (response.code === 200) {
          this.form = response.data;
        }
      });
    }
  },
  watch: {
    orderNumber: {
      immediate: true,
      handler: "receipt_detail"
    }
  }
};
</script>
<style lang="scss" scoped>
.kill-receipt-detail {
  border: 1px solid #EBEDF0;
  margin: 20px 25px;
  /deep/ .el-form-item {
    margin-bottom: 0px;
    border-top: 1px solid #EBEDF0;
    .el-form-item__label {
      color: #333;
      text-align: left;
      padding-left: 20px;
      font-weight: 400;
    }
    .el-form-item__content {
      padding-left: 20px;
      border-left: 1px solid #EBEDF0;
      color: #666;
    }
  }
  /deep/ .el-form-item__error {
    height: 15px;
    position: static;
  }
}
</style>