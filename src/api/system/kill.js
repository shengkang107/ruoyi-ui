import request from '@/utils/request'

// 查询消杀预约列表
export function listKill(query) {
  return request({
    url: '/system/kill/list',
    method: 'get',
    params: query
  })
}

// 查询消杀预约详细
export function getKill(id) {
  return request({
    url: '/system/kill/' + id,
    method: 'get'
  })
}

// 新增消杀预约
export function addKill(data) {
  return request({
    url: '/system/kill',
    method: 'post',
    data: data
  })
}

// 修改消杀预约
export function updateKill(data) {
  return request({
    url: '/system/kill',
    method: 'put',
    data: data
  })
}

//审核消杀预约
export function auditKill(data) {
  return request({
    url: '/system/kill/audit',
    method: 'put',
    data: data
  })
}

// 删除消杀预约
export function delKill(id) {
  return request({
    url: '/system/kill/' + id,
    method: 'delete'
  })
}

//其他支付方式
export function killOtherPay(data) {
  return request({
    url: '/pay/order',
    method: 'post',
    data: data
  })
}

//监控微信支付结果
export function wxPaySuc(code) {
  return request({
    url: '/pay/pay/selectResult/' + code,
    method: 'get'
  })
}

export function getKillCount() {
  return request({
    url: '/system/kill/count',
    method: 'get'
  })
}

export function leanPass(data) {
  return request({
    url: '/system/kill/pass',
    method: 'put',
    data: data
  })
}