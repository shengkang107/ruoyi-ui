<template>
  <div class="sum-warp app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="82px">
      <el-form-item label="箱柜号" prop="cabinetNumber">
        <el-input
          v-model="queryParams.cabinetNumber"
          placeholder="请输入箱柜号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="道口" prop="crossNumber" v-if="!checkRole(['cashier','finance'])">
        <el-input
          v-model="queryParams.crossNumber"
          placeholder="请输入道口"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检测机构" prop="checkCompany" v-if="!checkRole(['cashier'])">
        <el-select v-model="queryParams.checkCompany" placeholder="请选择核酸检测机构" clearable
                   size="small">
          <el-option
            v-for="dict in checkCompanyOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车牌号" prop="carNumber" v-if="!checkRole(['cashier','finance','boss'])">
        <el-input
          v-model="queryParams.carNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="carName" v-if="!checkRole(['cashier','finance','sale','boss'])">
        <el-input
          v-model="queryParams.carName"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机电话" prop="carPhone" v-if="!checkRole(['cashier','finance','sale','boss'])">
        <el-input
          v-model="queryParams.carPhone"
          placeholder="请输入司机电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入库/中转" prop="businessType">
        <el-select v-model="queryParams.businessType" placeholder="请选择入库/中转" clearable size="small">
          <el-option
            v-for="dict in inputOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="采样时间" prop="pickTime">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="pickTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        placeholder="选择采样时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="送检时间" prop="checkTime">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="checkTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        placeholder="选择送检时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="靠口时间" prop="inDate" v-if="!checkRole(['finance'])">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="inDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        placeholder="选择靠口时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="采样人姓名" prop="inspectors">
        <el-input
          v-model="queryParams.inspectors"
          placeholder="请输入采样人姓名"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:sum:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleUpdateMultiple"
          v-has-role="['check']"
        >批量修改送检时间
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:sum:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-has-role="['gov','manage','common','check']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="sumList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="订单号" align="center" prop="orderNumber"/>
      <el-table-column label="检测机构" align="center" prop="checkCompany" :formatter="checkCompanyFormat"
                       v-if="!checkRole(['cashier'])"/>
      <el-table-column label="箱柜号" align="center" prop="cabinetNumber" width="180"/>
      <el-table-column label="检验检疫证明编号" align="center" prop="quarantineNumber" width="180"/>
      <el-table-column label="道口" align="center" prop="crossNumber" v-if="!checkRole(['cashier','finance'])" :formatter="crossNumberOptionsFormat"/>
      <el-table-column label="产品名称" align="center" v-if="!checkRole(['cashier','finance'])">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="产品名称"
            width="200"
            trigger="hover"
            :content="scope.row.productName">
            <span class="popText" slot="reference">{{scope.row.productName}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" align="center" prop="carNumber" v-if="!checkRole(['cashier','finance','boss'])"/>
      <el-table-column label="司机姓名" align="center" prop="carName"
                       v-if="!checkRole(['cashier','finance','sale','boss'])"/>
      <el-table-column label="司机电话" align="center" prop="carPhone"
                       v-if="!checkRole(['cashier','finance','sale','boss'])"/>
      <el-table-column label="入库/中转" align="center" prop="businessType" :formatter="inputFormat"/>
      <el-table-column label="采样时间" align="center" prop="pickTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.pickTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="送检时间" align="center" prop="checkTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.checkTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="靠口时间" align="center" prop="inDate" width="180" v-if="!checkRole(['finance'])">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采样人姓名" align="center" prop="inspectors"/>
      <el-table-column label="检测报告代码" align="center" prop="reportCode"/>
      <el-table-column label="审核状态" align="center" prop="reviewStatus" :formatter="reviewFormat"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" width="120" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-popover
            placement="left-end"
            width="110"
            trigger="click">
            <div class="table-div-right">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-search"
                @click="handleQueryDetail(scope.row)"
              >查看详情
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-has-role="['check']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-has-role="['check']"
              >删除
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-upload"
                @click="handleUpload(scope.row)"
                v-has-role="['check']"
                v-if="!scope.row.reportUrl"
              >上传报告
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpload(scope.row)"
                v-has-role="['check']"
                v-if="scope.row.reportUrl"
              >修改报告
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-download"
                @click="handleOpenReport(scope.row)"
                v-has-role="['gov','hulenglian','manage','common','check','admin','warehouse','finance','order']"
                v-if="scope.row.reportUrl"
              >下载报告
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-s-promotion"
                v-if="checkRole(['admin','check'])&&(scope.row.reviewStatus===0||scope.row.reviewStatus===3)"
                @click="submitReview(scope.row)"
              >提交审核
              </el-button>
            </div>
            <el-button class="table-btn-right" icon="el-icon-s-fold" slot="reference">操作</el-button>
          </el-popover>
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

    <!-- 添加或修改核酸检测报告总表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="采样时间" prop="pickTime">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.pickTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择采样时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="送检时间" prop="checkTime">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.checkTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择送检时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="采样人姓名" prop="inspectors">
          <el-input v-model="form.inspectors" placeholder="请输入采样人姓名"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--    修改详情-->
    <el-dialog :title="title" :visible.sync="openDetailUpdate" width="500px" append-to-body>
      <el-form ref="formDetail" :model="formDetail" :rules="rules2" label-width="80px">
        <el-form-item label="样品名称" prop="sampleName">
          <el-input v-model="formDetail.sampleName" placeholder="请输入样品名称"/>
        </el-form-item>
        <el-form-item label="生产日期" prop="productionDate">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="formDetail.productionDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="批次" prop="batch">
          <el-input v-model="formDetail.batch" placeholder="请输入批次"/>
        </el-form-item>
        <el-form-item label="生产商" prop="producer">
          <el-input v-model="formDetail.producer" placeholder="请输入生产商"/>
        </el-form-item>
        <el-form-item label="原产地" prop="origin">
          <el-input v-model="formDetail.origin" placeholder="请输入原产地"/>
        </el-form-item>
        <el-form-item label="点位信息+样本号" prop="barCode">
          <el-input v-model="formDetail.barCode" placeholder="请输入点位信息+样本号"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formDetail.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitFormDetail">确 定</el-button>
        <el-button @click="cancelDetailUpdate">取 消</el-button>
      </div>
    </el-dialog>
    <!--    检测报告审核-->
    <el-dialog :title="title" :visible.sync="openReview" width="500px" append-to-body>
      <el-form ref="formDetail" :model="formReview" :rules="rulesReview" label-width="80px">
        <el-form-item label="是否通过" prop="reviewStatus" v-if="checkRole(['warehouse','admin'])">
          <el-switch
            v-model="formReview.reviewStatus"
            @change="formReview.show=!formReview.show"
            active-value="2"
            inactive-value="3"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="驳回理由" prop="reason" v-if="!formReview.show">
          <el-input v-model="formReview.reason" placeholder="请输入驳回理由"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitFormReview">确 定</el-button>
        <el-button @click="cancelReview">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 总表详情 -->
    <el-dialog :title="title" :visible.sync="openSumDetail" width="90%" append-to-body>
      <div class="title-container">
        <div class="order-main">
          订单号:{{ this.sumDetail.orderNumber }}
        </div>
        <el-row class="order-line">
          <el-col class="left" :span="8">
            箱柜号：{{ this.sumDetail.cabinetNumber }}
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col class="left" :span="8" v-if="!checkRole(['cashier','finance'])">
            道口：{{ this.sumDetail.crossNumber }}
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col class="left" :span="8" v-if="!checkRole(['cashier','finance'])">
            产品名称：{{ this.sumDetail.productName }}
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
        <el-row class="order-line">
          <el-col class="right" :span="8" v-if="!checkRole(['cashier','finance'])">
            车牌号：{{ this.sumDetail.carNumber }}
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col class="right" :span="8" v-if="!checkRole(['cashier','finance','sale','manage'])">
            司机姓名：{{ this.sumDetail.carName }}
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col class="right" :span="8" v-if="!checkRole(['cashier','finance','sale','manage'])">
            司机电话：{{ this.sumDetail.carPhone }}
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
        <el-row class="order-line">
          <el-col class="left" :span="6">
            原产地：{{ this.sumDetail.country }}
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col class="left" :span="6">
            工厂：{{ this.sumDetail.factory }}
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col class="right" :span="6">
            采样时间：{{ this.sumDetail.pickTime }}
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col class="right" :span="6">
            送检时间：{{ this.sumDetail.checkTime }}
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
      </div>

      <el-row :gutter="10" class="mt10 mb8">
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-plus"
            size="mini"
            @click="handleAddDetail"
            v-has-role="['check']"
            v-if="this.sumDetail.reviewStatus===0"
          >新增
          </el-button>
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExportSub()"
            v-has-role="['gov','manage','common','check']"
          >导出
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDeleteDetail"
            v-has-role="['check']"
            v-if="this.sumDetail.reviewStatus===0"
          >删除
          </el-button>
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            @click="handleReview"
            v-if="checkRole(['admin','warehouse'])&&this.sumDetail.reviewStatus===1"
          >审核
          </el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="sumDetailList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="样品名称" align="center" prop="sampleName"/>
        <el-table-column label="生产日期" align="center" prop="productionDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.productionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次" align="center" prop="batch"/>
        <el-table-column label="生产商" align="center" prop="producer"/>
        <el-table-column label="原产地" align="center" prop="origin"/>
        <el-table-column label="点位信息+样本号" align="center" prop="barCode"/>
        <el-table-column label="备注" align="center" prop="remark"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" v-if="this.sumDetail.reviewStatus===0">
          <template slot-scope="scope" >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdateDetail(scope.row)"
              v-has-role="['check']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDeleteDetail(scope.row)"
              v-has-role="['check']"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="sumDetailTotal>0"
        :total="sumDetailTotal"
        :page.sync="sumDetailQueryParams.pageNum"
        :limit.sync="sumDetailQueryParams.pageSize"
        @pagination="getDetailList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDetail">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="reportUrl.title" :visible.sync="reportUrl.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".pdf, .jpg, .png"
        :headers="reportUrl.headers"
        :action="reportUrl.url"
        :disabled="reportUrl.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        drag
      >
        <div class="el-upload__tip" slot="tip">
          <el-input
            v-model="upload.reportCode"
            placeholder="请输入检测报告代码"
            clearable
            size="small"
          />
        </div>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：文件后缀只能是.pdf.jpg.png</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitFileForm()">确 定</el-button>
        <el-button @click="reportUrl.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 送检审核申请 -->
    <el-dialog :title="title" :visible.sync="updateMultiple" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="送检时间">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.checkTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择送检时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitFormUpdateMultiple">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import {
  listSum,
  getSum,
  delSum,
  addSum,
  updateSum,
  getSumDetail,
  getSub,
  delSub, updateCheckTime, sumUpload
} from "@/api/system/sum";
import {addSub, updateSub} from "@/api/system/sub";
import {getToken} from "@/utils/auth";
import {checkRole} from "@/utils/permission";
import {getKill, listKill} from "@/api/system/recordKill";

