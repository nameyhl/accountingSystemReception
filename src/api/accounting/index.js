import request from '@/utils/requset'

export function addMultipleAccounting(data) {
  return request({
    url: 'api/accounting/addMultipleAccounting',
    method: 'post',
    data: data,
  })
}

export function getAccounting(params) {
  return request({
    url: 'api/accounting/getAccounting',
    method: 'get',
    params: params,
  })
}
