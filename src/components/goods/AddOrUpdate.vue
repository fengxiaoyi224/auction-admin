<template>
  <el-dialog
    :title="title"
    :visible.sync="addDialogVisible"
    @close="closeDia"
    :before-close="closeDia"
    @open="openDia"
    width="800px"
  >
    <el-form
      :model="dataForm"
      status-icon
      :rules="rules"
      ref="dataForm"
      label-width="110px"
      :inline="true"
      label-position="top"
    >
      <el-form-item label="拍品标题：" prop="goodsName">
        <el-input
          v-model="dataForm.goodsName"
          autocomplete="on"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="拍品类型：" prop="goodsTypeId">
        <el-select
          v-model="dataForm.goodsTypeId"
          placeholder="请选择"
          prop="goodsTypeId"
        >
          <el-option
            v-for="item in goodsTypeData"
            :key="item.id"
            :label="item.typeName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在地区：" prop="cityId">
        <el-cascader
          v-model="dataForm.cityId"
          :options="cityParentList"
          :props="cityProps"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.name }}{{ data.suffix }}</span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="拍品市场价：" prop="marketPrice">
        <el-input
          v-model.number="dataForm.marketPrice"
          autocomplete="off"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="起拍价：" prop="goodsPrice">
        <el-input
          v-model.number="dataForm.goodsPrice"
          autocomplete="off"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="加价幅度：" prop="increasePrice">
        <el-input
          v-model.number="dataForm.increasePrice"
          autocomplete="off"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="拍卖开始时间" required prop="startDate">
        <el-date-picker
          v-model="dataForm.startDate"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="拍卖结束时间" required prop="endDate">
        <el-date-picker
          v-model="dataForm.endDate"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <br />
      <el-form-item label="拍卖品图（最多3张, 推荐正方形图片最佳)：" required>
        <el-upload
          action="#"
          list-type="picture-card"
          ref="photoUpload"
          :on-change="handleUploadChange"
          :file-list="fileList"
          :auto-upload="false"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="" prop="goodsDetail" required>
        <quill-editor v-model="dataForm.goodsDetail"></quill-editor>
      </el-form-item>
    </el-form>
    <!-- 弹出层的按钮区 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDia">取 消</el-button>
      <el-button type="success" @click="addSubmit('dataForm', 0)"
        >保 存</el-button
      >
      <el-button type="primary" @click="addSubmit('dataForm', 1)"
        >提 交</el-button
      >
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
    updateId: {
      type: Number,
    },
  },
  data() {
    let self = this;
    return {
      // 城市级联下拉框的配置属性
      cityProps: {
        lazy: false,
      },
      dataForm: {
        goodsName: "",
        goodsTypeId: "",
        marketPrice: "",
        goodsPrice: "",
        increasePrice: "",
        startDate: "",
        endDate: "",
        cityId: "",
        goodsDetail: "请输入拍品详情...",
      },
      rules: {
        goodsName: [
          { required: true, message: "请输入拍品标题", trigger: "blur" },
        ],
        goodsTypeId: [
          { required: true, message: "请选择类型", trigger: "blur" },
        ],
        goodsDetail: [
          { required: true, message: "请输入拍品详情", trigger: "blur" },
        ],
        cityId: [{ required: true, message: "请选择城市", trigger: "blur" }],
        startDate: [
          { required: true, message: "请选择开始拍卖日期", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择开始拍卖时间", trigger: "blur" },
        ],
        endDate: [
          { required: true, message: "请选择结束拍卖日期", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请选择结束拍卖时间", trigger: "blur" },
        ],
        marketPrice: [
          { required: true, message: "请输入市场价", trigger: "blur" },
          { type: "number", message: "输入必须为数字值" },
        ],
        goodsPrice: [
          { required: true, message: "请输入起拍价", trigger: "blur" },
          { type: "number", message: "输入必须为数字值" },
        ],
        increasePrice: [
          { required: true, message: "请输入加价幅度", trigger: "blur" },
          { type: "number", message: "输入必须为数字值" },
        ],
      },
      // 拍品类型数据
      goodsTypeData: [],
      // 所有省份区划
      cityParentList: [],
      // 弹窗标题
      title: "新增拍品",
      // 回显使用的文件列表
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
    };
  },
  methods: {
    // 移除图片
    handleRemove(file) {
      let uploadFiles = this.$refs.photoUpload.uploadFiles;
      for (var i = 0; i < uploadFiles.length; i++) {
        if (uploadFiles[i]["url"] == file.url) {
          uploadFiles.splice(i, 1);
        }
      }
    },
    handleUploadChange(file, fileList) {
      if (fileList.length > 3) {
        this.$message.warning("最多只可以上传三张图! ");
        // 只可以上传三张图片!
        this.$refs.photoUpload.uploadFiles.splice(3, 1);
      }
    },
    // 关闭弹窗
    closeDia() {
      this.resetForm();
      this.$emit("closeDialog", false);
    },
    resetForm() {
      this.dataForm = {
        goodsName: "",
        goodsTypeId: "",
        marketPrice: "",
        goodsPrice: "",
        increasePrice: "",
        startDate: "",
        endDate: "",
        cityId: "",
        goodsDetail: "请输入拍品详情...",
      };
      this.fileList = [];
      this.$refs.photoUpload.uploadFiles = [];
      // 清空表单
      this.$refs["dataForm"].resetFields();
    },
    // 弹窗打开初始化方法
    async openDia() {
      // 如果要修改的ID不为空则 查询要修改的信息
      if (this.updateId && this.updateId != -1) {
        this.title = "修改拍品";
        // 修改的数据信息
        let { data: res } = await this.$request.get(
          `/system/goods/getInfoById/${this.updateId}`
        );
        this.dataForm = res.data;
        // 赋值回显的文件
        for (let i = 0; i < this.dataForm.imgList.length; i++) {
          this.fileList.push({
            url: this.dataForm.imgList[i],
          });
        }
      }
      // 查询类型信息
      let { data: typeRes } = await this.$request.get(
        `/system/goodsType/getDataList`
      );
      this.goodsTypeData = typeRes.data;
      this.cityParentList = JSON.parse(
        window.sessionStorage.getItem("cityInfos")
      );
      if (this.updateId) {
        this.dataForm.cityId = this.dataForm.fullAreaId;
      }
      return true;
    },
    // 表单提交事件
    addSubmit(formName, dataStatus) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 从上传组件中取出临时保存的文件对象(数组)
          let uploadFiles = this.$refs.photoUpload.uploadFiles;
          let goodsDetail = this.dataForm.goodsDetail;
          if (!uploadFiles || uploadFiles.length === 0) {
            this.$message.warning("请上传拍品图! ");
            return false;
          }
          if (!goodsDetail || goodsDetail === "请输入拍品详情...") {
            this.$message.warning("请输入拍品详情! ");
            return false;
          }
          // 拼接上传用的数据
          let queryData = this.dataForm;
          let cityIdArr = queryData.cityId;
          // 转换日期格式
          queryData.startDate = this.$formatDate(queryData.startDate);
          queryData.endDate = this.$formatDate(queryData.endDate);
          queryData.cityId = queryData.cityId[queryData.cityId.length - 1] + "";
          let form = new FormData();
          // 循环文件数组对象, 将所有图片文件全部塞入FormData对象中
          // 记录本次是否有回显未删除的文件
          let uploadFlag = "1";
          for (let i in uploadFiles) {
            // 如果上传文件中有文件为空, 则代表是有回显未删除的文件
            if (!uploadFiles[i].raw) {
              uploadFlag = "0";
            } else {
              form.append("file", uploadFiles[i].raw);
            }
          }
          Object.keys(queryData).forEach(function (item, index) {
            if (queryData[item] && queryData[item] != "null") {
              form.append(item, queryData[item]);
            }
          });
          form.append("uploadFlag", uploadFlag);
          // 发起请求
          let adminInfo = JSON.parse(
            window.sessionStorage.getItem("adminInfo")
          );
          // 保存委托人ID
          form.append("userId", adminInfo.id);
          // 保存数据状态
          form.append("dataStatus", dataStatus);
          let { data: res } = await this.$request.postForm(
            `/system/goods/saveOrUpdate`,
            form
          );

          // 重新赋值选中的城市
          this.dataForm.cityId = cityIdArr;
          if (res.code == 1) {
            this.$message.success("操作成功！");
            setTimeout(() => {
              // 关闭弹窗
              this.$emit("closeDialog", true);
              // 清空表单
              this.resetForm();
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
.el-select {
  width: 100%;
}
</style>