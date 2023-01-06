<template>
  <div class="app-container">
    <el-header style="text-align: center; font-size: 30px">
      Operation log
    </el-header>

    <div class="search-div">
      <el-form label-width="70px"
               size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="System model"
                          label-width="120px">
              <el-input style="width: 95%"
                        v-model="searchObj.title"
                        placeholder="Model name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Operator username"
                          label-width="150px">
              <el-input style="width: 95%"
                        v-model="searchObj.operName"
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

      <el-table-column prop="title"
                       label="System model"
                       width="180" />
      <el-table-column prop="businessType"
                       label="Business type"
                       width="130" />
      <el-table-column prop="requestMethod"
                       label="Request type"
                       width="130" />
      <el-table-column prop="operName"
                       label="Operator username"
                       width="180" />
      <el-table-column prop="operIp"
                       label="Operator IP"
                       width="180" />
      <el-table-column prop="method"
                       label="Request method"
                       width="280" />
      <el-table-column label="State"
                       width="80">
        <template slot-scope="scope">
          {{ scope.row.status===0?'Success':'Fail' }}
        </template>
      </el-table-column>
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
import log from '@/api/system/operlog'

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