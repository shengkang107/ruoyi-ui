<template>
  <div class="report">
    <div style="width: 90%;height:80%;background-color: #ffffff;border:1px solid white;
border-radius:10px;
-moz-border-radius:25px;margin-bottom: 20px"
    >
      <el-image :src="require('@/assets/image/report-logo.png')"
                style="width: 20%;display:block;margin:0 auto"></el-image>
      <div style="text-align: left;color: #ff8000;font-weight:500;margin-top: 10px;margin-left: 40px;margin-bottom: 10px">
        数据时间:{{ currentTime }}
      </div>
      <div style="text-align: left;display:block;">
        <div style="margin-left: 40px">
          今日入园数: <span style="color:red;font-weight: bolder">{{this.form.countForToday}}</span>车
        </div>
        <el-divider></el-divider>
        <div style="margin-left: 40px">
          今日靠口数: <span style="color:red;font-weight: bolder">{{this.form.inCountForToday}}</span>车
        </div>
        <el-divider></el-divider>
        <div style="margin-left: 40px">
          今日出园数: <span style="color:red;font-weight: bolder">{{this.form.outCountForToday}}</span>车
        </div>
        <el-divider></el-divider>
        <div style="margin-left: 40px">
          今日成交金额: <span style="color:red;font-weight: bolder">{{this.form.amountForToday}}</span>元
        </div>
        <el-divider></el-divider>
        <div style="margin-left: 40px">
          今日预约数: <span style="color:red;font-weight: bolder">{{this.form.reservationForToday}}</span>车
        </div>
        <el-divider></el-divider>
        <div style="margin-left: 40px">
          等待靠口数: <span style="color:red;font-weight: bolder">{{this.form.inCountSum}}</span>车
        </div>
        <el-divider></el-divider>
        <div style="margin-left: 40px">
          上港系统直推累计入园数: <span style="color:red;font-weight: bolder">{{this.form.highRiskSumCount}}</span>车
        </div>
        <el-divider></el-divider>
        <div style="margin-left: 40px">
          上港系统直推待送箱数: <span style="color:red;font-weight: bolder">{{this.form.highRiskSumWait}}</span>车
        </div>
        <el-divider></el-divider>
      </div>
      <el-button type="warning" style="display:block;margin:5% auto;;width: 200px" @click="fresh">刷新</el-button>
    </div>
  </div>

</template>
<script>

import request from "@/utils/request";
import moment from 'moment';

export default {
  components: {},
  props: [],
  data() {
    return {
      currentTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), // 获取当前时间
      form: {},
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {
  },
  methods: {
    getList() {
      request({
        url: '/system/analysis/bossKillReport/',
        method: 'get'
      }).then(response => {
        this.form = response.data
      })
    },
    fresh() {
      this.getList();
      this.currentTime= moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    },
    // 表单重置
    reset() {
      this.form = {
        countForToday: null,
        inCountForToday: null,
        outCountForToday: null,
        inCountSum: null,
        amountForToday: null,
        reservationForToday: null,
        highRiskSumCount: null,
        highRiskSumWait: null,
      };
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
      this.reset()
      this.tabShow = false
    },
  }
}

</script>
<style>
.report {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/report-bg.png");
  background-size: cover;
}

.el-row {
  margin-bottom: 5%
}
.el-divider--horizontal {
  margin: 15px 0;
}
</style>
