import request from '@/utils/request'

/*
菜单管理相关的API请求函数
*/
const api_name = '/admin/system/sysMenu'

export default {

  /*
  1. Menu list (tree data)
  */
  findNodes() {
    return request({
      url: `${api_name}/findNodes`,
      method: 'get'
    })
  },
  /*
  2. Add a menu
  */
  save(sysMenu) {
    return request({
      url: `${api_name}/save`,
      method: "post",
      data: sysMenu
    })
  },
  /*
  3. Modify a menu - select info by menu id
  */
  findNode(id) {
    return request({
      url: `${api_name}/findNode/${id}`,
      method: "get"
    })
  },
  /*
  4. Modify a menu
  */
  updateById(sysMenu) {
    return request({
      url: `${api_name}/update`,
      method: "post",
      data: sysMenu
    })
  },
  /*
  5. Delete a menu without sub-menus
  */
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: "delete"
    })
  },
  /*
  6. Get menus for a role
  */
  toAssign(roleId) {
    return request({
      url: `${api_name}/toAssign/${roleId}`,
      method: 'get'
    })
  },

  /*
  7. Assign menus for a role
  */
  doAssign(assginMenuVo) {
    return request({
      url: `${api_name}/doAssign`,
      method: "post",
      data: assginMenuVo
    })
  }

}