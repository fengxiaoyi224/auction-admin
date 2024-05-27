<template>
  <el-container class="home-content">
    <!-- 头部 -->
    <el-header>
      <div>
        <span>拍卖后台管理系统</span>
      </div>

      <div style="font-size: 16px; display: inline-block">
        {{
          adminInfo.nickName
        }}，你好！&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;欢迎使用拍卖后台管理系统
      </div>

      <div>
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#FFF"
        >
          <el-submenu index="0">
            <template slot="title">我的</template>
            <el-menu-item index="1">修改信息</el-menu-item>
            <el-menu-item v-if="adminInfo.roleId == 2" index="3"
              >信息完善</el-menu-item
            >
            <el-menu-item index="2">退出登录</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          class="el-menu-vertical-demo"
          router
          unique-opened
          :default-active="activeMenu"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#80deea"
        >
          <div v-for="(item, index) in menuList" :key="index">
            <div v-if="item.childMenu != null && item.childMenu.length > 0">
              <el-submenu :index="item.orderBy">
                <template slot="title">
                  <i :class="item.menuIcon"></i>
                  <span>{{ item.menuName }}</span>
                </template>
                <el-menu-item
                  @click="saveActiveMenu(childItem.menuPath)"
                  :index="childItem.menuPath"
                  :key="childItem.id"
                  v-for="childItem in item.childMenu"
                  >{{ childItem.menuName }}</el-menu-item
                >
              </el-submenu>
            </div>
            <div v-if="item.childMenu == null || item.childMenu.length <= 0">
              <el-menu-item
                :index="item.menuPath"
                @click="saveActiveMenu(item.menuPath)"
              >
                <i :class="item.menuIcon"></i>
                <span slot="title">{{ item.menuName }}</span>
              </el-menu-item>
            </div>
          </div>
        </el-menu>
      </el-aside>
      <!-- 页面展示区 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>

    <!-- 修改密码弹窗 -->
    <UpdatePwd
      :add-dialog-visible="addDialogVisible"
      @closeDialog="closeDialog"
    ></UpdatePwd>

    <!-- 补充信息弹窗 -->
    <PersonInfo
      :add-person-info="addPersonInfo"
      @closeDialog="closeDialog"
    ></PersonInfo>
  </el-container>
</template>

<script>
import UpdatePwd from "./admin/UpdatePwd.vue";
import PersonInfo from "./PersonInfo.vue";

export default {
  components: {
    UpdatePwd,
    PersonInfo,
  },
  data() {
    return {
      menuList: [],
      activeMenu: "",
      // 控制新增弹出的对话框
      addDialogVisible: false,
      addPersonInfo: false,
      adminInfo: {},
    };
  },
  created() {
    // 提前将区划信息缓存到浏览器缓存中
    if (!window.sessionStorage.getItem("cityInfos")) {
      // 查询区划信息
      this.$request.get(`/rest/city/getSelectDataList`).then((cityRes) => {
        window.sessionStorage.setItem(
          "cityInfos",
          JSON.stringify(cityRes.data.data)
        );
        console.log("区划缓存成功! ");
      });
    }
    // 初始化查询菜单信息
    this.getMenuListInfo();
    // 从缓存中取出当前登录的用户信息
    this.adminInfo = JSON.parse(window.sessionStorage.getItem("adminInfo"));
  },
  methods: {
    // 关闭弹窗并刷新页面
    closeDialog(submitFlag) {
      this.addDialogVisible = false;
      this.addPersonInfo = false;
      if (submitFlag) {
        // 代表修改成功 则需要重新登录
        this.logout("请重新登录！");
      }
    },
    // 头部工作台导航菜单
    handleSelect(key, keyPath) {
      if (key == 1) {
        // 1代表修改信息
        this.addDialogVisible = true;
      } else if (key == 2) {
        // 2代表退出登录
        this.logout();
      } else if (key == 3) {
        // 3代表补充信息
        this.addPersonInfo = true;
      }
    },
    // 保存当前点击的菜单
    saveActiveMenu(menuPath) {
      // 将打开的菜单index存入缓存中，使页面刷新仍然保持高亮
      window.sessionStorage.setItem("activeMenu", menuPath);
    },
    // 退出功能
    logout(msg) {
      // 清空缓存
      window.sessionStorage.clear();
      // 跳转到登录页
      this.$message.warning(msg ? msg : "已安全退出！");
      setTimeout(() => {
        this.$message.closeAll();
        this.$router.push("/login");
      }, 1000);
    },
    async getMenuListInfo() {
      let menuListStorage = window.sessionStorage.getItem("menuList");
      if (!menuListStorage) {
        // 查询菜单
        // 取出缓存的用户数据
        let adminInfoJsonStr = window.sessionStorage.getItem("adminInfo");
        let adminInfo = JSON.parse(adminInfoJsonStr);
        // 调用查询菜单信息
        let { data: res } = await this.$request.get(
          `/system/roleMenu/getMenuInfoByRoleId/${adminInfo.roleId}`
        );
        if (res.code == 1) {
          this.menuList = res.data;
          window.sessionStorage.setItem(
            "menuListStorage",
            JSON.stringify(res.data)
          );
        }
      } else {
        this.menuList = JSON.parse(menuListStorage);
      }
      // 将需要高亮的菜单赋值
      if (window.sessionStorage.getItem("activeMenu")) {
        this.activeMenu = window.sessionStorage.getItem("activeMenu");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.home-content {
  height: 100%;
}

.el-header {
  background-color: #333744;
  display: flex;
  justify-content: space-between;
  padding-left: 15px;
  align-items: center;
  color: #fff;
  font-family: "微软雅黑";

  > div {
    font-size: 20px;
    display: flex;
    align-items: center;

    > span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}
</style>
