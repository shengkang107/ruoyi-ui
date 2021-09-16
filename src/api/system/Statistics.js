import request from '@/utils/request'

// 查询消杀统计列表
export function analysisKillList(query) {
  return request({
    url: '/system/analysis/kill',
    method: 'get',
    params: query
  })
}

// 查询消杀预约报表
export function analysisReservation(query) {
  return request({
    url: '/system/analysis/reservation',
    method: 'get',
    params: query
  })
}