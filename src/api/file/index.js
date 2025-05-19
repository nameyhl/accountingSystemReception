import request from '@/utils/requset'
export function deleteFile(fileName) {
  return request({
    url: `/api/file/delete/${fileName}`,
    method: 'delete',
  })
}
