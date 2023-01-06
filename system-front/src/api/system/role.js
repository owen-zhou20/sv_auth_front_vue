import request from '@/utils/request'

const api_name = '/admin/system/sysRole'

export default {
  // Get list
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  // Remove a role by id
  removeId(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  // Save a role
  saveRole(role) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: role
    })
  },
  // Modify a role - select info by role id
  getRoleId(id) {
    return request({
      url: `${api_name}/findRoleById/${id}`,
      method: 'post'
    })
  },
  // Modify a role
  update(role) {
    return request({
      url: `${api_name}/update`,
      method: 'post',
      data: role
    })
  },
  // Batch delete
  batchRemove(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: idList
    })
  },
  // 8. Get roles for a user
  getRolesByUserId(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },
  // 9. Assign roles for a user
  assignRoles(assginRoleVo) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      data: assginRoleVo
    })
  }

}
