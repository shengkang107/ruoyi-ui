import request from '@/utils/request'

// 查询仓储收发存报列表
export function listReport(query) {
  return request({
    url: '/system/report/list',
    method: 'get',
    params: query
  })
}

// 查询仓储收发存报详细
export function getReport(id) {
  return request({
    url: '/system/report/' + id,
    method: 'get'
  })
}

// 新增仓储收发存报
export function addReport(data) {
  return request({
    url: '/system/report',
    method: 'post',
    data: data
  })
}

// 修改仓储收发存报
export function updateReport(data) {
  return request({
    url: '/system/report',
    method: 'put',
    data: data
  })
}

// 删除仓储收发存报
export function delReport(id) {
  return request({
    url: '/system/report/' + id,
    method: 'delete'
  })
}
