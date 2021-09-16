<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="100px">
      <el-form-item label="预约单号" prop="businessNo">
        <el-input
          v-model="queryParams.businessNo"
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
      <el-form-item label="支付方式" prop="payMethod">
        <el-select v-model="queryParams.payMethod" placeholder="请选择支付方式" clearable size="small">
          <el-option
            v-for="dict in payMethodOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
      <el-form-item label="支付时间" prop="successTimeFind">
        <el-date-picker
          clearable
          size="small"
          style="width: 187px"
          v-model="queryParams.successTimeFind"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择支付时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="预约单号" align="center" prop="businessNo" width="120"/>
      <el-table-column label="箱柜号" align="center" prop="cabinetNumber" width="130"/>
      <!-- <el-table-column label="审核状态" align="center" prop="status" :formatter="statusFormat"/> -->
      <el-table-column label="订单金额" align="center" prop="orderPrice"/>
      <el-table-column label="支付方式" align="center" prop="payMethod" :formatter="payMethodFormat"/>
      <el-table-column label="支付状态" align="center" prop="payState" :formatter="payStatusFormat"/>
      <el-table-column label="支付金额" align="center" prop="payPrice"/>
      <el-table-column label="优惠金额" align="center" prop="discount"/>
      <el-table-column label="凭证号" align="center" prop="voucherNumber"  width="150"/>
      <el-table-column label="交易流水号" align="center" prop="tradeNo"  width="150"/>
      <el-table-column label="支付成功时间" align="center" prop="successTime" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.successTime | sucTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-thumb"
            @click="toOpen(scope.row)"
            v-if="scope.row.payMethod == '3' && checkRole(['cashier','admin'])"
          >审核
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
            v-if="scope.row.payMethod == '3' && scope.row.payCertifyUrl"
          >下载凭证
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
    <!-- 审核信息 -->
    <el-dialog :title="'预约单号：' + verifyForm.businessNo" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="verifyForm" :rules="rules" label-width="110px">
        <el-form-item label="凭证">
          <el-image
            style="width: 100px; height: 100px"
            v-if="verifyForm.payCertifyUrl"
            :src="verifyForm.payCertifyUrl"
            :preview-src-list="[verifyForm.payCertifyUrl]">
          </el-image>
          <el-upload
            class="upload-url"
            :headers="upload.headers"
            :action="upload.url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <span class="font12" style="margin-left: 15px;color:#20B32E;">{{ verifyForm.payCertifyUrl ? "修改" : "上传"}}凭证</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="订单金额">
          ￥{{verifyForm.payPrice > verifyForm.orderPrice ? verifyForm.payPrice : verifyForm.orderPrice}}
        </el-form-item>
        <el-form-item label="支付状态" prop="payState">
          <el-radio-group v-model="verifyForm.payState">
            <el-radio :label="0">待支付</el-radio>
            <el-radio :label="1">已支付</el-radio>
            <el-radio :label="3">等待财务审核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="凭证号" prop="voucherNumber">
          <el-input
            v-model="verifyForm.voucherNumber"
            show-word-limit
            placeholder="请输入凭证号"
          ></el-input>
        </el-form-item>
        <el-form-item label="交易流水号" prop="tradeNo">
          <el-input
            v-model="verifyForm.tradeNo"
            show-word-limit
            placeholder="请输入交易流水号"
          ></el-input>
        </el-form-item>
        <el-form-item label="实际支付金额" prop="payPrice">
          <el-input
            v-model="verifyForm.payPrice"
            show-word-limit
            placeholder="请输入实际支付金额"
          ></el-input>
          <!-- 优惠金额：实际支付金额小于订单金额 -->
          <div class="font12 amount-tips" v-show="verifyForm.payPrice && verifyForm.payPrice < verifyForm.orderPrice">
            优惠金额（元）：<span style="color: #FF5600;">￥{{verifyForm.discount = parseFloat(verifyForm.orderPrice) - parseFloat(verifyForm.payPrice)}}</span>
          </div>
          <!-- 提示 -->
          <div class="font12 amount-tips" v-show="verifyForm.payPrice > verifyForm.orderPrice">
            <i class="el-icon-question"></i> 因实际支付金额大于订单金额，故订单金额为<span style="color: #FF5600;">￥{{ verifyForm.payPrice }}</span>
          </div>
        </el-form-item>
        <el-form-item label="是否高风险" prop="isDanger">
          <el-radio v-model="verifyForm.isDanger" :label="1">是</el-radio>
          <el-radio v-model="verifyForm.isDanger" :label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open=false">取 消</el-button>
        <el-button type="success" @click="verifySub">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { orderList, payOrder, orderDetail } from '@/api/system/finance'
import {checkRole} from '@/utils/permission' // 权限判断函数
import { getToken } from "@/utils/auth";

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
      // 支付状态字典
      payStatusOptions: [],
      // 支付方式字典
      payMethodOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        businessNo: null,
        payMethod: null,
        payState: null,
        cabinetNumber: null,
        successTimeFind: null
      },
      orderList: [],
      open: false,
      verifyForm: {},
      rules: {
        voucherNumber: [{
          required: true,
          message: '请输入凭证号',
          trigger: 'blur'
        }],
        payPrice: [{
          required: true,
          message: '请输入实际支付金额',
          trigger: 'blur'
        }],
        isDanger: [{
          required: true,
          message: '请选择是否高风险',
          trigger: 'change'
        }]
      },
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/oss/oss/uploadFile"
      },
    }
  },
  created() {
    this.getDicts('pay_status').then(response => {
      this.payStatusOptions = response.data
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
      orderList(this.addDateRange(this.queryParams)).then(response => {
        this.orderList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 支付状态字典翻译
    payStatusFormat(row, column) {
      return this.selectDictLabel(this.payStatusOptions, row.payState)
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
    beforeAvatarUpload() {},
    handleAvatarSuccess(response, file, fileList) {
      this.verifyForm.payCertifyUrl = response.data.url;
    },
    //审核操作
    verifySub(row) {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        //实际支付金额大于订单金额
        if (this.verifyForm.payPrice > this.verifyForm.orderPrice) {
          this.verifyForm.orderPrice = this.verifyForm.payPrice;
          this.verifyForm.discount = 0;
        }
        payOrder(this.verifyForm).then(response => {
          this.getList();
          this.msgSuccess('操作成功');
          this.open = false;
          this.resetForm();
        })
      });
    },
    toOpen(row) {
      orderDetail(row.id).then(response => {
        this.open = true;
        this.verifyForm = response.data;
      })
    },
    handleDownload(row) {
      //下载凭证
      var tempwindow = window.open('_blank');
      tempwindow.location = row.payCertifyUrl;
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
        var str = val.slice(0,10) + "  " + val.slice(11,19);
        return str;
      }
    }
  }
}
</script>
<style lang="scss">
.amount-tips {
  line-height: 20px;
}
</style>