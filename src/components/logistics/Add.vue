<template>
  <el-dialog
    title="新增物流"
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
      <el-form-item label="订单编号：" prop="orderNum">
        <el-input
          v-model="dataForm.orderNum"
          readonly
          onfocus="this.removeAttribute('readonly');"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="当前地点：" prop="currentLocation">
        <el-input
          v-model="dataForm.currentLocation"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="发货时间：" prop="deliveryTime">
        <el-date-picker
          style="width: 353px"
          v-model="dataForm.deliveryTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发货状态：" prop="status">
        <el-select
          style="width: 353px"
          v-model="dataForm.status"
          placeholder="请选择发货状态"
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
      <el-form-item label="物流公司：" prop="logisticsName">
        <el-input
          v-model="dataForm.logisticsName"
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
    updateData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      dataForm: {
        orderNum: "",
        currentLocation: "",
        deliveryTime: null,
        receivingTime: null,
        status: "",
        logisticsName: "",
      },
      options: [
        {
          value: "1",
          label: "待发货",
        },
        {
          value: "2",
          label: "已发货待收货",
        },
        {
          value: "3",
          label: "已收货",
        },
      ],
      rules: {
        orderNum: [
          { required: true, message: "请输入订单编号", trigger: "blur" },
        ],
        currentLocation: [
          { required: true, message: "请输入当前地点", trigger: "blur" },
        ],
        deliveryTime: [
          { required: true, message: "请输入发货时间", trigger: "blur" },
        ],
        receivingTime: [
          { required: false, message: "请输入收货时间", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择发货状态", trigger: "blur" },
        ],
        logisticsName: [
          { required: true, message: "请输入物流公司", trigger: "blur" },
        ],
      },
      // 弹窗标题
      title: "新增物流",
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
            `/system/logistics/saveOrUpdate`,
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
