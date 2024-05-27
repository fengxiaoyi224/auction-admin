<template>
  <div>
    <!-- <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>竞买人信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
    <div>
      <el-card>
        <div class="header-search-box">
          <el-form
            :inline="true"
            :model="queryParam"
            ref="queryParam"
            class="demo-form-inline"
          >
            <el-form-item label="用户昵称：" prop="nickName">
              <el-input
                v-model="queryParam.nickName"
                placeholder="请输入用户昵称"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="phoneNumber">
              <el-input
                v-model="queryParam.phoneNumber"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idNumber">
              <el-input
                v-model="queryParam.idNumber"
                placeholder="请输入身份证号"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户状态" prop="frozenFlag">
              <el-select
                style="width: 160px"
                v-model="queryParam.frozenFlag"
                placeholder="请选择用户状态"
              >
                <el-option label="正常" value="1"></el-option>
                <el-option label="冻结" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getUserTableData"
                >查询</el-button
              >
              <el-button @click="resetForm('queryParam')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="header-bar">
          <el-row :gutter="15">
            <el-button size="small" @click="updateFrozenFlag('0')" type="danger"
              >冻结账号</el-button
            >
            <el-button
              size="small"
              @click="updateFrozenFlag('1')"
              type="success"
              >解除冻结</el-button
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
            <el-table-column prop="nickName" label="用户昵称">
            </el-table-column>
            <el-table-column prop="realName" label="真实姓名">
            </el-table-column>
            <el-table-column prop="sex" label="性别">
              <template slot-scope="scope">
                <span v-if="scope.row.sex == '1'">男</span>
                <span v-if="scope.row.sex == '0'">女</span>
              </template>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="联系电话">
            </el-table-column>
            <el-table-column prop="idNumber" label="身份证号">
            </el-table-column>
            <el-table-column prop="createDate" label="注册时间">
            </el-table-column>
            <el-table-column prop="frozenFlag" label="用户状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.frozenFlag == '1'" type="success"
                  >正常</el-tag
                >
                <el-tag v-if="scope.row.frozenFlag == '0'" type="danger"
                  >冻结</el-tag
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存放查询结果的数据集
      dataList: [],
      // 查询参数
      queryParam: {
        nickName: "",
        idNumber: "",
        phoneNumber: "",
        userType: "0", // 只查竞买者
      },
      // 数据总数
      total: 0,
      // 当前页数
      page: 1,
      // 每页显示的条数
      pageSize: 10,
      multipleSelection: [],
    };
  },
  created() {
    // 初始化查询信息
    this.getUserTableData();
  },
  methods: {
    // 重置查询表单,
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // 初始化查询信息
      this.getUserTableData();
    },
    // 表格选中
    selectRow(val) {
      this.multipleSelection = val;
    },
    // 修改用户的冻结和正常状态
    updateFrozenFlag(frozenFlag) {
      if (!this.multipleSelection || this.multipleSelection.length == 0) {
        this.$message.info("请先选择要处理的数据! ");
        return;
      }
      this.$confirm("此操作的结果将是不可逆的, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 将选中的数据中的所有frozenFlag字段改为要设置的状态
          // this.multipleSelection.
          let param = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let obj = JSON.parse(JSON.stringify(this.multipleSelection[i]));
            obj.frozenFlag = frozenFlag;
            param.push(obj);
          }
          let { data: res } = await this.$request.post(
            `/system/user/updateFrozenFlag`,
            param
          );
          console.log(res);
          if (res.code == 1) {
            this.$message.success("操作成功! ");
            setTimeout(() => {
              this.getUserTableData();
            }, 500);
          }
        })
        .catch(() => {
          this.$message.info("已取消! ");
        });
    },
    // 查询表格数据
    async getUserTableData() {
      this.$message.closeAll();
      // 查询数据
      let { data: res } = await this.$request.get(
        `/system/user/getUserTableData/${this.page}/${this.pageSize}`,
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
      this.getUserTableData();
    },
    // 修改页码
    handleCurrentChange(val) {
      this.page = val;
      this.getUserTableData();
    },
  },
};
</script>

<style lang="less" scoped>
.tip {
  padding: 8px 16px;
  background-color: #eaf7ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;
}
</style>