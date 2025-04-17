import request from '@/utils/requset'

export function login(data) {
  return request({
    url: 'api/user/login',
    method: 'post',
    data: data,
  })
}

export function register(data) {
  return request({
    url: 'api/user/register',
    method: 'post',
    data: data,
  })
}
