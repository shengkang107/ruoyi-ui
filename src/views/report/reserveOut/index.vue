<template>
  <div class="views-kill-reservation">
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="135px">
      <div class="reserveOut-content">
        <div class="t-tips" style="margin-top: 20px;">基本预约信息</div>
        <el-form-item label="出库日期" prop="reservationDate">
          <el-date-picker
            v-model="formData.reservationDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :style="{ width: '100%' }"
            placeholder="请选择预约出库日期"
            :picker-options="pickerOptions"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="出库时段" prop="reservationTime">
          <el-select
            v-model="formData.reservationTime"
            placeholder="请选择时间"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="(item, index) in timeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input
            v-model="formData.carNumber"
            placeholder="请输入车牌号"
            :maxlength="18"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="司机姓名" prop="driverName">
          <el-input
            v-model="formData.driverName"
            placeholder="请输入司机姓名"
            maxlength="10"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="司机身份证号" prop="driverIdCard">
          <el-input
            v-model="formData.driverIdCard"
            placeholder="请输入司机身份证号"
            :maxlength="18"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="司机电话" prop="driverPhone">
          <el-input
            v-model="formData.driverPhone"
            placeholder="请输入司机电话"
            :maxlength="11"
            show-word-limit
            clearable
            prefix-icon="el-icon-mobile"
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="押车" prop="mortgageCar">
          <el-radio-group v-model="formData.mortgageCar">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="t-tips">货主企业信息</div>
        <el-form-item label="企业名称" prop="masterEnterpriseName">
          <el-input
            v-model="formData.masterEnterpriseName"
            placeholder="请输入货主企业名称"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="统一社会信用代码"
          prop="masterEnterpriseId"
        >
          <el-input
            v-model="formData.masterEnterpriseId"
            placeholder="请输入货主统一社会信用代码"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="masterContactsPhone">
          <el-input
            v-model="formData.masterContactsPhone"
            placeholder="请输入货主联系方式"
            :maxlength="11"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <div class="t-tips">收货企业信息</div>
        <el-form-item label="企业名称" prop="receiveEnterpriseName">
          <el-input
            v-model="formData.receiveEnterpriseName"
            placeholder="请输入收货企业名称"
            show-word-limit
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="统一社会信用代码"
          prop="receiveEnterpriseId"
        >
          <el-input
            v-model="formData.receiveEnterpriseId"
            placeholder="请输入收货企业统一社会信用代码"
            clearable
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="地址"
          prop="receiveEnterpriseAddress"
        >
          <el-input
            v-model="formData.receiveEnterpriseAddress"
            placeholder="请输入收货企业地址"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="receiveContactsName">
          <el-input
            v-model="formData.receiveContactsName"
            placeholder="请输入收货企业联系人"
            maxlength="10"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="receiveContactsPhone"
        >
          <el-input
            v-model="formData.receiveContactsPhone"
            placeholder="请输入收货企业联系电话"
            :maxlength="11"
            show-word-limit
            clearable
            prefix-icon="el-icon-mobile"
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <div class="t-tips">收货冷库/目的地信息</div>
        <el-form-item label="名称" prop="receiveWarehouse">
          <el-input
            v-model="formData.receiveWarehouse"
            placeholder="请输入收货冷库/目的地名称"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="统一社会信用代码"
          prop="receiveWarehouseId"
        >
          <el-input
            v-model="formData.receiveWarehouseId"
            placeholder="请输入统一社会信用代码"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="地址"
          prop="receiveWarehouseAddress"
        >
          <el-input
            v-model="formData.receiveWarehouseAddress"
            placeholder="请输入地址"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="receiveWarehouseContactsName"
        >
          <el-input
            v-model="formData.receiveWarehouseContactsName"
            placeholder="请输入联系人"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="receiveWarehouseContactsPhone"
        >
          <el-input
            v-model="formData.receiveWarehouseContactsPhone"
            placeholder="请输入联系电话"
            :maxlength="11"
            show-word-limit
            clearable
            prefix-icon="el-icon-mobile"
            :style="{ width: '100%' }"
          ></el-input>
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
            <div class="g-td"> 操作 </div>
          </div>
          <!-- 列表 -->
          <div class="goods-child" v-for="(item,index) in addGoodsList" :key="index">
            <div class="g-td"> {{index + 1}} </div>
            <div class="g-td"> {{item.orderNumber}} </div>
            <div class="g-td"> {{item.cabinetNumber}} </div>
            <div class="g-td"> {{item.productName}} </div>
            <div class="g-td"> {{item.outAmount}} </div>
            <div class="g-td"> {{item.weight}} </div>
            <div class="g-td"> {{item.batchNumber}} </div>
            <div class="g-td"> {{item.remark}} </div>
            <div class="g-td">
              <span class="mr20" @click="editGoods(item, index)">编辑</span>
              <span @click="delGoods(index)" v-if="!reserveid">删除</span>
            </div>
          </div>
          <!-- !reserveid 编辑时不能增加、删除商品 -->
          <!-- 添加商品 -->
          <div class="goods-btn" @click="toAddGoods()" v-if="!reserveid">
            <span class="el-icon-circle-plus-outline"> 添加商品</span>
          </div>
        </div>
        <div class="form-button">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="success" :loading="loading" @click="submitForm">提交</el-button>
        </div>
      </div>
    </el-form>

    <el-dialog title="出库商品" :visible.sync="goodsShow" width="500px" append-to-body>
      <el-form ref="goodsForm" :model="goodsForm" :rules="goodsRules" label-width="120px">
        <el-form-item label="预约消杀单号" prop="orderNumber">
          <el-input
            v-model="goodsForm.orderNumber"
            placeholder="请输入预约消杀单号"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="箱柜号" prop="cabinetNumber">
          <el-input
            v-model="goodsForm.cabinetNumber"
            placeholder="请输入箱柜号"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input
            v-model="goodsForm.productName"
            placeholder="请输入商品名称"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="出库数量（件）" prop="outAmount">
          <el-input
            v-model="goodsForm.outAmount"
            placeholder="请输入出库数量"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="重量（kg）" prop="weight">
          <el-input
            v-model="goodsForm.weight"
            placeholder="请输入重量"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber">
          <el-input
            v-model="goodsForm.batchNumber"
            placeholder="请输入批次号"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="goodsForm.remark"
            placeholder="请输入地址"
            clearable
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsShow = false">取 消</el-button>
        <el-button type="success" @click="submitGoods">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addReserveOut, reserveOutDetail, editReserveOut } from "@/api/system/out";
