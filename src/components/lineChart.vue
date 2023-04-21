<template>
  <div id="main" style="width: 600px;height:400px;margin: auto;" v-show="props.data.list.length"></div>
  <div v-show="!props.data.list.length">暂无数据</div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, onUpdated } from 'vue'
import $color from './util'
const range = {
  up: {
    red: [73, 90],
    yellow: [51, 72],
    green: [1, 50]
  },
  wq: {
    red: [65, 80],
    yellow: [45, 64],
    green: [1, 45]
  },
  cz: {
    red: [73, 90],
    yellow: [51, 72],
    green: [1, 50]
  }
}

const getColor = (type, num) => {
  const d = range[type]
  if (num <= d.yellow[1] && num >= d.yellow[0]) {
    return $color.yellow
  } else if (num <= d.green[1] && num >= d.green[0]) {
    return $color.green
  } else {
    return $color.red
  }
}
const props = defineProps({
  type: String,
  data: {
    type: Object,
    default: () => { }
  }
})
const setOption = () => {
  const datas = Object.assign({}, JSON.parse(JSON.stringify(props.data)))
  datas._5starInfo.push({
    name: '已垫',
    start_5count: datas.start_5count
  })
  const option = {
    animation: false,
    title: {
      text: '抽卡详情'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: datas._5starInfo.map(item => item.name)
    },
    series: [
      {
        name: '',
        type: 'bar',
        barWidth: 20,
        data: datas._5starInfo.map(item => item.start_5count),
        itemStyle: {
          barBorderRadius: [0, 10, 10, 0],
          color: function (params) {
            return getColor(props.type, params.data)
          }
        },
        label: {
          show: true,
          position: 'right',
          // valueAnimation: true,
          formatter: function (params) {
            return params.data + (datas._5starInfo[params.dataIndex].tag ? ('(' + (datas._5starInfo[params.dataIndex].tag) + ')') : '')
          }
        }
      }
    ],
    dataZoom: [
      {
        type: 'slider',
        maxValueSpan: 9, // 显示数据的条数(默认显示10个)
        show: true,
        yAxisIndex: [0],
        left: '98%', // 滑动条位置
        startValue: datas._5starInfo.length - 10, // 默认为0
        endValue: datas._5starInfo.length, // 默认为100
        handleSize: 0, // 滑动条的 左右2个滑动条的大小
        height: '80%', // 组件高度
        borderColor: 'rgba(43,48,67,1)',
        fillerColor: '#33384b',
        backgroundColor: 'rgba(43,48,67,.8)', // 两边未选中的滑动条区域的颜色
        showDataShadow: false, // 是否显示数据阴影 默认auto
        showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
        realtime: true, // 是否实时更新
        filterMode: 'filter'
      },
      {
        type: 'inside', // 内置滑动，随鼠标滚轮展示
        yAxisIndex: [0],
        start: 0, // 初始化时，滑动条宽度开始标度
        end: 100, // 初始化时，滑动条宽度结束标度
        zoomOnMouseWheel: false, // 如何触发缩放。可选值为：true：表示不按任何功能键，鼠标滚轮能触发缩放。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标滚轮能触发缩放。'ctrl'：表示按住 ctrl 和鼠标滚轮能触发缩放。'alt'：表示按住 alt 和鼠标滚轮能触发缩放。。
        moveOnMouseMove: true,
        moveOnMouseWheel: true // 鼠标滚轮实现移动
      }
    ]
  }
  myChart.setOption(option)
}
let myChart = null
onMounted(() => {
  myChart = echarts.init(document.getElementById('main'))
  setOption()
})
onUpdated(() => {
  setOption()
})
</script>
