<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="100px">
      <el-form-item label="预约单号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入预约单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="箱柜号">
        <el-input
          v-model="queryParams.cabinetNumber"
          placeholder="请输入箱柜号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="人员类型" prop="personType">
        <el-select v-model="queryParams.personType" placeholder="请选择人员类型" clearable size="small">
          <el-option
            v-for="dict in personTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-has-role="['manage','boss']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" row-key="id" :tree-props="{children: 'crossTaskPersonList', hasChildren: 'hasChildren'}">
      <el-table-column label="预约单号" align="center" prop="orderNumber"/>
      <el-table-column label="箱柜号" align="center" prop="cabinetNumber" width="125"/>
      <el-table-column label="车牌号" align="center" prop="carNumber"/>
      <el-table-column label="靠口时间" align="center" prop="inDate">
        <template slot-scope="scope">
          {{scope.row.inDate | inDate}}
        </template>
      </el-table-column>
      <el-table-column label="人员类型" align="center" prop="personType" :formatter="personTypeFormat"/>
      <el-table-column label="姓名" align="center" prop="personName"/>
      <el-table-column label="所属公司" align="center" prop="personCompany"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { crossTaskList } from '@/api/system/warehouse';
import {checkRole} from '@/utils/permission' // 权限判断函数

export default {
  name: 'Kill',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      //总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: null,
        cabinetNumber: null,
        personType: null
      },
      // 人员类型字典
      personTypeOptions: [],
      list: []
    }
  },
  created() {
    //人员类型
    this.getDicts('person_type').then(response => {
      this.personTypeOptions = response.data;
    })
    this.getList();
  },
  methods: {
    checkRole,
    /** 查询列表 */
    getList() {
      this.loading = true
      crossTaskList(this.queryParams).then(response => {
        this.list = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 人员类型字典翻译
    personTypeFormat(row, column) {
      return this.selectDictLabel(this.personTypeOptions, row.personType)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    resetForm() {
      this.$refs["queryForm"].resetFields();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/crossTaskPerson/export', {
        ...this.queryParams
      }, `道口任务.xlsx`)
    }
  },
  filters: {
    inDate(val) {
      if (val) {
        return val.slice(0,10) + "  " + val.slice(11,19);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>