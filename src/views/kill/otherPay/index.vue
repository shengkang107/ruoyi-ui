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
      <el-form-item label="支付状态" prop="payState">
        <el-select v-model="queryParams.payState" placeholder="请选择支付状态" clearable size="small">
          <el-option
            v-for="dict in payStatusOptions"
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

    <el-table v-loading="loading" :data="otherPayList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="预约单号" align="center" prop="orderNumber"/>
      <el-table-column label="箱柜号" align="center" prop="cabinetNumber" width="120"/>
      <el-table-column label="名称" align="center" prop="title"/>
      <el-table-column label="单价（元）" align="center" prop="itemPrice"/>
      <el-table-column label="数量" align="center" prop="itemCount"/>
      <el-table-column label="总价（元）" align="center" prop="itemTotal"/>
      <el-table-column label="支付状态" align="center" prop="payState" :formatter="payStatusFormat"/>
      <el-table-column label="实际支付金额（元）" align="center" prop="payAmount"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" v-if="checkRole(['admin','cashier','order','manage'])">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-thumb"
            v-if="checkRole(['admin','cashier','manage'])"
            @click="toOpen(scope.row)"
          >审核
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="checkRole(['order'])"
            @click="toOpen(scope.row)"
          >修改
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
    <el-dialog title="附加费用" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <div class="form-msg">
          <span>预约单号：{{form.orderNumber}}</span>
          <span>名称：{{form.title}}</span>
          <span>单价：￥{{form.itemPrice}}</span>
        </div>
        <el-form-item label="数量" prop="itemCount">
          <el-input
            v-model="form.itemCount"
            show-word-limit
            placeholder="请输入数量"
          ></el-input>
        </el-form-item>
        <el-form-item label="总价格">
          ￥{{form.itemTotal = form.itemPrice * form.itemCount}}
        </el-form-item>
        <el-form-item label="支付状态" v-if="checkRole(['admin','cashier','manage'])">
          <el-radio-group v-model="form.payState">
            <el-radio :label="1">已支付</el-radio>
            <el-radio :label="0">待支付</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="实际支付金额" prop="payAmount" v-if="checkRole(['admin','cashier','manage'])">
          <el-input
            v-model="form.payAmount"
            show-word-limit
            placeholder="请输入实际支付金额"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open=false">取 消</el-button>
        <el-button type="success" @click="formSub">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { otherPricePage, editOtherPrice } from '@/api/system/recordKill'
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
        payState: null
      },
      // 支付状态字典
      payStatusOptions: [],
      otherPayList: [],
      open: false,
      form: {},
      //表单校验
      rules: {
        itemCount: [{
          pattern: /^[0-9]+(.[0-9]{1,3})?$/,
          message: '数量只能是数字',
          trigger: 'blur'
        }],
        payAmount: [{
          pattern: /^[0-9]+(.[0-9]{1,3})?$/,
          message: '金额格式不正确',
          trigger: 'blur'
        }],
      }
    }
  },
  created() {
    this.getDicts('pay_status').then(response => {
      this.payStatusOptions = response.data
    })
    this.getList();
  },
  methods: {
    checkRole,
    /** 查询列表 */
    getList() {
      this.loading = true
      otherPricePage(this.addDateRange(this.queryParams)).then(response => {
        this.otherPayList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    toOpen(row) {
      this.open = true;
      this.form = row;
    },
    formSub() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        editOtherPrice(this.form).then(response => {
          this.getList();
          this.msgSuccess('操作成功');
          this.open = false;
          this.resetForm();
        })
      });
    },
    // 支付状态字典翻译
    payStatusFormat(row, column) {
      return this.selectDictLabel(this.payStatusOptions, row.payState)
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
<style lang="scss" scoped>
.form-msg {
  margin-bottom: 30px;
  margin-left: 111px;
  span {
    padding-right: 20px;
    margin-right: 20px;
    border-right: 1px solid #ECECEC;
    &:last-child {
      border-right: none;
    }
  }
}
</style>