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
            <el-form-item label="拍品标题：" prop="goodsName">
              <el-input
                v-model="queryParam.goodsName"
                placeholder="请输入拍品标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="委托人：" prop="realName">
              <el-input
                v-model="queryParam.realName"
                placeholder="请输入委托人"
              ></el-input>
            </el-form-item>
            <el-form-item label="审核状态：" prop="auditStatus">
              <el-select
                v-model="queryParam.auditStatus"
                placeholder="请选择审核状态"
              >
                <el-option label="未审核" value="0"></el-option>
                <el-option label="审核通过" value="1"></el-option>
                <el-option label="审核不通过" value="2"></el-option>
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
              v-if="adminInfo.roleId == 2"
              >新增拍品</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteInfo('1')"
              v-if="adminInfo.roleId == 2"
              >批量删除</el-button
            >
          </el-row>
        </div>

        <!-- 表格列表区域 -->
        <div class="table-box">
          <el-table
            :data="dataList"
            style="width: 100%"
            @selection-change="selectRow"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              prop="goodsName"
              min-width="130"
              show-overflow-tooltip
              label="拍品标题"
            >
            </el-table-column>
            <el-table-column prop="typeName" min-width="80" label="拍品类型">
            </el-table-column>
            <el-table-column prop="realName" min-width="80" label="委托人">
            </el-table-column>
            <el-table-column prop="phoneNumber" width="120" label="联系电话">
            </el-table-column>
            <el-table-column prop="goodsPrice" width="60" label="起拍价">
              <template slot-scope="scope">
                ¥&nbsp;{{ scope.row.goodsPrice }}
              </template>
            </el-table-column>
            <el-table-column prop="marketPrice" width="60" label="市场价">
              <template slot-scope="scope">
                ¥&nbsp;{{ scope.row.marketPrice }}
              </template>
            </el-table-column>
            <el-table-column prop="increasePrice" width="60" label="加价幅度">
              <template slot-scope="scope">
                ¥&nbsp;{{ scope.row.increasePrice }}
              </template>
            </el-table-column>
            <el-table-column prop="startDate" width="110" label="拍卖开始时间">
            </el-table-column>
            <el-table-column prop="endDate" width="110" label="拍卖结束时间">
            </el-table-column>
            <el-table-column prop="dataStatus" width="80" label="数据状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.dataStatus == '0'" type="warning"
                  >暂存</el-tag
                >
                <el-tag v-if="scope.row.dataStatus == '1'" type="success"
                  >已提交</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="auditStatus" width="80" label="审核状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.auditStatus == '0'" type="warning"
                  >未审核</el-tag
                >
                <el-tag v-if="scope.row.auditStatus == '1'" type="success"
                  >审核通过</el-tag
                >
                <el-tag v-if="scope.row.auditStatus == '2'" type="danger"
                  >审核不通过</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column fixed="right" width="200" label="操作">
              <template slot-scope="scope">
                <!-- 数据状态为提交, 并且审核状态为未审核, 才可以审核 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="审核"
                  placement="top"
                  v-if="
                    adminInfo.roleId == 1 &&
                    scope.row.dataStatus == 1 &&
                    scope.row.auditStatus == 0
                  "
                >
                  <el-button
                    size="mini"
                    icon="el-icon-check"
                    type="success"
                    @click="checkWindow(scope.row)"
                  ></el-button>
                </el-tooltip>

                <!-- 数据状态为未提交, 角色为委托者, 才可以提交 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="提交"
                  placement="top"
                  v-if="adminInfo.roleId == 2 && scope.row.dataStatus == 0"
                >
                  <el-button
                    size="mini"
                    icon="el-icon-check"
                    type="primary"
                    @click="submitData(scope.row)"
                  ></el-button>
                </el-tooltip>
                <!-- 编辑 -->
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="warning"
                  @click="updateBtn(scope.row)"
                  v-if="adminInfo.roleId == 2 && scope.row.dataStatus == 0"
                ></el-button>
                <!-- 拍品状态为暂存才可以删除 -->
                <el-button
                  v-if="scope.row.dataStatus == 0 && adminInfo.roleId == 2"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteInfo('0', scope.row)"
                  type="danger"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div style="margin-top: 15px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 20, 30, 40]"
            :page-size="pageSize"
            :current-page="page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-card>

      <!-- 表单弹窗 -->
      <AddOrUpdate
        :add-dialog-visible="addDialogVisible"
        :update-id="updateId"
        @closeDialog="closeDialog"
      ></AddOrUpdate>

      <!-- 审核弹窗 -->
      <Check
        :add-dialog-visible-find="addDialogVisibleFind"
        :find-id="findId"
        @closeDialog="closeDialog"
      ></Check>
    </div>
  </div>
