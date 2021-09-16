<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="!showSearch"
             label-width="96px"
    >
      <el-form-item label="箱柜号" prop="cabinetNumber">
        <el-input
          v-model="queryParams.cabinetNumber"
          placeholder="请输入箱柜号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="carNumber" v-if="!checkRole(['finance','boss'])">
        <el-input
          v-model="queryParams.carNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="carName" v-if="!checkRole(['finance','boss','warehouse'])">
        <el-input
          v-model="queryParams.carName"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机身份证" prop="idCard"
                    v-if="checkRole(['admin','order','gov','hulenglian','manage'])"
      >
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入司机身份证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机电话" prop="carPhone"
                    v-if="checkRole(['admin','order','gov','hulenglian','manage','warehouse','cashier'])"
      >
        <el-input
          v-model="queryParams.carPhone"
          placeholder="请输入司机电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消杀状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" multiple placeholder="请选择消杀状态" clearable
                   size="small"
        >
          <el-option
            v-for="dict in orderStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="核酸检测机构" prop="checkCompany">
        <el-select v-model="queryParams.checkCompany" placeholder="请选择核酸检测机构" clearable
                   size="small"
        >
          <el-option
            v-for="dict in checkCompanyOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="区局程序" prop="program" v-if="checkRole(['admin','gov','manage'])">
        <el-select v-model="queryParams.program" placeholder="请选择区局程序" clearable
                   size="small"
        >
          <el-option
            v-for="dict in programOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否高风险" prop="isDanger">
        <el-select v-model="queryParams.isDanger" placeholder="请选择是否高风险" clearable
                   size="small"
        >
          <el-option
            v-for="dict in isDangerOptions"
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
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="96px"
    >
      <el-form-item label="箱柜号" prop="cabinetNumber">
        <el-input
          v-model="queryParams.cabinetNumber"
          placeholder="请输入箱柜号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="carNumber" v-if="!checkRole(['finance','boss'])">
        <el-input
          v-model="queryParams.carNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="carName" v-if="!checkRole(['finance','boss','warehouse'])">
        <el-input
          v-model="queryParams.carName"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机身份证" prop="idCard"
                    v-if="checkRole(['admin','order','gov','hulenglian','manage'])"
      >
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入司机身份证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机电话" prop="carPhone"
                    v-if="checkRole(['admin','order','gov','hulenglian','manage','warehouse','cashier'])"
      >
        <el-input
          v-model="queryParams.carPhone"
          placeholder="请输入司机电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消杀状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" multiple placeholder="请选择消杀状态" clearable
                   size="small"
        >
          <el-option
            v-for="dict in orderStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="核酸检测机构" prop="checkCompany">
        <el-select v-model="queryParams.checkCompany" placeholder="请选择核酸检测机构" clearable
                   size="small"
        >
          <el-option
            v-for="dict in checkCompanyOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
      <el-form-item label="入园时间" prop="date" v-if="!checkRole(['warehouse','finance'])">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        placeholder="选择入园时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="道口" prop="crossNumber" v-if="!checkRole(['finance'])">
        <div class="block">
          <span class="demonstration"></span>
          <el-cascader
            v-model="queryParams.crossNumber"
            :options="crossNumberOptions"
            clearable
          ></el-cascader>
        </div>
      </el-form-item>
      <el-form-item label="靠口时间" prop="inDate" v-if="!checkRole(['finance'])">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="inDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        placeholder="选择靠口时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出园时间" prop="outDate" v-if="!checkRole(['finance','warehouse'])">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="outDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        placeholder="选择出园时间"
        >
        </el-date-picker>
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

      <el-form-item label="提单号" prop="extractNumber">
        <el-input
          v-model="queryParams.extractNumber"
          placeholder="请输入提单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="码头" prop="pier"
                    v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])"
      >
        <el-input
          v-model="queryParams.pier"
          placeholder="请输入码头"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="国家" prop="country" v-if="!checkRole(['finance'])">
        <el-input
          v-model="queryParams.country"
          placeholder="请输入国家"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName" v-if="!checkRole(['finance'])">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="件数(箱)" prop="count" v-if="!checkRole(['finance','cashier','boss'])">
        <el-input
          v-model="queryParams.count"
          placeholder="请输入件数(箱)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="毛重" prop="weight" v-if="!checkRole(['finance','cashier','boss'])">
        <el-input
          v-model="queryParams.weight"
          placeholder="请输入毛重(KG)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="收货冷库地址" prop="destination"
                    v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])"
      >
        <el-input
          v-model="queryParams.destination"
          placeholder="请输入收货冷库地址"
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
      <el-form-item label="核酸证明" prop="naCertificate" v-if="checkRole(['admin','sale','manage','order'])">
        <el-select v-model="queryParams.naCertificate" placeholder="请选择支付状态" clearable size="small">
          <el-option
            v-for="dict in naCertificateOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否备份" prop="isBack" v-if="checkRole(['admin','sale','manage','order'])">
        <el-select v-model="queryParams.isBack" placeholder="请选择支付状态" clearable size="small">
          <el-option
            v-for="dict in isBackOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工厂" prop="factory"
                    v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])"
      >
        <el-input
          v-model="queryParams.factory"
          placeholder="请输入工厂"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户姓名" prop="name"
                    v-if="checkRole(['admin','order','cashier','gov','hulenglian','manage','sale'])"
      >
        <el-input
          v-model="queryParams.name"
          placeholder="请输入客户姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话" prop="phone"
                    v-if="checkRole(['admin','order','cashier','gov','hulenglian','manage','sale'])"
      >
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入客户电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区局程序" prop="program" v-if="checkRole(['admin','gov','manage'])">
        <el-select v-model="queryParams.program" placeholder="请选择区局程序" clearable
                   size="small"
        >
          <el-option
            v-for="dict in programOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否高风险" prop="isDanger">
        <el-select v-model="queryParams.isDanger" placeholder="请选择是否高风险" clearable
                   size="small"
        >
          <el-option
            v-for="dict in isDangerOptions"
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
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:recordKill:add']"
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
          v-hasPermi="['system:recordKill:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['manage:recordKill:import']"
        >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['manage:recordKill:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-search"
          size="mini"
          @click="handleTwo"
          v-hasPermi="['manage:recordKill:fiveDay']"
        >近两日
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-search"
          size="mini"
          @click="handleFive"
          v-hasPermi="['manage:recordKill:fiveDay']"
        >近五日
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- :max-height="tabelHeight"  -->
    <el-table :cell-style="cellStyle" :row-class-name="tableRowClassName" v-loading="loading" :data="killList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="订单编号" sortable prop="id" width="100">
        <template slot-scope="scope">
          {{ scope.row.id }}
          <img v-if="scope.row.isBox == 0" class="isBox-icon" src="@/assets/image/kill/noBox.png"/>
        </template>
      </el-table-column>
      <el-table-column label="预约单号" align="center" prop="orderNumber" width="120"/>
      <el-table-column label="箱柜号" align="center" prop="cabinetNumber" width="180"/>
      <el-table-column label="用户名" align="center" prop="username" width="200" v-if="checkRole(['admin','order','manage','sale'])">
        <template slot-scope="scope">
          <span v-if="scope.row.vip=== 0">{{ scope.row.username }}</span>
          <div v-else-if="scope.row.vip=== 1">
            <div slot="reference" style="display:inline">
              <img src="../../../assets/image/vip1.png" width="20%"/>
            </div>
            <div style="display:inline">{{ scope.row.username }}</div>
          </div>
          <div v-else-if="scope.row.vip=== 2" class="div_allinline">
            <div slot="reference" class="subdiv_allinline">
              <img src="../../../assets/image/vip2.png" width="20%"/>
            </div>
            <div class="subdiv_allinline">{{ scope.row.username }}</div>
          </div>
          <div v-else-if="scope.row.vip=== 3">
            <div slot="reference" class="name-wrapper" style="display:inline">
              <img src="../../../assets/image/vip3.png" width="20%"/>
            </div>
            <div style="display:inline">
              {{ scope.row.username }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否高风险" align="center" prop="isDanger" width="100" :formatter="isDangerFormat" />
      <el-table-column label="消杀状态" align="center" prop="orderStatus" :formatter="orderStatusFormat"/>
      <el-table-column label="订单金额" align="center" prop="orderPrice" v-if="!checkRole(['manage','gov','hulenglian'])"/>
      <el-table-column label="支付状态" align="center" prop="payState" :formatter="payStatusFormat" v-if="!checkRole(['gov','hulenglian'])"/>
      <el-table-column label="支付金额" align="center" prop="payPrice" v-if="!checkRole(['warehouse','gov','hulenglian'])"/>
      <el-table-column label="支付方式" align="center" prop="payMethod" :formatter="payMethodFormat" v-if="!checkRole(['warehouse','gov','hulenglian'])"/>
      <el-table-column label="入园时间" sortable align="center" prop="date" width="180" v-if="!checkRole(['warehouse','finance'])"></el-table-column>
      <el-table-column label="报关单" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.customUrl"
            style="width: 30px; height: 30px"
            :src="scope.row.customUrl"
            :preview-src-list="[scope.row.customUrl]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="道口" align="center" prop="crossNumber" :formatter="crossNumberOptionsFormat" width="120" />
      <el-table-column label="靠口时间" sortable align="center" prop="inDate" width="180" v-if="!checkRole(['finance'])"></el-table-column>
      <el-table-column label="出园时间" sortable align="center" prop="outDate" width="180" v-if="!checkRole(['finance','warehouse'])"></el-table-column>
      <el-table-column label="货品规格" align="center" prop="cabinetType" width="75" :formatter="cabinetTypeFormat"/>
      <el-table-column label="提单号" align="center" prop="extractNumber" width="200"/>
      <el-table-column label="入库/中转" align="center" prop="businessType" :formatter="inputFormat"/>
      <el-table-column label="车牌号" align="center" prop="carNumber" width="100" v-if="!checkRole(['finance','boss'])" />
      <el-table-column label="司机姓名" align="center" prop="carName" v-if="!checkRole(['finance','boss','warehouse','sale'])" />
      <el-table-column label="司机身份证" align="center" prop="idCard" width="210" v-if="checkRole(['admin','order','gov','hulenglian','manage'])" />
      <el-table-column label="司机电话" align="center" prop="carPhone" width="180" v-if="checkRole(['admin','order','gov','hulenglian','manage','warehouse','cashier'])" />
      <el-table-column label="公司名称" align="center" prop="companyName" width="180" v-if="checkRole(['admin','order','cashier','gov','hulenglian','manage','sale'])" />
      <el-table-column label="客户姓名" align="center" prop="name" v-if="checkRole(['admin','order','cashier','gov','hulenglian','manage','sale'])" />
      <el-table-column label="客户电话" align="center" prop="phone" v-if="checkRole(['admin','order','cashier','gov','hulenglian','manage','sale'])" />
      <el-table-column label="产品名称" align="center" width="210" v-if="!checkRole(['finance'])">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="产品名称"
            width="200"
            trigger="hover"
            :content="scope.row.productName"
          >
            <span class="popText" slot="reference">{{ scope.row.productName }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="件数(箱)" align="center" prop="count" width="80" v-if="!checkRole(['finance','cashier','boss'])" />
      <el-table-column label="毛重(KG)" align="center" prop="weight" width="100" v-if="!checkRole(['finance','cashier','boss'])" />
      <el-table-column label="码头" align="center" prop="pier" v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])" />
      <el-table-column label="国家" align="center" prop="country" v-if="!checkRole(['finance'])"/>
      <el-table-column label="工厂" align="center" prop="factory" width="210" v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])" />
      <el-table-column label="收货冷库地址" align="center" prop="destination" width="210" v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])" />
      <el-table-column label="收货冷库名称" align="center" prop="storageName" width="210" v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])" />
      <el-table-column label="检验检疫证明编号" align="center" prop="quarantineNumber" width="210" v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])" />
      <el-table-column label="批次号" align="center" prop="batchNumber" width="210" v-if="checkRole(['admin','sale','manage','order','gov','hulenglian'])" >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="批次号"
            width="200"
            trigger="hover"
            :content="scope.row.batchNumber"
          >
            <span class="popText" slot="reference">{{ scope.row.batchNumber }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="消杀证明编号" align="center" prop="certifyCode"/>
      <el-table-column label="核酸证明" align="center" prop="naCertificate"
                       :formatter="naCertificateFormat"
                       v-if="checkRole(['admin','sale','manage','order'])"
      />
      <el-table-column label="核酸检测机构" align="center" prop="checkCompany" :formatter="checkCompanyFormat" />
      <el-table-column label="打印份数" align="center" prop="printCount"
                       v-if="checkRole(['admin','manage','order'])"
      />
      <el-table-column label="是否备份" align="center" prop="isBack" :formatter="isBackFormat"
                       v-if="checkRole(['admin','manage','order'])"
      />
      <el-table-column label="采样数据" align="center" prop="sampledData" width="180"
                       v-if="checkRole(['admin','sale','manage','order','gov','hulenglian','warehouse','finance','boss'])"
      />
      <el-table-column label="送检时间" align="center" prop="checkDate" width="180"
                       v-if="checkRole(['admin','sale','manage','order','gov','hulenglian','warehouse','finance','boss'])"
      />
      <el-table-column label="区局程序" align="center" prop="program" width="180"
                       :formatter="programFormat" v-if="checkRole(['gov','manage','admin'])"
      />
      <el-table-column label="备注" align="center" prop="remark" width="210"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding maxed-width" width="120"
                       v-if="checkRole(['admin','order','gov','hulenglian','manage','cashier','boss'])"
                       fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handlePass(scope.row)"
            v-if="checkRole(['admin','order'])&&scope.row.payState=='1'&&scope.row.orderStatus==='1'&&scope.row.isWait!==true&&scope.row.reason==null"
          >插队
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-loading"
            disabled
            v-if="checkRole(['admin','order'])&&scope.row.orderStatus==='1'&&scope.row.isWait!==true&&scope.row.reason!=null&&scope.row.pass!==true"
          >等待插队审批
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleApprove(scope.row)"
            v-if="checkRole(['admin','boss'])&&scope.row.orderStatus==='1'&&scope.row.isWait!==true&&scope.row.reason!=null&&scope.row.pass!==true"
          >插队审批
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleUpdateKillStatus1(scope.row)"
            v-if="(checkRole(['admin','order','manage'])&&scope.row.orderStatus==='1'&&scope.row.payState=='1')
            &&(scope.row.isWait===true||scope.row.pass===true||(scope.row.pass===true&&checkRole(['order'])&&scope.row.orderStatus==='1'&&scope.row.payState=='1'))"
          >靠口
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleEndCheckWindows(scope.row)"
            v-if="checkRole(['admin','order','manage'])&&scope.row.orderStatus==='3'"
          >放行
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="customUrlDownload(scope.row.customUrl)"
            v-if="scope.row.customUrl && checkRole(['common','order','manage','gov'])"
          >报关单
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleBox(scope.row)"
            v-if="checkRole(['admin','order','manage']) && scope.row.isBox == 1"
          >附加费用
          </el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleEndKillWindows(scope.row)"
            v-if="checkRole(['admin','order','manage'])&&scope.row.orderStatus==='2'"
          >已完成
          </el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="checkRole(['admin','manage','order'])"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="handleEndKillWindows(scope.row)"
            v-has-role="['order']"
            v-if="!scope.row.certifyUrl && scope.row.orderStatus > '1'"
          >上传证明
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="updateEndKillWindows(scope.row)"
            v-has-role="['order']"
            v-if="scope.row.certifyUrl"
          >修改证明
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleOpenCert(scope.row)"
            v-has-role="['gov','hulenglian','manage','common','admin','order']"
            v-if="scope.row.certifyUrl"
          >下载证明
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateGov(scope.row)"
            v-if="checkRole(['admin','gov'])"
          >修改送检
          </el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handlePay(scope.row)"
            v-if="checkRole(['admin','cashier'])"
          >到账审核
          </el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-close"
            @click="handleUpdateKillStatus5(scope.row)"
            v-if="checkRole(['admin','order','manage'])&&scope.row.orderStatus!=='5'"
          >取消订单
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

    <!-- order修改 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="124px">
        <el-form-item label="预约单号" prop="orderNumber">
          <el-input v-model="form.orderNumber" placeholder="请输入预约单号"/>
        </el-form-item>
        <el-form-item label="入园时间" prop="date" v-if="!checkRole(['warehouse','finance'])">
          <el-date-picker
            clearable size="small"
            style="width: 200px"
            v-model="form.date"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择入园时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="道口原始数据" prop="crossNumber" v-if="!checkRole(['finance'])">
          <el-input v-model="form.crossNumber" placeholder="请输入道口" disabled/>
        </el-form-item>
        <!-- <el-form-item label="道口" prop="crossNumber" v-if="!checkRole(['finance'])">
          <div class="block">
            <span class="demonstration"></span>
            <el-cascader
              v-if="crossNumberOptions"
              v-model="form.crossNumber"
              :options="crossNumberOptions"
              :disabled="form.orderStatus == '6'"
              clearable
            ></el-cascader>
          </div>
        </el-form-item> -->
        <el-form-item label="靠口时间" prop="inDate" v-if="!checkRole(['finance'])">
          <el-date-picker
            clearable size="small"
            style="width: 200px"
            v-model="form.inDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择靠口时间"
            :picker-options="pickerOptions2"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出园时间" prop="outDate" v-if="form.orderStatus===4">
          <el-date-picker
            clearable size="small"
            style="width: 200px"
            v-model="form.outDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择出园时间"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否高风险" prop="isDanger">
          <el-select v-model="form.isDanger" placeholder="请选择是否高风险" clearable size="small">
            <el-option
              v-for="dict in isDangerOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="核酸检测机构" prop="checkCompany">
          <el-select v-model="form.checkCompany" placeholder="请选择核酸检测机构" clearable size="small">
            <el-option
              v-for="dict in checkCompanyOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber" v-if="!checkRole(['finance','boss'])">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号"/>
        </el-form-item>
        <el-form-item label="司机姓名" prop="carName" v-if="!checkRole(['finance','boss','warehouse'])">
          <el-input v-model="form.carName" placeholder="请输入司机姓名"/>
        </el-form-item>
        <el-form-item label="司机身份证" prop="idCard"
                      v-if="checkRole(['admin','order','gov','hulenglian','manage'])"
        >
          <el-input v-model="form.idCard" placeholder="请输入司机身份证"/>
        </el-form-item>
        <el-form-item label="司机电话" prop="carPhone"
                      v-if="checkRole(['admin','order','gov','hulenglian','manage','warehouse','cashier'])"
        >
          <el-input v-model="form.carPhone" placeholder="请输入司机电话"/>
        </el-form-item>
        <el-form-item label="箱柜号" prop="cabinetNumber">
          <el-input v-model="form.cabinetNumber" placeholder="请输入箱柜号"/>
          <el-dropdown @command="handleCommand" v-if="msgDrop">
          <span class="el-dropdown-link">下拉选择日期<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown" align="center">
              <el-dropdown-item
                v-for="(msg,index) in AllMsg" :key="index"
                v-text="'预约时间:'+msg.date+'---预约单号:'+msg.id"
                :command="msg.id"
              ></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="right-items" style="float: right;padding-left: 10px">
            <el-col :span="1.5" style="margin: 10px 10px 10px 0;"
            >
              <el-button
                type="cyan" icon="el-icon-search"
                size="mini"
                @click="handleFind"
                v-hasPermi="['manage:recordKill:find']"
              >查询
              </el-button>
            </el-col>
            <el-col :span="1.5" style="margin: 10px 10px 10px 0;"
            >
              <el-button
                type="danger" icon="el-icon-refresh"
                size="mini"
                @click="reset"
                v-hasPermi="['manage:recordKill:reset']"
              >重置
              </el-button>
            </el-col>
          </div>
        </el-form-item>
        <el-form-item label="提单号" prop="extractNumber">
          <el-input v-model="form.extractNumber" placeholder="请输入提单号"/>
        </el-form-item>
        <el-form-item label="码头" prop="pier"
                      v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])"
        >
          <el-input v-model="form.pier" placeholder="请输入码头"/>
        </el-form-item>
        <el-form-item label="国家" prop="country" v-if="!checkRole(['finance'])">
          <el-input v-model="form.country" placeholder="请输入国家"/>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName" v-if="!checkRole(['finance'])">
          <el-input v-model="form.productName" placeholder="请输入产品名称"/>
        </el-form-item>
        <el-form-item label="件数(箱)" prop="count" v-if="!checkRole(['finance','cashier','boss'])">
          <el-input v-model="form.count" placeholder="请输入件数(箱)"/>
        </el-form-item>
        <el-form-item label="货品规格" prop="cabinetType">
          <el-radio-group v-model="form.cabinetType">
            <el-radio v-for="(item,index) in cabinetTypeOptions" :key="index" :label="parseInt(item.dictValue)">
              {{item.dictLabel}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="毛重(KG)" prop="weight" v-if="!checkRole(['finance','cashier','boss'])">
          <el-input v-model="form.weight" placeholder="请输入毛重(KG)"/>
        </el-form-item>
        <el-form-item label="收货冷库地址" prop="destination"
                      v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])"
        >
          <el-input v-model="form.destination" placeholder="请输入收货冷库地址"/>
        </el-form-item>
        <el-form-item label="收货冷库名称" prop="storageName"
                      v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])"
        >
          <el-input v-model="form.storageName" placeholder="请输入收货冷库名称"/>
        </el-form-item>
        <el-form-item label="消杀证明编号" prop="certifyCode"
                      v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])"
        >
          <el-input v-model="form.certifyCode" placeholder="消杀证明编号"/>
        </el-form-item>
        <el-form-item label="检验检疫证明编号" prop="quarantineNumber"
                      v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])"
        >
          <el-input v-model="form.quarantineNumber" placeholder="请输入检验检疫证明编号"/>
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber"
                      v-if="checkRole(['admin','sale','manage','order','gov','hulenglian'])"
        >
          <el-input v-model="form.batchNumber" placeholder="请输入批次号"/>
        </el-form-item>
        <el-form-item label="核酸证明" v-if="checkRole(['sale','manage','order','admin'])">
          <el-radio-group v-model="form.naCertificate">
            <el-radio
              v-for="dict in naCertificateOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{ dict.dictLabel }}
            </el-radio>
            <el-input v-model="form.printCount" v-if="form.naCertificate===1" placeholder="打印份数"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否备份" v-if="checkRole(['admin','sale','manage','order'])">
          <el-radio-group v-model="form.isBack">
            <el-radio
              v-for="dict in isBackOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消杀后入库" prop="businessType">
          <el-radio v-model="form.businessType" :label="1">是</el-radio>
          <el-radio v-model="form.businessType" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="工厂" prop="factory"
                      v-if="checkRole(['admin','order','sale','manage','gov','hulenglian'])"
        >
          <el-input v-model="form.factory" placeholder="请输入工厂"/>
        </el-form-item>
        <el-form-item label="客户姓名" prop="name"
                      v-if="checkRole(['admin','order','cashier','gov','hulenglian','manage','sale'])"
        >
          <el-input v-model="form.name" placeholder="请输入客户姓名"/>
        </el-form-item>
        <el-form-item label="客户电话" prop="phone"
                      v-if="checkRole(['admin','order','cashier','gov','hulenglian','manage','sale'])"
        >
          <el-input v-model="form.phone" placeholder="请输入客户电话"/>
        </el-form-item>
        <el-form-item label="报关单" prop="customUrl">
          <el-upload
            class="upload-url"
            accept="image/*"
            list-type="picture-card"
            :headers="uploadCustom.headers"
            :action="uploadCustom.url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.customUrl" :src="form.customUrl" class="avatar">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="封箱封带" prop="isBox">
          <el-radio-group v-model="form.isBox">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
    <!--已靠口，靠口-->
    <el-dialog :title="title" :visible.sync="openKillStatus1" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rulesKillStatus1" label-width="124px">
        <el-form-item label="道口" prop="crossNumber" v-if="!checkRole(['finance'])">
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
        <el-form-item label="靠口时间" prop="inDate" v-if="!checkRole(['finance'])">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.inDate"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择靠口时间"
                          :picker-options="pickerOptions2"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="是否高风险" prop="isDanger">
          <el-select v-model="form.isDanger" placeholder="请选择是否高风险" clearable
                     size="small"
          >
            <el-option
              v-for="dict in isDangerOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提单号" prop="extractNumber">
          <el-input v-model="form.extractNumber" placeholder="请输入提单号"/>
        </el-form-item> -->
        <el-form-item label="核酸检测机构" prop="checkCompany">
          <el-select v-model="form.checkCompany" placeholder="请选择核酸检测机构" clearable
                     size="small"
          >
            <el-option
              v-for="dict in checkCompanyOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="车牌号" prop="carNumber" v-if="!checkRole(['finance','boss'])">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号"/>
        </el-form-item>
        <el-form-item label="司机姓名" prop="carName" v-if="!checkRole(['finance','boss','warehouse'])">
          <el-input v-model="form.carName" placeholder="请输入司机姓名"/>
        </el-form-item>
        <el-form-item label="司机身份证" prop="idCard"
                      v-if="checkRole(['admin','order','gov','hulenglian','manage'])"
        >
          <el-input v-model="form.idCard" placeholder="请输入司机身份证"/>
        </el-form-item>
        <el-form-item label="司机电话" prop="carPhone"
                      v-if="checkRole(['admin','order','gov','hulenglian','manage','warehouse','cashier'])"
        >
          <el-input v-model="form.carPhone" placeholder="请输入司机电话"/>
        </el-form-item>
        <el-form-item label="件数(箱)" prop="count" v-if="!checkRole(['finance','cashier','boss'])">
          <el-input v-model="form.count" placeholder="请输入件数(箱)"/>
        </el-form-item>
        <el-form-item label="毛重(KG)" prop="weight" v-if="!checkRole(['finance','cashier','boss'])">
          <el-input v-model="form.weight" placeholder="请输入毛重(KG)"/>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitFormKillStatus2">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 财务审核 -->
    <el-dialog :title="title" :visible.sync="payOpen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="支付状态">
          <el-radio-group v-model="form.payState">
            <el-radio
              v-for="dict in payStatusOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{ dict.dictLabel }}
            </el-radio>
            <el-input v-model="form.payPrice" v-if="form.payState===1" placeholder="支付金额"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否高风险" prop="isDanger">
          <el-select v-model="form.isDanger" placeholder="请选择是否高风险" clearable
                     size="small"
          >
            <el-option
              v-for="dict in isDangerOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm">确 定</el-button>
        <el-button @click="cancelPay">取 消</el-button>
      </div>
    </el-dialog>
    <!-- gov审核 -->
    <el-dialog :title="title" :visible.sync="govOpen" width="500px" append-to-body>
      <el-form ref="form" :model="govForm" :rules="rules" label-width="80px">
        <el-form-item label="区局程序">
          <el-radio-group v-model="govForm.program">
            <el-radio
              v-for="dict in programOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitFormGov">确 定</el-button>
        <el-button @click="cancelGov">取 消</el-button>
      </div>
    </el-dialog>
    <!--    插队申请-->
    <el-dialog :title="title" :visible.sync="openPass" width="500px" append-to-body>
      <el-form ref="form" :model="passForm" :rules="rulesPass" label-width="80px">
        <el-form-item label="插队理由" prop="reason">
          <el-input v-model="passForm.reason" placeholder="请输入插队理由"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitPass">确 定</el-button>
        <el-button @click="cancelPass">取 消</el-button>
      </div>
    </el-dialog>
    <!--    插队审批-->
    <el-dialog :title="title" :visible.sync="openApprove" width="500px" append-to-body>
      <el-form ref="form" :model="approveForm" :rules="rulesPass" label-width="80px">
        <el-form-item label="插队理由" prop="reason">
          <el-input v-model="approveForm.reason" placeholder="请输入插队理由" readonly/>
        </el-form-item>
        <el-form-item label="是否通过" prop="pass" v-if="checkRole(['boss','admin'])">
          <el-switch
            v-model="approveForm.pass"
            active-value="true"
            inactive-value="false"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitApprove">确 定</el-button>
        <el-button @click="cancelApprove">取 消</el-button>
      </div>
    </el-dialog>
    <!--    导出数据日期筛选-->
    <el-dialog :title="title" :visible.sync="exportsDate" width="520px" append-to-body>
      <el-form ref="form" :model="queryParams" label-width="80px">
        <el-form-item label="入园时间" prop="date">
          <el-date-picker
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :picker-options="pickerOptions3"
            :default-value="timeDefaultShow"
            v-model="date"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出园时间" prop="outDate">
          <el-date-picker
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :picker-options="pickerOptions3"
            :default-value="timeDefaultShow"
            v-model="outDate"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="exportsDateSubmit">确 定</el-button>
        <el-button @click="exportsDate=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 已完成消杀窗口 -->
    <el-dialog :title="CertUrl.title" :visible.sync="CertUrl.open" width="500px" append-to-body>
      <el-form ref="form" :model="uploadCert" :rules="uploadCertRules" label-width="110px">
        <el-form-item label="消杀证明文件">
          <el-upload
            ref="upload"
            class="upload-demo"
            :limit="1"
            accept=".pdf, .jpg, .png"
            :headers="CertUrl.headers"
            :action="CertUrl.url"
            :disabled="CertUrl.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess2"
            >
            <el-button size="small" type="success">点击上传</el-button>
            <div class="el-upload__tip" style="color:red" slot="tip">提示：文件后缀只能是.pdf.jpg.png</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="消杀证明编号" prop="certifyCode">
          <el-input
            v-model="uploadCert.certifyCode"
            placeholder="请输入消杀证明编号"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="核酸证明" prop="naCertificate" v-if="checkRole(['sale','manage','order','admin'])">
          <el-radio-group v-model="uploadCert.naCertificate">
            <el-radio
              v-for="dict in naCertificateOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
          <el-input v-model="uploadCert.printCount" v-if="uploadCert.naCertificate == 1" prop="printCount" placeholder="打印份数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CertUrl.open = false">取 消</el-button>
        <el-button type="success" @click="submitFileForm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 已完成检测窗口 -->
    <el-dialog :title="title" :visible.sync="checkKillForm.open" width="500px" append-to-body>
      <el-form ref="form" :model="checkKillForm" :rules="rulesEndCheck" label-width="80px">
        <el-form-item label="出园时间" prop="outDate">
          <el-date-picker
            clearable size="small"
            style="width: 200px"
            v-model="checkKillForm.outDate"
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
        <el-button @click="checkKillForm.open=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 附加费用 -->
    <el-dialog title="附加费用" :visible.sync="boxOpen" width="500px" append-to-body>
      <other-price v-if="rowDetail && boxOpen" @cancel="cancelBox" :rowDetail="rowDetail"></other-price>
    </el-dialog>
  </div>
