<template>
  <div class="login-main">
    <div class="login-box">
      <div class="sys-name-box">
        <h2>欢迎来到在线拍卖 后台管理系统</h2>
      </div>
      <div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="0px"
          class="login-form demo-ruleForm"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="ruleForm.userName"
              placeholder="用户名"
              autocomplete="off"
              readonly
              onfocus="this.removeAttribute('readonly');"
              prefix-icon="el-icon-user-solid"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              placeholder="密码"
              autocomplete="off"
              readonly
              onfocus="this.removeAttribute('readonly');"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-radio v-model="ruleForm.loginType" label="1">管理员</el-radio>
            <el-radio v-model="ruleForm.loginType" label="2">委托人</el-radio>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="submitForm('ruleForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        userName: "",
        password: "",
        loginType: "",// 登录类型, 1管理员 2委托人
      },
      rules: {
        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 表单提交
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(async (valid) => {
        // 验证表单数据是否完整
        if (valid) {
          // 发起登陆请求
          let res = await this.$request.request({
            url: "/rest/login/adminLogin",
            method: "POST",
            data: that.ruleForm,
          });
          if (res.data.code == 1) {
            let resultData = res.data.data;
            // 将token和用户信息保存在sessionStorage中
            window.sessionStorage.setItem("roleId", resultData.roleId);
            window.sessionStorage.setItem(
              "adminInfo",
              JSON.stringify(resultData)
            );
            window.sessionStorage.setItem("token", resultData.token);

            this.$message.success("登录成功！");
            // 跳转页面
            setTimeout(() => {
              this.$message.closeAll();
              this.$router.push("/home");
            }, 500);
          } else if (res.data.code == 0) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.warning(res.data.msg);
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-main {
  position: relative;
  background-color: #0097a7;
  height: 100%;
}

.login-box {
  width: 500px;
  height: 440px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.sys-name-box {
  position: absolute;
  top: 60px;
  width: 100%;
  h2 {
    font-family: "微软雅黑";
    color: #555;
    text-align: center;
  }
}

.login-form {
  position: absolute;
  top: 130px;
  width: 100%;
  padding: 0 50px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
