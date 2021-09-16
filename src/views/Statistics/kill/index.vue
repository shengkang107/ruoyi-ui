<template>
  <!-- 业务报表-消杀 -->
  <div class="kill-statistics" v-loading="loading">
    <div class="kill-tab-top">
      <div class="kill-tab-click">
        <span 
          v-for="(item,index) in timeList" 
          :key="index" 
          :class="{'active': item.type == checkType}" 
          @click="check(item.type)"
        >{{item.name}}</span>
      </div>
      <el-form
        ref="queryForm"
        :inline="true"
        label-width="75px"
      >
        <el-form-item label="查询时间" prop="timeArea" class="search-form">
          <!-- 年 -->
          <div v-if="checkType == 1">
            <el-date-picker
              class="mr10"
              v-model="yearStart"
              type="year"
              placeholder="开始年份"
              value-format="yyyy">
            </el-date-picker> 至
            <el-date-picker
              class="ml0"
              v-model="yearEnd"
              type="year"
              placeholder="结束年份"
              value-format="yyyy">
            </el-date-picker>
          </div>
          <!-- 月 -->
          <el-date-picker
            v-if="checkType == 2"
            v-model="timeArea"
            type="monthrange"
            align="left"
            unlink-panels
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            value-format="yyyy-MM"
            :picker-options="pickerOptions">
          </el-date-picker>
          <!-- 日 -->
          <el-date-picker
            v-if="checkType == 3"
            v-model="timeArea"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <span class="mr20" style="line-height: 36px;" v-if="checkType == 4 && timeArea">
          {{timeArea[0]}} 至 {{timeArea[1]}}
        </span>
        <el-form-item class="search-btn">
          <el-button
            type="cyan"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kill-tab-content">
      <!-- echarts -->
      <div class="echarts">
        <div class="chart-child2" id="chart2Width">
          <div class="chart-title">车辆统计</div>
          <div class="echart" id="affairs_num"></div>
        </div>
        <div class="chart-child1" id="chartWidth">
          <div class="chart-title">金额统计</div>
          <div class="echart" id="affairs_process"></div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table">
        <div class="chart-title">
          列表视图 
          <el-tooltip class="item" effect="dark" content="订单金额、成交金额、优惠金额根据入园时间计算" placement="right">
            <span class="el-icon-question"></span>
          </el-tooltip>
          <span class="fr">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出
            </el-button>
          </span>
        </div>
        <div class="table-all">
          <div class="t-a-tab">
            <div class="the-title">入园数量（车）</div>
            <div class="the-msg"> {{totalJson.inCountSum}} </div>
          </div>
          <div class="t-a-tab">
            <div class="the-title">靠口数量（车）</div>
            <div class="the-msg"> {{totalJson.stopCountSum}} </div>
          </div>
          <div class="t-a-tab">
            <div class="the-title">出园数量（车）</div>
            <div class="the-msg"> {{totalJson.outCountSum}} </div>
          </div>
          <div class="t-a-tab">
            <div class="the-title">订单金额（元）</div>
            <div class="the-msg"> {{totalJson.orderAmountSum | moneyFilters}} </div>
          </div>
          <div class="t-a-tab">
            <div class="the-title">成交金额（元）</div>
            <div class="the-msg"> {{totalJson.priceAmountSum | moneyFilters}} </div>
          </div>
          <div class="t-a-tab">
            <div class="the-title">优惠金额（元）</div>
            <div class="the-msg"> {{totalJson.discountAmountSum | moneyFilters}} </div>
          </div>
          <div class="t-a-tab">
            <div class="the-title">订单取消数</div>
            <div class="the-msg"> {{totalJson.cancelCountSum}} </div>
          </div>
        </div>
        <div class="font12 color66 mb5"><i class="el-icon-info"></i> 该数据为实际业务发生数据</div>
        <el-table :data="list">
          <el-table-column label="周期" align="center" prop="date" />
          <el-table-column label="入园数量（车）" align="center" prop="inCount" />
          <el-table-column label="靠口数量（车）" align="center" prop="stopCount"/>
          <el-table-column label="出园数量（车）" align="center" prop="outCount"/>
          <el-table-column label="订单金额（元）" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.orderAmount | moneyFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成交金额（元）" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.priceAmount | moneyFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠金额（元）" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.discountAmount | moneyFilters }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单取消数" align="center" prop="cancelCount"/>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { analysisKillList } from '@/api/system/Statistics';
