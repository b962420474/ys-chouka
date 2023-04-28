<template>
  <div style="margin: auto;width: 800px;" v-show="props.data.list.length">
    <div class="process" v-for="item in datas" :key="item.id">
      <div class="icon">{{ item.name }}</div>
      <div class="progress-bar" :style="{
        width: getWidth(type, item.start_5count),
        minWidth:'40px',
        'background-color': getColor(type, item.start_5count)
      }">
        <div class="tip">{{ item.start_5count + '抽' }}</div>
      </div>
      <div class="right" :class="item.tag === '歪' ? 'red' : ''">
        {{ item.tag }}
      </div>
    </div>
  </div>
  <div style="height: 100px;font-size: 30px;">
    <!-- <div>4星保底率：{{ (_4Info.filter(item => item.start_4count === 10).length / _4Info.length * 100).toFixed(2) }}%</div>
    <div>4星9抽出货率：{{ (_4Info.filter(item => item.start_4count === 9).length / _4Info.length * 100).toFixed(2) }}%</div> -->
  </div>
</template>
<script setup>
import { computed } from '@vue/reactivity'
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
const props = defineProps({
  type: String,
  data: {
    type: Object,
    default: () => { }
  }
})
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

const getWidth = (type, num) => {
  const base = 0.8
  let typebase
  switch (type) {
    case 'wq':
      typebase = 80
      break
    default:
      typebase = 90
      break
  }
  return (num / typebase * base * 100) + '%'
}
const datas = computed(() => {
  const results = Object.assign({}, JSON.parse(JSON.stringify(props.data)))
  results._5starInfo.push({
    name: '已垫',
    start_5count: results.start_5count
  })
  return results._5starInfo.reverse()
})
// const _4Info = computed(() => {
//   const _4List = props.data._4starInfo.fromLineArray()
//   return _4List
// })
</script>
<style lang="scss">
.process {
  position: relative;
  margin: 10px;
  text-align: left;
  line-height: 30px;
  font-size: 18px;

  .icon {
    display: inline-block;
    width: 120px;
  }

  .progress-bar {
    border-radius: 10px;
    height: 30px;
    display: inline-block;
    background-size: 40px 40px;
    background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);

    .tip {
      margin-left: 5px;
    }
  }

  .right {
    float: right;
    width: 60px;
    text-align: center;
  }

  .red {
    color: red;
  }
}
</style>
