<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="customName"           v-if="checkRole(['admin','manage'])">
        <el-input
          v-model="queryParams.customName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          v-if="checkRole(['admin','manage'])"
        />
      </el-form-item>
      <el-form-item label="品名" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入品名"
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
      <el-form-item label="报表日期" prop="reportDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.reportDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择报表日期">
        </el-date-picker>
      </el-form-item><el-form-item label="收货日期" prop="receiptDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.receiptDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择收货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="生产日期" prop="productionDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.productionDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择生产日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="到期日期" prop="expiryDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.expiryDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择到期日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
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
          v-hasPermi="['manage:report:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:report:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:report:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['manage:report:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['common:report:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="reportList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="客户名称" align="center" v-if="checkRole(['admin','manage'])" prop="customName" />
      <el-table-column label="品名" align="center" prop="itemName" />
      <el-table-column label="柜号" align="center" prop="cabinetNumber" />
      <el-table-column label="报表日期" align="center" prop="reportDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reportDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货日期" align="center" prop="receiptDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiptDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产日期" align="center" prop="productionDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.productionDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期日期" align="center" prop="expiryDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expiryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" :formatter="statusFormat" prop="status" />
      <el-table-column label="当日结存_数量EA" align="center" prop="dayBalanceMount" />
      <el-table-column label="当日结存_重量KG" align="center" prop="dayBalanceWeight" />
      <el-table-column label="当日结存_拖数" align="center" prop="dayBalancePallet" />
      <el-table-column label="入库_数量EA" align="center" prop="inMount" />
      <el-table-column label="入库_重量KG" align="center" prop="inWeight" />
      <el-table-column label="入库_拖数" align="center" prop="inPallet" />
      <el-table-column label="出库_重量KG" align="center" prop="outWeight" />
      <el-table-column label="出库_拖数" align="center" prop="outPallet" />
      <el-table-column label="转出_数量EA" align="center" prop="transferOutMount" />
      <el-table-column label="转出_重量KG" align="center" prop="transferOutWeight" />
      <el-table-column label="转入_数量EA" align="center" prop="transferInMount" />
      <el-table-column label="转入_重量KG" align="center" prop="transferInWeight" />
      <el-table-column label="转入_拖数" align="center" prop="transferInPallet" />
      <el-table-column label="昨日结存_数量EA" align="center" prop="yesterdayBalanceMount" />
      <el-table-column label="昨日结存_重量KG" align="center" prop="yesterdayBalanceWeight" />
      <el-table-column label="昨日结存_拖数" align="center" prop="yesterdayBalancePallet" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作"  v-if="checkRole(['admin','manage'])" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:report:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:report:remove']"
          >删除</el-button>
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

    <!-- 添加或修改仓储收发存报对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户名称" prop="customName">
          <el-input v-model="form.customName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="品名" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入品名" />
        </el-form-item>
        <el-form-item label="柜号" prop="cabinetNumber">
          <el-input v-model="form.cabinetNumber" placeholder="请输入柜号" />
        </el-form-item>
        <el-form-item label="报表日期" prop="reportDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.reportDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择报表日期">
          </el-date-picker>
        </el-form-item><el-form-item label="收货日期" prop="receiptDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.receiptDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择收货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产日期" prop="productionDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.productionDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期" prop="expiryDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.expiryDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择到期日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当日结存_数量EA" prop="dayBalanceMount">
          <el-input v-model="form.dayBalanceMount" placeholder="请输入当日结存_数量EA" />
        </el-form-item>
        <el-form-item label="当日结存_重量KG" prop="dayBalanceWeight">
          <el-input v-model="form.dayBalanceWeight" placeholder="请输入当日结存_重量KG" />
        </el-form-item>
        <el-form-item label="当日结存_拖数" prop="dayBalancePallet">
          <el-input v-model="form.dayBalancePallet" placeholder="请输入当日结存_拖数" />
        </el-form-item>
        <el-form-item label="入库_数量EA" prop="inMount">
          <el-input v-model="form.inMount" placeholder="请输入入库_数量EA" />
        </el-form-item>
        <el-form-item label="入库_重量KG" prop="inWeight">
          <el-input v-model="form.inWeight" placeholder="请输入入库_重量KG" />
        </el-form-item>
        <el-form-item label="入库_拖数" prop="inPallet">
          <el-input v-model="form.inPallet" placeholder="请输入入库_拖数" />
        </el-form-item>
        <el-form-item label="出库_重量KG" prop="outWeight">
          <el-input v-model="form.outWeight" placeholder="请输入出库_重量KG" />
        </el-form-item>
        <el-form-item label="出库_拖数" prop="outPallet">
          <el-input v-model="form.outPallet" placeholder="请输入出库_拖数" />
        </el-form-item>
        <el-form-item label="转出_数量EA" prop="transferOutMount">
          <el-input v-model="form.transferOutMount" placeholder="请输入转出_数量EA" />
        </el-form-item>
        <el-form-item label="转出_重量KG" prop="transferOutWeight">
          <el-input v-model="form.transferOutWeight" placeholder="请输入转出_重量KG" />
        </el-form-item>
        <el-form-item label="转入_数量EA" prop="transferInMount">
          <el-input v-model="form.transferInMount" placeholder="请输入转入_数量EA" />
        </el-form-item>
        <el-form-item label="转入_重量KG" prop="transferInWeight">
          <el-input v-model="form.transferInWeight" placeholder="请输入转入_重量KG" />
        </el-form-item>
        <el-form-item label="转入_拖数" prop="transferInPallet">
          <el-input v-model="form.transferInPallet" placeholder="请输入转入_拖数" />
        </el-form-item>
        <el-form-item label="昨日结存_数量EA" prop="yesterdayBalanceMount">
          <el-input v-model="form.yesterdayBalanceMount" placeholder="请输入昨日结存_数量EA" />
        </el-form-item>
        <el-form-item label="昨日结存_重量KG" prop="yesterdayBalanceWeight">
          <el-input v-model="form.yesterdayBalanceWeight" placeholder="请输入昨日结存_重量KG" />
        </el-form-item>
        <el-form-item label="昨日结存_拖数" prop="yesterdayBalancePallet">
          <el-input v-model="form.yesterdayBalancePallet" placeholder="请输入昨日结存_拖数" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
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
import { listReport, getReport, delReport, addReport, updateReport } from "@/api/system/report";
import { getToken } from "@/utils/auth";
import { checkRole  } from "@/utils/permission"; // 权限判断函数