import lineChart from "@/api/echarts/kill.js";
import format from "@/utils/index.js";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 查询参数
      yearStart: null,
      yearEnd: null,
      timeArea: null,
      queryParams: {},
      pickerOptions: {
        shortcuts: [{
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      pickerOptions2: {
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      timeList: [{
        name: "近7日",
        type: 4
      },{
        name: "日",
        type: 3
      },{
        name: "月",
        type: 2
      },{
        name: "年",
        type: 1
      }],
      checkType: 4,
      list: [], //表格列表
      totalJson: {} //汇总
    };
  },
  mounted() {
    this.check(4);
  },
  methods: {
    getList() {
      //获取列表
      if (this.checkType == 4) {
        this.queryParams.type = 3;
      }
      analysisKillList(this.queryParams).then(response => {
        this.list = response.data.killReportOneVoList;
        this.totalJson = response.data.killReportSumVo;
        this.loading = false;
        this.killEchart("affairs_process", "chartWidth", this.list);
        this.killEchart("affairs_num", "chart2Width", this.list);
      })
    },
    killEchart(type, id, JsonData) {
      //生成图表
      let date = [],order = [],price = [],discount = [],inCount = [],outCount = [],stopCount = [];
      for (var j = 0; j < JsonData.length; j++) {
        date.push(JsonData[j].date); //日期
        order.push(JsonData[j].orderAmount); //订单金额
        price.push(JsonData[j].priceAmount); //成交金额
        discount.push(JsonData[j].discountAmount); //优惠金额
        inCount.push(JsonData[j].inCount); //入园
        outCount.push(JsonData[j].outCount); //出园
        stopCount.push(JsonData[j].stopCount); //靠口
      }
      // 进度百分比
      var sizeId = document.getElementById(id);
      var sizeWidth = sizeId.clientWidth || sizeId.offsetWidth;
      var sizeHeight = sizeId.clientHeight || sizeId.offsetHeight;

      var mycanvas = document.getElementById(type);
      mycanvas.width = sizeWidth - 10;
      mycanvas.width = mycanvas.width;
      mycanvas.height = sizeHeight - 80;
      mycanvas.height = mycanvas.height;
      let kline = new lineChart();
      if (id == "chartWidth") {
        kline.amountLine(mycanvas, date, order, price, discount);
      } else {
        kline.numLine(mycanvas, date, inCount, outCount, stopCount);
      }
    },
    check(type) {
      this.timeArea = null;
      this.checkType = type;
      let Time = new format();
      switch(type) {
        case 1: //年
          var date = new Date();
          this.yearStart = '' + (date.getFullYear() - 2);
          this.yearEnd = '' + date.getFullYear();
          this.timeArea = [this.yearStart, this.yearEnd];
          break;
        case 2: //月
          const end2 = new Date();
          const start2 = new Date();
          start2.setMonth(start2.getMonth() - 6);
          this.timeArea = [Time.format(start2, "yyyy-MM"), Time.format(end2, "yyyy-MM")];
          break;
        case 3: //日
          const end3 = new Date();
          const start3 = new Date();
          start3.setTime(start3.getTime() - 3600 * 1000 * 24 * 15);
          this.timeArea = [Time.format(start3, "yyyy-MM-dd"), Time.format(end3, "yyyy-MM-dd")];
          break;
        case 4: //近七天
          const end4 = new Date();
          const start4 = new Date();
          start4.setTime(start4.getTime() - 3600 * 1000 * 24 * 6);
          this.timeArea = [Time.format(start4, "yyyy-MM-dd"), Time.format(end4, "yyyy-MM-dd")];
          break;
      }
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.checkType == 1) {
        if (!this.yearStart || !this.yearEnd) {
          this.$message("请选择查询时间范围");
          return false;
        } else {
          this.timeArea = [this.yearStart, this.yearEnd];
        }
      }
      if (this.timeArea) {
        this.queryParams = {
          type: this.checkType,
          startDate: this.timeArea[0],
          endDate: this.timeArea[1]
        }
        this.loading = true;
        this.getList();
      } else {
        this.$message("请选择查询时间范围");
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.check(this.checkType);
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/analysis/exportKill', {
        ...this.queryParams
      }, `消杀业务报表.xlsx`)
    },
    resetForm() {
      this.$refs["queryForm"].resetFields();
    }
  },
  filters: {
    moneyFilters(value) {
      if (value) {
        var num = value;
        num = num.toFixed(2);
        num = parseFloat(num);
        num = num.toLocaleString();
        return num;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/index.scss";
.kill-statistics {
  width: 100%;
  height: calc(100vh - 84px);
  background: #F3F3F5;
  overflow-y: scroll;
  font-size: 14px;
  padding: 15px;
  .kill-tab-top {
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
    .kill-tab-click {
      border-bottom: 1px solid #DCDEE0;
      margin-bottom: 20px;
      span {
        display: inline-block;
        width: 103px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-top: 1px solid #DCDEE0;
        border-left: 1px solid #DCDEE0;
        background: #F7F8FA;
        color: #323233;
        cursor: pointer;
        &:first-child {
          border-radius: 4px 0 0 0;
        }
        &:last-child {
          border-right: 1px solid #DCDEE0;
          border-radius: 0 4px 0 0;
        }
        &.active {
          background: #fff;
        }
      }
    }
  }
  .chart-title {
    height: 45px;
    line-height: 45px;
    padding-left: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
  .kill-tab-content {
    height: calc(100% - 150px);
    .echarts {
      @include display-flex;
      height: 50%;
      width: 100%;
      margin-bottom: 15px;
      box-sizing: border-box;
      .chart-child2 {
        margin-right: 15px; 
      }
      .chart-child1,
      .chart-child2 {
        @include flex(1);
        background: #fff;
        height: 100%;
        border-radius: 2px;
        .echart {
          height: calc(100% - 50px);
        }
      }
    }
    .table {
      background: #fff;
      padding: 0 20px 30px;
      .chart-title {
        padding-left: 0px;
        border-bottom: 1px solid #F3F4F3;
      }
      .table-all {
        @include display-flex;
        .t-a-tab {
          @include flex(1);
          text-align: center;
          padding: 20px 0 30px;
          .the-title {
            font-size: 12px;
            color: #999;
          }
          .the-msg {
            margin-top: 10px;
            font-size: 20px;
            color: #FF5038;
            font-weight: 550;
          }
        }
      }
    }
  }
}
// 手机端样式
.mobile {
  .kill-statistics {
    padding: 0;
    .kill-tab-top {
      padding: 10px;
      margin-bottom: 10px;
      .kill-tab-click {
        border-bottom: 1px solid #DCDEE0;
        margin-bottom: 15px;
        span {
          width: 60px;
        }
      }
      .search-form {
        /deep/ .el-form-item__content {
          width: calc(100% - 75px);
        }
        .el-range-editor--medium.el-input__inner {
          width: 100%;
        }
      }
      .search-btn {
        margin-top: 10px;
        text-align: center;
        width: 100%;
      }
    }
    .el-date-editor.el-input {
      width: 40%;
    }
    .chart-title {
      font-size: 14px;
      padding-left: 10px;
    }
    .kill-tab-content {
      .echarts {
        display: inline-block;
        height: 550px;
        margin-bottom: 10px;
        .chart-child2 {
          margin-bottom: 10px;
          margin-right: 0;
        }
        .chart-child1,
        .chart-child2 {
          height: 275px;
        }
      }
      .table {
        margin-top: 10px;
        padding: 0 10px 20px;
        .table-all {
          display: inline-block;
          padding-top: 10px;
          padding-left: 20px;
          .t-a-tab {
            float: left;
            width: 50%;
            text-align: left;
            padding: 2px 0 10px;
            .the-msg {
              margin-top: 8px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>