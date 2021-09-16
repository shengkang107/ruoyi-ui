<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import request from '@/utils/request'

let lineChartData = {
   in: {
    inData: [],
    outData: [],
    saveData: [],
    days:[]
  },
  out: {
    inData: [],
    outData: [],
    saveData: [],
    days:[]
  },
  save: {
    inData: [],
    outData: [],
    saveData: [],
    days:[]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.in,
      days:[],
      inCount:0,
      outCount:0,
      saveCount:0,
      userCount:0
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    /** 首页信息 */
    getList() {
      this.loading = true;
      request({
        url: '/system/user/indexList',
        method: 'get'
      }).then(response => {
        this.userCount = response.data.userCount;
        this.inCount = response.data.inCount;
        this.outCount = response.data.outCount;
        this.saveCount = response.data.saveCount;
        this.days=response.data.days;
        this.total = response.total;
        this.loading = false;
        lineChartData.in.days=this.days;
        lineChartData.in.inData=response.data.in;
        lineChartData.in.outData=response.data.out;
        lineChartData.in.saveData=response.data.save;
        lineChartData.out.days=this.days;
        lineChartData.out.inData=response.data.in;
        lineChartData.out.outData=response.data.out;
        lineChartData.out.saveData=response.data.save;
        lineChartData.save.days=this.days;
        lineChartData.save.inData=response.data.in;
        lineChartData.save.outData=response.data.out;
        lineChartData.save.saveData=response.data.save;
      });
    }
  },created() {
    this.getList();
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
