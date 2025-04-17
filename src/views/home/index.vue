<template>
  <div>
    <el-upload
      action=""
      :auto-upload="false"
      :on-change="handleFileChange"
      :show-file-list="false"
      accept=".xlsx, .xls"
    >
      <el-button type="primary">选择Excel文件</el-button>
    </el-upload>

    <el-button
      type="success"
      @click="submitData"
      :disabled="!excelData.length"
      style="margin-top: 20px"
    >
      提交数据
    </el-button>
    <el-table :data="excelData" style="width: 100%; margin-top: 20px">
      <el-table-column
        v-for="item in excelColumns || {}"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const excelData = ref([]);

const excelColumns = ref([
  {prop: 'time', label: '交易时间' },
  {prop: 'type', label: '交易类型' },
  {prop: 'counterparty', label: '交易对方' },
  {prop: 'goods', label: '商品' },
  {prop: 'revOrExp', label: '收/支' },
  {prop: 'money', label: '金额(元)' },
  {prop: 'method', label: '支付方式' },
  {prop: 'static', label: '当前状态' },
  {prop: 'oddNumber', label: '交易单号' },
  {prop: 'businessNumber', label: '商户单号' },
  {prop: 'text', label: '备注' },
])


// 处理文件选择
const handleFileChange = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // 获取第一个工作表
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // 转换为JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true, });

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
      excelData.value.push(item);
    }

    ElMessage.success(`成功解析 ${jsonData.length} 条数据`);
  };
  reader.readAsArrayBuffer(file.raw);
};

// 提交数据到后端
const submitData = async () => {
  try {
    const response = await axios.post('/api/upload-excel', {
      data: excelData.value
    });

    ElMessage.success(`成功上传 ${excelData.value.length} 条数据`);
    console.log('服务器响应:', response.data);

    // 清空数据
    excelData.value = [];
  } catch (error) {
    ElMessage.error('上传失败: ' + error.message);
    console.error('上传错误:', error);
  }
};
</script>
