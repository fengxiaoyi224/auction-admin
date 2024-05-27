<template>
  <el-dialog
    :visible.sync="addDialogVisible"
    @close="closeDia"
    :before-close="closeDia"
    width="45%"
  >
    <el-form
      :model="dataForm"
      status-icon
      :rules="rules"
      ref="dataForm"
      label-width="100px"
    >
      <el-form-item label="拍品标题：" prop="goodsName">
        <el-input
          v-model="dataForm.goodsName"
          disabled
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="拍品类型：" prop="typeName">
        <el-input
          v-model="dataForm.typeName"
          disabled
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="购买人：" prop="realName">
        <el-input
          v-model="dataForm.realName"
          disabled
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phoneNumber">
        <el-input v-model="dataForm.phoneNumber" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="订单总价：" prop="totalPrice">
        <el-input
          v-model="dataForm.totalPrice"
          disabled
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="保证金：" prop="deposit">
        <el-input
          v-model="dataForm.deposit"
          disabled
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="剩余尾款：" prop="balancePrice">
        <el-input
          v-model="dataForm.balancePrice"
          disabled
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间：" prop="createDate">
        <el-date-picker
          style="width: 353px"
          v-model="dataForm.createDate"
          disabled
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="支付时间：" prop="payDate">
        <el-date-picker
          style="width: 353px"
          v-model="dataForm.payDate"
          disabled
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          autocomplete="off"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="支付状态：" prop="payStatus">
        <el-select
          style="width: 353px"
          v-model="dataForm.payStatus"
          disabled
          placeholder="请选择支付状态"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
    updateData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      dataForm: {
        goodsName: "",
        typeName: "",
        realName: "",
        phoneNumber: "",
        totalPrice: "",
        deposit: "",
        balancePrice: "",
        createDate: null,
        payDate: null,
        payStatus: "",
      },
      options: [
        {
          value: "0",
          label: "已支付",
        },
        {
          value: "1",
          label: "未支付",
        },
      ],
      rules: {
        goodsName: [
          { required: true, message: "请输入拍品标题", trigger: "blur" },
        ],
        typeName: [
          { required: true, message: "请输入拍品类型", trigger: "blur" },
        ],
        realName: [
          { required: true, message: "请输入购买人", trigger: "blur" },
        ],
        phoneNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
        totalPrice: [
          { required: true, message: "请输入订单总价", trigger: "blur" },
        ],
        deposit: [{ required: true, message: "请输入保证金", trigger: "blur" }],
        balancePrice: [
          { required: true, message: "请输入剩余尾款", trigger: "blur" },
        ],
        createDate: [
          { required: true, message: "请选择创建时间", trigger: "blur" },
        ],
        payDate: [
          { required: true, message: "请选择支付时间", trigger: "blur" },
        ],
        payStatus: [
          { required: true, message: "请选择支付状态", trigger: "blur" },
        ],
      },
      // 弹窗标题
      // title: '新增订单',
    };
  },
  watch: {
    updateData(val) {
      console.log(val);
      this.dataForm = {};
      this.dataForm = val;
    },
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
            `/system/order/saveOrUpdate`,
            this.dataForm
          );
          console.log(res);
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
