<template>
  <div class="app-container">
    <el-header style="text-align: center; font-size: 30px">
      User list
    </el-header>

    <div class="search-div">
      <el-form label-width="70px"
               size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="Keyword">
              <el-input style="width: 95%"
                        v-model="searchObj.keyword"
                        placeholder="Username/Name/Phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Create Time"
                          label-width="120px">
              <el-date-picker v-model="createTimes"
                              type="datetimerange"
                              range-separator="to"
                              start-placeholder="Start date"
                              end-placeholder="End date"
                              format="HH:mm:ss dd-MM-yyyy"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              style="margin-right: 10px;width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary"
                     :disabled="$hasBP('bnt.sysUser.list')  === false"
                     icon="el-icon-search"
                     size="mini"
                     @click="fetchData()">Search</el-button>
          <el-button :disabled="$hasBP('bnt.sysUser.list')  === false"
                     icon="el-icon-refresh"
                     size="mini"
                     @click="resetData">Reset</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- Tools button -->
    <div class="tools-div">
      <el-button type="success"
                 :disabled="$hasBP('bnt.sysUser.add')  === false"
                 icon="el-icon-plus"
                 size="mini"
                 @click="add">Add</el-button>
    </div>

    <!-- Table -->
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              border
              style="width: 100%;margin-top: 10px;">

      <el-table-column label="No"
                       width="70"
                       align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="username"
                       label="User name"
                       width="180" />
      <el-table-column prop="name"
                       label="Name"
                       width="110" />
      <el-table-column prop="phone"
                       label="Phone" />
      <el-table-column label="State"
                       width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status === 1"
                     :disabled="$hasBP('bnt.sysUser.update')  === false"
                     @change="switchStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime"
                       label="Create Time" />

      <el-table-column label="Modify"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-button type="warning"
                     :disabled="$hasBP('bnt.sysUser.assignRole')  === false"
                     icon="el-icon-baseball"
                     size="mini"
                     @click="showAssignRole(scope.row)"
                     title="Show assign roles" />
          <el-button type="primary"
                     :disabled="$hasBP('bnt.sysUser.update')  === false"
                     icon="el-icon-edit"
                     size="mini"
                     @click="edit(scope.row.id)"
                     title="Modify" />
          <el-button type="danger"
                     :disabled="$hasBP('bnt.sysUser.remove')  === false"
                     icon="el-icon-delete"
                     size="mini"
                     @click="removeDataById(scope.row.id)"
                     title="Delete" />
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination :current-page.sync="page"
                   :total="total"
                   :page-size="limit"
                   :page-sizes="[3, 5, 10, 20, 50]"
                   style="padding: 30px 0; text-align: center;"
                   layout="total,sizes, prev, pager, next, jumper"
                   @current-change="fetchData"
                   @size-change="handleSizeChange" />

    <!-- Dialog for add/modify a user -->
    <el-dialog title="Add / Modify a user"
               :visible.sync="dialogVisible"
               width="40%">
      <el-form ref="dataForm"
               :model="sysUser"
               label-width="100px"
               size="small"
               style="padding-right: 40px;">
        <el-form-item label="User name"
                      prop="username">
          <el-input v-model="sysUser.username" />
        </el-form-item>
        <el-form-item v-if="!sysUser.id"
                      label="Password"
                      prop="password">
          <el-input v-model="sysUser.password"
                    type="password" />
        </el-form-item>
        <el-form-item label="Name"
                      prop="name">
          <el-input v-model="sysUser.name" />
        </el-form-item>
        <el-form-item label="Phone"
                      prop="phone">
          <el-input v-model="sysUser.phone" />
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   :disabled="($hasBP('bnt.sysUser.add')=== false) && ($hasBP('bnt.sysUser.update')  === false)"
                   icon="el-icon-check"
                   @click="saveOrUpdate()"
                   size="small">Confirm</el-button>
        <el-button @click="dialogVisible = false"
                   size="small"
                   icon="el-icon-refresh-right">Cancel</el-button>
      </span>
    </el-dialog>

    <!-- Assign roles for a user -->
    <el-dialog title="Assign roles"
               :visible.sync="dialogRoleVisible">
      <el-form label-width="80px">
        <el-form-item label="User name"
                      label-width="100px">
          <el-input disabled
                    :value="sysUser.username"></el-input>
        </el-form-item>

        <el-form-item label="Roles">
          <el-checkbox :indeterminate="isIndeterminate"
                       v-model="checkAll"
                       @change="handleCheckAllChange">All</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userRoleIds"
                             @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles"
                         :key="role.id"
                         :label="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary"
                   :disabled="$hasBP('bnt.sysUser.assignRole')  === false"
                   @click="assignRole()"
                   size="small">Save</el-button>
        <el-button @click="dialogRoleVisible = false"
                   size="small">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import user from '@/api/system/user'
