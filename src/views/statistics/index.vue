<script setup>
import { ref } from 'vue'
import { getIncomeAndExpense, getIncomeAndExpenseByDate, getIncomeAndExpenseByDay } from '@/api/accounting'

import Mychart from "@/components/echarts/index.vue"

let data = ref([])

let totleChart = ref(null)

// 总计收支情况
const getIncomeAndExpenseData = async () => {
  await getIncomeAndExpense().then(res =>  {
    data.value = [
      {value: res.data.revTotal, name: '收入'},
      {value: res.data.expTotal, name: '支出'},
    ]
  })
  let option = {
    title: {
      text: '总计收支情况',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: data.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
 }
 totleChart.value.init(option)
}
getIncomeAndExpenseData()

// 今日收支情况
let todayChart = ref(null)
let todayData = ref([])
const getIncomeAndExpenseByDateData = async () => {
  await getIncomeAndExpenseByDate({date: new Date().toLocaleDateString()}).then(res => {
    todayData.value = [
      {value: res.data.revTotal ? res.data.revTotal : 0, name: '收入'},
      {value: res.data.expTotal ? res.data.expTotal : 0, name: '支出'},
    ]
  })
  let option = {
    title: {
      text: '今日收支情况',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient:'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: todayData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  todayChart.value.init(option)
}

getIncomeAndExpenseByDateData()

// 近七日收支情况
let weekChart = ref(null)
let weekData = ref([])
const getIncomeAndExpenseByDayData = async () => {
// 获取当天和七天前的日期
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  let params = {
    startDate: sevenDaysAgo,
    endDate: today
  }
  await getIncomeAndExpenseByDay(params).then(res => {
    res.data.forEach(item => {
      item.date = item.date.split(' ')[0]
    })
    weekData.value = res.data
  })
  let option = {
    title: {
      text: '近七日收支情况',
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['收入', '支出']
    },
    xAxis: {
      type: 'category',
      data: weekData.value.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '收入',
        type: 'line',
        data: weekData.value.map(item => item.revTotal)
      },
      {
        name: '支出',
        type: 'line',
        data: weekData.value.map(item => item.expTotal)
      }
    ]
  }
  weekChart.value.init(option)
}

getIncomeAndExpenseByDayData()

</script>
<template>
  <div class="topChart">
    <!-- 总计收支情况 -->
    <Mychart ref="totleChart" :width="'500px'" :height="'500px'"/>
    <!-- 今日收支情况 -->
     <Mychart ref="todayChart" :width="'500px'" :height="'500px'"/>
  </div>
  <!-- 近七日收支情况 -->
  <div>
    <Mychart ref="weekChart"  :height="'300px'"/>
  </div>
</template>
<style>
.topChart{
  display: flex;
}
</style>
