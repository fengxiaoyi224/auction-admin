<template>
  <el-dialog
    :title="title"
    :visible.sync="addPersonInfo"
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
      <el-form-item label="真实姓名：" prop="realName">
        <el-input
          v-model="dataForm.realName"
          :disabled="adminInfo.realName ? true : false"
          readonly
          onfocus="this.removeAttribute('readonly');"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="身份证号：" prop="idNumber">
        <el-input
          v-model="dataForm.idNumber"
          :disabled="adminInfo.idNumber ? true : false"
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
    addPersonInfo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dataForm: {
        realName: "",
        idNumber: "",
        roleId: "",
      },
      adminInfo: {},
      rules: {
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        idNumber: [
          { required: true, message: "请输入身份证", trigger: "blur" },
        ],
      },
      // 弹窗标题
      title: "信息完善",
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
      this.adminInfo = JSON.parse(window.sessionStorage.getItem("adminInfo"));
      this.dataForm.id = this.adminInfo.id;
      this.dataForm.roleId = this.adminInfo.roleId;
      this.dataForm.idNumber = this.adminInfo.idNumber;
      this.dataForm.realName = this.adminInfo.realName;
    },
    // 表单提交事件
    addSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 发起请求
          let { data: res } = await this.$request.postForm(
            `/system/user/updateUserInfo`,
            this.dataForm
          );
          if (res.code == 1) {
            this.$message.success("操作成功！");
            setTimeout(() => {
              // 更新缓存信息
              this.adminInfo.idNumber = this.dataForm.idNumber;
              this.adminInfo.realName = this.dataForm.realName;
              window.sessionStorage.setItem(
                "adminInfo",
                JSON.stringify(this.adminInfo)
              );
              // 关闭弹窗
              this.$emit("closeDialog", false);
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