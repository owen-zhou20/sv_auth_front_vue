<template>
  <div class="app-container">
    <el-header style="text-align: center; font-size: 30px">
      Login log
    </el-header>

    <div class="search-div">
      <el-form label-width="70px"
               size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="Username">
              <el-input style="width: 95%"
                        v-model="searchObj.username"
                        placeholder="Username"></el-input>
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
                     :disabled="$hasBP('bnt.sysLoginLog.list')  === false"
                     icon="el-icon-search"
                     size="mini"
                     @click="fetchData()">Search</el-button>
          <el-button :disabled="$hasBP('bnt.sysLoginLog.list')  === false"
                     icon="el-icon-refresh"
                     size="mini"
                     @click="resetData()">Reset</el-button>
        </el-row>
      </el-form>
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
      <el-table-column prop="ipaddr"
                       label="IP address" />
      <el-table-column label="State"
                       width="80">
        <template slot-scope="scope">
          {{ scope.row.status===0?'Success':'Fail' }}
        </template>
      </el-table-column>
      <el-table-column prop="msg"
                       label="Notice message" />
      <el-table-column prop="createTime"
                       label="Create Time" />
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

  </div>
</template>

<script>
import log from '@/api/system/loginlog'

export default {
  data() {
    return {
      listLoading: true, // Loading...
      list: null, // banner list
      total: 0, // total records in DB
      page: 1, // current page
      limit: 3, // limit records for every page
      searchObj: {}, // searchObj entity
      createTimes: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // Pagination select login log
    fetchData(page = 1) {
      this.page = page
      if (this.createTimes && this.createTimes.length == 2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }
      log.getPageList(this.page, this.limit, this.searchObj)
        .then(response => {
          this.listLoading = false
          //this.list = response.data.list
          this.list = response.data.records
          this.total = response.data.total
        })
    },
    // Reset
    resetData() {
      this.searchObj = {}
      this.createTimes = []
      this.fetchData()
    },
    // Change size for pagination select
    handleSizeChange(limit) {
      this.limit = limit
      this.fetchData()
    }

  }
}
</script>