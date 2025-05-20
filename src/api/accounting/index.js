import request from '@/utils/requset'

// 批量添加账单
export function addMultipleAccounting(data) {
  return request({
    url: 'api/accounting/addMultipleAccounting',
    method: 'post',
    data: data,
  })
}

// 新增单条账单
export function addAccounting(data) {
  return request({
    url: 'api/accounting/addAccounting',
    method: 'post',
    data: data,
  })
}

// 分页获取账单
export function getAccounting(params) {
  return request({
    url: 'api/accounting/getAccounting',
    method: 'get',
    params: params,
  })
}

// 获取收支情况
export function getIncomeAndExpense() {
  return request({
    url: 'api/accounting/getIncomeAndExpense',
    method: 'get',
  })
}

// 根据日期获取收支情况
export function getIncomeAndExpenseByDate(params) {
  return request({
    url: 'api/accounting/getIncomeAndExpenseByDate',
    method: 'get',
    params: params,
  })
}

// 根据日期范围获取每天的收支情况
export function getIncomeAndExpenseByDay(params) {
  return request({
    url: 'api/accounting/getIncomeAndExpenseByDay',
    method: 'get',
    params: params,
  })
}

// 删除账单
export function deleteAccounting(id) {
  return request({
    url: `api/accounting/deleteAccounting`,
    method: 'delete',
    params: { id: id },
  })
}
