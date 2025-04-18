import request from '@/utils/requset'

export function addMultipleAccounting(data) {
  return request({
    url: 'api/accounting/addMultipleAccounting',
    method: 'post',
    data: data,
  })
}
