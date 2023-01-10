<template>
  <div class="app-container">

    <!-- tools -->
    <div class="tools-div">
      <el-button type="success"
                 :disabled="$hasBP('bnt.sysMenu.add')  === false"
                 icon="el-icon-plus"
                 size="mini"
                 @click="add()">Add</el-button>
    </div>

    <!-- tree -->
    <el-table :data="sysMenuList"
              style="width: 100%;margin-bottom: 20px;margin-top: 10px;"
              row-key="id"
              border
              :default-expand-all="true"
              :tree-props="{children: 'children'}">

      <el-table-column prop="name"
                       label="Menu name"
                       width="240" />
      <el-table-column label="Icon"
                       width="80">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="perms"
                       label="Auth perms"
                       width="250" />
      <el-table-column prop="path"
                       label="Router path"
                       width="250" />
      <el-table-column prop="component"
                       label="Component path"
                       width="250" />
      <el-table-column prop="sortValue"
                       label="Sort"
                       width="60" />
      <el-table-column label="Status"
                       width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status === 1"
                     :disabled="true">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime"
                       label="Create time"
                       width="160" />
      <el-table-column label="Operation"
                       width="180"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-button type="success"
                     :disabled="$hasBP('bnt.sysMenu.add')  === false"
                     v-if="scope.row.type !== 2"
                     icon="el-icon-plus"
                     size="mini"
                     @click="add(scope.row)"
                     title="Add sub menu" />
          <el-button type="primary"
                     :disabled="$hasBP('bnt.sysMenu.update')  === false"
                     icon="el-icon-edit"
                     size="mini"
                     @click="edit(scope.row)"
                     title="Modify" />
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="removeDataById(scope.row.id)"
                     title="Delete"
                     :disabled="(scope.row.children.length > 0) || ($hasBP('bnt.sysMenu.remove')  === false)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- Add / Modify -->
    <el-dialog :title="dialogTitle"
               :visible.sync="dialogVisible"
               width="40%">
      <el-form ref="dataForm"
               :model="sysMenu"
               label-width="150px"
               size="small"
               style="padding-right: 40px;">
        <el-form-item label="Parent menu"
                      v-if="sysMenu.id === ''">
          <el-input v-model="sysMenu.parentName"
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="Menu type"
                      prop="type">
          <el-radio-group v-model="sysMenu.type"
                          :disabled="typeDisabled">
            <el-radio :label="0"
                      :disabled="type0Disabled">Directory</el-radio>
            <el-radio :label="1"
                      :disabled="type1Disabled">Menu</el-radio>
            <el-radio :label="2"
                      :disabled="type2Disabled">Button</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Menu name"
                      prop="name">
          <el-input v-model="sysMenu.name" />
        </el-form-item>
        <el-form-item label="Icon"
                      prop="icon"
                      v-if="sysMenu.type !== 2">
          <el-select v-model="sysMenu.icon"
                     clearable>
            <el-option v-for="item in iconList"
                       :key="item.class"
                       :label="item.class"
                       :value="item.class">
              <span style="float: left;">
                <i :class="item.class"></i> <!-- 如果动态显示图标，这里添加判断 -->
              </span>
              <span style="padding-left: 6px;">{{ item.class }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Sort">
          <el-input-number v-model="sysMenu.sortValue"
                           controls-position="right"
                           :min="0" />
        </el-form-item>
        <el-form-item prop="path">
          <span slot="label">
            <el-tooltip content="Router path for a menu. For example:`sysMenu`"
                        placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            Router path
          </span>
          <el-input v-model="sysMenu.path"
                    placeholder="Access router path for a menu. For example:`sysMenu`" />
        </el-form-item>
        <el-form-item prop="component"
                      v-if="sysMenu.type !== 0">
          <span slot="label">
            <el-tooltip content="Component path for a button. For example:`system/sysMenu/list`, default in directory `views`"
                        placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            Component path
          </span>
          <el-input v-model="sysMenu.component"
                    placeholder="Access component path for a button. For example:`system/sysMenu/list`" />
        </el-form-item>
        <el-form-item v-if="sysMenu.type === 2">
          <el-input v-model="sysMenu.perms"
                    placeholder="Auth perms"
                    maxlength="100" />
          <span slot="label">
            <el-tooltip content="Auth perms in API, For example: @PreAuthorize(hasAuthority('bnt.sysMenu.list'))"
                        placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            Auth perms
          </span>
        </el-form-item>
        <el-form-item label="Status"
                      prop="type">
          <el-radio-group v-model="sysMenu.status">
            <el-radio :label="1">Actived</el-radio>
            <el-radio :label="0">Forbidden</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   :disabled="($hasBP('bnt.sysMenu.add') === false) && ($hasBP('bnt.sysMenu.update') === false)"
                   icon="el-icon-check"
                   @click="saveOrUpdate()"
                   size="small">Confirm</el-button>
        <el-button @click="dialogVisible = false"
                   size="small"
                   icon="el-icon-refresh-right">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import api from '@/api/system/menu'

const defaultForm = {
  id: '',
  parentId: '',
  name: '',
  type: 0,
  path: '',
  component: '',
  perms: '',
  icon: '',
  sortValue: 1,
  status: 1
}
export default {
  data() {
    return {
      sysMenuList: [],
      expandKeys: [], // 需要自动展开的项

      typeDisabled: false,
      type0Disabled: false,
      type1Disabled: false,
      type2Disabled: false,
      dialogTitle: '',

      dialogVisible: false,
      sysMenu: defaultForm,
      saveBtnDisabled: false,

      iconList: [
        {
          class: "el-icon-s-tools",
        },
        {
          class: "el-icon-s-custom",
        },
        {
          class: "el-icon-setting",
        },
        {
          class: "el-icon-user-solid",
        },
        {
          class: "el-icon-s-help",
        },
        {
          class: "el-icon-phone",
        },
        {
          class: "el-icon-s-unfold",
        },
        {
          class: "el-icon-s-operation",
        },
        {
          class: "el-icon-more-outline",
        },
        {
          class: "el-icon-s-check",
        },
        {
          class: "el-icon-tickets",
        },
        {
          class: "el-icon-s-goods",
        },
        {
          class: "el-icon-document-remove",
        },
        {
          class: "el-icon-warning",
        },
        {
          class: "el-icon-warning-outline",
        },
        {
          class: "el-icon-question",
        },
        {
          class: "el-icon-info",
        }
      ]
    }
  },


  created() {
    this.fetchData()
  },

  methods: {
    // Show menu list
    fetchData() {
      console.log('Loading')
      api.findNodes().then(response => {
        this.sysMenuList = response.data
        console.log(this.sysMenuList)
      })
    },

    // Remove a menu by id
    removeDataById(id) {
      // debugger
      this.$confirm('This will permanently delete the menu. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => { // promise
        return api.removeById(id)
      }).then((response) => {
        this.fetchData()
        this.$message({
          type: 'success',
          message: response.message
        })
      }).catch(() => {
        this.$message.info('Delete canceled')
      })
    },

    // Show add/update 
    add(row) {
      //debugger
      this.typeDisabled = false
      this.dialogTitle = 'Add sub menu'
      this.dialogVisible = true

      this.sysMenu = Object.assign({}, defaultForm) // format this.sysMenu
      this.sysMenu.id = ''
      if (row) {
        this.sysMenu.parentId = row.id
        this.sysMenu.parentName = row.name
        //this.sysMenu.component = 'ParentView'
        if (row.type === 0) {
          this.sysMenu.type = 1
          this.typeDisabled = false
          this.type0Disabled = false
          this.type1Disabled = false
          this.type2Disabled = true
        } else if (row.type === 1) {
          //this.dialogTitle = 'Add sub button'
          this.sysMenu.type = 2
          this.typeDisabled = true
        }
      } else {
        this.dialogTitle = 'Add node directory'
        this.sysMenu.type = 0
        this.sysMenu.component = 'Layout'
        this.sysMenu.parentId = 0
        this.typeDisabled = true
      }
    },

    //Modefy
    edit(row) {
      debugger
      this.dialogTitle = 'Modify menu'
      this.dialogVisible = true

      this.sysMenu = Object.assign({}, row)
      this.typeDisabled = true
    },

    // Confirm to add / modify a menu
    saveOrUpdate() {
      if (this.sysMenu.type === 0 && this.sysMenu.parentId !== 0) {
        this.sysMenu.component = 'ParentView'
      }
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true // 防止表单重复提交
          if (!this.sysMenu.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },

    // Add a menu
    save() {
      api.save(this.sysMenu).then(response => {
        this.$message.success(response.message || 'Success')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    // Update a menu
    update() {
      api.updateById(this.sysMenu).then(response => {
        this.$message.success(response.message || 'Success')
        this.dialogVisible = false
        this.fetchData()
      })
    }
  }
}
</script>