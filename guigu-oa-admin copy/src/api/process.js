import request from '@/utils/request'

const api_name = '/admin/process'

export default {

  findProcessType() {
    return request({
      url: `${api_name}/findProcessType`,
      method: 'get'
    })
  },

  getProcessTemplate(processTemplateId) {
    return request({
      url: `${api_name}/getProcessTemplate/`+processTemplateId,
      method: 'get'
    })
  },

  startUp(processFormVo) {
    return request({
      url: `${api_name}/startUp`,
      method: 'post',
      data: processFormVo
    })
  },

  findPending(page, limit) {
    return request({
      url: `${api_name}/findPending/`+page+`/`+ limit,
      method: 'get'
    })
  },

  findPending2(page, limit) {
    return request({
      url: `${api_name}/findPending2/`+page+`/`+ limit,
      method: 'get'
    })
  },

  findPendingCount(){
    return request({
      url:`${api_name}/findPendingCount`,
      method: 'get'
    })
  },

  show(id) {
    return request({
      url: `${api_name}/show/`+id,
      method: 'get'
    })
  },

  approve(approvalVo) {
    return request({
      url: `${api_name}/approve`,
      method: 'post',
      data: approvalVo
    })
  },


  findProcessed(page, limit) {
    return request({
      url: `${api_name}/findProcessed/`+page+`/`+ limit,
      method: 'get'
    })
  },

  findProcessed2(page, limit) {
    return request({
      url: `${api_name}/findProcessed2/`+page+`/`+ limit,
      method: 'get'
    })
  },

  findProcessedCount(){
    return request({
      url:`${api_name}/findProcessedCount`,
      method: 'get'
    })
  },

  findStarted(page, limit) {
    return request({
      url: `${api_name}/findStarted/`+page+`/`+ limit,
      method: 'get'
    })
  },

  findStarted2(page, limit) {
    return request({
      url: `${api_name}/findStarted2/`+page+`/`+ limit,
      method: 'get'
    })
  },

  findStartedCount(){
    return request({
      url:`${api_name}/findStartedCount`,
      method: 'get'
    })
  },

}
