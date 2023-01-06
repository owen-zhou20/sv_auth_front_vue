<template>
  <div class="app-container">
    <div style="padding: 20px 20px 0 20px;">
      Assign menus for role: {{ $route.query.roleName }}
    </div>
    <el-tree style="margin: 20px 0px;"
             ref="tree"
             :data="sysMenuList"
             node-key="id"
             show-checkbox
             default-expand-all
             :props="defaultProps" />
    <div style="padding: 20px 20px;">
      <el-button :loading="loading"
                 :disabled="$hasBP('bnt.sysRole.assignAuth')  === false"
                 type="primary"
                 icon="el-icon-check"
                 size="mini"
                 @click="save">Save</el-button>
      <el-button @click="$router.push('/system/sysRole')"
                 size="mini"
                 icon="el-icon-refresh-right">Cancel</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/api/system/menu'
export default {
  name: 'roleAuth',

  data() {
    return {
      loading: false, // show loading 
      sysMenuList: [], // all menus in a tree data
      defaultProps: {
        children: 'children',
        label: 'name'
      },
    };
  },

  created() {
    this.fetchData()
  },

  methods: {
    /*
    Format and show all menus and show menus belong this role 
    */
    fetchData() {
      const roleId = this.$route.query.id
      api.toAssign(roleId).then(result => {
        const sysMenuList = result.data
        this.sysMenuList = sysMenuList
        const checkedIds = this.getCheckedIds(sysMenuList)
        console.log('getPermissions() checkedIds', checkedIds)
        // set all items in checkedIds checked in tree
        this.$refs.tree.setCheckedKeys(checkedIds)
      })
    },

    /*
    Get menus belong this role 
    */
    getCheckedIds(auths, initArr = []) {
      return auths.reduce((pre, item) => {
        if (item.select && item.children.length === 0) {
          pre.push(item.id)
        } else if (item.children) {
          this.getCheckedIds(item.children, initArr)
        }
        return pre
      }, initArr)
    },

    /*
    Do assign and save for this role
    */
    save() {
      //Get all checked nodes
      //const checkedNodes = this.$refs.tree.getCheckedNodes()
      //Get all checked nodes and parent node
      const allCheckedNodes = this.$refs.tree.getCheckedNodes(false, true);
      //Put all ids for checked nodes into idList and put into assginMenuVo
      let idList = allCheckedNodes.map(node => node.id);
      console.log(idList)
      let assginMenuVo = {
        roleId: this.$route.query.id,
        menuIdList: idList
      }
      this.loading = true
      // Do assign and show message
      api.doAssign(assginMenuVo).then(result => {
        this.loading = false
        this.$message.success(result.$message || 'Success to change!')
        this.$router.push('/system/sysRole');
      })
    }
  }
};
</script>