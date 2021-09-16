<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item label="入库类型" prop="inType">
        <el-select v-model="queryParams.inType" placeholder="请选择入库类型" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称" prop="customName" v-if="checkRole(['admin','manage','boss','order'])">
        <el-input
          v-model="queryParams.customName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          v-if="checkRole(['admin','manage','boss','order'])"
        />
      </el-form-item>
      <el-form-item label="编号" prop="number">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入库日期" prop="inDate">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.inDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择入库日期">
        </el-date-picker>
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
      <el-form-item label="总数" prop="sumAmount">
        <el-input
          v-model="queryParams.sumAmount"
          placeholder="请输入总数"
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
      <el-form-item label="重量" prop="weightAmount">
        <el-input
          v-model="queryParams.weightAmount"
          placeholder="请输入重量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="托盘数量" prop="palletAmount">
        <el-input
          v-model="queryParams.palletAmount"
          placeholder="请输入托盘数量"
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
          v-hasPermi="['manage:in:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:in:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:in:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['manage:in:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['common:in:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="客户名称" v-if="checkRole(['admin','manage','boss','order']) " align="center"
                       prop="customName"/>
      <el-table-column label="柜号" align="center" prop="cabinetNumber"/>
      <el-table-column label="描述" align="center" prop="description"/>
      <el-table-column label="入库类型" align="center" prop="inType" :formatter="statusFormat"/>
      <el-table-column label="编号" align="center" prop="number"/>
      <el-table-column label="入库日期" align="center" prop="inDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总数" align="center" prop="sumAmount"/>
      <el-table-column label="箱数" align="center" prop="boxAmount"/>
      <el-table-column label="重量" align="center" prop="weightAmount"/>
      <el-table-column label="托盘数量" align="center" prop="palletAmount"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" v-if="checkRole(['admin','manage','boss','order'])"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:in:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:in:remove']"
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

    <!-- 添加或修改仓储入库记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="入库类型" prop="inType">
          <el-select v-model="form.inType" placeholder="请选择入库类型">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="customName">
          <el-input v-model="form.customName" placeholder="请输入客户名称"/>
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input v-model="form.number" placeholder="请输入编号"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述"/>
        </el-form-item>
        <el-form-item label="入库日期" prop="inDate">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.inDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择入库日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="柜号" prop="cabinetNumber">
          <el-input v-model="form.cabinetNumber" placeholder="请输入柜号"/>
        </el-form-item>
        <el-form-item label="总数" prop="sumAmount">
          <el-input v-model="form.sumAmount" placeholder="请输入总数"/>
        </el-form-item>
        <el-form-item label="箱数" prop="boxAmount">
          <el-input v-model="form.boxAmount" placeholder="请输入箱数"/>
        </el-form-item>
        <el-form-item label="重量" prop="weightAmount">
          <el-input v-model="form.weightAmount" placeholder="请输入重量"/>
        </el-form-item>
        <el-form-item label="托盘数量" prop="palletAmount">
          <el-input v-model="form.palletAmount" placeholder="请输入托盘数量"/>
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
  import {listIn, getIn, delIn, addIn, updateIn} from "@/api/system/in";
  import {checkRole} from "@/utils/permission"; // 权限判断函数
  import {getToken} from "@/utils/auth";

  export default {
    name: "In",
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
        // 仓储入库记录表格数据
        inList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          inType: null,
          customName: null,
          number: null,
          description: null,
          inDate: null,
          cabinetNumber: null,
          sumAmount: null,
          boxAmount: null,
          weightAmount: null,
          palletAmount: null,
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
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/system/in/importData"
        },
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_in_type").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      checkRole,
      /** 查询仓储入库记录列表 */
      getList() {
        this.loading = true;
        listIn(this.queryParams).then(response => {
          this.inList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 字典状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.inType);
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
          inType: null,
          customName: null,
          number: null,
          description: null,
          inDate: null,
          cabinetNumber: null,
          sumAmount: null,
          boxAmount: null,
          weightAmount: null,
          palletAmount: null,
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
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加仓储入库记录";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getIn(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改仓储入库记录";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateIn(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addIn(this.form).then(response => {
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
        this.$confirm('是否确认删除仓储入库记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delIn(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('system/in/importTemplate', {
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
        this.upload.title = "入库记录";
        this.upload.open = true;
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/in/export', {
          ...this.queryParams
        }, `入库记录.xlsx`)
      }
    }
  };
</script>
