import request from '@/utils/request'

// 查询仓储入库记录列表
export function listIn(query) {
  return request({
    url: '/system/in/list',
    method: 'get',
    params: query
  })
}

// 查询仓储入库记录详细
export function getIn(id) {
  return request({
    url: '/system/in/' + id,
    method: 'get'
  })
}

// 新增仓储入库记录
export function addIn(data) {
  return request({
    url: '/system/in',
    method: 'post',
    data: data
  })
}

// 修改仓储入库记录
export function updateIn(data) {
  return request({
    url: '/system/in',
    method: 'put',
    data: data
  })
}

// 删除仓储入库记录
export function delIn(id) {
  return request({
    url: '/system/in/' + id,
    method: 'delete'
  })
}
