# accounting项目是一个记账项目

功能分为：登录注册，解析微信导出的订单并展示，上传订单到数据库进行存储。

## 登录注册功能

没什么特别的，只有使用cavans实现前端的验证码功能，再组件中随机生成一个整数，这个整数对应26个英文字母，并将这个字符串验证码传递给父组件，及登录注册页面进行前端验证码验证，如果验证码不正确是无法登录或者注册的

验证码验证功能实现

```js
// setup语法
import { onMounted, onBeforeUnmount, computed, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
let props = defineProps({
  canvasWidth: { // 容器宽度
      type: Number,
      default: 100
  },
  canvasHeight: { // 容器高度
      type: Number,
      default: 40
  },
  refreshTime: {//验证码刷新间隔时间
      type: Number,
      default: 60
  }
}),
  emits = defineEmits(['getVerifyCodeStr']),
  verifyCodeTimeId = null,//定时器id
  randomStr = '0123456789abcdefghijklmnopqrstuvwxyz',// 所有随机字符串
  trueRefreshTime = computed(() => {
      return props.refreshTime * 1000;
  }),
  verifyCodeStr = '';//验证码字符串

onMounted(() => {
  initVerifyCodeImg();
});

// 初始化
const initVerifyCodeImg = () => {
  drawPic();
  verifyCodeTimeId = setInterval(() => {
      drawPic();
  }, trueRefreshTime.value);
};



// 绘制验证码图片
const drawPic = () => {
  randomCode();
  let canvas = document.getElementById('canvasDom')
  let ctx = canvas.getContext('2d')
  ctx.textBaseline = 'bottom'
  // 绘制背景
  ctx.fillStyle = '#e6ecfd'
  ctx.fillRect(0, 0, props.canvasWidth, props.canvasHeight)
  // 绘制文字
  for (let i = 0; i < verifyCodeStr.length; i++) {
      drawText(ctx, verifyCodeStr[i], i)
  }
  drawLine(ctx)
  drawDot(ctx)
};

//4个随机字符
const randomCode = () => {
  verifyCodeStr = ''
  for (let i = 0; i < 4; i++) {
      let txt = randomStr[randomNum(0, randomStr.length)];
      verifyCodeStr += txt;
  }
  emits('getVerifyCodeStr', verifyCodeStr);
};

// 随机数
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
};

// 随机色
const randomColor = (min, max) => {
  let r = randomNum(min, max)
  let g = randomNum(min, max)
  let b = randomNum(min, max)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
};

// 绘制文字
const drawText = (ctx, txt, i) => {
  let fontSizeMin = props.canvasHeight - 10,// 字体最小值
      fontSizeMax = props.canvasHeight;// 字体最大值
  ctx.fillStyle = randomColor(50, 160) // 随机生成字体颜色
  ctx.font = randomNum(fontSizeMin, fontSizeMax) + 'px SimHei' // 随机生成字体大小
  let x = (i + 1) * (props.canvasWidth / (verifyCodeStr.length + 1))
  let y = randomNum(fontSizeMax, props.canvasHeight - 10 )
  var deg = randomNum(-30, 30)
  // 修改坐标原点和旋转角度
  ctx.translate(x, y)
  ctx.rotate(deg * Math.PI / 180)
  ctx.fillText(txt, 0, 0)
  // 恢复坐标原点和旋转角度
  ctx.rotate(-deg * Math.PI / 180)
  ctx.translate(-x, -y)
};

// 绘制干扰线
const drawLine = (ctx) => {
  for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = randomColor(100, 200)
      ctx.beginPath()
      ctx.moveTo(randomNum(0, props.canvasWidth), randomNum(0, props.canvasHeight))
      ctx.lineTo(randomNum(0, props.canvasWidth), randomNum(0, props.canvasHeight))
      ctx.stroke()
  }
};

// 绘制干扰点
const drawDot = (ctx) => {
  // 绘制干扰点
  for (let i = 0; i < 30; i++) {
      ctx.fillStyle = randomColor(0, 255)
      ctx.beginPath()
      ctx.arc(randomNum(0, props.canvasWidth), randomNum(0, props.canvasHeight), 1, 0, 2 * Math.PI)
      ctx.fill()
  }
};

//暴露绘制图片方法供父组件使用
defineExpose({
  drawPic
});

onBeforeUnmount(() => {
  clearInterval(verifyCodeTimeId);//页面销毁前，需要清除定时器
});
```

```html
  <canvas id="canvasDom" :width="props.canvasWidth" :height="props.canvasHeight" @click="drawPic"></canvas>
```

```css
#canvasDom {
  cursor: pointer;
}
```



## 解析微信导出的订单并展示

解析使用了xlsx的解析包，再excel中前17行是微信的信息，上传到数据库的意义不大，所以就没展示，后续把信息展示提供出来，目前还没实现

解析代码:

```js
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
```



## 上传账单功能

账单上传分为两种：批量上传和单条上传

批量上传时后端会做处理，当上传的账单的商单后会去重在进行插入，目前导入格式只能是微信导出的账单类型

单条上传会需要输入不能为空的字段不输入无法新增，因为在批量上传是使用的是商户单号进行的上传，所以最好不要单条上传微信支付的账单，除非你记得商户单号

## 项目使用pinia状态管理工具

使用插件pinia-plugin-persistedstate进行状态持久化



主要封装1个模块



注册pinia工具

```js
//store/index.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

```

注册user模块

```js
// store/models/user.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

const userStore = defineStore(
  'user',
  () => {
    let user = ref(null)

    const setUser = (data) => {
      user.value = data
    }

    const removeUser = () => {
      user.value = null
    }
    let token = ref(null)

    const setToken = (data) => {
      token.value = data
      localStorage.setItem('token', data)
    }

    const getUser = () => {
      return user.value
    }

    const removeToken = () => {
      token.value = null
      localStorage.removeItem('token')
    }

    const login = (data) => {
      setUser(data)
      setToken(data.token)
    }

    const logout = () => {
      removeUser()
      removeToken()
    }

    return { user, setUser, removeUser, token, setToken, removeToken, login, logout, getUser }
  },
  {
    persist: true,// 使用pinia-plugin-persistedstate插件
  },
)

export default userStore

```





[后端地址](https://github.com/nameyhl/accountingSystembackend)
