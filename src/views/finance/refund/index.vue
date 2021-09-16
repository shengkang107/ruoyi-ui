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
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="refundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!-- <el-table-column label="退款单号" align="center" prop="id" width="130"/> -->
      <el-table-column label="预约单号" align="center" prop="orderNumber" width="120"/>
      <el-table-column label="交易流水号" align="center" prop="tradeNo"  width="150"/>
      <el-table-column label="业务单号" align="center" prop="outTradeNo" width="150"/>
      <el-table-column label="订单金额" align="center" prop="orderAmount"/>
      <el-table-column label="申请退款金额" align="center" prop="refundAmount"/>
      <el-table-column label="实际退款金额" align="center" prop="actualAmount"/>
      <el-table-column label="支付方式" align="center" prop="payMethod" :formatter="payMethodFormat"/>
      <el-table-column label="退款状态" align="center" prop="result" width="120" :formatter="refundStatusFormat"/>
      <el-table-column label="审核备注" align="center" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.orderRemark">单证：{{ scope.row.orderRemark }}</div>
          <div v-if="scope.row.financeRemark">财务：{{ scope.row.financeRemark }}</div>
        </template>
      </el-table-column>
      <el-table-column label="退款申请时间" align="center" prop="createTime" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | sucTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款理由" align="center" prop="refundReason" width="150"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-thumb"
            @click="toSumbit(scope.row)"
            v-if="scope.row.result == '0' && checkRole(['orderManage']) || scope.row.result == '1' && checkRole(['finance'])"
          >审核
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-wallet"
            @click="sendRefund(scope.row)"
            v-if="scope.row.result == '3' && checkRole(['finance'])"
          >放款
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
    <!-- 退款审核 -->
    <el-dialog title="退款审核" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="checkRow" label-width="80px">
        <el-form-item label="订单编号">
          <span>{{checkRow.orderNumber}}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="remark"
            placeholder="请输入审核备注"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="verifySub('no')">拒 绝</el-button>
        <el-button type="success" @click="verifySub('yes')">通 过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { refundList, verifyRefund, verifyRefundzfb } from '@/api/system/finance'
import {checkRole} from '@/utils/permission' // 权限判断函数

export default {
  name: 'refund',
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
      // 退款状态字典
      refundStatusOptions: [],
      // 支付方式字典
      payMethodOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: null
      },
      refundList: [],
      open: false,
      remark: "",
      checkRow: {}
    }
  },
  created() {
    this.getDicts('refund_status').then(response => {
      this.refundStatusOptions = response.data
    })
    this.getDicts('pay_method').then(response => {
      this.payMethodOptions = response.data
    })
    this.getList();
  },
  methods: {
    checkRole,
    /** 查询消杀预约列表 */
    getList() {
      this.loading = true
      refundList(this.addDateRange(this.queryParams)).then(response => {
        this.refundList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 退款状态字典翻译
    refundStatusFormat(row, column) {
      return this.selectDictLabel(this.refundStatusOptions, row.result)
    },
    // 支付方式字典翻译
    payMethodFormat(row, column) {
      if (row.payMethod) {
        return this.selectDictLabel(this.payMethodOptions, row.payMethod)
      }
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
    toSumbit(row) {
      this.remark = "";
      this.checkRow = {};
      this.open = true;
      this.checkRow = row;
    },
    //退款审核提交
    verifySub(type) {
      //0=等待单证审核,1=单证审核通过,2=单证驳回,3=财务审核通过,4=财务驳回,5=已退款
      if (this.checkRow.result == '0' && checkRole(['order'])) {
        //单证
        this.checkRow.orderRemark = this.remark;
        this.checkRow.result = (type == 'yes' ? 1 : 2);
      } else {
        //财务
        this.checkRow.financeRemark = this.remark;
        this.checkRow.result = (type == 'yes' ? 3 : 4);
      }
      this.checkRow.payState = (type == 'yes' ? 5 : 6); //支付状态-5退款中，6退款被驳回
      verifyRefund(this.checkRow).then(response => {
        if (response.code === 200) {
          this.remark = "";
          this.checkRow = {};
          this.msgSuccess('操作成功');
          this.open = false;
          this.getList();
        }
      })
    },
    //放款操作
    sendRefund(row) {
      if (row.payMethod == '3') {
        //其他
        this.$prompt('请输入实际退款金额', '预约单号：'+ row.orderNumber +'', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]+(.[0-9]{1,3})?$/,
          inputErrorMessage: '金额格式不正确'
        }).then(({ value }) => {
          row.result = 5;
          row.actualAmount = value;
          row.payState = 7; //支付状态-退款成功
          verifyRefund(row).then(response => {
            if (response.code === 200) {
              this.msgSuccess('操作成功');
              this.getList();
            }
          })
        }).catch(() => {

        });
      } else if (row.payMethod == '1' || row.payMethod == '2') {
        //支付宝、微信
        this.$prompt('请输入退款备注', '预约单号：'+ row.orderNumber +'', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          let info = {
            orderNumber: row.orderNumber,
            remark: value,
            payState: 7 //支付状态-退款成功
          }
          verifyRefundzfb(info).then(response => {
            if (response.code === 200) {
              this.msgSuccess('操作成功');
              this.getList();
            }
          })
        }).catch(() => {

        });
      }
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
  },
  filters: {
    sucTime(val) {
      if (val) {
        var str = val.slice(0,16);
        return str;
      }
    }
  }
}
</script>