export default {
  props: ["reserveid"],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      formData: {
        reservationDate: null,
        reservationTime: null,
        carNumber: null,
        driverName: null,
        driverPhone: null,
        driverIdCard: null,
        mortgageCar: null,
        masterEnterpriseName: null,
        masterEnterpriseId: null,
        masterContactsPhone: null,
        masterContactsName: null,
        receiveEnterpriseName: null,
        receiveEnterpriseId: null,
        receiveEnterpriseAddress: null,
        receiveContactsName: null,
        receiveContactsPhone: null,
        receiveWarehouse: null,
        receiveWarehouseId: null,
        receiveWarehouseAddress: null,
        receiveWarehouseContactsName: null,
        receiveWarehouseContactsPhone: null,
      },
      rules: {
        reservationDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        reservationTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        carNumber: [
          {
            required: true,
            message: "请输入车牌号",
            trigger: "blur",
          },
        ],
        driverName: [
          {
            required: true,
            message: "请输入司机姓名",
            trigger: "blur",
          },
        ],
        driverIdCard: [
          {
            required: true,
            message: "请输入司机身份证号",
            trigger: "blur",
          },
          {
            pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "请输入正确的身份证号",
            trigger: "blur",
          },
        ],
        mortgageCar: [
          {
            required: true,
            message: "请选择押车",
            trigger: "change",
          },
        ],
        masterEnterpriseName: [
          {
            required: true,
            message: "请输入货主企业名称",
            trigger: "blur",
          },
        ],
        masterEnterpriseId: [
          {
            required: true,
            message: "请输入货主统一社会信用代码",
            trigger: "blur",
          },
        ],
        masterContactsPhone: [
          {
            required: true,
            message: "请输入货主联系方式",
            trigger: "blur",
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式错误",
            trigger: "change",
          },
        ],
        receiveEnterpriseName: [
          {
            required: true,
            message: "请输入收货企业名称",
            trigger: "blur",
          },
        ],
        receiveEnterpriseId: [
          {
            required: true,
            message: "请输入收货企业统一社会信用代码",
            trigger: "blur",
          },
        ],
        receiveEnterpriseAddress: [
          {
            required: true,
            message: "请输入收货企业地址",
            trigger: "blur",
          },
        ],
        receiveContactsName: [
          {
            required: true,
            message: "请输入收货企业联系人",
            trigger: "blur",
          },
        ],
        receiveContactsPhone: [
          {
            required: true,
            message: "请输入收货企业联系电话",
            trigger: "blur",
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式错误",
            trigger: "change",
          },
        ],
        receiveWarehouse: [
          {
            required: true,
            message: "请输入收货冷库/目的地名称",
            trigger: "blur",
          },
        ],
        receiveWarehouseId: [
          {
            required: true,
            message: "请输入收货冷库/目的地统一社会信用代码",
            trigger: "blur",
          },
        ],
        receiveWarehouseAddress: [
          {
            required: true,
            message: "请输入收货冷库/目的地地址",
            trigger: "blur",
          },
        ],
        receiveWarehouseContactsName: [
          {
            required: true,
            message: "请输入收货冷库/目的地联系人",
            trigger: "blur",
          },
        ],
        receiveWarehouseContactsPhone: [
          {
            required: true,
            message: "请输入收货冷库/目的地联系电话",
            trigger: "blur",
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式错误",
            trigger: "change",
          },
        ],
      },
      timeOptions: [
        {
          label: "上午",
          value: 1,
        },
        {
          label: "下午",
          value: 2,
        },
      ],
      goodsShow: false,
      goodsForm: {},
      goodsRules: {
        cabinetNumber: [
          {
            required: true,
            message: "请输入箱柜号",
            trigger: "blur",
          },
        ],
        productName: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        outAmount: [
          {
            required: true,
            message: "请输入出库数量",
            trigger: "blur",
          },
          {
            pattern: /^\d+$/,
            message: '出库数量只能是整数',
            trigger: 'blur'
          }
        ],
        weight: [
          {
            required: true,
            message: "请输入重量",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]+(.[0-9]{1,3})?$/,
            message: '请输入正确的重量',
            trigger: 'blur'
          }
        ],
        batchNumber: [
          {
            required: true,
            message: "请输入批次号",
            trigger: "blur",
          },
        ]
      },
      loading: false,
      goodsType: "add",
      addGoodsList: []
    };
  },
  mounted() {
    if (this.reserveid) {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      //查询详情
      reserveOutDetail(this.reserveid).then((response) => {
        if (response.code == 200) {
          this.formData = response.data;
          this.addGoodsList = response.data.outWarehouseProducts;
        }
      });
    },
    toAddGoods() {
      this.goodsType = 'add';
      this.goodsShow = true;
      this.goodsForm = {
        batchNumber: "",
        cabinetNumber: "",
        outAmount: "",
        orderNumber: "",
        productName: "",
        remark: "",
        weight: ""
      }
    },
    editGoods(item, index) {
      //编辑商品
      this.goodsType = "edit";
      this.goodsShow = true;
      this.goodsForm.index = index;
      this.goodsForm = item;
    },
    delGoods(index) {
      //修改商品
      this.addGoodsList.splice(index, 1);
    },
    submitGoods() {
      this.$refs["goodsForm"].validate((valid) => {
        if (!valid) {
          return;
        }
        if (this.goodsType == 'add') {
          this.addGoodsList.push(this.goodsForm);
        } else if (this.goodsType == 'edit') {
          this.addGoodsList.splice(this.goodsForm.index, 1, this.goodsForm);
        }
        this.goodsShow = false;
      })
    },
    submitForm() {
      // TODO 提交表单
      if (this.reserveid) {
        //编辑
        this.submitFormEdit();
        return;
      }
      this.$refs["elForm"].validate((valid) => {
        if (!valid) {
          return;
        }
        if (this.addGoodsList.length == 0) {
          this.$message("请填写需出库的商品信息");
          return false;
        }
        this.formData.outWarehouseProducts = this.addGoodsList;
        addReserveOut(this.formData).then((response) => {
          if (response.code == 200) {
            this.loading = false;
            this.msgSuccess('提交出库预约成功');
            this.resetForm();
          } else {
            this.loading = false;
          }
        });
      });
    },
    submitFormEdit() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) {
          return;
        }
        if (this.addGoodsList.length == 0) {
          this.$message("请填写需出库的商品信息");
          return false;
        }
        this.formData.outWarehouseProducts = this.addGoodsList;
        this.formData.reservationState = 1; //编辑将状态变为待审核
        editReserveOut(this.formData).then((response) => {
          if (response.code == 200) {
            this.loading = false;
            this.msgSuccess('操作成功');
            this.$emit("cancel");
            this.resetForm();
          } else {
            this.loading = false;
          }
        });
      });
    },
    // 取消按钮
    cancel() {
      this.reset();
    },
    resetForm() {
      this.addGoodsList = [];
      this.$refs["elForm"].resetFields();
    },
  },
  watch: {
    reserveid(val) {
      if (val) {
        this.getDetail();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/index.scss";
.views-kill-reservation {
  background: rgb(243, 247, 249);
  padding: 10px;
  font-size: 14px;
  .t-tips {
    color: #333;
    border-left: 2px solid #{$themeGreen};
    padding-left: 10px;
    font-weight: bold;
    margin: 30px 0 20px;
  }
  .reserveOut-content {
    width: 100%;
    background: #fff;
    padding-right: 20px;
    box-sizing: border-box;
    display: inline-block;
    .el-form-item--medium {
      padding-left: 20px;
      min-width: 33.333%;
      display: inline-block;
      /deep/ .el-form-item__label,
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
      .goods-btn {
        border-top: 1px solid #F1F1F1;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: #FAFAFA;
        cursor: pointer;
        span {
          color: #{$themeGreen};
          padding: 10px 20px;
        }
      }
    }
    .form-button {
      margin-bottom: 30px;
      text-align: center;
    }
  }
}
</style>
