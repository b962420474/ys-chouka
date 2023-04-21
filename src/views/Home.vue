<template>
  <div class="home">
    <a-layout>
      <a-layout-header>
        <a-input v-model:value="value" placeholder="请输入祈愿地址或uid" autocomplete="on" />
        <a-space :size="20">
          <a-button type="primary" @click="query">查询</a-button>
          <a-button type="primary" @click="getAddress">获取祈愿地址</a-button>
        </a-space>
      </a-layout-header>
      <a-layout-content style="max-height: 600px;overflow-y:auto;">
        <div class="log" v-if="!isShow">
          <div v-for="item in logs" :key="item">{{ item }}</div>
        </div>
        <div v-else>
          <a-tabs v-model:activeKey="activeKey" centered>
            <a-tab-pane key="up" tab="Up池">
            </a-tab-pane>
            <a-tab-pane key="wq" tab="武器池">
            </a-tab-pane>
            <a-tab-pane key="cz" tab="常驻池">
            </a-tab-pane>
          </a-tabs>
          <line-show :type="activeKey" :data="results[activeKey]"></line-show>
          <pancake :data="results[activeKey]"></pancake>
          <line-table :data="results[activeKey].list"></line-table>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup>
import { AnalysisQiYuan, queryDataById, parserUrl } from '@/lib/analysis.js'
import { ref } from 'vue'
// import lineChart from '../components/lineChart.vue'
import pancake from '../components/pancake.vue'
import lineShow from '../components/lineShow.vue'
import lineTable from '../components/lineTable.vue'
import { message } from 'ant-design-vue'
import { sleep } from '@/lib/util.js'
console.log('........')
const value = ref('')
const logs = ref([])
const isShow = ref(false)
const activeKey = ref('up')
const results = ref({})
const isLegal = (url) => {
  if (url === '') {
    return false
  }
  if (!isNaN(Number(value.value, 10))) {
    return true
  }
  try {
    const uri = parserUrl(url)
    if (uri.searchParams.get('authkey') !== 'null') {
      return true
    }
  } catch (error) {

  }
  return false
}
const query = async () => {
  if (!isLegal(value.value)) {
    message.error('请输入正确的祈愿地址或uid')
    return
  }
  isShow.value = false
  logs.value = []
  if (isNaN(Number(value.value, 10))) {
    results.value = Object.freeze(await AnalysisQiYuan(value.value, (err, value) => {
      if (err) {
        console.log(err)
        message.error(err)
        return
      }
      logs.value.push(value)
    }))
  } else {
    logs.value.push('正在查询本地数据........')
    results.value = Object.freeze(await queryDataById(value.value))
    await sleep(500)
  }
  isShow.value = true
}

const getAddress = () => {
  window.get_qy_address && window.get_qy_address()
}
</script>

<style lang="scss">
.ant-layout-header {
  height: auto !important;
}

.log {
  height: 300px;
  overflow-y: auto;
}
</style>
