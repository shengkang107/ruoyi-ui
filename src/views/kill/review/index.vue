<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="100px">
      <el-form-item label="箱柜号" prop="carNumber">
        <el-input
          v-model="queryParams.cabinetNumber"
          placeholder="请输入箱柜号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预约单号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入预约单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="createBy" v-if="checkRole(['admin','manage','sale','order'])">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入用户名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预约日期" prop="date">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.date"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择预约日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-select v-model="queryParams.time" placeholder="请选择时间" clearable size="small">
          <el-option
            v-for="dict in timeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择审核状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="消杀状态" prop="killStatus">
        <el-select v-model="queryParams.killStatus" placeholder="请选择消杀状态" clearable size="small">
          <el-option
            v-for="dict in killStatusOptions"
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
      <el-form-item label="是否高风险" prop="isDanger">
        <el-select v-model="queryParams.isDanger" placeholder="请选择是否高风险" clearable
                   size="small">
          <el-option
            v-for="dict in isDangerOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户姓名" prop="name" v-if="checkRole(['admin','manage','common','order','cashier','sale'])">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入客户姓名"
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
      <el-form-item label="客户电话" prop="phone" v-if="checkRole(['admin','manage','common','order','cashier','sale'])">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入客户电话"
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
      <el-form-item label="公司名称" prop="companyName" v-if="checkRole(['admin','manage','common','order','cashier','sale'])">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="carName" v-if="checkRole(['admin','common','manage','order'])">
        <el-input
          v-model="queryParams.carName"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机电话" prop="carPhone" v-if="checkRole(['admin','common','manage','order'])">
        <el-input
          v-model="queryParams.carPhone"
          placeholder="请输入司机电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机身份证" prop="idCard" v-if="checkRole(['admin','common','manage','order'])">
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入司机身份证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="道口" prop="crossNumber" v-if="checkRole(['admin','common'])">
        <el-input
          v-model="queryParams.crossNumber"
          placeholder="请输入道口"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="入园时间" prop="inDate" v-if="checkRole(['common','admin'])">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="inDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        placeholder="选择入园时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出园时间" prop="outDate" v-if="checkRole(['common','admin'])">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="outDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        placeholder="选择出园时间">
        </el-date-picker>
      </el-form-item>
<!--      <el-form-item label="件数" prop="count" v-if="checkRole(['admin','manage','boss','order'])">-->
<!--        <el-input-->
<!--          v-model="queryParams.count"-->
<!--          placeholder="请输入件数"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="收货冷库地址" prop="destination" v-if="checkRole(['admin','common','manage','order'])">
        <el-input
          v-model="queryParams.destination"
          placeholder="请输入收货冷库地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工厂" prop="factory" v-if="checkRole(['admin','common','manage','order'])">
        <el-input
          v-model="queryParams.factory"
          placeholder="请输入工厂"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-input
          v-model="queryParams.country"
          placeholder="请输入国家"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="毛重" prop="weight" v-if="checkRole(['admin','manage','boss','order'])">-->
