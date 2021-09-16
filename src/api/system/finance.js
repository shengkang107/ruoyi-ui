import request from '@/utils/request'

//预约消杀付款审核列表
export function orderList(data) {
  return request({
    url: '/pay/order/page',
    method: 'get',
    params: data
  })
}

//预约消杀审核按钮
export function payOrder(data) {
  return request({
    url: '/pay/order',
    method: 'put',
    data: data
  })
}

//付款审核详情
export function orderDetail(id) {
  return request({
    url: '/pay/order/' + id,
    method: 'get'
  })
}

//退款操作
export function payRefund(data) {
  return request({
    url: '/pay/refund',
    method: 'post',
    data: data
  })
}

//退款审核列表
export function refundList(data) {
  return request({
    url: '/pay/refund/page',
    method: 'get',
    params: data
  })
}

//退款审核、放款-其他
export function verifyRefund(data) {
  return request({
    url: '/pay/refund',
    method: 'put',
    data: data
  })
}

//放款-支付宝
export function verifyRefundzfb(data) {
  return request({
    url: '/pay/refund/refundButton',
    method: 'post',
    data: data
  })
}

//退款详情
export function refundDetail(orderNumber) {
  return request({
    url: '/pay/refund/' + orderNumber,
    method: 'get'
  })
}