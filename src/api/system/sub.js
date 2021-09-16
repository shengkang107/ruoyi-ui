import request from '@/utils/request'

// 查询核算检测报告子列表
export function listSub(query) {
  return request({
    url: '/system/sub/list',
    method: 'get',
    params: query
  })
}

// 查询核算检测报告子详细
export function getSub(id) {
  return request({
    url: '/system/sub/' + id,
    method: 'get'
  })
}

// 新增核算检测报告子
export function addSub(data) {
  return request({
    url: '/system/sub',
    method: 'post',
    data: data
  })
}

// 修改核算检测报告子
export function updateSub(data) {
  return request({
    url: '/system/sub',
    method: 'put',
    data: data
  })
}

// 删除核算检测报告子
export function delSub(id) {
  return request({
    url: '/system/sub/' + id,
    method: 'delete'
  })
}
