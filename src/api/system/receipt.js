import request from '@/utils/request'

// 查询发票信息
export function receiptDetail(id) {
  return request({
    url: '/pay/invoiceInfo/' + id,
    method: 'get'
  })
}
