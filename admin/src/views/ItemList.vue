<template>
  <div class="app">
    <h2>物品列表</h2>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="230"></el-table-column>
      <el-table-column prop="name" label="物品名称"></el-table-column>
      <el-table-column prop="icon" label="图标">
      <template slot-scope="scope">
        <img :src="baseurl + scope.row.icon" alt="" style="height:4rem;">
      </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="$router.push(`/items/edit/${scope.row._id}`)"
          >编辑</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ItemList",
  props: [""],
  data() {
    return {
      items: []
    };
  },
  components: {},
  computed: {},
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/items");
      this.items = res.data;
    },
    async remove(row) {
      this.$confirm(`'是否确认要删除分类"${row.name}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.delete(`rest/items/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        // 重新获取数据，更新页面
        this.fetch();
      });
    }
  },
  created() {
    this.fetch();
  }
};
</script>

<style scoped>
</style>