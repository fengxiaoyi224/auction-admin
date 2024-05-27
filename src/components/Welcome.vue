<template>
  <div style="display: flex; padding: 110px">
    <div>
      <div id="chart" style="width: 600px; height: 400px"></div>
    </div>
    <div>
      <div id="main1" style="width: 500px; height: 350px"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      barData: [],
      pieTitle: [],
      pieData: [],
    };
  },
  mounted() {
    this.getEchartData();
    this.getmain2();
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 8) {
        if (columnIndex === 0) {
          return [0, 2];
        }
      }
    },
    async getEchartData() {
      let { data: res } = await this.$request.get(
        `/system/logistics/getEchartData`
      );

      let data = res.data;
      let result = [];
      if (data.Q1 != null) {
        let obj = { quarter: "第一季度", count: data.Q1 };
        result.push(obj);
      } else {
        let obj = { quarter: "第一季度", count: 0 };
        result.push(obj);
      }
      if (data.Q2 != null) {
        let obj = { quarter: "第二季度", count: data.Q2 };
        result.push(obj);
      } else {
        let obj = { quarter: "第二季度", count: 0 };
        result.push(obj);
      }
      if (data.Q3 != null) {
        let obj = { quarter: "第三季度", count: data.Q3 };
        result.push(obj);
      } else {
        let obj = { quarter: "第三季度", count: 0 };
        result.push(obj);
      }
      if (data.Q4 != null) {
        let obj = { quarter: "第四季度", count: data.Q4 };
        result.push(obj);
      } else {
        let obj = { quarter: "第四季度", count: 0 };
        result.push(obj);
      }
      const datas = result;
      console.log(datas);

      var myChart = echarts.init(document.getElementById("chart"));

      // 配置柱状图
      const option = {
        title: {
          text: "各季度用户注册数量统计",
        },
        xAxis: {
          type: "category",
          data: datas.map((item) => item.quarter),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: datas.map((item) => item.count),
            type: "bar", // 柱状
            label: {
              show: true,
              position: "top",
            },
          },
          {
            data: datas.map((item) => item.count),
            type: "line", // 折线
          },
        ],
      };

      // 使用配置项显示饼图
      myChart.setOption(option);
    },
    async getmain2() {
      //echarts.init(document.getElementById('chart'));
      // 基于准备好的dom，初始化echarts实例
      let { data: res3 } = await this.$request.get(
        `/system/logistics/getEchartPieData`
      );
      let obj = res3.data;
      for (const key in obj) {
        const item = obj[key];
        this.pieTitle.push(item.type_name);
        let dataObject = {};
        dataObject.name = item.type_name;
        dataObject.value = item.num;
        this.pieData.push(dataObject);
      }
      var myChart = echarts.init(document.getElementById("main1"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "拍品类型占比", //主标题
          x: "center", //x轴方向对齐方式
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          bottom: "bottom",
          data: this.pieTitle,
        },
        series: [
          {
            name: "拍品类型",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="less" scoped>

</style>