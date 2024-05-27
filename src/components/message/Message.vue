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
            <el-form-item label="回复状态：" prop="messageStatus">
              <el-select
                v-model="queryParam.messageStatus"
                placeholder="请选择回复状态"
              >
                <el-option label="已回复" value="1"></el-option>
                <el-option label="未回复" value="0"></el-option>
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
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteInfo('1')"
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
            <el-table-column prop="userName" min-width="70" label="留言人">
              <template slot-scope="scope">
                <span>{{ scope.row.user.nickName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="phoneNumber"
              min-width="110"
              label="联系方式"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.user.phoneNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" min-width="80" label="留言时间">
            </el-table-column>
            <el-table-column
              prop="content"
              width="230"
              show-overflow-tooltip
              label="留言内容"
            >
            </el-table-column>
            <el-table-column
              prop="replyContent"
              width="230"
              show-overflow-tooltip
              label="回复内容"
            >
            </el-table-column>
            <el-table-column prop="messageStatus" label="留言状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.messageStatus === '0'" type="warning"
                  >未回复</el-tag
                >
                <el-tag v-if="scope.row.messageStatus === '1'" type="success"
                  >已回复</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="messageType" label="留言对象">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.messageType === '0'">给管理员</el-tag>
                <el-tag v-if="scope.row.messageType === '1'" type="success"
                  >给委托人</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column fixed="right" width="170" label="操作">
              <template slot-scope="scope">
                <!-- roleId 为1是管理员 -->
                <el-button
                  v-if="
                    adminInfo.roleId === 1 &&
                    scope.row.messageStatus === '0' &&
                    scope.row.messageType === '0'
                  "
                  size="mini"
                  type="warning"
                  @click="updateBtn(scope.row)"
                  >回复</el-button
                >
                <!-- roleId 为2是委托人 -->
                <el-button
                  v-if="
                    adminInfo.roleId === 2 && scope.row.messageStatus === '0'
                  "
                  size="mini"
                  type="warning"
                  @click="updateBtn(scope.row)"
                  >回复</el-button
                >
                <el-button
                  size="mini"
                  @click="deleteInfo('0', scope.row)"
                  type="danger"
                  >删除</el-button
                >
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
      <Update
        :add-dialog-visible="addDialogVisible"
        :update-data="updateData"
        @closeDialog="closeDialog"
      ></Update>
    </div>
  </div>
</template>

<script>
import Update from "./Update.vue";

export default {
  components: {
    Update,
  },
  data() {
    return {
      // 存放查询结果的数据集
      dataList: [],
      // 查询参数
      queryParam: {
        messageStatus: "",
        toId: "",
        startDate: "",
        endDate: "",
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
      // 临时保存要修改的数据
      updateData: {},
      // 当前登录的用户信息
      adminInfo: {},
    };
  },
  created() {
    // 不是管理员，则传入ID查询
    this.adminInfo = JSON.parse(window.sessionStorage.getItem("adminInfo"));
    // 判断用户权限是不是管理员，根据不同的用户查询不同的留言信息
    let roleId = window.sessionStorage.getItem("roleId");
    if (roleId != 1) {
      this.queryParam.toId = this.adminInfo.id;
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
    updateBtn(data) {
      this.updateData = data;
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
            `/system/message/deleteDataInfos`,
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
        `/system/message/getTableDataList/${this.page}/${this.pageSize}`,
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