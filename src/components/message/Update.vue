<template>
  <el-dialog
    title="回复留言"
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
      <el-form-item label="留言人：" prop="nickName">
        <el-input
          v-model="dataForm.nickName"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phoneNumber">
        <el-input
          v-model="dataForm.phoneNumber"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="留言内容：" prop="content">
        <el-input
          type="textarea"
          :rows="4"
          resize="none"
          v-model="dataForm.content"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="回复内容：" prop="replyContent">
        <el-input
          type="textarea"
          :rows="4"
          resize="none"
          :maxlength="200"
          show-word-limit
          v-model="dataForm.replyContent"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 弹出层的按钮区 -->
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
    return {
      dataForm: {
        content: "",
        replyContent: "",
        phoneNumber: "",
        nickName: "",
        // 回复的留言ID
        id: "",
      },
      rules: {
        replyContent: [
          { required: true, message: "请输入回复内容", trigger: "blur" },
        ],
      },
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
      // 如果要修改的ID不为空则 查询要修改的信息
      if (this.updateData) {
        this.dataForm.content = this.updateData.content;
        this.dataForm.phoneNumber = this.updateData.user.phoneNumber;
        this.dataForm.nickName = this.updateData.user.nickName;
        this.dataForm.id = this.updateData.id;
      }
    },
    // 表单提交事件
    addSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 发起请求
          let { data: res } = await this.$request.postForm(
            `/system/message/saveOrUpdate`,
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