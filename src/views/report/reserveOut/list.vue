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

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column label="预约单号" align="center" prop="orderNumber"/>
      <el-table-column label="预约出库日期" align="center" prop="reservationDate"/>
      <el-table-column label="时段" align="center" prop="orderPrice" :formatter="timeFormat"/>
      <el-table-column label="车牌号" align="center" prop="carNumber"/>
      <el-table-column label="司机姓名" align="center" prop="driverName"/>
      <el-table-column label="司机电话" align="center" prop="driverPhone"/>
      <el-table-column label="状态" align="center" prop="reservationState" :formatter="reservationStateFormat"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="创建时间" align="center" prop="successTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | sucTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="toOpen(scope.row)"
          >
            查看详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handelEdit(scope.row)"
            v-if="(scope.row.reservationState == 0 || scope.row.reservationState == 1) && checkRole(['admin','common','order','manage'])"
          >
          {{scope.row.reservationState == 0 ? '重新提交' : '编辑'}}
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleStatus(scope.row)"
            v-if="checkRole(['admin','order','manage']) && scope.row.reservationState == 3"
          >靠口
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleEndCheckWindows(scope.row)"
            v-if="checkRole(['admin','order','manage']) && scope.row.reservationState == 5"
          >放行
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

    <el-dialog :title="'出库单号：' + openDetail.orderNumber" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="elForm" label-width="140px">
        <div class="reserveOut-detail">
          <div class="t-tips" style="margin-top: 20px;">基本预约信息</div>
          <el-form-item label="出库日期：">
            {{ openDetail.reservationDate }}
          </el-form-item>
          <el-form-item label="出库时段：">
            {{ openDetail.reservationTime }}
          </el-form-item>
          <el-form-item label="车牌号：">
            {{ openDetail.carNumber }}
          </el-form-item>
          <el-form-item label="司机姓名：">
            {{ openDetail.driverName }}
          </el-form-item>
          <el-form-item label="司机身份证号：">
            {{ openDetail.driverIdCard }}
          </el-form-item>
          <el-form-item label="司机电话：">
            {{ openDetail.driverPhone }}
          </el-form-item>
          <el-form-item label="押车：" prop="mortgageCar">
            {{ openDetail.mortgageCar == '1' ? '是' : '否' }}
          </el-form-item>
          <div class="t-tips">货主企业信息</div>
          <el-form-item label="企业名称：">
            {{ openDetail.masterEnterpriseName }}
          </el-form-item>
          <el-form-item label="统一社会信用代码：">
            {{ openDetail.masterEnterpriseId }}
          </el-form-item>
          <el-form-item label="联系方式：">
            {{ openDetail.masterContactsPhone }}
          </el-form-item>
          <div class="t-tips">收货企业信息</div>
          <el-form-item label="企业名称：">
            {{ openDetail.receiveEnterpriseName }}
          </el-form-item>
          <el-form-item label="统一社会信用代码：">
            {{ openDetail.receiveEnterpriseId }}
          </el-form-item>
          <el-form-item label="地址：">
            {{ openDetail.receiveEnterpriseAddress }}
          </el-form-item>
          <el-form-item label="联系人：">
            {{ openDetail.receiveContactsName }}
          </el-form-item>
          <el-form-item label="联系电话：">
            {{ openDetail.receiveContactsPhone }}
          </el-form-item>
          <div class="t-tips">收货冷库/目的地信息</div>
          <el-form-item label="名称：">
            {{ openDetail.receiveWarehouse }}
          </el-form-item>
          <el-form-item label="统一社会信用代码：">
            {{ openDetail.receiveWarehouseId }}
          </el-form-item>
          <el-form-item label="地址：">
            {{ openDetail.receiveWarehouseAddress }}
          </el-form-item>
          <el-form-item label="联系人：">
            {{ openDetail.receiveWarehouseContactsName }}
          </el-form-item>
          <el-form-item label="联系电话：">
            {{ openDetail.receiveWarehouseContactsPhone }}
          </el-form-item>
          <div class="t-tips">商品信息</div>
          <div class="goods-list">
            <div class="goods-title">
              <div class="g-td"> 序号 </div>
              <div class="g-td"> 预约消杀单号 </div>
              <div class="g-td"> 箱柜号 </div>
              <div class="g-td"> 商品名称 </div>
              <div class="g-td"> 出库数量（件） </div>
              <div class="g-td"> 重量（kg） </div>
              <div class="g-td"> 批次号 </div>
              <div class="g-td"> 备注 </div>
            </div>
            <!-- 列表 -->
            <div class="goods-child" v-for="(item,index) in openDetail.outWarehouseProducts" :key="index">
              <div class="g-td"> {{index + 1}} </div>
              <div class="g-td"> {{item.orderNumber}} </div>
              <div class="g-td"> {{item.cabinetNumber}} </div>
              <div class="g-td"> {{item.productName}} </div>
              <div class="g-td"> {{item.outAmount}} </div>
              <div class="g-td"> {{item.weight}} </div>
              <div class="g-td"> {{item.batchNumber}} </div>
              <div class="g-td"> {{item.remark}} </div>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <span v-if="checkRole(['admin','order','manage']) && openDetail.reservationState == 1">
          <el-button type="danger" @click="auditTask(0)">驳  回</el-button>
          <el-button type="success" @click="auditTask(2)">通  过</el-button> 
        </span>
        <el-button class="ml0" @click="open = false">关  闭</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="出库预约编辑" :visible.sync="openEdit" width="90%" append-to-body>
      <reserve-out v-if="reserveid" @cancel="editCancel" :reserveid="reserveid"></reserve-out>
    </el-dialog>

    <!--已靠口，靠口-->
    <el-dialog title="靠口" :visible.sync="openStatus" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rulesStatus" label-width="124px">
        <el-form-item label="道口" prop="crossNumber">
          <div class="block">
            <span class="demonstration"></span>
            <el-cascader
              v-if="crossNumberSearch"
              v-model="form.crossNumber"
              :options="crossNumberSearch"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="靠口时间" prop="inDate">
          <el-date-picker 
            clearable 
            size="small" 
            style="width: 200px"
            v-model="form.inDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择靠口时间"
            :picker-options="pickerOptions2"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitFormStatus">确 定</el-button>
        <el-button @click="openStatus = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 放行 -->
    <el-dialog title="放行" :visible.sync="checkOpen" width="500px" append-to-body>
      <el-form ref="checkForm" :model="checkForm" :rules="rulesEndCheck" label-width="80px">
        <el-form-item label="出园时间" prop="outDate">
          <el-date-picker
            clearable size="small"
            style="width: 200px"
            v-model="checkForm.outDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择出园时间"
            :picker-options="pickerOptions2"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitFormKillStatus4">确 定</el-button>
        <el-button @click="checkOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reserveOutList, reserveOutAudit, outPass } from "@/api/system/out";