</template>
<script>
import {
  listKill,
  getKill,
  delKill,
  addKill,
  updateKill, approvePass, recordKillUpload
} from '@/api/system/recordKill'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
import { checkRole } from '@/utils/permission'
import { listUser } from '@/api/system/user' // 权限判断函数
import otherPrice from '@/components/Kill/Record/otherPrice'
import { WarehouseAndCross, crossListAll, arrangement, WarehouseList, crossList } from '@/api/system/warehouse';

export default {
  name: 'recordKill',
  components: {
    otherPrice
  },
  data() {
    return {
      pickerOptions3: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate(time) {
          //time.getTime()获取的是时间戳，可以随便玩啊。
          return time.getTime() > Date.now() || time.getTime() < (Date.now() - (90 * 24 * 60 * 60 * 1000));
        }
      },
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }],
      printCount: 0,
      date: [],
      inDate: [],
      outDate: [],
      thisMsg: null,
      AllMsg: [],
      killMsg: [],
      msgDrop: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      // 消杀记录表格数据
      killList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openKillStatus1: false,
      openPass: false,
      openApprove: false,
      exportsDate: false,
      payOpen: false,
      govOpen: false,
      // 消杀状态字典
      orderStatusOptions: [],
      //查验公司名称
      checkCompanyOptions: [],
      isDangerOptions: [],
      crossNumberOptions: [],
      crossNumberSearch: [],
      // 支付状态字典
      payStatusOptions: [],
      // 支付方式字典
      payMethodOptions: [],
      programOptions: [],
      //货品规格
      cabinetTypeOptions: [],
      inputOptions: [],
      //道口状态
      crossStatusOptions: [],
      // 核酸证明字典
      naCertificateOptions: [],
      // 是否备份字典
      isBackOptions: [],
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/recordKill/importData'
      },
      //上传报关单
      uploadCustom: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/oss/oss/uploadFile'
      },
      // 上传消杀证明
      CertUrl: {
        // 是否显示弹出层（用户导入）
        open: false,
        title: "消杀证明",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/oss/oss/uploadFile"
      },
      uploadCert: {
        id: null,
        url: null,
        certifyCode: null,
        naCertificate: null
      },
      // 查询参数
      queryParams: {
        two: null,
        five: null,
        pageNum: 1,
        pageSize: 10,
        orderNumber: null,
        crossNumber: null,
        carNumber: null,
        carName: null,
        idCard: null,
        // date: null,
        startDate: null,
        endDate: null,
        carPhone: null,
        cabinetNumber: null,
        extractNumber: null,
        pier: null,
        country: null,
        productName: null,
        count: null,
        weight: null,
        orderStatus: null,
        isDanger: null,
        destination: null,
        payState: null,
        naCertificate: null,
        payPrice: null,
        printCount: null,
        isBack: null,
        factory: null,
        checkCompany: null,
        name: null,
        phone: null
      },
      // 表单参数
      form: {
        certifyUrl: null,
        program: null
      },// 表单参数
      govForm: {
        id: null,
        program: null
      }, passForm: {
        id: null,
        reason: null
      }, approveForm: {
        id: null,
        reason: null,
        pass: null
      }, checkKillForm: {
        open: false,
        id: null,
        orderNumber: null,
        outDate: null,
        orderStatus: null
      },
      uploadCertRules: {
        certifyCode:
          [{
            required: true,
            message: '请输入消杀证明编号',
            trigger: 'change'
          }]
      }
      ,
      rulesPass: {
        reason: [{
          required: true,
          message: '请输入插队理由',
          trigger: 'blur'
        }]
      }
      , rulesEndCheck: {
        outDate:
          [{
            required: true,
            message: '请输入出园时间',
            trigger: 'blur'
          }]
      }
      ,
      rules: {
        date: [{
          required: true,
          message: '请选择日期选择',
          trigger: 'change'
        }],
        carNumber:
          [{
            required: true,
            message: '请输入车牌号',
            trigger: 'blur'
          }], carName:
          [{
            required: true,
            message: '请输入驾驶员姓名',
            trigger: 'blur'
          }],
        carPhone:
          [{
            required: true,
            message: '请输入驾驶员电话',
            trigger: 'blur'
          }, {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }],
        idCard:
          [{
            required: true,
            message: '请输入驾驶员身份证号',
            trigger: 'blur'
          }, {
            pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确的身份号',
            trigger: 'blur'
          }],
        cabinetNumber:
          [{
            required: true,
            message: '请输入箱柜号',
            trigger: 'blur'
          }, {
            pattern: /^[0-9a-zA-Z]*$/g,
            message: '箱柜号只能是数字和字母',
            trigger: 'blur'
          }],
        companyName:
          [{
            required: true,
            message: '请输入公司名称',
            trigger: 'blur'
          }], name:
          [{
            required: true,
            message: '请输入联系人姓名',
            trigger: 'blur'
          }],
        phone:
          [{
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur'
          }, {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }],
        productName:
          [{
            required: true,
            message: '请输入产品名称',
            trigger: 'blur'
          }], outDate:
          [{
            required: true,
            message: '请输入出园时间',
            trigger: 'blur'
          }],
        country:
          [{
            required: true,
            message: '请输入国家',
            trigger: 'blur'
          }],
        factory:
          [{
            required: true,
            message: '请输入工厂',
            trigger: 'blur'
          }],
        destination:
          [{
            required: true,
            message: '请输入收货冷库地址',
            trigger: 'blur'
          }], weight:
          [{
            required: true,
            message: '请输入重量(KG)',
            trigger: 'blur'
          }, {
            pattern: /^[0-9]+(.[0-9]{1,3})?$/,
            message: '重量只能是数字',
            trigger: 'blur'
          }], count:
          [{
            required: true,
            message: '请输入件数(箱)',
            trigger: 'blur'
          }, {
            pattern: /^[0-9]+(.[0-9]{1,3})?$/,
            message: '件数只能是数字',
            trigger: 'blur'
          }],
          cabinetType: [{
            required: true,
            message: '请选择货品规格',
            trigger: 'change'
          }]
      }
      ,
      rulesKillStatus1: {
        carNumber: [{
          required: true,
          message: '请输入车牌号',
          trigger: 'blur'
        }], carName:
          [{
            required: true,
            message: '请输入驾驶员姓名',
            trigger: 'blur'
          }],
        carPhone:
          [{
            required: true,
            message: '请输入驾驶员电话',
            trigger: 'blur'
          }, {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }],
        idCard:
          [{
            required: true,
            message: '请输入驾驶员身份证号',
            trigger: 'blur'
          }, {
            pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确的身份号',
            trigger: 'blur'
          }],
        weight: [{
          required: true,
          message: '请输入重量(KG)',
          trigger: 'blur'
        }, {
          pattern: /^[0-9]+(.[0-9]{1,3})?$/,
          message: '重量只能是数字',
          trigger: 'blur'
        }], count:
          [{
            required: true,
            message: '请输入件数(箱)',
            trigger: 'blur'
          }, {
            pattern: /^[0-9]+(.[0-9]{1,3})?$/,
            message: '件数只能是数字',
            trigger: 'blur'
          }],
        crossNumber:
          [{
            required: true,
            message: '请输入道口',
            trigger: 'blur'
          }],
        inDate:
          [{
            required: true,
            message: '请选择靠口时间',
            trigger: 'blur'
          }],
        checkCompany:
          [{
            required: true,
            message: '请选择消杀机构',
            trigger: 'blur'
          }]
      },
      pickerOptions:
        {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() + 24 * 60 * 60 * 1000 < Date.now()
        }
      },
      boxOpen: false,
      rowDetail: {},
      tabelHeight: 500
    }
  },
  created() {
    this.tabelHeight = window.screen.height - 530;
    this.queryParamsReset()
    let that = this
    that.timeDefaultShow = new Date()
    that.timeDefaultShow.setMonth(new Date().getMonth() - 1)
    this.getList()
    this.getDicts('kill_danger').then(response => {
      this.isDangerOptions = response.data
    })
    this.getDicts('kill_check_company').then(response => {
      this.checkCompanyOptions = response.data
    })
    this.getDicts('kill_order_status').then(response => {
      this.orderStatusOptions = response.data
    })
    this.getDicts('kill_program').then(response => {
      this.programOptions = response.data
    })
    this.getDicts('pay_status').then(response => {
      this.payStatusOptions = response.data
    })
    this.getDicts('pay_method').then(response => {
      this.payMethodOptions = response.data
    })
    this.getDicts('na_status').then(response => {
      this.naCertificateOptions = response.data
    })
    this.getDicts('back_status').then(response => {
      this.isBackOptions = response.data
    })
    this.getDicts('cabinet_type').then((response) => {
      if (response.data.length > 0) {
        this.cabinetTypeOptions = response.data
      }
    })
    this.getDicts('business_type').then(response => {
      this.inputOptions = response.data
    })
    //道口状态
    this.getDicts('cross_status').then(response => {
      this.crossStatusOptions = response.data;
    });
    this.getCrossListAll();
  },
  methods: {
    getCrossListAll() {
      //道口-搜索用
      this.crossNumberOptions= [];
      crossListAll().then((response) => {
        if (response.rows.length > 0) {
          response.rows.map(item => {
            const children2 = [];
            if (item.crossManageList.length > 0) {
              item.crossManageList.map(cross => {
                children2.push({ label: cross.crossName, value: cross.id }); //搜索用
              })
            }
            this.crossNumberOptions.push({ label: item.warehouseName, value: item.id, children: children2 }); //搜索用
          })
        }
      })
    },
    getWarehouseAndCross(orderNumber) {
      //道口-新版-靠口用
      this.crossNumberSearch = [];
      var str = {
        orderNumber: orderNumber,
        taskType: '1' //1-消杀，2-出库，3-入库
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
    //设置字体颜色
    cellStyle(row, column, rowIndex, columnIndex) {
      if ((row.row.vip !== 0 && row.row.orderStatus === '1' && row.row.payState === 1)
        || (row.row.pass === true && row.row.orderStatus === '1' && row.row.payState === 1)) {
        return 'font-weight:500;color:red;'
      } else {
        return 'font-weight:500;color:#333;'
      }
    },
    checkRole,
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    handleCommand(command) {
      request({
        url: '/system/recordKill/orderNumber/' + command,
        method: 'get'
      }).then(response => {
        this.killMsg = response.data
        this.form.orderNumber = this.killMsg.orderNumber
        this.form.crossNumber = this.killMsg.crossNumber
        this.form.carName = this.killMsg.carName
        this.form.carNumber = this.killMsg.carNumber
        this.form.carPhone = this.killMsg.carPhone
        this.form.idCard = this.killMsg.idCard
        this.form.cabinetNumber = this.killMsg.cabinetNumber
        this.form.country = this.killMsg.country
        this.form.productName = this.killMsg.productName
        this.form.count = this.killMsg.count
        this.form.weight = this.killMsg.weight
        this.form.killStatus = this.killMsg.killStatus
        this.form.destination = this.killMsg.destination
        this.form.payState = this.killMsg.payState
        this.form.factory = this.killMsg.factory
        this.form.name = this.killMsg.name
      })
    },
    /** 查询按钮操作 */
    handleFind() {
      request({
        url: '/system/recordKill/recordKillForReservation/' + this.form.cabinetNumber,
        method: 'get'
      }).then(response => {
        this.AllMsg = response.data
        if (this.AllMsg.length !== 0) {
          this.msgDrop = true
        }
      })
    },
    /** 下载报关单 */
    customUrlDownload(url) {
      var tempwindow = window.open('_blank');
      tempwindow.location = url;
    },
    /** 查询消杀记录列表 */
    getList() {
      this.loading = true
      const value = this.queryParams.orderStatus
      if (value != null && value !== ('') && value.length !== 0) {
        this.queryParams.orderStatus = value.toString()
      }
      listKill(
        this.addDateRange(this.queryParams, null, this.date, this.inDate, this.outDate)).then(
        response => {
          this.killList = response.rows
          this.total = response.total
          this.loading = false
          if (value) {
            this.queryParams.orderStatus = value.slice(',')
          }
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
                number += ' / ' + this.crossNumberOptions[i].children[j].label;
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
    // 消杀状态字典翻译
    orderStatusFormat(row, column) {
      return this.selectDictLabel(this.orderStatusOptions, row.orderStatus)
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
    inputFormat(row, column) {
      return this.selectDictLabel(this.inputOptions, row.businessType)
    },
    //货品规格字典翻译
    cabinetTypeFormat(row, column) {
      if (row.cabinetType) {
        return this.selectDictLabel(this.cabinetTypeOptions, row.cabinetType)
      }
    },
    // 查验公司名称
    checkCompanyFormat(row, column) {
      return this.selectDictLabel(this.checkCompanyOptions, row.checkCompany)
    },
    // 核酸证明字典翻译
    naCertificateFormat(row, column) {
      return this.selectDictLabel(this.naCertificateOptions, row.naCertificate)
    },
    // 是否备份字典翻译
    isBackFormat(row, column) {
      return this.selectDictLabel(this.isBackOptions, row.isBack)
    },
    //道口状态字典翻译
    crossStatusFormat(row, column) {
      return this.selectDictLabel(this.crossStatusOptions, row)
    },
    // 区局程序
    programFormat(row, column) {
      return this.selectDictLabel(this.programOptions, row.program)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.openKillStatus1 = false
      this.reset()
    },// 取消按钮
    cancelPay() {
      this.payOpen = false
      this.reset()
    }, cancelGov() {
      this.govOpen = false
      this.reset()
    }, cancelPass() {
      this.openPass = false
      this.reset()
    }, cancelApprove() {
      this.openApprove = false
      this.reset()
    },
    queryParamsReset() {
      this.date = []
      this.inDate = []
      this.outDate = []
      this.queryParams = {
        two: null,
        five: null,
        pageNum: 1,
        pageSize: 10,
        orderNumber: null,
        crossNumber: null,
        carNumber: null,
        carName: null,
        idCard: null,
        date: null,
        startDate: null,
        endDate: null,
        carPhone: null,
        cabinetNumber: null,
        extractNumber: null,
        pier: null,
        country: null,
        productName: null,
        count: null,
        weight: null,
        orderStatus: null,
        isDanger: null,
        destination: null,
        payState: null,
        naCertificate: null,
        payPrice: null,
        printCount: null,
        isBack: null,
        factory: null,
        checkCompany: null,
        name: null,
        phone: null
      }
      // this.queryParams.date = ''
      // this.queryParams.dateBeginTime = ''
      // this.queryParams.dateEndTime = ''
      // this.queryParams.inDateBeginTime = ''
      // this.queryParams.inDateEndTime = ''
      // this.queryParams.outDateBeginTime = ''
      // this.queryParams.outDateBeginTime = ''
      // this.queryParams.pickTimeBeginTime = ''
      // this.queryParams.pickTimeEndTime = ''
      // this.queryParams.checkTimeBeginTime = ''
      // this.queryParams.checkTimeEndTime = ''
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        orderNumber: null,
        date: null,
        crossNumber: null,
        inDate: null,
        outDate: null,
        carNumber: null,
        carName: null,
        idCard: null,
        carPhone: null,
        cabinetNumber: null,
        extractNumber: null,
        pier: null,
        country: null,
        productName: null,
        count: null,
        weight: null,
        orderStatus: 1,
        destination: null,
        payState: 0,
        naCertificate: 0,
        isBack: 0,
        factory: null,
        checkCompany: null,
        name: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        checkDate: null,
        sampledData: null,
        program: null
      }
      this.msgDrop = false
      this.resetForm('form')
    },
    // 表单重置
    resetUpload() {
      // 上传消杀证明
      this.uploadCert = {
        id: null,
        url: null,
        certifyCode: null,
        naCertificate: null,
        // 是否更新已经存在的用户数据
        updateSupport: 0
      }
      this.msgDrop = false
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      if (this.queryParams.crossNumber != null && Array.isArray(this.queryParams.crossNumber)) {
        this.queryParams.crossNumber = this.queryParams.crossNumber.join(',')
      }
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParamsReset()
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
      this.title = '添加消杀记录'
    },
    /** 上传消杀证明 */
    handleEndKillWindows(row) {
      this.reset()
      this.resetForm('form')
      this.resetUpload()
      this.CertUrl.open = true;
      this.uploadCert.id = row.id;
      this.uploadCert.naCertificate = row.naCertificate;
      this.uploadCert.certifyCode = row.certifyCode;
    }, 
    /** 修改消杀证明窗口 */
    updateEndKillWindows(row) {
      this.reset()
      this.resetForm('form')
      this.resetUpload()
      this.uploadCert.id = row.id
      this.CertUrl.open = true
      // this.uploadCert.orderStatus = row.orderStatus;
      this.uploadCert.naCertificate = row.naCertificate
      this.uploadCert.certifyCode = row.certifyCode
    },
    handleEndCheckWindows(row) {
      this.reset()
      this.resetUpload()
      this.title = '放行'
      this.checkKillForm.open = true
      this.checkKillForm.id = row.id
      this.checkKillForm.orderNumber = row.orderNumber
    },
    /** 下载证明 */
    handleOpenCert(row) {
      var tempwindow = window.open('_blank');
      tempwindow.location = row.certifyUrl;
    },
    /** 审核按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKill(id).then(response => {
        this.form = response.data
        this.form.orderStatus = parseInt(response.data.orderStatus)
        if (this.form.crossNumber != null && Array.isArray(this.form.crossNumber)) {
          this.form.crossNumber = this.form.crossNumber.split(',')
        }
        this.open = true
        this.title = '修改消杀记录'
      })
    },
    handlePass(row) {
      this.reset()
      const id = row.id || this.ids
      getKill(id).then(response => {
        this.passForm.id = response.data.id
        this.passForm.reason = response.data.reason
        this.openPass = true
        this.title = '补充插队理由'
      })
    },
    handleApprove(row) {
      this.reset()
      const id = row.id || this.ids
      getKill(id).then(response => {
        this.approveForm.id = response.data.id
        this.approveForm.reason = response.data.reason
        this.approveForm.pass = response.data.pass
        this.openApprove = true
        this.title = '审批插队'
      })
    }, 
    handleUpdateKillStatus1(row) {
      this.reset();
      this.getWarehouseAndCross(row.orderNumber); //确保拿到最新道口
      const id = row.id || this.ids
      getKill(id).then(response => {
        this.form = response.data
        this.form.orderStatus = parseInt(response.data.orderStatus)
        this.openKillStatus1 = true
        this.title = '靠口确认'
      })
    },
    handleUpdateKillStatus5(row) {
      this.reset()
      this.$confirm('是否取消消杀记录编号为"' + row.id + '"的记录?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        row.orderStatus = 5
        return updateKill(row)
      }).then(() => {
        this.getList()
        this.msgSuccess('取消成功')
      }).catch(function() {
      })
    },
    /**
     * 监管修改
     * */
    handleUpdateGov(row) {
      this.reset()
      const id = row.id || this.ids
      getKill(id).then(response => {
        this.govForm.id = response.data.id
        this.govForm.program = response.data.program
        this.govOpen = true
        this.title = '修改送检信息'
      })
    },
    /** 修改按钮操作 */
    // handlePay(row) {
    //   this.reset()
    //   const id = row.id || this.ids
    //   getKill(id).then(response => {
    //     this.form = response.data
    //     this.payOpen = true
    //     this.title = '到账审核'
    //   })
    // },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            if (this.form.crossNumber != null && Array.isArray(this.form.crossNumber)) {
              this.form.crossNumber = this.form.crossNumber.join(',')
            }
            updateKill(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.payOpen = false
                this.govOpen = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /** 提交按钮 */
    submitFormGov() {
      if (this.govForm.id != null) {
        updateKill(this.govForm).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.govOpen = false
            this.getList()
          }
        })
      }
    }, /** 提交插队理由 */
    submitPass() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.passForm.id != null) {
            updateKill(this.passForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess('提交成功')
                this.openPass = false
                this.getList()
              }
            })
          }
        }
      })
    }, /** 审批插队理由 */
    submitApprove() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.approveForm.id != null) {
            approvePass(this.approveForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess('审批成功')
                this.openApprove = false
                this.getList()
              }
            })
          }
        }
      })
    }, /** 等待靠口 */
    submitFormKillStatus2() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.orderStatus = 2
            if (this.form.crossNumber != null && Array.isArray(this.form.crossNumber)) {
              this.form.crossNumber = this.form.crossNumber.join(',')
            }
            arrangement(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('操作成功')
                this.openKillStatus1 = false
                this.getList()
              }
            })
          }
        }
      })
    }, 
    /** 已完成检测 */
    submitFormKillStatus4() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.checkKillForm.id != null) {
            this.checkKillForm.orderStatus = 4
            updateKill(this.checkKillForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.checkKillForm.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /** 导出数据submit */
    exportsDateSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          //入园时间
          // if (this.date != null) {
          //   let result = ''
          //   for (let item of this.date) {
          //     result += this.formatTime(item) + ','
          //   }
          //   this.date = result.substr(0, result.length - 1)
          // }
          // //出园时间
          // if (this.outDate != null) {
          //   let result2 = ''
          //   for (let item of this.outDate) {
          //     result2 += this.formatTime(item) + ','
          //   }
          //   this.outDate = result2.substr(0, result2.length - 1)
          // }
          if (this.date != null || this.outDate != null) {
            this.download('system/recordKill/export', {
              ...this.addDateRange(this.queryParams, null, this.date, null, this.outDate)
            }, `消杀记录.xlsx`).then(
              this.exportsDate = false,
              this.queryParamsReset
            )
          }
        }
      })
    },
    /** 时间格式化 */
    formatTime(time = +new Date()) {
      var date = new Date(time + 8 * 3600 * 1000)
      return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '-')
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除消杀记录编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delKill(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/recordKill/importTemplate', {
        ...this.queryParams
      }, `消杀记录_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.data.url, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    handleFileSuccess2(response, file, fileList) {
      this.CertUrl.isUploading = false;
      this.uploadCert.url = response.data.url;
    },
    // 提交上传文件
    submitFileForm() {
      if (!this.uploadCert.url || this.uploadCert.url == '') {
        this.$message.warning(`请上传消杀证明文件`);
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          recordKillUpload(this.uploadCert).then(response => {
            this.CertUrl.open = false;
            this.$refs.upload.clearFiles();
            this.msgSuccess('提交成功！')
            this.getList()
          })
        }
      })
    },
    beforeAvatarUpload() {
    },
    handleAvatarSuccess(response, file, fileList) {
      this.form.customUrl = response.data.url;
    },
    // 封箱封带按钮
    handleBox(row) {
      this.rowDetail = row
      this.boxOpen = true
    },
    cancelBox() {
      this.boxOpen = false
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '消杀记录'
      this.upload.open = true
    },
    /** 导出按钮操作 */
    handleExport() {
      this.date = null
      this.outDate = null
      this.exportsDate = true
      // this.download('system/recordKill/export', {
      //   ...this.queryParams
      // }, `消杀记录.xlsx`)
    },
    /** 导出按钮操作 */
    handleFive() {
      this.queryParams.pageNum = 1
      this.queryParams.five = true
      this.loading = true
      listKill(this.queryParams).then(response => {
        this.killList = response.rows
        this.total = response.total
        this.queryParams.five = null
        this.loading = false
      })
    },
    handleTwo() {
      this.queryParams.pageNum = 1
      this.queryParams.two = true
      this.loading = true
      listKill(this.queryParams).then(response => {
        this.killList = response.rows
        this.total = response.total
        this.queryParams.two = null
        this.loading = false
      })
    }
  }
}
</script>
<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-table .warning-row {
  background: #F9FBFE;
}

.el-table .success-row {
  background: #FFFFFF;
}

.div_allinline {
  text-align: center;
  margin: 0 auto;
  padding: 0;
  clear: both;
}

.subdiv_allinline {
  margin: 0;
  padding: 0;
  display: inline;
  _display: inline;
  *display: inline;
  zoom: 1;
}

</style>