<!--        <el-input-->
<!--          v-model="queryParams.weight"-->
<!--          placeholder="请输入毛重"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->

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
          v-hasPermi="['manage:kill:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:kill:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['manage:kill:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="killList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="预约单号" align="center" prop="orderNumber" width="120">
        <template slot-scope="scope">
          {{ scope.row.orderNumber }}
          <img v-if="scope.row.isBox == 0" class="isBox-icon" src="@/assets/image/kill/noBox.png" />
        </template>
      </el-table-column>
      <el-table-column label="箱柜号" align="center" prop="cabinetNumber" width="150"/>
      <el-table-column label="用户名" align="center" prop="createBy" width="100"
                       v-if="checkRole(['admin','manage','sale','order'])">
        <template slot-scope="scope">
           <span v-if="scope.row.vip=== 0">
                        {{ scope.row.createBy }}
          </span>
          <span v-else-if="scope.row.vip=== 1">
                        {{ scope.row.createBy }}
          <div slot="reference" class="name-wrapper">
            <img src="../../../assets/image/vip1.png" width="50%"/>
          </div>
          </span>
          <span v-else-if="scope.row.vip=== 2">
            {{ scope.row.createBy }}
          <div slot="reference" class="name-wrapper">
            <img src="../../../assets/image/vip2.png" width="50%"/>
          </div>
          </span>
          <span v-else-if="scope.row.vip=== 3">
                        {{ scope.row.createBy }}
          <div slot="reference" class="name-wrapper">
            <img src="../../../assets/image/vip3.png" width="50%"/>
          </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="是否高风险" align="center" prop="isDanger" width="100" :formatter="isDangerFormat"/>
      <el-table-column label="货品规格" align="center" prop="cabinetType" width="100" :formatter="cabinetTypeFormat"/>
      <el-table-column label="预约日期" align="center" prop="date" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="time" :formatter="timeFormat"/>
      <el-table-column label="报关单" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.customUrl"
            style="width: 30px; height: 30px"
            :src="scope.row.customUrl"
            :preview-src-list="[scope.row.customUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="消杀状态" align="center" prop="killStatus"
                       :formatter="killStatusFormat"/>
      <el-table-column label="订单金额" align="center" prop="orderPrice" v-if="checkRole(['admin','manage','common'])"/>
      <el-table-column label="支付状态" align="center" prop="payState" :formatter="payStatusFormat" v-if="checkRole(['admin','manage','common','order','cashier','finance'])"/>
      <el-table-column label="支付金额" align="center" prop="payPrice" v-if="checkRole(['admin','manage','common','order','cashier','finance'])"/>
      <el-table-column label="支付方式" align="center" prop="payMethod" :formatter="payMethodFormat" v-if="checkRole(['admin','manage','common','order','cashier','finance'])"/>
      <el-table-column label="提单号" align="center" prop="extractNumber" width="150"/>
      <el-table-column label="入库/中转" align="center" prop="businessType" :formatter="inputFormat"/>
      <el-table-column label="公司名称" align="center" prop="companyName" width="230" v-if="checkRole(['admin','manage','common','order','cashier','sale'])"/>
      <el-table-column label="客户姓名" align="center" prop="name" v-if="checkRole(['admin','manage','common','order','cashier','sale'])"/>
      <el-table-column label="客户电话" align="center" prop="phone" width="150" v-if="checkRole(['admin','manage','common','order','cashier','sale'])"/>
      <el-table-column label="车牌号" align="center" prop="carNumber" v-if="!checkRole(['boss','finance'])"/>
      <el-table-column label="司机姓名" align="center" prop="carName" v-if="checkRole(['admin','common','manage','order'])"/>
      <el-table-column label="司机身份证" align="center" prop="idCard" width="210" v-if="checkRole(['admin','common','manage','order'])"/>
      <el-table-column label="司机电话" align="center" prop="carPhone" width="150" v-if="checkRole(['admin','common','manage','order'])"/>
      <!-- <el-table-column label="道口" align="center" prop="crossNumber" :formatter="crossNumberOptionsFormat" v-if="checkRole(['admin','common'])"/> -->
      <el-table-column label="入园时间" align="center" prop="inDate" width="180"
                       v-if="checkRole(['common','admin'])">
      </el-table-column>
      <el-table-column label="出园时间" align="center" prop="outDate" width="180"
                       v-if="checkRole(['common','admin'])">
      </el-table-column>
      <el-table-column label="产品名称" align="center" v-if="!checkRole(['finance'])">
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
      <el-table-column label="件数(箱)" align="center" prop="count"
                       v-if="checkRole(['admin','order','common'])"/>
      <el-table-column label="毛重(KG)" align="center" prop="weight"
                       v-if="checkRole(['admin','manage','order','common'])"/>
      <el-table-column label="国家" align="center" prop="country" v-if="!checkRole(['finance'])"/>
      <el-table-column label="工厂" align="center" prop="factory" width="210" v-if="checkRole(['admin','common','manage','order'])"/>
      <el-table-column label="收货冷库地址" align="center" prop="destination" width="210" v-if="checkRole(['admin','common','manage','order'])"/>
      <el-table-column label="收货冷库名称" align="center" prop="storageName" width="210" v-if="checkRole(['admin','common','manage','order'])"/>
      <el-table-column label="检验检疫证明编号" align="center" prop="quarantineNumber" width="210" v-if="checkRole(['admin','common','manage','order'])"/>
      <el-table-column label="批次号" align="center" prop="batchNumber" width="210" v-if="checkRole(['admin','common','manage','order'])">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="批次号"
            width="200"
            trigger="hover"
            :content="scope.row.batchNumber">
            <span class="popText" slot="reference">{{scope.row.batchNumber}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" prop="createTime" width="100"
                       v-if="checkRole(['admin','manage','boss','order','sale'])">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消杀证明编号" align="center" prop="certifyCode"/>
      <el-table-column label="备注" align="center" prop="remark"
                       v-if="checkRole(['admin','manage','boss','order','finance','sale','cashier'])"/>
      <el-table-column label="操作" align="center" width="110" class-name="small-padding maxed-width"
                       v-if="checkRole(['admin','common','order','manage','finance','cashier','sale'])" fixed="right">
        <!-- status: 2驳回 -->
        <template slot-scope="scope" v-if="scope.row.status != '2'">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="(scope.row.payState=='1' || (scope.row.payState=='3' && scope.row.payMethod == '3'))
                && scope.row.killStatus!==4 && scope.row.killStatus!==5 && checkRole(['admin','manage','boss'])"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-thumb"
            @click="handleAudit(scope.row)"
            v-if="(scope.row.payState=='1' || (scope.row.payState=='3' && scope.row.payMethod == '3'))
                && scope.row.status == 0 && checkRole(['admin','manage','boss'])"
          >审核
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="allowLean(scope.row)"
            v-if="scope.row.killStatus == 7 && checkRole(['admin','manage','boss','order'])"
          >允许靠口
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-coin"
            @click="toPay(scope.row)"
            v-if="(!scope.row.payState || scope.row.payState == '0' || scope.row.payState == '2' || scope.row.payState == null) && checkRole(['common'])"
          >去支付
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate2(scope.row)"
            v-if="scope.row.status!=='1'&&checkRole(['common'])"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="customUrlDownload(scope.row.customUrl)"
            v-if="scope.row.customUrl && checkRole(['admin','common','order','manage','gov'])"
          >报关单
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="cancelReservation(scope.row)"
            v-if="scope.row.killStatus <= 1 && checkRole(['common'])"
          >取消预约
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleOpenCert(scope.row)"
            v-has-role="['common']"
            v-if="scope.row.certifyUrl"
          >下载证明
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="lookReceipt(scope.row)"
            v-if="scope.row.isInvoice == '1'"
          >发票信息
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="toRefund(scope.row)"
            v-if="scope.row.killStatus == '5' && (scope.row.payState == 1 || scope.row.payState == 6) && checkRole(['common'])"
          >退款
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="toRefundDetail(scope.row)"
            v-if="scope.row.payState >= 4 && checkRole(['common'])"
          >退款详情
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

    <!-- 审核按钮 -->
    <el-dialog class="special-open-dialog" title="消杀预约审核" :visible.sync="auditOpen" width="500px" append-to-body>
      <el-form class="open-right" ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="审核状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1" >审核通过</el-radio>
            <el-radio :label="2" >驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"
                    v-if="checkRole(['admin','manage','boss','order'])"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="auditSumbit">确 定</el-button>
        <el-button @click="auditOpen = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 单证、运营编辑 -->
    <el-dialog class="special-open-dialog" :title="title" :visible.sync="open" :width="!openLeft ? '500px' : '80%'" append-to-body>
      <div class="open-left" v-if="openLeft">
        <img :src="form.customUrl">
      </div>
      <el-form class="open-right" ref="form" :model="form" label-width="125px" :rules="rules">
        <el-form-item label="预约日期" prop="date">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.date"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择预约日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-radio-group v-model="form.time">
            <el-radio
              v-for="dict in timeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="是否入园" prop="input">
          <el-radio v-model="form.input" :label="1" :disabled="form.status != 1">是</el-radio>
          <el-radio v-model="form.input" :label="0">否</el-radio>
        </el-form-item> -->
        <el-form-item label="是否高风险" prop="isDanger">
          <el-radio-group v-model="form.isDanger" @change="isDangerChange">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提单号" prop="extractNumber">
          <el-input v-model="form.extractNumber" placeholder="请输入提单号"/>
        </el-form-item>
        <el-form-item label="客户姓名" prop="name" v-if="checkRole(['admin','manage','common','order','cashier','sale'])">
          <el-input v-model="form.name" placeholder="请输入客户姓名"/>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号"/>
        </el-form-item>
        <el-form-item label="箱柜号" prop="cabinetNumber">
          <el-input v-model="form.cabinetNumber" placeholder="请输入箱柜号"/>
        </el-form-item>
        <el-form-item label="箱柜价格" prop="orderPrice" v-if="form.isDanger == 1 || form.isDanger == 0">
          <el-radio-group v-model="form.orderPrice">
            <el-radio-button
              v-for="(item,index) in killPriceOptions"
              :key="index"
              :label="item.dictValue"
              v-show="(item.remark == '1' && form.isDanger == 1) || (item.remark == '0' && form.isDanger == 0)">
              {{item.dictLabel}}
              <img class="radio-check" v-if="form.orderPrice == item.dictValue" src="@/assets/image/kill/radio-check.png" />
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="司机姓名" prop="carName" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.carName" clearable placeholder="请输入司机姓名"/>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName" v-if="checkRole(['admin','manage','common','order','cashier','sale'])">
          <el-input v-model="form.companyName" placeholder="请输入公司名称"/>
        </el-form-item>
        <el-form-item label="司机身份证" prop="idCard" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.idCard" placeholder="请输入司机身份证"/>
        </el-form-item>
        <!-- <el-form-item label="道口" prop="crossNumber" v-if="checkRole(['admin','common'])">
          <el-input v-model="form.crossNumber" placeholder="请输入道口"/>
        </el-form-item> -->
        <el-form-item label="入园时间" prop="inDate"
                      v-if="checkRole(['admin','common'])">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.inDate"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择入园时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出园时间" prop="outDate"
                      v-if="checkRole(['admin','common'])">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.outDate"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择出园时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="货品件数(箱)" prop="count" v-if="checkRole(['admin','manage','boss','order'])">
          <el-input v-model="form.count" v-on:input="countChange" clearable placeholder="请输入件数"/>
        </el-form-item>
        <el-form-item label="货品规格" prop="cabinetType">
          <el-radio-group v-model="form.cabinetType">
            <el-radio v-for="(item,index) in cabinetTypeOptions" :key="index" :label="parseInt(item.dictValue)" :disabled="parseInt(form.count) < 500 && item.dictLabel == '其他'">
              {{item.dictLabel}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户电话" prop="phone" v-if="checkRole(['admin','manage','common','order','cashier','sale'])">
          <el-input v-model="form.phone" placeholder="请输入客户电话"/>
        </el-form-item>
        <el-form-item label="收货冷库地址" prop="destination" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.destination" placeholder="请输入收货冷库地址"/>
        </el-form-item>
        <el-form-item label="收货冷库名称" prop="storageName" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.storageName" placeholder="请输入收货冷库名称"/>
        </el-form-item>
        <el-form-item label="检验检疫证明编号" prop="quarantineNumber" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.quarantineNumber" placeholder="请输入检验检疫证明编号"/>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.batchNumber" placeholder="请输入批次号"/>
        </el-form-item>
        <el-form-item label="工厂" prop="factory" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.factory" placeholder="请输入工厂"/>
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入国家"/>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称"/>
        </el-form-item>
        <el-form-item label="司机电话" prop="carPhone" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.carPhone" :maxlength="11" show-word-limit placeholder="请输入司机电话"/>
        </el-form-item>
        <el-form-item label="毛重" prop="weight" v-if="checkRole(['admin','manage','boss','order'])">
          <el-input v-model="form.weight" placeholder="请输入毛重"/>
        </el-form-item>
        <el-form-item label="报关单" prop="customUrl">
          <el-upload
            class="upload-url"
            accept="image/*"
            list-type="picture-card"
            :headers="upload.headers"
            :action="upload.url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.customUrl" :src="form.customUrl" class="avatar">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
          <span class="look-customUrl" @click="openLeft = !openLeft">报关单大图</span>
        </el-form-item>
        <el-form-item label="封箱封带" prop="isBox">
          <el-radio-group v-model="form.isBox">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消杀后入库" prop="businessType">
          <el-radio v-model="form.businessType" :label="1">是</el-radio>
          <el-radio v-model="form.businessType" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"
                    v-if="checkRole(['admin','manage','boss','order'])"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改消杀预约对话框 -->
    <el-dialog class="special-open-dialog" :title="title" :visible.sync="commonOpen" :width="!openLeft ? '500px' : '80%'" append-to-body>
      <div class="open-left" v-if="openLeft">
        <img :src="form.customUrl">
      </div>
      <el-form class="open-right" ref="form" :model="form" :rules="rules" label-width="125px">
        <el-form-item label="客户姓名" prop="name" v-if="checkRole(['admin','manage','common','order','cashier','sale'])">
          <el-input v-model="form.name" placeholder="请输入客户姓名"/>
        </el-form-item>
        <el-form-item label="箱柜号" prop="cabinetNumber">
          <el-input v-model="form.cabinetNumber" placeholder="请输入箱柜号" disabled/>
        </el-form-item>
        <el-form-item label="司机姓名" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.carName" placeholder="请输入司机姓名"/>
        </el-form-item>
        <el-form-item label="司机电话" prop="carPhone" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.carPhone" placeholder="请输入司机电话"/>
        </el-form-item>
        <el-form-item label="司机身份证" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.idCard" placeholder="请输入司机身份证"/>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号"/>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName" v-if="checkRole(['admin','manage','common','order','cashier','sale'])">
          <el-input v-model="form.companyName" placeholder="请输入公司名称"/>
        </el-form-item>
        <!-- <el-form-item label="道口" prop="crossNumber" v-if="checkRole(['admin','common'])">
          <el-input v-model="form.crossNumber" placeholder="请输入道口"/>
        </el-form-item> -->
        <el-form-item label="客户电话" prop="phone" v-if="checkRole(['admin','manage','common','order','cashier','sale'])">
          <el-input v-model="form.phone" placeholder="请输入客户电话"/>
        </el-form-item>
        <el-form-item label="收货冷库地址" prop="destination" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.destination" placeholder="请输入收货冷库地址"/>
        </el-form-item>
        <el-form-item label="收货冷库名称" prop="storageName" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.storageName" placeholder="请输入收货冷库名称"/>
        </el-form-item>
        <el-form-item label="检验检疫证明编号" prop="quarantineNumber" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.quarantineNumber" placeholder="请输入检验检疫证明编号"/>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.batchNumber" placeholder="请输入批次号"/>
        </el-form-item>
        <el-form-item label="工厂" prop="factory" v-if="checkRole(['admin','common','manage','order'])">
          <el-input v-model="form.factory" placeholder="请输入工厂"/>
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入国家"/>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称"/>
        </el-form-item>
        <el-form-item label="货品件数(箱)" prop="count">
          <el-input
            v-model="form.count"
            v-on:input="countChange"
            placeholder="请输入货品件数"
            :maxlength="10"
            :style="{ width: '100%' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="货品规格" prop="cabinetType">
          <el-radio-group v-model="form.cabinetType">
            <el-radio v-for="(item,index) in cabinetTypeOptions" :key="index" :label="parseInt(item.dictValue)" :disabled="parseInt(form.count) < 500 && item.dictLabel == '其他'">
              {{item.dictLabel}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报关单" prop="customUrl">
          <el-upload
            class="upload-url"
            accept="image/*"
            list-type="picture-card"
            :headers="upload.headers"
            :action="upload.url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.customUrl" :src="form.customUrl" class="avatar">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
          <span class="look-customUrl" @click="openLeft = !openLeft">报关单大图</span>
        </el-form-item>
        <el-form-item label="封箱封带" prop="isBox">
          <el-radio-group v-model="form.isBox">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm">确 定</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 发票信息 -->
    <el-dialog class="recepit-dialog" title="发票信息" :visible.sync="receiptOpen" width="550px" append-to-body>
      <receipt-detail v-if="orderNumber && receiptOpen" :orderNumber="orderNumber"></receipt-detail>
    </el-dialog>
    <!-- 退款信息 -->
    <el-dialog title="退款详情" :visible.sync="refundOpen" width="800px" append-to-body>
      <refund-detail v-if="orderNumber && refundOpen" :orderNumber="orderNumber"></refund-detail>
    </el-dialog>
  </div>
</template>

<script>
import {listKill, getKill, delKill, addKill, updateKill, auditKill, leanPass } from '@/api/system/kill'
import { payRefund } from '@/api/system/finance'
import {checkRole} from '@/utils/permission' // 权限判断函数
import request from '@/utils/request'
import receiptDetail from "@/components/Receipt/detail";
import refundDetail from "@/components/refund/detail";
import { getToken } from "@/utils/auth";

export default {
  name: 'Kill',
  components: {
    receiptDetail,
    refundDetail
  },
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
      // 总条数
      total: 0,
      // 消杀预约表格数据
      killList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      commonOpen: false,
      // 时间字典
      timeOptions: [],
      // 状态字典
      statusOptions: [],
      // 消杀状态字典
      killStatusOptions: [],
      // 支付状态字典
      payStatusOptions: [],
      //支付方式字典
      payMethodOptions: [],
      //货品规格字典
      cabinetTypeOptions: [],
      //箱柜价格
      killPriceOptions: [],
      //道口字典
      crossNumberOptions: [],
      isDangerOptions: [],
      inputOptions: [],
      inDate: [],
      outDate: [],
      // 查询参数
      queryParams: {
        date: null,
        pageNum: 1,
        pageSize: 10,
        time: null,
        vip: null,
        status: null,
        orderNumber: null,
        createBy: null,
        killStatus: null,
        payState: null,
        Input: null,
        name: null,
        carNumber: null,
        carName: null,
        companyName: null,
        cabinetNumber: null,
        idCard: null,
        businessType: null,
        crossNumber: null,
        count: null,
        phone: null,
        destination: null,
        storageName: null,
        quarantineNumber: null,
        batchNumber: null,
        factory: null,
        country: null,
        productName: null,
        carPhone: null,
        weight: null,
        input: null,
        isDanger: null
      },
      // 表单参数
      form: {
        isDanger: 0,
        extractNumber: null,
        input: 0,
        businessType: null,
        storageName: null,
        quarantineNumber: null,
        batchNumber: null
      },
      // 表单校验
      rules: {
        date: [{
          required: true,
          message: '请选择日期选择',
          trigger: 'change'
        }],
        // carNumber: [{
        //   required: true,
        //   message: '请输入车牌号',
        //   trigger: 'blur'
        // }], carName: [{
        //   required: true,
        //   message: '请输入驾驶员姓名',
        //   trigger: 'blur'
        // }],
        // carPhone: [{
        //   required: true,
        //   message: '请输入驾驶员电话',
        //   trigger: 'blur'
        // }, {
        //   pattern: /^1[3-9]\d{9}$/,
        //   message: '手机号格式错误',
        //   trigger: 'blur'
        // }],
        phone: [{
          required: true,
          message: '请输入客户电话',
          trigger: 'blur'
        }, {
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        // idCard: [{
        //   required: true,
        //   message: '请输入驾驶员身份证号',
        //   trigger: 'blur'
        // }, {
        //   pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        //   message: '请输入正确的身份号',
        //   trigger: 'blur'
        // }],
        cabinetNumber: [{
          required: true,
          message: '请输入箱柜号',
          trigger: 'blur'
        },{
          pattern:  /^[0-9a-zA-Z]*$/g,
          message: "箱柜号只能是数字和字母",
          trigger: "blur",
        }],
        companyName: [{
          required: true,
          message: '请输入公司名称',
          trigger: 'blur'
        }], name: [{
          required: true,
          message: '请输入联系人姓名',
          trigger: 'blur'
        }],
        productName: [{
          required: true,
          message: '请输入产品名称',
          trigger: 'blur'
        }],
        country: [{
          required: true,
          message: '请输入国家',
          trigger: 'blur'
        }],
        factory: [{
          required: true,
          message: '请输入工厂',
          trigger: 'blur'
        }],
        destination: [{
          required: true,
          message: '请输入收货冷库地址',
          trigger: 'blur'
        }],
        // weight: [{
        //   required: true,
        //   message: '请输入重量(KG)',
        //   trigger: 'blur'
        // }, {
        //   pattern: /^[0-9]+(.[0-9]{1,3})?$/,
        //   message: '重量只能是数字',
        //   trigger: 'blur'
        // }],
        // count: [{
        //   required: true,
        //   message: '请输入件数(箱)',
        //   trigger: 'blur'
        // }, {
        //   pattern: /^[0-9]+(.[0-9]{1,3})?$/,
        //   message: '件数只能是数字',
        //   trigger: 'blur'
        // }],
        cabinetType: [{
          required: true,
          message: "请选择货品规格",
          trigger: "change",
        }]
      },
      //发票信息所需
      receiptOpen: false,
      orderNumber: "",
      refundOpen: false,
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/oss/oss/uploadFile"
      },
      openLeft: false,
      auditOpen: false
    }
  },
  created() {
    this.getDicts('kill_danger').then(response => {
      this.isDangerOptions = response.data
    })
    this.getList()
    this.getDicts('reservation_time').then(response => {
      this.timeOptions = response.data
    })
    this.getDicts('reservation_status').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('kill_status').then(response => {
      this.killStatusOptions = response.data
    })
    this.getDicts('pay_status').then(response => {
      this.payStatusOptions = response.data
    })
    this.getDicts('pay_method').then(response => {
      this.payMethodOptions = response.data
    })
    //箱柜-价格
    this.getDicts("kill_price").then((response) => {
      if (response.data.length > 0) {
        this.killPriceOptions = response.data;
      }
    });
    this.getDicts("cabinet_type").then((response) => {
      if (response.data.length > 0) {
        this.cabinetTypeOptions = response.data;
      }
    });
    this.getDicts('business_type').then(response => {
      this.inputOptions = response.data
    });
    this.getDicts('cross_number').then(response => {
      for (let i = 0; i < response.data.length; i++) {
        const data = response.data[i]
        const children = []
        this.getDicts(response.data[i].dictValue).then(res => {
          for (let j = 0; j < res.data.length; j++) {
            children.push({ label: res.data[j].dictLabel, value: res.data[j].dictValue })
          }
        })
        this.crossNumberOptions.push(
          { label: data.dictLabel, value: data.dictValue, children: children })
      }
    })
  },
  methods: {
    /** 下载证明 */
    handleOpenCert(row) {
      var tempwindow = window.open('_blank');
      tempwindow.location = row.certifyUrl;
    },
    /** 查看发票信息 */
    lookReceipt(row) {
      this.orderNumber = "";
      this.orderNumber = row.orderNumber;
      this.receiptOpen = true;
    },
    /** 退款操作 */
    toRefund(row) {
      this.$prompt('请输入退款理由', '预约编号："' + row.orderNumber + '"', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        let reason = {
          orderNumber: row.orderNumber,
          refundReason: value,
          payState: 4
        }
        payRefund(reason).then(response => {
          if (response.code === 200) {
            this.msgSuccess('申请退款成功,请等待审核');
            this.getList();
          }
        })
      }).catch(() => {

      });
    },
    /** 查看退款详情 */
    toRefundDetail(row) {
      this.orderNumber = "";
      this.orderNumber = row.orderNumber;
      this.refundOpen = true;
    },
    checkRole,
    /** 查询消杀预约列表 */
    getList() {
      this.loading = true
      listKill(this.addDateRange(this.queryParams, null,null,this.inDate,this.outDate)).then(response => {
        this.killList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 道口翻译
    crossNumberOptionsFormat(row, column) {
      if (row.crossNumber != null) {
        let number
        for (let i = 0; i < this.crossNumberOptions.length; i++) {
          if (this.crossNumberOptions[i].value === row.crossNumber.split(',')[0]) {
            number = this.crossNumberOptions[i].label
            for (let j = 0; j < this.crossNumberOptions[i].children.length; j++) {
              if (this.crossNumberOptions[i].children[j].value === row.crossNumber.split(
                ',')[1]) {
                number += this.crossNumberOptions[i].children[j].label
              }
            }
          }
        }
        return number
      }
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
    // 消杀状态字典翻译
    killStatusFormat(row, column) {
      return this.selectDictLabel(this.killStatusOptions, row.killStatus)
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
    //货品规格字典翻译
    cabinetTypeFormat(row, column) {
      if (row.cabinetType) {
        return this.selectDictLabel(this.cabinetTypeOptions, row.cabinetType)
      }
    },
    inputFormat(row, column) {
      return this.selectDictLabel(this.inputOptions, row.businessType)
    },
    countChange(val) {
      //监控货品数量
      if (parseInt(val.count) < 500) {
        this.form.cabinetType = 1;
      } else {
        this.form.cabinetType = undefined;
      }
    },
    beforeAvatarUpload() {},
    handleAvatarSuccess(response, file, fileList) {
      this.form.customUrl = response.data.url;
    },
    statusChange(val) {
      //监控状态是否为审核通过
      if (val == '0' || val == '2') {
        this.form.input = 0;
      }
    },
    isDangerChange(val) {
      //监控是否高风险
      this.form.orderPrice = undefined;
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },// 取消按钮
    cancel2() {
      this.commonOpen = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        date: null,
        time: null,
        status: '0',
        killStatus: 0,
        payState: 0,
        name: null,
        carNumber: null,
        carName: null,
        companyName: null,
        idCard: null,
        crossNumber: null,
        outDate: null,
        count: null,
        phone: null,
        destination: null,
        factory: null,
        country: null,
        productName: null,
        carPhone: null,
        weight: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        inDate: null,
        createBy: null,
        createTime: null
      }
      this.resetForm('form');
      this.openLeft = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.inDate = null;
      this.outDate = null;
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加消杀预约'
    },
    allowLean(row) {
      //允许靠口
      this.$confirm('确认允许靠口?', '预约单号：'+ row.orderNumber, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        leanPass(row).then(response => {
          if (response.code === 200) {
            this.msgSuccess('操作成功');
            this.getList()
          }
        })
      }).catch(() => {
      })
    },
    /** 单证编辑按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getKill(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '消杀预约修改'
      })
    },
    //审核
    handleAudit(row) {
      this.reset()
      const id = row.id || this.ids
      getKill(id).then(response => {
        this.form = response.data;
        this.auditOpen = true;
      })
    },
    /** 下载报关单 */
    customUrlDownload(url) {
      var tempwindow = window.open('_blank');
      tempwindow.location = url;
    },
     /** 修改按钮操作 */
    handleUpdate2(row) {
      this.reset()
      const id = row.id || this.ids
      getKill(id).then(response => {
        this.form = response.data
        this.commonOpen = true
        this.title = '修改消杀预约'
      })
    },
    //去支付
    toPay(row) {
      this.$router.push({path: '/review/pay',query: { id: row.id }})
    },
    //取消预约
    cancelReservation(row) {
      this.reset()
      this.$confirm('是否确认取消消杀预约编号为"' + row.id + '"的预约?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.killStatus = 5
        updateKill(row).then(response => {
          if (response.code === 200) {
            this.msgSuccess('已取消预约')
            this.getList()
          }
        })
      }).catch(() => {
      })
    },
    //审核提交
    auditSumbit() {
      //审核通过-驳回；不与修改互斥
      auditKill(this.form).then(response => {
        if (response.code === 200) {
          //操作成功
          this.msgSuccess('操作成功')
          this.auditOpen = false;
          this.getList()
        }
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateKill(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.commonOpen = false
                this.getList()
              }
            })
          } else {
            addKill(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除消杀预约编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delKill(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function () {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/kill/export', {
        ...this.queryParams
      }, `system_kill.xlsx`)
    }
  }
}
</script>
<style lang="scss">
.special-open-dialog {
	.el-dialog__body {
		display: flex;
		padding: 10px 20px;
		overflow: hidden;
		.open-right {
			flex: 1;
			padding: 0 20px;
			overflow: scroll;
			.look-customUrl {
				font-size: 12px;
				margin-left: 15px;
				color: #20B32E;
				vertical-align: bottom;
				cursor: pointer;
			}
		}
		.open-left {
			flex: 1;
			overflow: scroll;
			//滚动条样式
			&::-webkit-scrollbar {
				width: 8px;
				height: 8px;
			}
			&::-webkit-scrollbar-thumb {
			  border-radius: 10px;
			  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
			  background: rgba(0, 0, 0, 0.2);
			}
			&::-webkit-scrollbar-track {
			  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
			  border-radius: 0;
			  background: rgba(0, 0, 0, 0);
			}
		}
	}
}
.recepit-dialog {
  .el-dialog__header {
    background: #20B32E;
    text-align: center;
    padding: 10px;
    .el-dialog__title,
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 13px;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