import { WarehouseAndCross, outArrangement } from '@/api/system/warehouse';
import {checkRole} from '@/utils/permission' // 权限判断函数
import reserveOut from "@/views/report/reserveOut/index";

export default {
  name: 'Kill',
  components: {
    reserveOut
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //时段字典
      timeOptions: [],
      //状态字典
      reservationStateOptions: [],
      // 显示搜索条件
      showSearch: true,
      //总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: null
      },
      list: [],
      open: false,
      openDetail: {},
      openEdit: false,
      reserveid: "",
      openStatus: false,
      form: {},
      crossNumberSearch: [],
      rulesStatus: {
        crossNumber: [{
          required: true,
          message: '请输入道口',
          trigger: 'blur'
        }],
        inDate: [{
          required: true,
          message: '请选择靠口时间',
          trigger: 'blur'
        }],
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() + 24 * 60 * 60 * 1000 < Date.now()
        }
      },
      checkOpen: false,
      checkForm: {},
      rulesEndCheck: {
        outDate: [{
          required: true,
          message: '请输入出园时间',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getDicts('reservation_time').then(response => {
      this.timeOptions = response.data
    })
    this.getDicts('reserve_out_state').then(response => {
      this.reservationStateOptions = response.data
    })
    this.getList();
  },
  methods: {
    checkRole,
    /** 查询消杀预约列表 */
    getList() {
      this.loading = true
      reserveOutList(this.queryParams).then(response => {
        this.list = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    auditTask(type) {
      //审核 0-驳回、2-通过 即 待入园
      this.$prompt('备注：', (type == 0 ? '驳回' : '通过') + '出库预约', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.openDetail.reservationState = type;
        this.openDetail.remark = value; //备注
        reserveOutAudit(this.openDetail).then(response => {
          if (response.code === 200) {
            this.msgSuccess('操作成功');
            this.getList();
            this.open = false;
          }
        })
      }).catch(() => {})
    },
    getWarehouseAndCross(orderNumber) {
      //道口-新版-靠口用
      this.crossNumberSearch = [];
      var str = {
        orderNumber: orderNumber,
        taskType: '2' //1-消杀，2-出库，3-入库
      }
      WarehouseAndCross(str).then((response) => {
        if (response.rows.length > 0) {
          response.rows.map(item => {
            const children = [];
            if (item.crossManageList.length > 0) {
              item.crossManageList.map(cross => {
                children.push({ label: cross.crossName, value: cross.id});
              })
            }
            this.crossNumberSearch.push({ label: item.warehouseName, value: item.id, children: children });
          })
        }
      })
    },
    handleStatus(row) {
      //靠口
      this.getWarehouseAndCross(row.orderNumber); //确保拿到最新道口
      this.form = row; //赋值
      this.openStatus = true;
    },
    /** 等待靠口 */
    submitFormStatus() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.orderStatus = 2
            if (this.form.crossNumber != null && Array.isArray(this.form.crossNumber)) {
              this.form.crossNumber = this.form.crossNumber.join(',')
            }
            outArrangement(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('操作成功');
                this.$refs['form'].resetFields();
                this.openStatus = false;
                this.getList();
              }
            })
          }
        }
      })
    },
    //放行
    handleEndCheckWindows(row) {
      this.checkOpen = true;
      this.checkForm = row;
    },
    //放行操作
    submitFormKillStatus4() {
      this.$refs['checkForm'].validate(valid => {
        if (valid) {
          outPass(this.checkForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess('操作成功');
              this.checkOpen = false;
              this.$refs['checkForm'].resetFields();
              this.getList()
            }
          })
        }
      })
    },
    toOpen(item) {
      //查看详情
      this.openDetail = item; //赋值
      this.open = true;
    },
    handelEdit(item) {
      //去编辑
      this.reserveid = item.id;
      this.openEdit = true;
    },
    editCancel() {
      //编辑之后回传
      this.reserveid = null;
      this.openEdit = false;
      this.getList();
    },
    // 时间字典翻译
    timeFormat(row, column) {
      return this.selectDictLabel(this.timeOptions, row.reservationTime)
    },
    //状态字典翻译
    reservationStateFormat(row, column) {
      return this.selectDictLabel(this.reservationStateOptions, row.reservationState)
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
    resetForm() {
      this.$refs["queryForm"].resetFields();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
@import "~@/assets/styles/index.scss";
.amount-tips {
  line-height: 20px;
}
.reserveOut-detail {
  width: 100%;
  background: #fff;
  padding-right: 20px;
  box-sizing: border-box;
  display: inline-block;
  .t-tips {
    color: #333;
    border-left: 2px solid #{$themeGreen};
    padding-left: 10px;
    font-weight: bold;
    margin: 30px 0 20px;
  }
  .el-form-item--medium {
    padding-left: 20px;
    min-width: 33.333%;
    display: inline-block;
    margin-bottom: 0;
    .el-form-item__label,
    label {
      font-weight: normal;
    }
  }
  .goods-list {
    margin-left: 20px;
    margin-bottom: 30px;
    border: 1px solid #F1F1F1;
    .goods-title,
    .goods-child {
      @include display-flex;
      height: 54px;
      line-height: 54px;
      .g-td {
        @include flex(1);
        padding-left: 15px;
        border-right: 1px solid #F1F1F1;
        &:last-child {
          border-right: 0px;
        }
      }
    }
    .goods-title {
      background: #F7F8FA;
    }
    .goods-child {
      border-top: 1px solid #F1F1F1;
      .g-td {
        span {
          color: #{$themeGreen};
          cursor: pointer;
        }
      }
    }
  }
}
</style>