import request from '@/utils/request'

const api_name = '/admin/system/sysOperLog'

export default {
  // 1. Get list
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  }

}