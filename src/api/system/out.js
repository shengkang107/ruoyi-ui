import request from '@/utils/request'

//预约出库
export function addReserveOut(data) {
  return request({
    url: '/system/out_reservation',
    method: 'post',
    data: data
  })
}

//预约出库列表
export function reserveOutList(query) {
  return request({
    url: '/system/out_reservation/list',
    method: 'get',
    params: query
  })
}

//预约出库详情
export function reserveOutDetail(id) {
  return request({
    url: '/system/out_reservation/' + id,
    method: 'get'
  })
}

//编辑出库预约
export function editReserveOut(data) {
  return request({
    url: '/system/out_reservation',
    method: 'put',
    data: data
  })
}

//审核出库预约
export function reserveOutAudit(data) {
  return request({
    url: '/system/out_reservation/audit',
    method: 'put',
    data: data
  })
}

//出园
export function outPass(data) {
  return request({
    url: '/system/out_reservation/pass',
    method: 'put',
    data: data
  })
}

// 查询仓储出库记录列表
export function listOut(query) {
  return request({
    url: '/system/out/list',
    method: 'get',
    params: query
  })
}

// 查询仓储出库记录详细
export function getOut(id) {
  return request({
    url: '/system/out/' + id,
    method: 'get'
  })
}

// 新增仓储出库记录
export function addOut(data) {
  return request({
    url: '/system/out',
    method: 'post',
    data: data
  })
}

// 修改仓储出库记录
export function updateOut(data) {
  return request({
    url: '/system/out',
    method: 'put',
    data: data
  })
}

// 删除仓储出库记录
export function delOut(id) {
  return request({
    url: '/system/out/' + id,
    method: 'delete'
  })
}