export default {
  name: "Report",
  data() {
    return {
      statusOptions: [],
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
      // 仓储收发存报表格数据
      reportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customName: null,
        itemName: null,
        cabinetNumber: null,
        receiptDate: null,
        reportDate: null,
        productionDate: null,
        expiryDate: null,
        status: null,
      },
      // 表单参数
      form: {},
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
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/report/importData"
      },
      // 表单校验
      rules: {
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    checkRole,
    /** 查询仓储收发存报列表 */
    getList() {
      this.loading = true;
      listReport(this.queryParams).then(response => {
        this.reportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
        customName: null,
        itemName: null,
        cabinetNumber: null,
        receiptDate: null,
        reportDate: null,
        productionDate: null,
        expiryDate: null,
        status: "0",
        dayBalanceMount: null,
        dayBalanceWeight: null,
        dayBalancePallet: null,
        inMount: null,
        inWeight: null,
        inPallet: null,
        outWeight: null,
        outPallet: null,
        transferOutMount: null,
        transferOutWeight: null,
        transferInMount: null,
        transferInWeight: null,
        transferInPallet: null,
        yesterdayBalanceMount: null,
        yesterdayBalanceWeight: null,
        yesterdayBalancePallet: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加仓储收发存报";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReport(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改仓储收发存报";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateReport(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addReport(this.form).then(response => {
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
      this.$confirm('是否确认删除仓储收发存报编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delReport(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "仓储收发存报";
      this.upload.open = true;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/report/export', {
        ...this.queryParams
      }, `收发存报表.xlsx`)
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/report/importTemplate', {
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
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
