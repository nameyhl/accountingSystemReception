<script setup>
import { ref } from "vue"
import AccountingDialog from "@/components/accountingDialog/index.vue"

let accountingDialog = ref(false)
const openDialog = () => {
  accountingDialog.value = true
}
</script>
<template>
  <el-button type="primary" @click="openDialog">导入账单</el-button>
  <div>
    <el-dialog v-model="accountingDialog" title="导入excel" width="80%">
      <AccountingDialog />
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped></style>
