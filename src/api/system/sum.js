import request from '@/utils/request'

// 查询核酸检测报告总表列表
export function listSum(query) {
  return request({
    url: '/system/sum/list',
    method: 'get',
    params: query
  })
}

// 查询核酸检测报告总表详细
export function getSum(id) {
  return request({
    url: '/system/sum/' + id,
    method: 'get'
  })
}
// 查询核酸检测报告总表详细
export function getSub(id) {
  return request({
    url: '/system/sub/' + id,
    method: 'get'
  })
}

// 查询核酸检测报告总表详细
export function getSumDetail(query) {
  return request({
    url: '/system/sub/sumDetail',
    method: 'get',
    params: query
  })
}


// 新增核酸检测报告总表
export function addSum(data) {
  return request({
    url: '/system/sum',
    method: 'post',
    data: data
  })
}

// 修改核酸检测报告总表
export function updateCheckTime(data,ids) {
  return request({
    url: '/system/sum/'+ids,
    method: 'put',
    data: data
  })
}// 修改核酸检测报告总表
export function updateSum(data) {
  return request({
    url: '/system/sum',
    method: 'put',
    data: data
  })
}

// 删除核酸检测报告总表
export function delSum(id) {
  return request({
    url: '/system/sum/' + id,
    method: 'delete'
  })
}
// 删除核酸检测报告子表
export function delSub(id) {
  return request({
    url: '/system/sub/' + id,
    method: 'delete'
  })
}

//上传核酸报告
export function sumUpload(data) {
  return request({
    url: '/system/sum/upload',
    method: 'post',
    data: data
  })
}