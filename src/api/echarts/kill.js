import echarts from 'echarts';

export default class lineChart {
  //金额统计
  amountLine(canvasName, date, order, price, discount) {
    let canvasKLInit = echarts.init(canvasName);
    var Option = ({
      tooltip: {
        trigger: 'axis',
        confine: true
      },
      legend: {
        data: ['订单金额', '成交金额', '优惠金额'],
        right: 35
      },
      grid: [{
        left: 90,
        right: 30,
        top: 40,
        bottom: 40
      }],
      // dataZoom: [{
      //   type: 'inside'
      // }, {
      //   type: 'slider'
      // }],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: { show: false }, //去掉坐标轴刻度线
        axisLine: { onZero: false, lineStyle: { color: '#EBEBEB' } },
        axisLabel: { textStyle: { color: '#666666' } }, //坐标值颜色
        data: date
      },
      yAxis: {
        type: 'value',
        axisTick: { show: false },
        axisLine: { onZero: false, lineStyle: { color: '#E4E4E4' } },
        axisLabel: { textStyle: { color: '#666666' }, formatter: '{value}' },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E4E4E4'
          }
        },
      },
      series: [{
        name: '订单金额',
        type: 'line',
        itemStyle: {
          normal: {
            color: "#00BABA",
            lineStyle: {
              color: "#00BABA"
            }
          }
        },
        data: order
      },
      {
        name: '成交金额',
        type: 'line',
        itemStyle: {
          normal: {
            color: "#9A60B4",
            lineStyle: {
              color: "#9A60B4"
            }
          }
        },
        data: price
      },
      {
        name: '优惠金额',
        type: 'line',
        itemStyle: {
          normal: {
            color: "#F6AA1F",
            lineStyle: {
              color: "#F6AA1F"
            }
          }
        },
        data: discount
      }]
    })
    canvasKLInit.setOption(Option, true);
  }
  //车辆数量统计
  numLine(canvasName, date, inCount, outCount, stopCount) {
    let canvasKLInit = echarts.init(canvasName);
    var Option = ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['入园数量', '靠口数量', '出园数量'],
        right: 35
      },
      grid: [{
        left: 70,
        right: 30,
        top: 40,
        bottom: 40
      }],
      // dataZoom: [{
      //   type: 'inside'
      // }, {
      //   type: 'slider'
      // }],
      xAxis: {
        type: 'category',
        axisTick: { show: false }, //去掉坐标轴刻度线
        axisLine: { onZero: false, lineStyle: { color: '#EBEBEB' } },
        axisLabel: { textStyle: { color: '#666666' } }, //坐标值颜色
        data: date
      },
      yAxis: {
        type: 'value',
        axisTick: { show: false },
        axisLine: { onZero: false, lineStyle: { color: '#E4E4E4' } },
        axisLabel: { textStyle: { color: '#666666' }, formatter: '{value}' },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E4E4E4'
          }
        }, //网格线
      },
      series: [{
        name: '入园数量',
        type: 'bar',
        barGap: 0.1,
        barMaxWidth: 25,//最大宽度
        itemStyle: {
          normal: {
            color: "#2A61FF"
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: inCount
      },
      {
        name: '靠口数量',
        type: 'bar',
        barGap: 0.1,
        barMaxWidth: 25,//最大宽度
        itemStyle: {
          normal: {
            color: "#FC8452"
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: stopCount
      },
      {
        name: '出园数量',
        type: 'bar',
        barGap: 0.1,
        barMaxWidth: 25,//最大宽度
        itemStyle: {
          normal: {
            color: "#51CA90"
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: outCount
      }]
    })
    canvasKLInit.setOption(Option, true);
  }
}