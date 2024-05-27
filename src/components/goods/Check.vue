<template>
  <!-- 新增弹出的对话框 -->
  <el-dialog
    :title="title"
    :visible.sync="addDialogVisibleFind"
    @close="closeDia"
    :before-close="closeDia"
    @open="openDia"
    width="800px"
  >
    <el-form
      status-icon
      :model="goodsData"
      ref="goodsData"
      label-width="110px"
      :inline="true"
      label-position="top"
    >
      <el-form-item label="拍品标题：">
        <el-input
          v-model="goodsData.goodsName"
          autocomplete="off"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="拍品类型：">
        <el-input v-model="goodsData.typeName" readonly></el-input>
      </el-form-item>
      <el-form-item label="所在地区：">
        <el-input v-model="goodsData.areaName" readonly></el-input>
      </el-form-item>
      <el-form-item label="拍品市场价：">
        <el-input v-model.number="goodsData.marketPrice" readonly></el-input>
      </el-form-item>
      <el-form-item label="起拍价：">
        <el-input v-model.number="goodsData.goodsPrice" readonly></el-input>
      </el-form-item>
      <el-form-item label="加价幅度：">
        <el-input v-model.number="goodsData.increasePrice" readonly></el-input>
      </el-form-item>
      <el-form-item label="拍卖开始时间">
        <el-input v-model="goodsData.startDate" readonly></el-input>
      </el-form-item>
      <el-form-item label="拍卖结束时间">
        <el-input v-model="goodsData.endDate" readonly></el-input>
      </el-form-item>
      <br />
      <el-form-item label="拍卖品图（最多3张, 推荐正方形图片最佳)：">
        <div class="demo-image">
          <el-image
            style="width: 180px; margin-right: 10px"
            :src="item"
            v-if="item"
            v-for="(item, index) in goodsData.imgList"
            :key="index"
          ></el-image>
        </div>
      </el-form-item>
      <br />
      <el-form-item label="" prop="goodsDetail" required>
        <quill-editor
          v-model="goodsData.goodsDetail"
          ref="quillEditor"
          @focus="editorFocus($event)"
        ></quill-editor>
      </el-form-item>
    </el-form>
    <!-- 弹出层的按钮区 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDia">取 消</el-button>
      <el-button type="success" @click="addSubmit(1)">通 过</el-button>
      <el-button type="danger" @click="addSubmit(2)">不通过</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 用来控制弹出层的隐藏和显示
    addDialogVisibleFind: {
      type: Boolean,
      default: false,
    },
    // 要修改的信息
    findId: {
      type: Number,
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "审核拍品",
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      goodsData: {},
    };
  },
  methods: {
    // 为富文本编辑器绑定只读
    editorFocus(event) {
      // 设置富文本编辑器不可编辑
      event.enable(false);
    },
    // 关闭弹窗
    closeDia() {
      // 清空本次的查询数据
      this.goodsData = {};
      this.goodsImgUrlArr = [];
      this.$emit("closeDialog", false);
    },
    // 弹窗打开初始化方法
    async openDia() {
      if (this.findId == -1) {
        this.closeDia();
        return false;
      }
      // 如果要修改的ID不为空则 查询要修改的信息
      if (this.updateData) {
        this.dataForm.typeName = this.updateData.typeName;
        this.dataForm.id = this.updateData.id;
        if (this.updateData.id) {
          this.title = "审核拍品";
        }
      }
      // 查询类型信息
      let { data: res } = await this.$request.get(
        `/system/goods/getInfoById/${this.findId}`
      );
      this.goodsData = res.data;
      return true;
    },
    // 提交审核
    async addSubmit(auditStatus) {
      // 发起请求
      let param = {
        id: this.findId,
        auditStatus: auditStatus,
      };
      let { data: res } = await this.$request.postForm(
        `/system/goods/auditGoodsInfo`,
        param
      );

      // 重新赋值选中的城市
      if (res.code == 1) {
        this.$message.success("操作成功！");
        setTimeout(() => {
          // 关闭弹窗
          this.$emit("closeDialog", true);
          // 清空本次查询数据
          this.goodsData = {};
          this.goodsImgUrlArr = [];
        }, 1000);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-select {
  width: 100%;
}
</style>