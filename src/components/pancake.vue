<template>
  <div id="main" style="width: 600px;height:400px;margin: auto;" v-show="props.data._4starInfo.length"></div>
  <div v-show="!props.data.list.length">暂无数据</div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, onUpdated } from 'vue'
const props = defineProps({
  data: {
    type: Object,
    default: () => { }
  }
})
const setOption = () => {
  if (props.data._4starInfo.length < 1) return
  const _4List = props.data._4starInfo.fromLineArray()
  const datas = [
    [
      { value: _4List.filter(item => item.start_4count === 10).length, name: '保底出紫' },
      { value: _4List.filter(item => item.start_4count === 9).length, name: '9抽出紫' },
      { value: _4List.filter(item => item.start_4count < 9).length, name: '其它出紫' }
    ],
    [
      { value: _4List.filter(item => item.item_type === '角色').length, name: '角色' },
      { value: _4List.filter(item => item.item_type === '武器').length, name: '武器' }
    ]
  ]
  const option = {
    title: {
      text: '4星详情',
      subtext: '占比率',
      left: 'center'
    },
    series: datas.map(function (data, idx) {
      var left = idx * 50
      return {
        type: 'pie',
        radius: [20, 60],
        top: '10%',
        height: '50%',
        left: left + '%',
        width: 300,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          alignTo: 'edge',
          formatter: '{name|{b}{c}}\n{time|{d}%}',
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: 15,
          rich: {
            time: {
              fontSize: 10,
              color: '#999'
            }
          }
        },
        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80
        },
        labelLayout: function (params) {
          const isLeft = params.labelRect.x < myChart.getWidth() / 2
          const points = params.labelLinePoints
          // Update the end point.
          points[2][0] = isLeft
            ? params.labelRect.x
            : params.labelRect.x + params.labelRect.width
          return {
            labelLinePoints: points
          }
        },
        data: data
      }
    })
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