</template>

<script>
import AddOrUpdate from "./AddOrUpdate";
import Check from "./Check";

export default {
  components: {
    AddOrUpdate,
    Check,
  },
  data() {
    return {
      // 存放查询结果的数据集
      dataList: [],
      // 查询参数
      queryParam: {
        realName: "",
        userId: "",
        goodsName: "",
        startDateQuery: "",
        endDateQuery: "",
        auditStatus: "",
      },
      // 保存选中的日期范围
      queryDate: [],
      // 数据总数
      total: 0,
      // 当前页数
      page: 1,
      // 每页显示的条数
      pageSize: 5,
      // 要删除的信息
      multipleSelection: [],
      // 控制新增弹出的对话框
      addDialogVisible: false,
      // 控制审核弹出的对话框
      addDialogVisibleFind: false,
      // 临时保存要修改的数据
      updateId: -1,
      // 当前登录的用户信息
      adminInfo: {},
      // 正在审核的拍品ID
      findId: -1,
    };
  },
  created() {
    // 不是管理员，则传入ID查询
    this.adminInfo = JSON.parse(window.sessionStorage.getItem("adminInfo"));
    // 判断用户权限是不是管理员，根据不同的委托人查询不同的拍卖品信息
    let roleId = window.sessionStorage.getItem("roleId");
    if (roleId != 1) {
      this.queryParam.userId = this.adminInfo.id;
    }
    // 初始化查询信息
    this.getTableData();
  },
  methods: {
    // 打开审核窗口
    checkWindow(goods) {
      this.findId = goods.id;
      this.addDialogVisibleFind = true;
    },
    // 关闭弹窗并刷新页面
    closeDialog(submitFlag) {
      this.updateData = {};
      this.addDialogVisible = false;
      this.addDialogVisibleFind = false;
      this.findId = -1;
      if (submitFlag) {
        // 重新调用查询
        this.getTableData();
      }
    },
    // 绑定修改按钮
    updateBtn(data) {
      this.updateId = data.id;
      this.addDialogVisible = true;
    },
    // 重置查询表单,
    resetForm(formName) {
      // 清空日期选择
      this.queryDate = [];
      this.queryParam.startDateQuery = "";
      this.queryParam.endDateQuery = "";
      this.$refs[formName].resetFields();
      // 初始化查询信息
      this.getTableData();
    },
    // 表格选中
    selectRow(val) {
      this.multipleSelection = val;
    },
    // 批量删除或单条删除删除
    deleteInfo(flag, val) {
      let deleteList = [];
      // flag == 1代表是批量删除
      if (flag === "1") {
        if (!this.multipleSelection || this.multipleSelection.length == 0) {
          this.$message.info("请先选择要处理的数据! ");
          return;
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          deleteList.push(this.multipleSelection[i].id);
        }
      } else {
        // 单条删除
        deleteList.push(val.id);
      }
      // 提示
      this.$confirm("此操作的结果将是不可逆的, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let { data: res } = await this.$request.post(
            `/system/goods/deleteDataInfos`,
            deleteList
          );
          if (res.code == 1) {
            this.$message.success("操作成功! ");
            setTimeout(() => {
              this.getTableData();
            }, 500);
          } else if (res.code == 2) {
            this.$message.warning(res.msg);
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
        this.queryParam.startDateQuery = this.queryDate[0];
        this.queryParam.endDateQuery = this.queryDate[1];
      }
      // 查询数据
      let { data: res } = await this.$request.post(
        `/system/goods/getTableDataList/${this.page}/${this.pageSize}`,
        this.queryParam
      );
      // 查询成功
      this.dataList = res.data;
      // 赋值总数量
      this.total = res.total;
    },
    // 提交数据
    async submitData(data) {
      // 发起请求
      let param = {
        id: data.id,
        dataStatus: 1,
        auditStatus: 0,
      };
      let { data: res } = await this.$request.postForm(
        `/system/goods/auditGoodsInfo`,
        param
      );
      // 重新赋值选中的城市
      if (res.code == 1) {
        this.$message.success("操作成功！");
        setTimeout(() => {
          this.getTableData();
        }, 500);
      }
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