import echarts from 'echarts';

var cellSize = [document.body.clientWidth/13, document.body.clientHeight/9.5];
var pieRadius = 30;

function getPieSeries(scatterData, chart) {
  return scatterData.map(function (item, index) {
    var center = chart.convertToPixel('calendar', item);
    return {
      id: index + 'pie',
      type: 'pie',
      center: center,
      label: {
        normal: {
          formatter: '{c}',
          position: 'inside'
        }
      },
      radius: pieRadius,
      color: ['#2BC63A', '#FFA23E', '#248BFF'], //饼图颜色
      data: [
        { name: '等待入园', value: item[1] == 0 ? '' : item[1] },
        { name: '已入园', value: item[2] == 0 ? '' : item[2] },
        { name: '已取消', value: item[3] == 0 ? '' : item[3] }
      ]
    };
  });
}

function getPieSeriesUpdate(scatterData, chart) {
  return scatterData.map(function (item, index) {
    var center = chart.convertToPixel('calendar', item);
    return {
      id: index + 'pie',
      center: center
    };
  });
}

export default class lineChart {
  reservationPie(canvasName, dataArr, time) {
    let canvasKLInit = echarts.init(canvasName);
    var scatterData = dataArr;
    var Option = ({
      tooltip: {},
      legend: {
        data: ['等待入园', '已入园', '已取消'],
        // left: 20,
        bottom: 20
      },
      calendar: {
        top: 'middle',
        left: 'center',
        orient: 'vertical',
        cellSize: cellSize,
        splitLine: {
          lineStyle: {
            color: '#DFE0E6',
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#DFE0E6',
          borderWidth: 1
        },
        yearLabel: {
          show: false,
          fontSize: 30
        },
        dayLabel: {
          margin: 20,
          firstDay: 7,
          nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          color: "#323233",
        },
        monthLabel: {
          show: false
        },
        range: [time]
      },
      series: [{
        id: 'label',
        type: 'scatter',
        coordinateSystem: 'calendar',
        symbolSize: 1,
        label: {
          show: true,
          formatter: function (params) {
            return echarts.format.formatTime('dd', params.value[0]) + '{all|\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t预约：'+ params.value[4] +'}';
          },
          rich: {
            all: {
              fontSize: 10,
              color: '#666'
            }
          },
          offset: [0, -cellSize[1] / 2 + 15], //-cellSize[0] / 2 + 60
          color: "#000",
          fontWeight: 'bold',
          fontSize: 14
        },
        data: scatterData
      }]
    });
    canvasKLInit.setOption(Option, true);

    var pieInitialized;
    setTimeout(function () {
      pieInitialized = true;
      canvasKLInit.setOption({
        series: getPieSeries(scatterData, canvasKLInit)
      });
    }, 10);
    app.onresize = function () {
      if (pieInitialized) {
        canvasKLInit.setOption({
          series: getPieSeriesUpdate(scatterData, canvasKLInit)
        });
      }
    };
  }
}