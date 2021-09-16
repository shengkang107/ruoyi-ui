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
      <el-form-item label="箱柜号" prop="cabinetNumber">
        <el-input
          v-model="queryParams.cabinetNumber"
          placeholder="请输入箱柜号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="carNumber">
        <el-input
          v-model="queryParams.carNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="otherPayList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="预约单号" align="center" prop="orderNumber" width="130"/>
      <el-table-column label="箱柜号" align="center" prop="cabinetNumber" width="120"/>
      <el-table-column label="单证审核状态" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="预约日期" align="center" prop="date" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="time" :formatter="timeFormat"/>
      <el-table-column label="车牌号" align="center" prop="carNumber"/>
      <el-table-column label="是否高风险" align="center" prop="isDanger" width="100" :formatter="isDangerFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-truck"
            v-if="scope.row.status == '1'"
            @click="toOpen(scope.row)"
          >入园
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 入园 -->
    <el-dialog title="车辆入园" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="5px">
        <el-form-item>
          预约单号：{{form.orderNumber}}
        </el-form-item>
        <el-form-item prop="carMsg">
          <el-radio v-model="form.carMsg" label="1">已核对行车证信息无误</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="success" @click="toOpenSumbit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { janitorPage, janitorPass } from '@/api/system/janitor'
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
        carNumber: null
      },
      isDangerOptions: [],
      timeOptions: [],
      statusOptions: [],
      otherPayList: [],
      //表单校验
      rules: {
        carPhone: [ {
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        carMsg: [{
          required: true,
          message: "是否已核对行车证信息无误",
          trigger: "change"
        }]
      },
      open: false,
      form: {
        carMsg: null
      }
    }
  },
  created() {
    this.getDictsList();
    this.getList();
  },
  methods: {
    checkRole,
    // 字典列表
    getDictsList() {
      this.getDicts('kill_danger').then(response => {
        this.isDangerOptions = response.data
      });
      this.getDicts('reservation_time').then(response => {
        this.timeOptions = response.data
      });
      this.getDicts('reservation_status').then(response => {
        this.statusOptions = response.data
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      janitorPage(this.addDateRange(this.queryParams)).then(response => {
        this.otherPayList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },
    toOpen(row) {
      //操作
      this.form = row;
      this.open = true;
    },
    toOpenSumbit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          janitorPass(this.form.orderNumber).then(response => {
            if (response.code === 200) {
              this.msgSuccess('操作成功');
              this.open = false;
              this.getList()
            }
          })
        }
      })
    },
    // 是否高风险
    isDangerFormat(row, column) {
      return this.selectDictLabel(this.isDangerOptions, row.isDanger)
    },
    // 时间字典翻译
    timeFormat(row, column) {
      return this.selectDictLabel(this.timeOptions, row.time)
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
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
  }
}
</script>