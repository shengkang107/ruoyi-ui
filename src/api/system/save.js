import request from '@/utils/request'

// 查询仓储库存记录列表
export function listSave(query) {
  return request({
    url: '/system/save/list',
    method: 'get',
    params: query
  })
}

// 查询仓储库存记录详细
export function getSave(id) {
  return request({
    url: '/system/save/' + id,
    method: 'get'
  })
}

// 新增仓储库存记录
export function addSave(data) {
  return request({
    url: '/system/save',
    method: 'post',
    data: data
  })
}

// 修改仓储库存记录
export function updateSave(data) {
  return request({
    url: '/system/save',
    method: 'put',
    data: data
  })
}

// 删除仓储库存记录
export function delSave(id) {
  return request({
    url: '/system/save/' + id,
    method: 'delete'
  })
}
