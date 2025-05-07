<!-- 所有账单的列表 -->
<script setup>
import { ref, watch } from "vue"
import AccountingDialog from "@/components/accountingDialog/index.vue"


let tableType = ref('2')
// 监听tabletype
watch(tableType, (val) => {
  getAccountingList()
})
// 获取所有账单
let page = ref(1)
let pageSize = ref(10)
let total = ref(0)
let tableData = ref([])
const excelColumns = ref([
  {prop: 'time', label: '交易时间'},
  {prop: 'type', label: '交易类型'},
  {prop: 'counterparty', label: '交易对方'},
  {prop: 'goods', label: '商品'},
  {prop: 'revOrExp', label: '收/支'},
  {prop: 'money', label: '金额(元)'},
  {prop: 'method', label: '支付方式'},
  {prop: 'static', label: '当前状态'},
  {prop: 'oddNumber', label: '交易单号'},
  {prop: 'businessNumber', label: '商户单号'},
  {prop: 'text', label: '备注',  },
])

import { getAccounting } from "@/api/accounting"
// 获取账单列表
const getAccountingList = async () => {
  await getAccounting({
    page: page.value,
    pageSize: pageSize.value,
    tableType: tableType.value
  }).then(res => {
      tableData.value = res.data?.rows
      total.value = res.data?.total
      tableData.value.forEach(item => {
        item.time = new Date(item.time).toLocaleString().replaceAll('/', '-')
        item.revOrExp = item.revOrExp == 0 ? '收入' : '支出'
        })
  })
}

getAccountingList()

const handleSizeChange = (val) => {
  pageSize.value = val
  getAccountingList()
}

const handleCurrentChange = (val) => {
  page.value = val
  getAccountingList()
}

let accountingDialog = ref(false)
const openDialog = () => {
  accountingDialog.value = true
}
</script>
<template>
  <div class="dataBox">
    <div class="dataTitle">
      <el-radio-group v-model="tableType" size="large">
        <el-radio-button label="所有" value="2" />
        <el-radio-button label="支出" value="1" />
        <el-radio-button label="收入" value="0" />
      </el-radio-group>
      <el-button type="primary" @click="openDialog">导入账单</el-button>
    </div>


    <el-table border :data="tableData" style="width: 100%; height: calc(100vh - 200px)" >
        <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
        <el-table-column
          v-for="item in excelColumns || {}"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :size="size"
        :disabled="disabled"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
  </div>
  <div>
    <el-dialog v-model="accountingDialog" title="导入excel" width="80%">
      <AccountingDialog />
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.dataBox{
  .dataTitle{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

}
</style>
