import request from '@/utils/request'

//查询仓库-道口列表-搜索用
export function crossListAll(query) {
  return request({
    url: '/system/warehouseManage/info',
    method: 'get',
    params: query
  })
}

//查询仓库-道口列表-带orderNumber靠口用
export function WarehouseAndCross(data) {
  return request({
    url: '/system/warehouseManage/info',
    method: 'post',
    data: data
  })
}

// 查询仓库列表
export function WarehouseList(query) {
  return request({
    url: '/system/warehouseManage/page',
    method: 'get',
    params: query
  })
}

// 新增仓库
export function addWarehouse(data) {
  return request({
    url: '/system/warehouseManage',
    method: 'post',
    data: data
  })
}

//根据仓库ID查询道口列表
export function crossList(id, query) {
  return request({
    url: '/system/crossManage/page/' + id,
    method: 'get',
    params: query
  })
}

// 新增道口
export function addCross(data) {
  return request({
    url: '/system/crossManage',
    method: 'post',
    data: data
  })
}

// 修改道口
export function editCross(data) {
  return request({
    url: '/system/crossManage',
    method: 'put',
    data: data
  })
}

//完成任务
export function finishCross(data) {
  return request({
    url: '/system/crossManage/finish',
    method: 'post',
    data: data
  })
}

//特殊情况
export function specialCross(data) {
  return request({
    url: '/system/crossManage/special',
    method: 'post',
    data: data
  })
}

//开启
export function continueCross(data) {
  return request({
    url: '/system/crossManage/continue',
    method: 'post',
    data: data
  })
}

//暂停
export function pauseCross(data) {
  return request({
    url: '/system/crossManage/pause',
    method: 'post',
    data: data
  })
}

//道口详情
export function crossDetail(id) {
  return request({
    url: '/system/crossManage/' + id,
    method: 'get'
  })
}

//道口任务-搬运工等
export function crossTaskList(query) {
  return request({
    url: '/system/crossTaskPerson/page',
    method: 'get',
    params: query
  })
}

// 消杀-靠口
export function arrangement(data) {
  return request({
    url: '/system/recordKill/arrangement',
    method: 'post',
    data: data
  })
}

//出库-靠口
export function outArrangement(data) {
  return request({
    url: '/system/out_reservation/arrangement',
    method: 'put',
    data: data
  })
}