<template>
  <div class="views-kill-reservation">
    <div>
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="134px"
      >
        <div class="reservation-title">
          <div class="t-tips">咨询电话</div>
          <div class="title-list">
            <div class="title-child" v-for="(item,index) in killTitleOptions" :key="index">
              <div class="font12 color66">{{item.dictLabel}}</div>
              <div class="t-text">{{ item.dictValue }}</div>
            </div>
          </div>
          <img class="phone-icon" src="@/assets/image/kill/icon-phone.png" />
        </div>
        <div class="reservation-content">
          <div class="t-tips">预约信息填写</div>
          <div class="reservation-form">
            <div class="r-f-left">
              <el-form-item label="预约日期" prop="date">
                <el-date-picker
                  v-model="formData.date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :style="{ width: '100%' }"
                  placeholder="请选择预约日期"
                  :picker-options="pickerOptions"
                  clearable
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="预约时段" prop="time">
                <el-select
                  v-model="formData.time"
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
              <el-form-item label="公司名称" prop="companyName">
                <el-autocomplete
                  v-model="formData.companyName"
                  placeholder="请输入公司名称"
                  clearable
                  @focus="queryLocal('companyName')"
                  :fetch-suggestions="querySearch"
                  @select="handleSelect"
                  :style="{ width: '100%' }"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="联系人" prop="name">
                <el-autocomplete
                  v-model="formData.name"
                  placeholder="请输入联系人姓名"
                  clearable
                  @focus="queryLocal('name')"
                  :fetch-suggestions="querySearch"
                  @select="handleSelect"
                  :style="{ width: '100%' }"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="联系电话" prop="phone">
                <el-autocomplete
                  v-model="formData.phone"
                  placeholder="请输入联系电话"
                  :maxlength="11"
                  show-word-limit
                  clearable
                  @focus="queryLocal('phone')"
                  :fetch-suggestions="querySearch"
                  @select="handleSelect"
                  :style="{ width: '100%' }"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="箱柜号" prop="cabinetNumber">
                <el-input
                  v-model="formData.cabinetNumber"
                  placeholder="请输入箱柜号"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="产品名称" prop="productName">
                <el-autocomplete
                  v-model="formData.productName"
                  :maxlength="128"
                  show-word-limit
                  placeholder="请输入产品名称"
                  clearable
                  @focus="queryLocal('productName')"
                  :fetch-suggestions="querySearch"
                  @select="handleSelect"
                  :style="{ width: '100%' }"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="货品重量(kg)" prop="weight">
                <el-input
                  v-model="formData.weight"
                  placeholder="请输入货品重量"
                  clearable
                  :maxlength="10"
                  show-word-limit
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="货品件数(箱)" prop="count">
                <el-input
                  v-model="formData.count"
                  v-on:input="countChange"
                  placeholder="请输入货品件数"
                  :maxlength="10"
                  show-word-limit
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="货品规格" prop="cabinetType">
                <el-radio-group v-model="formData.cabinetType">
                  <el-radio v-for="(item,index) in cabinetTypeOptions" :key="index" :label="item.dictValue" :disabled="parseInt(formData.count) < 500 && item.dictLabel == '其他'">
                    {{item.dictLabel}} 
                    <el-tooltip class="item" effect="dark" content="大件：例如（二分体、四分体、酮体、大桶装）等" placement="top" v-if="item.dictValue == '1'">
                      <span class="el-icon-question"></span>
                    </el-tooltip>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="高风险地区" prop="isDanger">
                <el-radio-group v-model="formData.isDanger" @change="isDangerChange">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="箱柜价格" prop="orderPrice" v-if="formData.isDanger == 1 || formData.isDanger == 0">
                <el-radio-group v-model="formData.orderPrice">
                  <el-radio-button 
                    v-for="(item,index) in killPriceOptions" 
                    :key="index" 
                    :label="item.dictValue" 
                    v-show="(item.remark == '1' && formData.isDanger == 1) || (item.remark == '0' && formData.isDanger == 0)">
                    {{item.dictLabel}}
                    <img class="radio-check" v-if="formData.orderPrice == item.dictValue" src="@/assets/image/kill/radio-check.png" />
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="提单号" prop="extractNumber" :rules="formData.isDanger == 1 ? rules.extractNumber:[{required: false}]">
                <el-input
                  v-model="formData.extractNumber"
                  placeholder="请输入提单号"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="消杀后入库" prop="businessType">
                <el-radio v-model="formData.businessType" :label="1">是</el-radio>
                <el-radio v-model="formData.businessType" :label="0">否</el-radio>
              </el-form-item>
            </div>
            <div class="r-f-right">
              <el-form-item label="码头" prop="pier">
                <el-input
                  v-model="formData.pier"
                  placeholder="请输入码头"
                  show-word-limit
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item label="国家" prop="country">
                <el-autocomplete
                  v-model="formData.country"
                  placeholder="请输入国家"
                  clearable
                  @focus="queryLocal('country')"
                  :fetch-suggestions="querySearch"
                  @select="handleSelect"
                  :style="{ width: '100%' }"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="驾驶员姓名" prop="carName">
                <el-input
                  v-model="formData.carName"
                  placeholder="请输入驾驶员姓名"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="驾驶员电话" prop="carPhone">
                <el-input
                  v-model="formData.carPhone"
                  placeholder="请输入驾驶员电话"
                  :maxlength="11"
                  show-word-limit
                  clearable
                  prefix-icon="el-icon-mobile"
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
              <el-form-item label="驾驶员身份证号" prop="idCard">
                <el-input
                  v-model="formData.idCard"
                  placeholder="请输入驾驶员身份证号"
                  :maxlength="18"
                  show-word-limit
                  clearable
                  :style="{ width: '100%' }"
                ></el-input>
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
              <el-form-item label="检验检疫证明编号" prop="quarantineNumber">
                <el-input
                  v-model="formData.quarantineNumber"
                  placeholder="请输入检验检疫证明编号"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="批次号" prop="batchNumber">
                <el-input
                  v-model="formData.batchNumber"
                  placeholder="请输入批次号"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="工厂" prop="factory">
                <el-autocomplete
                  v-model="formData.factory"
                  placeholder="请输入工厂"
                  clearable
                  @focus="queryLocal('factory')"
                  :fetch-suggestions="querySearch"
                  @select="handleSelect"
                  :style="{ width: '100%' }"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="收货冷库名称" prop="storageName">
                <el-input
                  v-model="formData.storageName"
                  :maxlength="64"
                  show-word-limit
                  placeholder="请输入收货冷库名称"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="收货冷库地址" prop="destination">
                <el-input
                  v-model="formData.destination"
                  :maxlength="64"
                  show-word-limit
                  placeholder="请输入收货冷库地址"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-form-item>
              <el-form-item class="upload-groups" label="报关单" prop="customUrl">
                <el-upload
                  ref="upload"
                  class="upload-url"
                  :headers="upload.headers"
                  :action="upload.url"
                  :limit="1"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="small" type="success">点击上传</el-button>
                </el-upload>
                <span class="upload-fonts">支持zip、png、jpg、pdf...</span>
              </el-form-item>
              <el-form-item label="开票" prop="isInvoice">
                <el-radio-group v-model="formData.isInvoice">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
                <div class="write-receipt" v-if="formData.isInvoice == '1'">
                  <label v-if="receiptForm.invoiceHeadType">
                    <span>{{receiptForm.invoiceMaterial == '1' ? '电子普通发票' : '纸质发票'}}</span>
                    <span>{{receiptForm.invoiceHeadType == '1' ? '个人' : '公司'}}</span>
                    <span>{{receiptForm.invoiceContent}}</span>
                    <span class="green" @click.stop="open = true">修改</span>
                  </label>
                  <span class="green" v-else @click.stop="open = true">填写开票信息</span>
                </div>
              </el-form-item>
              <el-form-item label="封箱封带" prop="isBox">
                <el-radio-group v-model="formData.isBox">
                  <el-radio :label="1">是
                    <el-tooltip class="item" effect="dark" content="包装破损需封箱封带，单价：封箱封带30元/箱，封带10元/箱（具体费用与现场确认结算）" placement="top">
                      <span class="el-icon-question"></span>
                    </el-tooltip>
                  </el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="fr" style="margin-right: 20px">
            <div class="paying-amount" v-if="formData.orderPrice">
              <span class="paying">待支付金额：</span>
              ¥ <span class="amount">{{formData.orderPrice}}</span>
            </div>
            <!-- <div class="subSuc-tips" v-if="subSuc">
              提交成功，将在 <span>{{countdown}}s </span>后跳转至支付
            </div> -->
            <el-form-item size="medium">
              <el-button @click="resetForm">重置</el-button>
              <el-button type="success" :loading="loading" @click="submitForm">提交并支付</el-button>
            </el-form-item> 
          </div>
        </div>
      </el-form>
      <!-- 发票信息 -->
      <el-dialog title="发票信息" :visible.sync="open" width="680px" append-to-body>
        <receipt @receipt="receipt" @cancel="cancelreceipt"></receipt>
      </el-dialog>
    </div>
    <!-- <div v-if="subSuc" class="submit-suc">
      <div class="suc-bg">
        <img src="@/assets/image/kill/sub-suc-icon.png" alt="">
        <div class="logo-title">审核中</div>
      </div>
      <div class="pay-suc-tips">
        <div class="tips-font">订单已提交，等待人工审核</div>
        <div class="look-btn">
          <span @click.stop="toReview()">查看预约记录</span>
        </div>
        <div class="pay-suc-info">
          订单审核通过后，请及时点击支付
        </div>
      </div>
    </div> -->
    <el-dialog title="提示" center :visible.sync="subSuc" width="500px" append-to-body>
      <div class="wx-pay-content">
        <div class="wx-pay-suc-msg">
          提交成功，将在 <span>{{countdown}}s </span>后跳转至支付；请尽快完成支付，如果长时间未支付，系统将自动取消订单。
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addKill, getKillCount } from "@/api/system/kill";
import receipt from "@/components/Receipt/index";
import { getToken } from "@/utils/auth";
import format from "@/utils/index.js";
export default {
  components: {
    receipt
  },
  props: [],
  data() {
    return {
      killTitleOptions: [],
      killPriceOptions: [],
      cabinetTypeOptions: [],
      //可预约数量字典
      killCountOptions: [],
      show: false,
      formData: {
        title: "",
        date: null,
        time: undefined,
        carName: undefined,
        carPhone: "",
        carNumber: "",
        idCard: "",
        storageName: "",
        quarantineNumber: "",
        batchNumber: "",
        orderPrice: undefined,
        cabinetType: undefined,
        cabinetNumber: undefined,
        extractNumber: undefined,
        name: undefined,
        companyName: undefined,
        businessType: 0,
        pier: undefined,
        isDanger: undefined,
        standard: undefined,
        phone: undefined,
        productName: undefined,
        country: undefined,
        factory: undefined,
        weight: "",
        count: "",
        destination: undefined,
        isInvoice: undefined, //发票类型
        customUrl: undefined, //报关单
        isBox: 1
      },
      rules: {
        field118: [],
        date: [
          {
            required: true,
            message: "请选择日期选择",
            trigger: "change",
          },
        ],
        time: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        // carNumber: [
        //   {
        //     required: true,
        //     message: "请输入车牌号",
        //     trigger: "blur",
        //   },
        // ],
        storageName: [
          {
            required: true,
            message: "请输入收货冷库名称",
            trigger: "blur",
          },
        ],
        // carName: [
        //   {
        //     required: true,
        //     message: "请输入驾驶员姓名",
        //     trigger: "blur",
        //   },
        // ],
        // carPhone: [
        //   {
        //     required: true,
        //     message: "请输入驾驶员电话",
        //     trigger: "blur",
        //   },
        //   {
        //     pattern: /^1[3-9]\d{9}$/,
        //     message: "手机号格式错误",
        //     trigger: "blur",
        //   },
        // ],
        // idCard: [
        //   {
        //     required: true,
        //     message: "请输入驾驶员身份证号",
        //     trigger: "blur",
        //   },
        //   {
        //     pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        //     message: "请输入正确的身份号",
        //     trigger: "blur",
        //   },
        // ],
        // quarantineNumber: [
        //   {
        //     required: true,
        //     message: "请输入检验检疫证明编号",
        //     trigger: "blur",
        //   },
        // ],
        cabinetNumber: [
          {
            required: true,
            message: "请输入箱柜号",
            trigger: "blur",
          },
          {
            pattern:  /^[0-9a-zA-Z]*$/g,
            message: "箱柜号只能是数字和字母",
            trigger: "blur",
          }
        ],
        extractNumber: [
          {
            required: true,
            message: "请输入提单号",
            trigger: "blur",
          },
        ],
        companyName: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入联系人姓名",
            trigger: "change",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入联系人电话",
            trigger: "blur",
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式错误",
            trigger: "change",
          },
        ],
        productName: [
          {
            required: true,
            message: "请输入产品名称",
            trigger: "change",
          },
        ],
        country: [
          {
            required: true,
            message: "请输入国家",
            trigger: "change",
          },
        ],
        factory: [
          {
            required: true,
            message: "请输入工厂",
            trigger: "change",
          },
        ],
        destination: [
          {
            required: true,
            message: "请输入收货冷库地址",
            trigger: "blur",
          },
        ],
        cabinetType: [
          {
            required: true,
            message: "请选择货品规格",
            trigger: "change",
          },
        ],
        orderPrice: [
          {
            required: true,
            message: "请选择箱柜价格",
            trigger: "change",
          },
        ],
        isInvoice: [
          {
            required: true,
            message: '请选择是否开票',
            trigger: 'change'
          }
        ],
        isDanger: [
          {
            required: true,
            message: "请选择是否高风险地区",
            trigger: "change",
          }
        ],
        pier: [
          {
            required: true,
            message: "请输入码头",
            trigger: "blur",
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
            message: '重量只能是数字',
            trigger: 'blur'
          }
        ],
        count: [
          {
            required: true,
            message: "请输入件数",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]+(.[0-9]{1,3})?$/,
            message: '件数只能是数字',
            trigger: 'blur'
          }
        ],
        customUrl: [
          {
            required: true,
            message: "请上传报关单",
            trigger: "change",
          }
        ]
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        cellClassName: (time) => {
          let Time = new format();
          if (this.fullArr.includes(Time.format(time.getTime(), 'yyyy-MM-dd'))) {
            return 'red-font';
          } else if (this.notFull.includes(Time.format(time.getTime(), 'yyyy-MM-dd'))) {
            return 'green-font';
          }
        }
      },
      loading: false,
      // 是否显示弹出层
      open: false,
      receiptForm: {},
      subSuc: false, //提交成功
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/oss/oss/uploadFile"
      },
      countdown: 3,
      queryList: [],
      limitNum: []
    };
  },
  watch: {},
  created() {
    this.$alert("暂不接待目的地非上海的货柜！来园司机必须持有7天内有效的核酸检测报告，且确保离园之前有效", "公告", {
      confirmButtonText: "确定",
      // callback: action => {
      //   this.$message({
      //     type: 'info',
      //     message: `action: ${action}`
      //   })
      // }
    });
    this.killDicts();
    this.killTitle();
  },
  computed: {
    storageMsg() {
      //缓存信息
      return JSON.parse(localStorage.getItem("Storage"));
    },
    fullArr() {
      let arr = [];
      if (this.limitNum.length > 0) {
        this.limitNum.map(item => {
          if (item.count >= parseInt(this.killCountOptions[0].dictValue)) {
            arr.push(item.date)
          }
        })
      }
      return arr;
    },
    notFull() {
      let arr = [];
      if (this.limitNum.length > 0) {
        this.limitNum.map(item => {
          if (item.count < parseInt(this.killCountOptions[0].dictValue)) {
            arr.push(item.date)
          }
        })
      }
      return arr;
    }
  },
  methods: {
    killTitle() {
      this.subSuc = false;
      this.getDicts("kill_title").then((response) => {
        if (response.data.length > 0) {
          // response.data.map((item) => {
          //   item.dictValue = item.dictValue.split("；");
          // });
          this.killTitleOptions = response.data;
        }
      });
      //已预约数量
      getKillCount().then((response) => {
        if (response.rows.length > 0) {
          this.limitNum = response.rows;
        }
      });
    },
    killDicts() {
      //箱柜-价格
      this.getDicts("kill_price").then((response) => {
        if (response.data.length > 0) {
          this.killPriceOptions = response.data;
        }
      });
      //箱柜-类型
      this.getDicts("cabinet_type").then((response) => {
        if (response.data.length > 0) {
          this.cabinetTypeOptions = response.data;
        }
      });
      //每日可预约数量
      this.getDicts("kill_count").then((response) => {
        if (response.data.length > 0) {
          this.killCountOptions = response.data;
        }
      });
    },
    change() {
      this.formData.radio1 === "";
      this.formData.radio2 === "";
      this.show = !this.show;
    },
    receipt(data) {
      console.log(data)
      this.receiptForm = data;
      this.open = false;
    },
    cancelreceipt() {
      //关闭发票弹窗
      this.open = false;
    },
    submitForm() {
      //判断预约数量是否到达上限
      if (this.fullArr.includes(this.formData.date)) {
        this.$message({
          message: '您选择的日期已经预约满，请选择其他日期',
          type: 'error'
        })
        return;
      }
      // TODO 提交表单
      this.$refs["elForm"].validate((valid) => {
        if (!valid) {
          return;
        }
        //判断开票
        if (this.formData.isInvoice == '1' && !this.receiptForm.invoiceHeadType) {
          this.$message({
            message: '请填写开票信息',
            type: 'warning'
          })
          return;
        }
        // this.loading = true;
        // const obj1 = this.formData;
        // const obj2 = this.receiptForm;
        // const result = Object.assign(obj1, obj2);
        const result = {
          reservationKill: this.formData,
          invoiceInfo: this.receiptForm
        }
        this.saveStorge(result.reservationKill, result.invoiceInfo);
        addKill(result).then((response) => {
          if (response.code === 200) {
            this.open = false;
            this.loading = false;
            this.subSuc = true;
            this.resetForm();
            this.setTimeFive(response.data.id);
          } else {
            this.loading = false;
          }
        });
      });
    },
    countChange(val) {
      //监控货品数量
      if (parseInt(val.count) < 500) {
        this.formData.cabinetType = 1;
      } else {
        this.formData.cabinetType = undefined;
      }
    },
    beforeAvatarUpload() {},
    handleAvatarSuccess(response, file, fileList) {
      this.formData.customUrl = response.data.url;
    },
    // 取消按钮
    cancel() {
      // this.open = false;
      this.reset();
    },
    toReview() {
      //关闭当前路由标签
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.push({path: '/kill/review/index'})
    },
    resetForm() {
      this.$refs.upload.clearFiles();
      this.$refs["elForm"].resetFields();
    },
    setTimeFive(orderId) {
      //倒计时
      if (this.countdown == 0) {
        //跳转至支付
        this.$router.push({path: '/review/pay',query: { id: orderId }})
        return
      }
      setTimeout(() => {
        this.countdown = this.countdown - 1;
        this.setTimeFive(orderId);
      },1000);
    },
    saveStorge(result, receipt) {
      //缓存数据
      var Storage = {
        companyName: result.companyName,
        name: result.name,
        phone: result.phone,
        productName: result.productName,
        country: result.country,
        factory: result.factory
      }
      localStorage.setItem("Storage", JSON.stringify(Storage));
      if (receipt.invoiceMaterial) {
        localStorage.setItem("receipt", JSON.stringify(receipt));
      }
    },
    queryLocal(type) {
      this.queryList = [];
      if (this.storageMsg.companyName) {
        switch(type) {
          case "companyName":
            this.queryList = [{value: this.storageMsg.companyName}]
            break;
          case "name":
            this.queryList = [{value: this.storageMsg.name}]
            break;
          case "phone":
            this.queryList = [{value: this.storageMsg.phone}]
            break;
          case "productName":
            this.queryList = [{value: this.storageMsg.productName}]
            break;
          case "country":
            this.queryList = [{value: this.storageMsg.country}]
            break;
          case "factory":
            this.queryList = [{value: this.storageMsg.factory}]
            break;
        }
      }
    },
    isDangerChange(val) {
      //监控是否高风险
      this.formData.orderPrice = undefined;
    },
    //缓存搜索
    querySearch(val, cb) {
      var textValue = this.queryList;
      var result = val ? textValue.filter(this.createFilter(val)) : textValue;
      cb(result);
    },
    createFilter(val) {
      return (textValue) => {
        return (textValue.value.toLowerCase().indexOf(val.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      // console.log(item);
    },
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/index.scss";
@import "@/assets/styles/receipt.scss";
.views-kill-reservation {
  background: rgb(243, 247, 249);
  .t-tips {
    color: #333;
    font-size: 16px;
    border-left: 2px solid #{$themeGreen};
    padding-left: 10px;
    font-weight: bold;
  }
  .reservation-title {
    position: relative;
    background: #fff;
    margin-bottom: 13px;
    padding: 20px;
    .phone-icon {
      position: absolute;
      top: 50%;
      margin-top: -20px;
      right: 37px;
      width: 50px;
    }
    .title-list {
      @include display-flex;
      margin-top: 20px;
      .title-child {
        @include flex(1);
        padding-left: 50px;
        border-right: 1px solid #bfcbd9;
        .t-text {
          color: #333;
          font-size: 16px;
          line-height: 30px;
        }
        &:last-child {
          border-right: none;
        }
      }
    }
  }
  .reservation-content {
    width: calc(100% - 26px);
    background: #fff;
    margin: 0 13px;
    padding: 10px 0;
    box-sizing: border-box;
    display: inline-block;
    .reservation-form {
      padding: 15px 20px;
      .r-f-left,
      .r-f-right {
        float: left;
        min-width: 50%;
      }
      .el-form-item--medium {
        padding-left: 40px;
        .el-form-item__label {
          text-align: right;
        }
      }
      .write-receipt {
        position: absolute;
        top: 36px;
        color: #999;
        font-size: 12px;
        line-height: 15px;
        span {
          margin-right: 8px;
        }
        .green {
          color: #{$themeGreen};
          cursor: pointer;
        }
      }
    }
    .paying-amount {
      text-align: right;
      margin-right: 10px;
      margin-bottom: 20px;
      color: #{$amountRed};
      font-size: 12px;
      font-weight: 500;
      .paying {
        color: #333;
      }
      .amount {
        font-size: 18px;
      }
    }
  }
  .submit-suc {
    background: url(../../../assets/image/kill/sub-suc-bg.png);
    background-size: 100% 100%;
    background-position: 0 100%;
    text-align: center;
    margin: 10px;
    min-height: calc(100vh - 104px);
    .suc-bg {
      padding-top: 130px;
      img {
        width: 130px;
      }
      .logo-title {
        margin-top: 20px;
        font-size: 22px;
        color: #fff;
      }
    }
    .pay-suc-tips {
      margin-top: 220px;
      .tips-font {
        color: #333;
        font-size: 18px;
        font-weight: 500;
      }
      .look-btn {
        margin-top: 35px;
        span {
          font-size: 14px;
          background: #{$themeGreen};
          color: #fff;
          border-radius: 25px;
          padding: 15px 35px;
          cursor: pointer;
        }
      }
      .pay-suc-info {
        margin-top: 35px;
        color: #FE1F1F;
        font-size: 16px;
      }
    }
  }
  .upload-url {
    max-width: 50%;
    /deep/ .el-upload-dragger {
      width: 50%;
    }
  }
  .upload-groups {
    position: relative;
    .upload-fonts {
      position: absolute;
      top: 0px;
      left: 90px;
      font-size: 12px;
      color: #999;
    }
  }
  .subSuc-tips {
    text-align: right;
    font-size: 12px;
    color: #333;
    padding-bottom: 15px;
    span {
      color: #ed5565;
      font-size: 14px;
    }
  }
}
</style>
