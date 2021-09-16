<template>
  <div class="kill-refund-detail" v-if="detail">
    <el-timeline>
      <el-timeline-item :timestamp="detail.createTime" :color="'#20B32E'">
        申请退款 <span v-if="detail.refundAmount">（申请退款金额：￥{{detail.refundAmount}}）</span>
        <p class="color66 font12">预约单号：{{detail.orderNumber}}</p>
      </el-timeline-item>
      <el-timeline-item :color="orderColor">
        单证审核{{detail.result == '2' ? "驳回" : "通过"}}
        <p v-if="detail.orderRemark" class="color66">备注：{{detail.orderRemark}}</p>
      </el-timeline-item>
      <el-timeline-item :color="financeColor">
        财务审核{{detail.result == '4' ? "驳回" : "通过"}}
        <p v-if="detail.financeRemark" class="color66">备注：{{detail.financeRemark}}</p>
      </el-timeline-item>
      <el-timeline-item :color="detail.result == '5' ? '#20B32E' : ''">
        退款成功
        <p v-if="detail.actualAmount">实际退款金额：￥{{detail.actualAmount}}</p>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import { refundDetail } from "@/api/system/finance";
export default {
  props: ["orderNumber"],
  data() {
    return {
      detail: {},
      orderColor: '',
      financeColor: ''
    };
  },
  methods: {
    refund_detail() {
      let vm = this;
      this.detail = {};
      //发票信息
      refundDetail(this.orderNumber).then(response => {
        if (response.code === 200) {
          this.detail = response.data;
          //颜色
          let data = response.data;
          this.orderColor = data.result >= 1 && data.result != 2 ? '#20B32E' : data.result == 2 ? '#FF5600' : '';
          this.financeColor = data.result >= 3 && data.result != 4 ? '#20B32E' : data.result == 4 ? '#FF5600' : '';
        }
      });
    }
  },
  watch: {
    orderNumber: {
      immediate: true,
      handler: "refund_detail"
    }
  }
};
</script>
<style lang="scss" scoped>
.kill-refund-detail {
}
</style>