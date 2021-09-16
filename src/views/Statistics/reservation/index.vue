<template>
  <!-- 消杀预约报表 -->
  <div class="r-statistics" v-loading="loading">
    <div class="r-tab-title">
      <el-form ref="queryForm" :inline="true" label-width="75px">
        <el-form-item label="查询时间">
          <el-date-picker
            v-model="timeSearch"
            type="month"
            placeholder="选择月"
            value-format="yyyy-MM"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="search-btn">
          <el-button
            type="cyan"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="r-tab-content">
      <!-- echarts -->
      <div class="echarts">
        <div class="timeSearch" v-if="timeTitle">{{timeTitle}}</div>
        <div class="chart-child">
          <div class="echart" id="affairs_num"></div>
        </div>
      </div>
      <!-- 表格 -->
      <!-- <div class="table">
        <div class="chart-title">
          列表视图
        </div>
        <el-table height="calc(100vh - 340px)" :data="list">
          <el-table-column label="日期" align="center" prop="date" />
          <el-table-column label="等待入园" align="center" prop="wait" />
          <el-table-column label="已入园" align="center" prop="already"/>
          <el-table-column label="已取消" align="center" prop="cancel"/>
          <el-table-column label="预约总数" align="center" prop="count" />
        </el-table>
      </div> -->
    </div>
  </div>
</template>
<script>
import { analysisReservation } from "@/api/system/Statistics";
import lineChart from "@/api/echarts/reservation.js";
import format from "@/utils/index.js";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 查询参数
      timeSearch: null,
      timeTitle: null,
      queryParams: {},
      list: [], //表格列表
    };
  },
  mounted() {
    let Time = new format();
    const timeStr = new Date();
    this.timeSearch = Time.format(timeStr, "yyyy-MM");
    this.handleQuery();
  },
  methods: {
    getList() {
      //获取列表
      analysisReservation(this.queryParams).then((response) => {
        this.list = response.data;
        this.loading = false;
        this.killEchart(this.list);
      });
    },
    killEchart(JsonData) {
      //生成图表
      let dataArr = [];
      for (var j = 0; j < JsonData.length; j++) {
        dataArr.push([
          JsonData[j].date,
          JsonData[j].wait,
          JsonData[j].already,
          JsonData[j].cancel,
          JsonData[j].count,
        ]);
      }
      // 进度百分比
      var mycanvas = document.getElementById("affairs_num");
      let kline = new lineChart();
      kline.reservationPie(mycanvas, dataArr, this.timeSearch);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.timeSearch) {
        let timeStr = this.timeSearch;
        let year = timeStr.slice(0,4);
        let mounth = timeStr.slice(5,7);
        this.timeTitle = year + '年' + mounth + '月'; //标题
        let d =  new Date(year, mounth, 0);
        //查询
        this.queryParams = {
          startDate: timeStr + '-01',
          endDate: timeStr + '-' + d.getDate(),
        }
        this.loading = true;
        this.getList();
      } else {
        this.$message("请选择查询时间");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/index.scss";
.r-statistics {
  width: 100%;
  height: calc(100vh - 84px);
  background: #f3f3f5;
  font-size: 14px;
  padding: 15px;
  .r-tab-title {
    background: #fff;
    padding: 14px 69px 0;
  }
  .chart-title {
    height: 45px;
    line-height: 45px;
    padding-left: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
  .r-tab-content {
    // @include display-flex;
    background: #fff;
    height: calc(100% - 75px);
    .echarts {
      // @include flex(2);
      height: calc(100% - 35px);
      // width: 100%;
      box-sizing: border-box;
      .timeSearch {
        text-align: center;
        font-size: 30px;
        font-weight: 500;
        color: #323233;
      }
      .chart-child {
        height: 100%;
        border-radius: 2px;
        .echart {
          height: 100%;
        }
      }
    }
    // .table {
    //   @include flex(1);
    //   margin-right: 68px;
    //   .chart-title {
    //     padding-left: 0px;
    //     margin-bottom: 15px;
    //     border-bottom: 1px solid #F3F4F3;
    //   }
    // }
  }
}
</style>