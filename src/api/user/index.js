import request from '@/utils/requset'

export function updateUser(data) {
  return request({
    url: 'api/user/updateUser',
    method: 'put',
    data: data,
  })
}
