import request from '@/utils/request'

// 查询发票信息
export function janitorPage(data) {
  return request({
    url: 'system/janitor/page',
    method: 'get',
    params: data
  })
}

export function janitorPass(orderNumber) {
  return request({
    url: 'system/janitor/pass/' + orderNumber,
    method: 'post'
  })
}