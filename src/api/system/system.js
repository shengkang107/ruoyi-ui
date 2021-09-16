import request from '@/utils/request'

// 查询上港系统列表
export function listSystem(query) {
  return request({
    url: '/system/system/list',
    method: 'get',
    params: query
  })
}

// 查询上港系统详细
export function getSystem(id) {
  return request({
    url: '/system/system/' + id,
    method: 'get'
  })
}

// 新增上港系统
export function addSystem(data) {
  return request({
    url: '/system/system',
    method: 'post',
    data: data
  })
}

// 修改上港系统
export function updateSystem(data) {
  return request({
    url: '/system/system',
    method: 'put',
    data: data
  })
}

// 删除上港系统
export function delSystem(id) {
  return request({
    url: '/system/system/' + id,
    method: 'delete'
  })
}
