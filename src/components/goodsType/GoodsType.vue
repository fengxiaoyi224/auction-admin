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
            <el-form-item label="类型名：" prop="typeName">
              <el-input
                v-model="queryParam.typeName"
                placeholder="请输入类型名"
              ></el-input>
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
              >新增类型</el-button
            >
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
            <el-table-column prop="typeName" label="类型名"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="warning"
                  @click="updateBtn(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  icon="el-icon-delete"
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
      <AddOrUpdate
        :add-dialog-visible="addDialogVisible"
        :update-data="updateData"
        @closeDialog="closeDialog"
      ></AddOrUpdate>
    </div>
  </div>
</template>

<script>
import AddOrUpdate from "./AddOrUpdate.vue";

export default {
  components: {
    AddOrUpdate,
  },
  data() {
    return {
      // 存放查询结果的数据集
      dataList: [],
      // 查询参数
      queryParam: {
        typeName: "",
      },
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
    };
  },
  created() {
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
            `/system/goodsType/deleteDataInfos`,
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
      this.$message.closeAll();
      // 查询数据
      let { data: res } = await this.$request.get(
        `/system/goodsType/getTableDataList/${this.page}/${this.pageSize}`,
        { params: this.queryParam }
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