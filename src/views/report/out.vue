<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item label="客户代码" prop="userName" v-if="checkRole(['admin','manage'])">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入客户代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customName" v-if="checkRole(['admin','manage','boss','order'])">
        <el-input
          v-model="queryParams.customName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发生单据" prop="receipt" v-if="checkRole(['admin','manage'])">
        <el-input
          v-model="queryParams.receipt"
          placeholder="请输入发生单据"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单日期" prop="orderDate">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.orderDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择订单日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出库日期" prop="outDate">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.outDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择出库日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType" v-if="checkRole(['admin','manage'])">
        <el-select v-model="queryParams.orderType" placeholder="请选择订单类型" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户订单" prop="customOrder" v-if="checkRole(['admin','manage'])">
        <el-input
          v-model="queryParams.customOrder"
          placeholder="请输入客户订单"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提货单位" prop="pickUnit" >
        <el-input
          v-model="queryParams.pickUnit"
          placeholder="请输入提货单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提货地址" prop="pickAddress">
        <el-input
          v-model="queryParams.pickAddress"
          placeholder="请输入提货地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品组" prop="productGroup" v-if="checkRole(['admin','manage'])">
        <el-input
          v-model="queryParams.productGroup"
          placeholder="请输入产品组"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品代码" prop="productNumber" v-if="checkRole(['admin','manage'])">
        <el-input
          v-model="queryParams.productNumber"
          placeholder="请输入产品代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次" prop="productBatch" v-if="checkRole(['admin','manage'])">
        <el-input
          v-model="queryParams.productBatch"
          placeholder="请输入批次"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="柜号" prop="cabinetNumber">
        <el-input
          v-model="queryParams.cabinetNumber"
          placeholder="请输入柜号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产日期" prop="produceDate" v-if="checkRole(['admin','manage'])">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.produceDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择生产日期">
        </el-date-picker>
      </el-form-item >
      <el-form-item label="到期日期" prop="endDate" v-if="checkRole(['admin','manage'])">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.endDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择到期日期">
        </el-date-picker>
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
      <el-form-item label="单重" prop="weight">
        <el-input
          v-model="queryParams.weight"
          placeholder="请输入单重"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出库数量" prop="outAmount">
        <el-input
          v-model="queryParams.outAmount"
          placeholder="请输入出库数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="大单位" prop="bigUnit">
        <el-input
          v-model="queryParams.bigUnit"
          placeholder="请输入大单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="零头数" prop="oddAmount">
        <el-input
          v-model="queryParams.oddAmount"
          placeholder="请输入零头数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="理论总重" prop="theoryWeight">
        <el-input
          v-model="queryParams.theoryWeight"
          placeholder="请输入理论总重"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际总重" prop="realityWeight">
        <el-input
          v-model="queryParams.realityWeight"
          placeholder="请输入实际总重"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="托数" prop="palletAmount">
        <el-input
          v-model="queryParams.palletAmount"
          placeholder="请输入托数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱数" prop="boxAmount">
        <el-input
          v-model="queryParams.boxAmount"
          placeholder="请输入箱数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions2"
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
          v-hasPermi="['manage:out:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:out:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:out:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['manage:out:import']"
        >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['common:out:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="outList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="客户代码" align="center" prop="userName"
                       v-if="checkRole(['admin','manage'])"/>
      <el-table-column label="客户名称" align="center" prop="customName"
                       v-if="checkRole(['admin','manage','boss','order'])"/>
      <el-table-column label="产品名称" align="center" prop="productName"/>
      <el-table-column label="柜号" align="center" prop="cabinetNumber"/>
      <el-table-column label="订单日期" align="center" prop="orderDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库日期" align="center" prop="outDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.outDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单重" align="center" prop="weight"/>
      <el-table-column label="出库数量" align="center" prop="outAmount"/>
      <el-table-column label="大单位" align="center" prop="bigUnit"/>
      <el-table-column label="零头数" align="center" prop="oddAmount"/>
      <el-table-column label="理论总重" align="center" prop="theoryWeight"/>
      <el-table-column label="实际总重" align="center" prop="realityWeight"/>
      <el-table-column label="托数" align="center" prop="palletAmount"/>
      <el-table-column label="箱数" align="center" prop="boxAmount"/>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat2"/>
      <el-table-column label="发生单据" align="center" prop="receipt" v-if="checkRole(['admin','manage'])"/>
      <el-table-column label="订单类型" align="center" prop="orderType" :formatter="statusFormat" v-if="checkRole(['admin','manage'])"/>
      <el-table-column label="客户订单" align="center" prop="customOrder" v-if="checkRole(['admin','manage'])"/>
      <el-table-column label="提货单位" align="center" prop="pickUnit" />
      <el-table-column label="提货地址" align="center" prop="pickAddress"/>
      <el-table-column label="产品组" align="center" prop="productGroup" :formatter="statusFormat3" v-if="checkRole(['admin','manage'])"/>
      <el-table-column label="产品代码" align="center" prop="productNumber" v-if="checkRole(['admin','manage'])"/>
      <el-table-column label="批次" align="center" prop="productBatch" v-if="checkRole(['admin','manage'])"/>
      <el-table-column label="生产日期" align="center" prop="produceDate" width="180" v-if="checkRole(['admin','manage'])">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.produceDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期日期" align="center" prop="endDate" width="180" v-if="checkRole(['admin','manage'])">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" v-if="checkRole(['admin','manage'])"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"
                       v-if="checkRole(['admin','manage'])">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:out:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:out:remove']"
          >删除
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

    <!-- 添加或修改仓储出库记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户代码" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入客户代码"
                    v-if="checkRole(['admin','manage'])"/>
        </el-form-item>
        <el-form-item label="客户名称" prop="customName">
          <el-input v-model="form.customName" placeholder="请输入客户名称"
                    v-if="checkRole(['admin','manage'])"/>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称"/>
        </el-form-item>
        <el-form-item label="发生单据" prop="receipt">
          <el-input v-model="form.receipt" placeholder="请输入发生单据"/>
        </el-form-item>
        <el-form-item label="订单日期" prop="orderDate">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.orderDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择订单日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出库日期" prop="outDate">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.outDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择出库日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单类型" prop="orderType">
          <el-select v-model="form.orderType" placeholder="请选择订单类型">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户订单" prop="customOrder">
          <el-input v-model="form.customOrder" placeholder="请输入客户订单"/>
        </el-form-item>
        <el-form-item label="提货单位" prop="pickUnit">
          <el-input v-model="form.pickUnit" placeholder="请输入提货单位"/>
        </el-form-item>
        <el-form-item label="提货地址" prop="pickAddress">
          <el-input v-model="form.pickAddress" placeholder="请输入提货地址"/>
        </el-form-item>
        <el-form-item label="产品组" prop="productGroup">
          <el-input v-model="form.productGroup" placeholder="请输入产品组"/>
        </el-form-item>
        <el-form-item label="产品代码" prop="productNumber">
          <el-input v-model="form.productNumber" placeholder="请输入产品代码"/>
        </el-form-item>
        <el-form-item label="批次" prop="productBatch">
          <el-input v-model="form.productBatch" placeholder="请输入批次"/>
        </el-form-item>
        <el-form-item label="柜号" prop="cabinetNumber">
          <el-input v-model="form.cabinetNumber" placeholder="请输入柜号"/>
        </el-form-item>
        <el-form-item label="生产日期" prop="produceDate">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.produceDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期" prop="endDate">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.endDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择到期日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入单重"/>
        </el-form-item>
        <el-form-item label="出库数量" prop="outAmount">
          <el-input v-model="form.outAmount" placeholder="请输入出库数量"/>
        </el-form-item>
        <el-form-item label="大单位" prop="bigUnit">
          <el-input v-model="form.bigUnit" placeholder="请输入大单位"/>
        </el-form-item>
        <el-form-item label="零头数" prop="oddAmount">
          <el-input v-model="form.oddAmount" placeholder="请输入零头数"/>
        </el-form-item>
        <el-form-item label="理论总重" prop="theoryWeight">
          <el-input v-model="form.theoryWeight" placeholder="请输入理论总重"/>
        </el-form-item>
        <el-form-item label="实际总重" prop="realityWeight">
          <el-input v-model="form.realityWeight" placeholder="请输入实际总重"/>
        </el-form-item>
        <el-form-item label="托数" prop="palletAmount">
          <el-input v-model="form.palletAmount" placeholder="请输入托数"/>
        </el-form-item>
        <el-form-item label="箱数" prop="boxAmount">
          <el-input v-model="form.boxAmount" placeholder="请输入箱数"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-option
              v-for="dict in statusOptions2"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
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

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport"/>
          是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listOut, getOut, delOut, addOut, updateOut} from "@/api/system/out";
  import {checkRole} from "@/utils/permission"; // 权限判断函数
  import {getToken} from "@/utils/auth";

  export default {
    name: "Out",
    data() {
      return {
        statusOptions: [],
        statusOptions2: [],
        statusOptions3: [],
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
        // 仓储出库记录表格数据
        outList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: null,
          customName: null,
          receipt: null,
          orderDate: null,
          outDate: null,
          orderType: null,
          customOrder: null,
          pickUnit: null,
          pickAddress: null,
          productGroup: null,
          productNumber: null,
          productBatch: null,
          cabinetNumber: null,
          produceDate: null,
          endDate: null,
          productName: null,
          weight: null,
          outAmount: null,
          bigUnit: null,
          oddAmount: null,
          theoryWeight: null,
          realityWeight: null,
          palletAmount: null,
          boxAmount: null,
          status: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/system/out/importData"
        },
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_out_type").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("sys_report_type").then(response => {
        this.statusOptions2 = response.data;
      });
      this.getDicts("sys_product_type").then(response => {
        this.statusOptions3 = response.data;
      });
    },
    methods: {
      checkRole,
      /** 查询仓储出库记录列表 */
      getList() {
        this.loading = true;
        listOut(this.queryParams).then(response => {
          this.outList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          userName: null,
          customName: null,
          receipt: null,
          orderDate: null,
          outDate: null,
          orderType: null,
          customOrder: null,
          pickUnit: null,
          pickAddress: null,
          productGroup: null,
          productNumber: null,
          productBatch: null,
          cabinetNumber: null,
          produceDate: null,
          endDate: null,
          productName: null,
          weight: null,
          outAmount: null,
          bigUnit: null,
          oddAmount: null,
          theoryWeight: null,
          realityWeight: null,
          palletAmount: null,
          boxAmount: null,
          status: "0",
          remark: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
        };
        this.resetForm("form");
      },
      // 字典状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.orderType);
      },
      // 字典状态字典翻译
      statusFormat2(row, column) {
        return this.selectDictLabel(this.statusOptions2, row.status);
      },// 字典状态字典翻译
      statusFormat3(row, column) {
        return this.selectDictLabel(this.statusOptions3, row.productGroup);
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加仓储出库记录";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getOut(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改仓储出库记录";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateOut(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addOut(this.form).then(response => {
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
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除仓储出库记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delOut(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('system/out/importTemplate', {
          ...this.queryParams
        }, `user_${new Date().getTime()}.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
        this.getList();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "出库记录";
        this.upload.open = true;
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/out/export', {
          ...this.queryParams
        }, `出库记录.xlsx`)
      }
    }
  };
</script>