import roleApi from '@/api/system/role'

export default {
  data() {
    return {
      listLoading: true, // Loading...
      list: null, // banner list
      total: 0, // total records in DB
      page: 1, // current page
      limit: 3, // limit records for every page
      searchObj: {}, // searchObj entity
      createTimes: [],
      dialogVisible: false,
      sysUser: {},

      dialogRoleVisible: false,
      allRoles: [], // All roles list
      userRoleIds: [], // User's roles list
      isIndeterminate: false, // false: CheckAll is not checked and some checkbox checked
      checkAll: false // All checked, false: CheckAll is not checked
    }
  },
  created() {
    // refresh
    this.fetchData()
  },
  methods: {
    // Pagination select users
    fetchData(page = 1) {
      this.page = page
      if (this.createTimes && this.createTimes.length == 2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }
      user.getPageList(this.page, this.limit, this.searchObj)
        .then(response => {
          this.listLoading = false
          //this.list = response.data.list
          this.list = response.data.records
          this.total = response.data.total
        })

    },
    // Add/Modify a user
    saveOrUpdate() {
      if (!this.sysUser.id) {
        this.save()
      } else {
        this.update()
      }
    },
    // Add a user
    save() {
      user.save(this.sysUser)
        .then(response => {
          // Notice
          this.$message({
            type: 'success',
            message: 'Add a user completed'
          });
          // Close dialog
          this.dialogVisible = false
          //Refresh
          this.fetchData()
        })
    },
    // Modify a user - select info by user id
    edit(id) {
      this.dialogVisible = true
      user.getUserById(id)
        .then(response => {
          this.sysUser = response.data
        })
    },
    // Modify a user
    update() {
      user.update(this.sysUser)
        .then(response => {
          // Notice
          this.$message({
            type: 'success',
            message: 'Modify a user completed'
          });
          // Close dialog
          this.dialogVisible = false
          //Refresh
          this.fetchData()
        })
    },
    // Delete a user
    removeDataById(id) {
      this.$confirm('This will permanently delete the user. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        user.removeById(id)
          .then(response => {
            this.$message({
              type: 'success',
              message: 'Delete completed'
            });
            // refresh 
            this.fetchData()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        });
      });
    },
    // Change user status
    switchStatus(row) {
      // Check user status and change user status
      row.status = row.status === 1 ? 0 : 1
      // 
      user.updateStatus(row.id, row.status)
        .then(response => {
          if (response.code == 20000) {
            this.$message.success(response.message || 'Status changed')
            this.fetchData()
          }
        })
    },
    // Show add a user dialog
    add() {
      this.dialogVisible = true
      this.sysUser = {}
    },
    // Reset
    resetData() {
      this.searchObj = {}
      this.createTimes = []
      this.fetchData()
    },

    // Show user's roles for a user
    showAssignRole(row) {
      this.sysUser = row
      this.dialogRoleVisible = true
      roleApi.getRolesByUserId(row.id).then(response => {
        this.allRoles = response.data.allRoles
        this.userRoleIds = response.data.userRoleIds
        this.checkAll = this.userRoleIds.length === this.allRoles.length
        this.isIndeterminate = this.userRoleIds.length > 0 && this.userRoleIds.length < this.allRoles.length
      })
    },

    // CheckAll checked change listener
    handleCheckAllChange(value) {// value: Is CheckAll checked? true/false
      // If CheckAll checked, userRoleIds is all role id list. If CheckAll is not checked, userRoleIds is null.
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      // false: CheckAll is not checked and some checkbox checked
      this.isIndeterminate = false
    },

    // Role checkbox change listener
    handleCheckedChange(value) {
      const { userRoleIds, allRoles } = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length > 0
      this.isIndeterminate = userRoleIds.length > 0 && userRoleIds.length < allRoles.length
    },
    // Change size for pagination select
    handleSizeChange(limit) {
      this.limit = limit
      this.fetchData()
    },

    // Assign roles for a user
    assignRole() {
      let assginRoleVo = {
        userId: this.sysUser.id,
        roleIdList: this.userRoleIds
      }
      roleApi.assignRoles(assginRoleVo).then(response => {
        this.$message.success(response.message || 'Success to change!')
        this.dialogRoleVisible = false
        this.fetchData(this.page)
      })
    }



  }
}
</script>
