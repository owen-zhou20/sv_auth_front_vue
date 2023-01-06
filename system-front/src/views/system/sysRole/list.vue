<template>
  <div class="app-container">
    <div>
      <el-header style="text-align: center; font-size: 30px">
        Role list
      </el-header>
    </div>

    <!--Select from-->
    <div class="search-div">
      <el-form label-width="70px"
               size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Role Name"
                          label-width="100px">
              <el-input style="width: 100%"
                        v-model="searchObj.roleName"
                        placeholder="Role Name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary"
                     :disabled="$hasBP('bnt.sysRole.list')  === false"
                     icon="el-icon-search"
                     size="mini"
                     @click="fetchData()">Search</el-button>
          <el-button icon="el-icon-refresh"
                     :disabled="$hasBP('bnt.sysRole.list')  === false"
                     size="mini"
                     @click="resetData">Reset</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- Tools button -->
    <div class="tools-div">
      <el-button type="success"
                 :disabled="$hasBP('bnt.sysRole.add')  === false"
                 icon="el-icon-plus"
                 size="mini"
                 @click="add">Add</el-button>
      <el-button type="danger"
                 :disabled="$hasBP('bnt.sysRole.remove')  === false"
                 class="btn-add"
                 size="mini"
                 @click="batchRemove()">Batch delete</el-button>
    </div>

    <!-- Table -->
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              border
              style="width: 100%;margin-top: 10px;"
              @selection-change="handleSelectionChange">

      <el-table-column type="selection"
                       width="55"
                       align="center" />

      <el-table-column label="Number"
                       width="90"
                       align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName"
                       label="Role Name" />
      <el-table-column prop="roleCode"
                       label="Role Code" />
      <el-table-column prop="description"
                       label="Description" />
      <el-table-column prop="createTime"
                       label="Create Time"
                       width="160" />
      <el-table-column label="Modify"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <el-button type="warning"
                     :disabled="$hasBP('bnt.sysRole.assignAuth')  === false"
                     icon="el-icon-baseball"
                     size="mini"
                     @click="showAssignAuth(scope.row)"
                     title="Show assign auth" />
          <el-button type="primary"
                     :disabled="$hasBP('bnt.sysRole.update')  === false"
                     icon="el-icon-edit"
                     size="mini"
                     @click="edit(scope.row.id)"
                     title="Modify" />
          <el-button type="danger"
                     :disabled="$hasBP('bnt.sysRole.remove')  === false"
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

    <!-- Dialog for add/modify a role -->
    <el-dialog title="Add / Modify a role"
               :visible.sync="dialogVisible"
               width="40%">
      <el-form ref="dataForm"
               :model="sysRole"
               label-width="150px"
               size="small"
               style="padding-right: 40px;">
        <el-form-item label="Role Name">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="Role Code">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="sysRole.description" />
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false"
                   size="small"
                   icon="el-icon-refresh-right">Cancel</el-button>
        <el-button type="primary"
                   :disabled="($hasBP('bnt.sysRole.add')=== false) && ($hasBP('bnt.sysRole.update')  === false)"
                   icon="el-icon-check"
                   @click="saveOrUpdate()"
                   size="small">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import role from '@/api/system/role'
export default {
  data() {
    return {
      listLoading: true, // loading
      list: [], // role list
      total: 0, // total records
      page: 1, // current page
      limit: 3, // limit records for every page
      searchObj: {}, // Obj for pagination select roles
      sysRole: {}, // Obj for save a Role
      dialogVisible: false, // Show dialog for add/modify a role
      selectValue: [] // selected records array
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // pagination select role list
    // pageNum,  select page number, default 1
    fetchData(pageNum = 1) {
      this.page = pageNum
      role.getPageList(this.page, this.limit, this.searchObj)
        .then(response => {
          this.listLoading = false
          console.log(response)
          this.list = response.data.records
          this.total = response.data.total
        })
    },
    // Reset search
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },

    // Remove a role by id
    removeDataById(id) {
      this.$confirm('This will permanently delete the role. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        role.removeId(id)
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
    // Show dialog for add/modify a role
    add() {
      this.dialogVisible = true
      this.sysRole = {}
    },
    // Confirm to add / modify a role
    saveOrUpdate() {
      //
      if (!this.sysRole.id) {
        this.saveRole()
      } else {
        this.updateRole()
      }

    },
    // add a role
    saveRole() {
      role.saveRole(this.sysRole)
        .then(response => {
          // Notice 
          this.$message({
            type: 'success',
            message: 'Add a role completed'
          });
          // Close dialog
          this.dialogVisible = false
          // Refresh
          this.fetchData()
        })
    },
    // Update a role
    updateRole() {
      role.update(this.sysRole)
        .then(response => {
          // Notice 
          this.$message({
            type: 'success',
            message: 'Modify a role completed'
          });
          // Close dialog
          this.dialogVisible = false
          // Refresh
          this.fetchData()
        })
    },
    // modify a role -- show data for a role
    edit(id) {
      // show dialog
      this.dialogVisible = true
      role.getRoleId(id)
        .then(response => {
          this.sysRole = response.data
        })
    },
    // Batch delete
    batchRemove() {
      if (this.selectValue.length == 0) {
        this.$message({
          type: 'warning',
          message: 'Please select rows!'
        });
        return
      } else {
        this.$confirm('This will permanently delete these roles. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          // Get id list for seleted records
          var idList = []
          for (var i = 0; i < this.selectValue.length; i++) {
            var rowObj = this.selectValue[i]
            var id = rowObj.id
            idList.push(id)
          }
          // batch delete rows by idList
          role.batchRemove(idList)
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
      }
    },
    // Show assign auth
    showAssignAuth(row) {
      this.$router.push('/system/assignAuth?id=' + row.id + '&roleName=' + row.roleName);
    },
    // Change size for pagination select
    handleSizeChange(limit) {
      this.limit = limit
      this.fetchData()
    },
    // Checkbox change
    handleSelectionChange(selection) {
      this.selectValue = selection
      //console.log(selection)
    }


  }
}
</script>
