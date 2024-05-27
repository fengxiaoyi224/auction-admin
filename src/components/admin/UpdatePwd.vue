<template>
  <el-dialog
    :title="title"
    :visible.sync="addDialogVisible"
    @close="closeDia"
    :before-close="closeDia"
    @open="openDia"
    width="30%"
  >
    <el-form
      :model="dataForm"
      status-icon
      :rules="rules"
      ref="dataForm"
      label-width="100px"
    >
      <el-form-item label="账号昵称：" prop="nickName">
        <el-input
          v-model="dataForm.nickName"
          readonly
          onfocus="this.removeAttribute('readonly');"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="原密码：" prop="oldPwd">
        <el-input
          type="password"
          v-model="dataForm.oldPwd"
          readonly
          onfocus="this.removeAttribute('readonly');"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="password">
        <el-input
          type="password"
          v-model="dataForm.password"
          readonly
          onfocus="this.removeAttribute('readonly');"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="rePassword">
        <el-input
          type="password"
          v-model="dataForm.rePassword"
          readonly
          onfocus="this.removeAttribute('readonly');"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDia">取 消</el-button>
      <el-button type="primary" @click="addSubmit('dataForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 用来控制弹出层的隐藏和显示
    addDialogVisible: {
      type: Boolean,
      default: false,
    },
    // 要修改的信息
    updateData: {
      type: Object,
    },
  },
  data() {
    var rePasswordCheck = (rule, value, callback) => {
      if (value !== this.dataForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dataForm: {
        oldPwd: "",
        password: "",
        rePassword: "",
        nickName: "",
        roleId: "",
      },
      rules: {
        nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        oldPwd: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
        rePassword: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: rePasswordCheck, trigger: "blur" },
        ],
      },
      // 弹窗标题
      title: "修改信息",
    };
  },
  methods: {
    // 关闭弹窗
    closeDia() {
      // 清空表单
      this.$refs["dataForm"].resetFields();
      this.$emit("closeDialog", false);
    },
    // 弹窗打开初始化方法
    openDia() {
      let adminInfo = JSON.parse(window.sessionStorage.getItem("adminInfo"));
      this.dataForm.nickName = adminInfo.nickName;
      this.dataForm.id = adminInfo.id;
      this.dataForm.roleId = adminInfo.roleId;
    },
    // 表单提交事件
    addSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 发起请求
          let { data: res } = await this.$request.postForm(
            `/system/admin/updatePwdInfo`,
            this.dataForm
          );
          if (res.code == 1) {
            this.$message.success("操作成功！");
            setTimeout(() => {
              // 关闭弹窗
              this.$emit("closeDialog", true);
              // 清空表单
              this.$refs[formName].resetFields();
            }, 1000);
          } else if (res.code == 2) {
            this.$message.warning(res.msg);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>