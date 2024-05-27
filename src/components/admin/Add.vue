<template>
  <el-dialog
    :title="title"
    :visible.sync="addDialogVisible"
    @close="closeDia"
    :before-close="closeDia"
    width="30%"
  >
    <el-form
      :model="dataForm"
      status-icon
      :rules="rules"
      ref="dataForm"
      label-width="100px"
    >
      <el-form-item label="用户名：" prop="userName">
        <el-input
          v-model="dataForm.userName"
          readonly
          onfocus="this.removeAttribute('readonly');"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="账号昵称：" prop="nickName">
        <el-input v-model="dataForm.nickName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="账号密码：" prop="password">
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
        userName: "",
        nickName: "",
        password: "",
        rePassword: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        rePassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: rePasswordCheck, trigger: "blur" },
        ],
      },
      // 弹窗标题
      title: "新增账号",
    };
  },
  methods: {
    // 关闭弹窗
    closeDia() {
      // 清空表单
      this.$refs["dataForm"].resetFields();
      this.$emit("closeDialog", false);
    },
    // 表单提交事件
    addSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 发起请求
          let { data: res } = await this.$request.postForm(
            `/system/admin/saveInfo`,
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