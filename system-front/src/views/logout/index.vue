<template>
  <div class="login-container">
    <el-form ref="loginForm"
             :model="loginForm"
             :rules="loginRules"
             class="login-form"
             auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">Logout Form</h3>
      </div>

      <el-button :loading="loading"
                 type="primary"
                 style="width:100%;margin-bottom:30px;"
                 @click.native.prevent="handleLogin">Login</el-button>

      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: 111111</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  data() {

  },
  methods: {

  }
}
</script>

