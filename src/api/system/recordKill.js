import request from '@/utils/request'

// 查询消杀记录列表
export function listKill(query) {
  return request({
    url: '/system/recordKill/list',
    method: 'get',
    params: query
  })
}

// 查询消杀记录详细
export function getKill(id) {
  return request({
    url: '/system/recordKill/' + id,
    method: 'get'
  })
}

// 新增消杀记录
export function addKill(data) {
  return request({
    url: '/system/recordKill',
    method: 'post',
    data: data
  })
}

// 修改消杀记录
export function updateKill(data) {
  return request({
    url: '/system/recordKill',
    method: 'put',
    data: data
  })
}
// 插队审批
export function approvePass(data) {
  return request({
    url: '/system/recordKill/approve',
    method: 'put',
    data: data
  })
}

// 删除消杀记录
export function delKill(id) {
  return request({
    url: '/system/recordKill/' + id,
    method: 'delete'
  })
}

//新增附加费用
export function addOtherPrice(data) {
  return request({
    url: '/system/additional',
    method: 'post',
    data: data
  })
}

//修改附加费用
export function editOtherPrice(data) {
  return request({
    url: '/system/additional',
    method: 'put',
    data: data
  })
}

//查询附加费用列表
export function otherPricePage(data) {
  return request({
    url: '/system/additional/page',
    method: 'get',
    params: data
  })
}

//查询附加费用详情
export function otherPriceList(data) {
  return request({
    url: '/system/additional/list',
    method: 'get',
    params: data
  })
}

//上传消杀证明文件
export function recordKillUpload(data) {
  return request({
    url: '/system/recordKill/upload',
    method: 'post',
    data: data
  })
}