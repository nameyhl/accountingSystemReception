<template>
  <div>
    <el-upload
      action=""
      :auto-upload="false"
      :on-change="handleFileChange"
      :show-file-list="false"
      accept=".xlsx, .xls, .csv"
    >
      <el-button type="primary">选择Excel或CSV文件</el-button>
    </el-upload>
    <div class="message">文件内容有限制，必须为微信支付导出文件。导出方法：<span class="importentFont">进入微信->点击我的->进入服务->点击钱包->点击账单->点击客服中心->导出账单</span> </div>
    <el-button
      type="success"
      @click="submitData"
      :disabled="!excelData.length"
      style="margin-top: 20px"
    >
      提交数据
    </el-button>
    <el-button
      type="info"
      @click="closeDialog()"
      style="margin-top: 20px"
    >
      取消
    </el-button>
    <el-table border :data="tableData" style="width: 100%; margin-top: 20px">
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
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 20, 30, 40]"
      :size="size"
      :disabled="disabled"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';
import { addMultipleAccounting } from '@/api/accounting';

const excelData = ref([]);

const porps = defineProps({
  closeDialog: {
    type: Function,
    default: () => {}
  },
  submitDialog: {
    type: Function,
    default: () => {}
  }
})

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

let size = ref(10)
let tableData = ref([])
const handleSizeChange = (val) => {
  size.value = val
  tableData.value = excelData.value.slice(0, size.value);
  console.log(tableData.value, excelData.value);

  console.log(tableData.value);
}
let currentPage4 = ref(1)
const handleCurrentChange = () => {
  tableData.value = excelData.value.slice((currentPage4.value - 1) * size.value, (currentPage4.value - 1) * size.value + size.value);
  // tableData.value = excelData.value.slice((currentPage4.value - 1) * size.value, size.value);
  console.log(excelData.value, tableData.value);

}

let total = ref(0)

import userStore from '@/stores/models/user';
const user = userStore();

console.log(user.getUser().uid);


// 处理文件选择
const handleFileChange = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      let jsonData = [];
      if (file.name.endsWith('.csv')) {
        // 处理 CSV 文件
        const csvData = e.target.result;
        const workbook = XLSX.read(csvData, { type: 'binary', raw: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true,
          headers: true,
          range: 16
         });
      } else {
        // 处理 Excel 文件
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true,
         });
      }

      excelData.value = [];
      let data = []
      for(let i = 0; i < jsonData.length; i++){
        let item = {}
        excelColumns.value.forEach((column) => {
          const cellValue = jsonData[i][column.label];

          // 如果是时间字段，并且是数字（Excel 日期）
          if (column.prop === 'time' && typeof cellValue === 'number') {
            // 解析 Excel 日期
            const dateObj = XLSX.SSF.parse_date_code(cellValue);
            const jsDate = new Date(
              dateObj.y, // 年
              dateObj.m - 1, // 月（JS 月份是 0-11）
              dateObj.d, // 日
              dateObj.H, // 时
              dateObj.M, // 分
              dateObj.S // 秒
            );
            // 格式化为 "yyyy/mm/dd hh:mm:ss"
            item[column.prop] = jsDate.toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false, // 24 小时制
            }).replace(/\//g, '/').replace(/,/g, '');
          } else {
            item[column.prop] = cellValue;
          }
        });
        data.push({
          uid: user.getUser().uid,
          ...item
        });
      }
      for(let i = 0; i < data.length; i++){
        console.log(data[i]);

        if(data[i].revOrExp === '/' && data[i].static === "提现已到账"){
          data[i].revOrExp = '1'
        }else if(data[i].revOrExp === '/' && data[i].static === "充值完成"){
          data[i].revOrExp = '0'
        }
        data[i].static = '已完成'
      }
      excelData.value = data;
      total.value = jsonData.length;
      tableData.value = excelData.value.slice(0, size.value);

      ElMessage.success(`成功解析 ${jsonData.length} 条数据`);
    } catch (error) {
      ElMessage.error('文件解析失败: ' + error.message);
      console.error('文件解析错误:', error);
    }
  };

  if (file.name.endsWith('.csv')) {
    reader.readAsBinaryString(file.raw);
  } else {
    reader.readAsArrayBuffer(file.raw);
  }
};

// 提交数据到后端
const submitData = async () => {
  try {
    excelData.value.map((item) => {
      item.static = item.static == '已完成' ? item.static = '1' : item.static = '0'
      item.revOrExp = item.revOrExp === '支出' ? 1 : 0
    })
    const response = await addMultipleAccounting(excelData.value)
    ElMessage.success(`成功上传 ${response.data.count} 条数据`);
    // 清空数据
    excelData.value = [];
    tableData.value = [];
    porps.submitDialog();
  } catch (error) {
    ElMessage.error('上传失败: ' + error.message);
    console.error('上传错误:', error);
  }
};
</script>

<style lang="scss" scoped>
.message{
  margin-top: 20px;
  color: #7d7d7d;
}
</style>
