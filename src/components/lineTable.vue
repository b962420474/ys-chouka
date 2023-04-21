<template>
  <a-table :dataSource="dataSource" :columns="columns" style="max-width: 800px;margin:auto;">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <label :class="'label' + record.rank_type">
          {{ record.name + (record.rank_type > 3 ? `(${record.rank_type}星)` : '') }}
        </label>
      </template>
    </template>
  </a-table>
</template>
<script setup>
import { computed } from '@vue/reactivity'
import { ref } from 'vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const columns = ref([
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '名字',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '类型',
    dataIndex: 'item_type',
    key: 'item_type'
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time'
  }
])
const dataSource = computed(() => {
  return props.data
})
</script>

<style lang="scss">
.label4 {
  color: #f107bf;
}

.label5 {
  color: #fd7b02;
}
</style>