export default {
  name: "Sum",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      updateMultiple: null,
      // 总条数
      total: 0,
      sumDetailTotal: 0,
      // 核酸检测报告总表表格数据
      sumList: [],
      sumDetailList: [],
      sumDetail: [],
      inputOptions: [],
      reviewOptions: [],
      checkCompanyOptions: [],
      crossNumberOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openDetailUpdate: false,
      openSumDetail: false,
      openReview: false,
      // 用户导入参数
      reportUrl: {
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/oss/oss/uploadFile"
      },
      upload: {
        id: null,
        url: null,
        reportCode: null
      },
      inDate: [],
      checkTime: [],
      pickTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: null,
        inspectors: null,
        checkCompany: null,
        pid: null,
        crossNumber: null,
        businessType: null,
        carName: null,
        carPhone: null,
      },// 查询参数
      sumDetailQueryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: null,
        checkTime: null,
        inspectors: null,
        pid: null,
        crossNumber: null,
        businessType: null,
        carName: null,
        carPhone: null
      },
      // 表单参数
      form: {},
      formDetail: {},
      formReview: {
        id: null,
        reason: '',
        reviewStatus: 2,
        show: false
      },
      // 表单校验
      rules: {
        orderNumber: [
          {required: true, message: "订单号不能为空", trigger: "blur"}
        ],
        checkTime: [
          {message: "送检时间不能为空", trigger: "blur"}
        ],
        pickTime: [
          {required: true, message: "采样时间不能为空", trigger: "blur"}
        ],
      }, rules2: {
        sampleName: [
          {required: true, message: "样品名称不能为空", trigger: "blur"}
        ],
        productionDate: [
          {message: "生产日期不能为空", trigger: "blur"}
        ], batch: [
          {message: "批次不能为空", trigger: "blur"}
        ], barCode:
          [
            {required: true, message: "点位信息+样本号不能为空", trigger: "blur"}
          ]
      }, rulesReview: {
        reason: [
          {required: true, message: "驳回理由不能为空", trigger: "blur"}
        ],
      }
    }
      ;
  },
  created() {
    this.getList();
    this.getDicts('kill_check_company').then(response => {
      this.checkCompanyOptions = response.data
    })
    this.getDicts('business_type').then(response => {
      this.inputOptions = response.data
    }), this.getDicts('review_status').then(response => {
      this.reviewOptions = response.data
    })
    this.getDicts('cross_number').then(response => {
      for (let i = 0; i < response.data.length; i++) {
        const data = response.data[i];
        const children = [];
        this.getDicts(response.data[i].dictValue).then(res => {
          for (let j = 0; j < res.data.length; j++) {
            children.push({label: res.data[j].dictLabel, value: res.data[j].dictValue})
          }
        })
        this.crossNumberOptions.push({label: data.dictLabel, value: data.dictValue, children: children})
      }
    })
  },
  methods: {
    // 区局程序
    reviewFormat(row, column) {
      return this.selectDictLabel(this.reviewOptions, row.reviewStatus)
    },
    checkRole,
    inputFormat(row, column) {
      return this.selectDictLabel(this.inputOptions, row.businessType)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.reportUrl.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.reportUrl.isUploading = false;
      this.upload.url = response.data.url;
      // this.$refs.upload.clearFiles();
    },
    // 提交上传文件
    submitFileForm() {
      if (!this.upload.url || this.upload.url == '') {
        this.$message.warning(`请上传消杀证明文件`);
        return
      }
      sumUpload(this.upload).then(response => {
        this.reportUrl.open = false;
        this.$refs.upload.clearFiles();
        this.msgSuccess('提交成功！')
        this.getList()
      })
    },
    /** 查询核酸检测报告总表列表 */
    getList() {
      this.loading = true;
      listSum(this.addDateRange(this.queryParams, null, null, this.inDate, null, this.pickTime, this.checkTime)).then(response => {
        this.sumList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getDetailList() {
      this.loading = true;
      this.sumDetailQueryParams.pid = this.sumDetail.id
      getSumDetail(this.sumDetailQueryParams).then(response => {
        this.sumDetailList = response.rows;
        this.sumDetailTotal = response.total;
        this.loading = false;
        this.openSumDetail = true;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.updateMultiple = false
      this.reset();
    },// 取消按钮
    cancelDetail() {
      this.openSumDetail = false;
      this.reset();
    }, cancelDetailUpdate() {
      this.openDetailUpdate = false;
      this.reset();
    }, cancelReview() {
      this.openReview = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        orderNumber: null,
        checkTime: null,
        inspectors: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.formDetail = {
        productionDate: null,
        sampleName: null,
        producer: null,
        origin: null,
        batch: null,
        barCode: null,
        reportUrl: null
      }
      this.resetForm("form");
      this.resetForm("formDetail");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 道口翻译
    crossNumberOptionsFormat(row, column) {
      if (row.crossNumber != null) {
        let number;
        for (let i = 0; i < this.crossNumberOptions.length; i++) {
          if (this.crossNumberOptions[i].value === row.crossNumber.split(',')[0]) {
            number = this.crossNumberOptions[i].label;
            for (let j = 0; j <this.crossNumberOptions[i].children.length; j++) {
              if (this.crossNumberOptions[i].children[j].value===row.crossNumber.split(',')[1]){
                number+=this.crossNumberOptions[i].children[j].label;
              }
            }
          }
        }
        return number
      }
    },
    // 查验公司名称
    checkCompanyFormat(row, column) {
      return this.selectDictLabel(this.checkCompanyOptions, row.checkCompany)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加核酸检测报告总表";
    }, /** 新增按钮操作 */
    handleAddDetail() {
      this.openDetailUpdate = true;
      this.title = "添加核酸检测报告总表";
    },
    /** 总表详情 */
    handleQueryDetail(row) {
      this.formReview.id = row.id
      this.sumDetail = row;
      this.reset();
      this.sumDetailQueryParams.pid = row.id
      getSumDetail(this.sumDetailQueryParams).then(response => {
        this.sumDetailList = response.rows;
        this.sumDetailTotal = response.total;
        this.loading = false;
        this.openSumDetail = true;
      });
    },
    /**提交审核  */
    submitReview(row) {
      this.reset()
      this.$confirm('是否提交订单号为："' + row.orderNumber + '"的检测报告?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        row.reviewStatus = 1
        updateSum(row)
      }).then(() => {
        this.getList()
        this.msgSuccess('提交成功')
      }).catch(function () {
      })
    },
    /** 打开上传窗口 */
    handleUpload(row) {
      this.upload.id = row.id
      this.upload.reportCode = row.reportCode
      this.reportUrl.title = "订单号:" + row.orderNumber + ' 报告上传'
      this.reportUrl.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSum(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改核酸检测报告总表";
      });
    },
    /**
     * 查看报告
     */
    handleOpenReport(row) {
      var tempwindow = window.open('_blank');
      tempwindow.location = row.reportUrl;
    },
    handleUpdateDetail(row) {
      this.reset();
      const id = row.id || this.ids
      getSub(id).then(response => {
        this.formDetail = response.data;
        this.openDetailUpdate = true;
        this.title = "修改核酸检测报告总表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSum(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSum(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 提交按钮 */
    submitFormUpdateMultiple() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.ids != null) {
            updateCheckTime(this.form, this.ids).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.updateMultiple = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 提交按钮 */
    submitFormReview() {
      if (this.formReview.id != null) {
        updateSum(this.formReview).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.openReview = false;
            this.openSumDetail = false;
            this.getList();
          }
        });
      }
    },
    submitFormDetail() {
      this.$refs["formDetail"].validate(valid => {
        if (valid) {
          if (this.formDetail.id != null) {
            this.sumDetailQueryParams.pid = this.sumDetail.id
            updateSub(this.formDetail).then(response => {
              if (response.code === 200) {
                this.openDetailUpdate = false;
                this.reset();
                getSumDetail(this.sumDetailQueryParams).then(response => {
                  this.msgSuccess("修改成功");
                  this.sumDetailList = response.rows;
                  this.total = response.total;
                  this.loading = false;
                  this.openSumDetail = true;
                });
              }
            });
          } else {
            this.sumDetailQueryParams.pid = this.sumDetail.id
            this.formDetail.pid = this.sumDetail.id
            addSub(this.formDetail).then(response => {
              if (response.code === 200) {
                this.openDetailUpdate = false;
                getSumDetail(this.sumDetailQueryParams).then(response => {
                  this.msgSuccess("新增成功");
                  this.sumDetailList = response.rows;
                  this.total = response.total;
                  this.loading = false;
                  this.openSumDetail = true;
                });
              }
            });
          }
        }
      });
    },
    /** 批量修改按钮操作 */
    handleUpdateMultiple(row) {
      this.ids = row.id || this.ids;
      this.title = '批量修改送检时间'
      this.updateMultiple = true
    }, /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除箱柜号为"' + row.cabinetNumber + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delSum(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /**检测审批 */
    handleReview() {
      this.reset()
      this.openReview = true
      this.formReview.show = false
      this.title = '检测报告审核'
    },
    /** 删除按钮操作 */
    handleDeleteDetail(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除所选的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delSub(ids);
      }).then(() => {
        this.sumDetailQueryParams.pid = this.sumDetail.id
        this.reset();
        getSumDetail(this.sumDetailQueryParams).then(response => {
          this.msgSuccess("删除成功");
          this.sumDetailList = response.rows;
          this.total = response.total;
          this.loading = false;
          this.openSumDetail = true;
        });
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/sum/export', {
        ...this.queryParams
      }, `核酸检测报告总表.xlsx`)
    },
    /** 导出按钮操作 */
    handleExportSub() {
      this.queryParams.pid = this.sumDetail.id
      this.download('system/sub/export', {
        ...this.queryParams
      }, `核酸检测报告子表.xlsx`)
    }
  }
};

</script>
<style lang="scss" scoped>
.sum-warp {
  .container {
    display: flex;
    min-height: 130px;
  }

  .left {
    order: -1;
    flex-basis: 200px;
    text-align: center;
  }

  .right {
    flex-basis: 300px;
    text-align: center;
  }
}
.title-container {
  .order-main {
    font-size: 25px;
    flex-grow: 1;
    text-align: center;
  }
  .order-line {
    line-height: 25px;
  }
}
</style>

