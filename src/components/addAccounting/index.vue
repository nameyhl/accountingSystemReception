<script setup>
import { ref } from 'vue'

let accountingForm = ref({
  time: '',// 交易时间
  type: '',// 交易类型
  counterparty: '',// 交易对方
  goods: '',// 商品
  revOrExp: '',// 收/支
  money: '',// 金额(元)
  method: '',// 支付方式
  state: '',// 当前状态
  oddNumber: '',// 交易单号
  businessNumber: '',// 商户单号
  text: '',// 备注
})

const rules = {
  time: [
    { required: true, message: '请输入交易时间', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请输入交易类型', trigger: 'blur' },
  ],
  counterparty: [
    { required: true, message: '请输入交易对方', trigger: 'blur' },
  ],
  goods: [
    { required: true, message: '请输入商品', trigger: 'blur' },
  ],
  revOrExp: [
    { required: true, message: '请输入收/支', trigger: 'blur' },
  ],
  money: [
    { required: true, message: '请输入金额', trigger: 'blur' },
  ],
  method: [
    { required: true, message: '请输入支付方式', trigger: 'blur' },
  ],
  static: [
    { required: true, message: '请输入当前状态', trigger: 'blur' },
  ],
}

let props = defineProps({
  closeDialog: {
    type: Function,
    default: () => {}
  },
  submitDialog: {
    type: Function,
    default: () => {}
  }
})

const { closeDialog, submitDialog } = props

import { addAccounting } from '@/api/accounting'

import userStore from '@/stores/models/user'
import { ElMessage } from 'element-plus'
const user = userStore()

const ruleFormRef = ref()
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let time = new Date(accountingForm.value.time).toLocaleString().replaceAll('/', '-')
      accountingForm.value.time = time
      let params = {
        ...accountingForm.value,
        uid: user.getUser().uid
      }
      await addAccounting(params).then(res => {
        ElMessage.success(res.msg)
      })
      submitDialog()
    } else {
      ElMessage.error('请填写完整信息')
    }
  })

}
</script>
<template>
  <el-form
    ref="ruleFormRef"
    :model="accountingForm"
    :rules="rules"
    label-width="100"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item prop="counterparty" label="交易对方：">
          <el-input v-model="accountingForm.counterparty" placeholder="请输入交易对方"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="type" label="交易类型：">
          <el-input v-model="accountingForm.type" placeholder="请输入交易类型"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item prop="revOrExp" label="收/支：">
          <el-select v-model="accountingForm.revOrExp" placeholder="请选择收/支">
            <el-option label="收入" value="0"></el-option>
            <el-option label="支出" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="goods" label="商品：">
          <el-input v-model="accountingForm.goods" placeholder="请输入商品"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item prop="money" label="金额：">
          <el-input v-model="accountingForm.money" placeholder="请输入金额"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="method" label="支付方式：">
          <el-input v-model="accountingForm.method" placeholder="请输入支付方式"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item prop="static" label="状态：">
          <el-select v-model="accountingForm.state" placeholder="请选择账单状态">
            <el-option label="未结算" value="0"></el-option>
            <el-option label="已结算" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="time" label="交易时间：">
          <el-date-picker
            v-model="accountingForm.time"
            type="datetime"
            placeholder="选择交易时间"
            :shortcuts="shortcuts"
            style="width: 100%;"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item prop="oddNumber" label="交易单号：">
          <el-input v-model="accountingForm.oddNumber" placeholder="请输入交易单号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="businessNumber" label="商户单号：">
          <el-input v-model="accountingForm.businessNumber" placeholder="请输入商户单号"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item prop="text" label="备注：">
          <el-input v-model="accountingForm.text" type="textarea" row="2" show-word-limit maxlength="50" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div class="footer">
    <el-button type="info" @click="closeDialog()">取消</el-button>
    <el-button type="primary" @click="submitForm(ruleFormRef)">提交数据</el-button>
  </div>
</template>
<style lang="scss" scoped>
.footer{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
