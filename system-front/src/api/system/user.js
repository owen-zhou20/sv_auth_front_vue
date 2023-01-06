import request from '@/utils/request'

const api_name = '/admin/system/sysUser'

export default {
  // 1. Get list
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  // 2. Add a user
  save(sysUser) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: sysUser
    })
  },
  // 3. Modify a user - select info by user id
  getUserById(id) {
    return request({
      url: `${api_name}/getUser/${id}`,
      method: 'get'
    })
  },
  // 4. Modify a role
  update(user) {
    return request({
      url: `${api_name}/update`,
      method: 'post',
      data: user
    })
  },
  // 5. Delete a user
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  // 6. Modify a user status
  updateStatus(id, status) {
    return request({
      url: `${api_name}/updataStatus/${id}/${status}`,
      method: 'get'
    })
  }



}