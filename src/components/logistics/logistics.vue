<template>
  <div>
    <div>
      <el-card>
        <div class="header-search-box">
          <el-form
            :inline="true"
            :model="queryParam"
            ref="queryParam"
            class="demo-form-inline"
          >
            <el-form-item label="物流编号：" prop="logisticsNum">
              <el-input
                v-model="queryParam.logisticsNum"
                placeholder="请输入物流编号"
              ></el-input>
            </el-form-item>
            <el-form-item label="订单编号：" prop="orderNum">
              <el-input
                v-model="queryParam.orderNum"
                placeholder="请输入订单编号"
              ></el-input>
            </el-form-item>
            <el-form-item label="物流状态：" prop="status">
              <el-select
                v-model="queryParam.status"
                placeholder="请选择物流状态"
              >
                <el-option label="待发货" value="1"></el-option>
                <el-option label="已发货待收货" value="2"></el-option>
                <el-option label="已收货" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getTableData">查询</el-button>
              <el-button @click="resetForm('queryParam')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="header-bar">
          <el-row :gutter="15">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="small"
              @click="addDialogVisible = true"
              >新增物流</el-button
            >
            <el-button
              type="info"
              icon="el-icon-edit"
              size="small"
              @click="updateBtn()"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteInfo()"
              >删除</el-button
            >
          </el-row>
        </div>

        <!-- 表格列表区域 -->
        <div class="table-box">
          <el-table
            ref="multipleTable"
            tooltip-effect="dark"
            :data="dataList"
            style="width: 100%"
            @selection-change="selectRow"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              prop="logisticsNum"
              min-width="100"
              show-overflow-tooltip
              label="物流编号"
            >
            </el-table-column>
            <el-table-column
              prop="orderNum"
              min-width="100"
              show-overflow-tooltip
              label="订单编号"
            >
            </el-table-column>
            <el-table-column
              prop="currentLocation"
              min-width="80"
              show-overflow-tooltip
              label="当前地点"
            >
            </el-table-column>
            <el-table-column prop="deliveryTime" width="110" label="发货时间">
            </el-table-column>
            <el-table-column prop="receivingTime" width="110" label="收货时间">
            </el-table-column>
            <el-table-column prop="status" width="120" label="发货状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === '1'" type="warning"
                  >待发货</el-tag
                >
                <el-tag v-if="scope.row.status === '2'" type="danger"
                  >已发货待收货</el-tag
                >
                <el-tag v-if="scope.row.status === '3'" type="success"
                  >已收货</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="createTime" width="110" label="创建时间">
            </el-table-column>
            <el-table-column prop="updateTime" width="110" label="更新时间">
            </el-table-column>
            <el-table-column prop="logisticsName" width="100" label="物流公司">
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div style="margin-top: 15px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pageSize"
            :current-page="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-card>
      <!-- 表单弹窗 -->
      <Add
        :add-dialog-visible="addDialogVisible"
        :update-data="updateData"
        @closeDialog="closeDialog"
      ></Add>
    </div>
  </div>
</template>

<script>
import Add from "./Add.vue";

export default {
  components: {
    Add,
  },
  data() {
    return {
      // 存放查询结果的数据集
      dataList: [],
      // 查询参数
      queryParam: {
        logisticsNum: "",
        clientId: "",
        orderNum: "",
        startDate: "",
        endDate: "",
        status: "",
      },
      // 保存选中的日期范围
      queryDate: [],
      // 数据总数
      total: 0,
      // 当前页数
      page: 1,
      // 每页显示的条数
      pageSize: 10,
      // 要删除的信息
      multipleSelection: [],
      // 控制新增弹出的对话框
      addDialogVisible: false,
      // 临时保存要修改的数据
      updateData: {},
      // 当前登录的用户信息
      adminInfo: {},
      // 控制新增弹出的对话框
      addDialogVisible: false,
    };
  },
  created() {
    // 不是管理员，则传入ID查询
    this.adminInfo = JSON.parse(window.sessionStorage.getItem("adminInfo"));
    // 判断用户权限是不是管理员，根据不同的委托人查询不同的拍卖品信息
    let roleId = window.sessionStorage.getItem("roleId");
    if (roleId != 1) {
      this.queryParam.clientId = this.adminInfo.id;
    }
    // 初始化查询信息
    this.getTableData();
  },
  methods: {
    // 关闭弹窗并刷新页面
    closeDialog(submitFlag) {
      this.updateData = {};
      this.addDialogVisible = false;
      if (submitFlag) {
        // 重新调用查询
        this.getTableData();
      }
    },
    // 绑定修改按钮
    updateBtn() {
      if (this.multipleSelection.length > 1) {
        this.$message.warning("只能选择一条数据");
        return;
      }
      if (this.multipleSelection.length < 1) {
        this.$message.warning("必须选择一条数据");
        return;
      }
      this.updateData = this.multipleSelection[0];
      this.addDialogVisible = true;
    },
    // 重置查询表单,
    resetForm(formName) {
      // 清空日期选择
      this.queryDate = [];
      this.queryParam.startDate = "";
      this.queryParam.endDate = "";
      this.$refs[formName].resetFields();
      // 初始化查询信息
      this.getTableData();
    },
    // 表格选中
    selectRow(val) {
      this.multipleSelection = val;
    },
    // 批量删除或单条删除删除
    deleteInfo() {
      let deleteList = [];
      if (!this.multipleSelection || this.multipleSelection.length == 0) {
        this.$message.info("请先选择要处理的数据! ");
        return;
      }

      for (let i = 0; i < this.multipleSelection.length; i++) {
        deleteList.push(this.multipleSelection[i].id);
      }

      this.$confirm("确认删除？此操作的结果将是不可逆的, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let { data: res } = await this.$request.post(
            `/system/logistics/deleteDataInfos`,
            deleteList
          );
          if (res.code == 1) {
            this.$message.success("操作成功! ");
            setTimeout(() => {
              this.getTableData();
            }, 500);
          }
        })
        .catch(() => {
          this.$message.info("已取消! ");
        });
    },
    // 查询表格数据
    async getTableData() {
      // 关闭弹窗提示
      this.$message.closeAll();
      // 判断如果选择了日期
      if (this.queryDate && this.queryDate.length > 0) {
        // 将日期拆分为开始时间和结束时间
        this.queryParam.startDate = this.queryDate[0];
        this.queryParam.endDate = this.queryDate[1];
      }
      // 查询数据
      let { data: res } = await this.$request.post(
        `/system/logistics/getTableDataList/${this.page}/${this.pageSize}`,
        this.queryParam
      );
      // 查询成功
      this.dataList = res.data;
      // 赋值总数量
      this.total = res.total;
    },
    // 修改每页显示的条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    // 修改页码
    handleCurrentChange(val) {
      this.page = val;
      this.getTableData();
    },
  },
};
</script>

<style lang="less" scoped>

</style>