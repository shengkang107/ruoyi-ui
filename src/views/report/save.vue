<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item label="客户名称" prop="customName" v-if="checkRole(['admin','manage'])">
        <el-input
          v-model="queryParams.customName"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库存日期" prop="saveDate" v-if="checkRole(['admin','manage'])">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.saveDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择库存日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目编号" prop="itemNumber">
        <el-input
          v-model="queryParams.itemNumber"
          placeholder="请输入项目编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目描述" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入项目描述"
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
      <el-form-item label="重量" prop="weight">
        <el-input
          v-model="queryParams.weight"
          placeholder="请输入重量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数量" prop="amount">
        <el-input
          v-model="queryParams.amount"
          placeholder="请输入数量"
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
          v-hasPermi="['manage:save:add']"
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
          v-hasPermi="['manage:save:edit']"
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
          v-hasPermi="['manage:save:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['manage:save:import']"
        >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['common:save:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="saveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="客户名称" align="center" prop="customName"
                       v-if="checkRole(['admin','manage'])"/>
      <el-table-column label="最后更新日期" align="center" prop="saveDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.saveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目编号" align="center" prop="itemNumber"/>
      <el-table-column label="项目描述" align="center" prop="description"/>
      <el-table-column label="柜号" align="center" prop="cabinetNumber"/>
      <el-table-column label="重量" align="center" prop="weight"/>
      <el-table-column label="数量" align="center" prop="amount"/>
      <el-table-column label="托数" align="center" prop="palletAmount"/>
      <el-table-column label="箱数" align="center" prop="boxAmount"/>
      <el-table-column label="大单位" align="center" prop="bigUnit"/>
      <el-table-column label="零头数" align="center" prop="oddAmount"/>
      <el-table-column label="备注" align="center" prop="remark"
                       v-if="checkRole(['admin','manage'])"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"
                       v-if="checkRole(['admin','manage'])">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:save:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['manage:save:remove']"
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

    <!-- 添加或修改仓储库存记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户名称" prop="customName">
          <el-input v-model="form.customName" placeholder="请输入客户名称"/>
        </el-form-item>
        <el-form-item label="库存日期" prop="saveDate">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.saveDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择库存日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目编号" prop="itemNumber">
          <el-input v-model="form.itemNumber" placeholder="请输入项目编号"/>
        </el-form-item>
        <el-form-item label="项目描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入项目描述"/>
        </el-form-item>
        <el-form-item label="柜号" prop="cabinetNumber">
          <el-input v-model="form.cabinetNumber" placeholder="请输入柜号"/>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入重量"/>
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入数量"/>
        </el-form-item>
        <el-form-item label="托数" prop="palletAmount">
          <el-input v-model="form.palletAmount" placeholder="请输入托数"/>
        </el-form-item>
        <el-form-item label="箱数" prop="boxAmount">
          <el-input v-model="form.boxAmount" placeholder="请输入箱数"/>
        </el-form-item>
        <el-form-item label="大单位" prop="bigUnit">
          <el-input v-model="form.bigUnit" placeholder="请输入大单位"/>
        </el-form-item>
        <el-form-item label="零头数" prop="oddAmount">
          <el-input v-model="form.oddAmount" placeholder="请输入零头数"/>
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
        :action="upload.url + '?updateSupport=' + upload.updateSupport+'&&saveDate='+formData.field101"
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
          <el-form ref="elForm" :model="formData" :rules="rules1" size="medium" label-width="100px">
            <el-form-item label="库存日期" prop="field101">
              <el-date-picker v-model="formData.field101" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              :style="{width: '100%'}" placeholder="请选择库存日期"
                              clearable></el-date-picker>
            </el-form-item>
          </el-form>
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
  import {listSave, getSave, delSave, addSave, updateSave} from "@/api/system/save";
  import {checkRole} from "@/utils/permission"; // 权限判断函数
  import {getToken} from "@/utils/auth";

  export default {
    name: "Save",
    inheritAttrs: false,
    components: {},
    props: [],
    data() {
      return {
        formData: {
          field101: null,
        },
        rules1: {
          field101: [{
            required: true,
            message: '请选择库存日期',
            trigger: 'change'
          }],
        },
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
        // 仓储库存记录表格数据
        saveList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          customName: null,
          saveDate: null,
          itemNumber: null,
          description: null,
          cabinetNumber: null,
          weight: null,
          amount: null,
          palletAmount: null,
          boxAmount: null,
          bigUnit: null,
          oddAmount: null,
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
          url: process.env.VUE_APP_BASE_API + "/system/save/importData"
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      checkRole,
      /** 查询仓储库存记录列表 */
      getList() {
        this.loading = true;
        listSave(this.queryParams).then(response => {
          this.saveList = response.rows;
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
          customName: null,
          saveDate: null,
          itemNumber: null,
          description: null,
          cabinetNumber: null,
          weight: null,
          amount: null,
          palletAmount: null,
          boxAmount: null,
          bigUnit: null,
          oddAmount: null,
          remark: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
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
        this.title = "添加仓储库存记录";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getSave(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改仓储库存记录";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateSave(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addSave(this.form).then(response => {
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
        this.$confirm('是否确认删除仓储库存记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delSave(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('system/save/importTemplate', {
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
        this.$refs['elForm'].validate(valid => {
          if (!valid) {
          } else {
            return this.$refs.upload.submit();
          }
        })
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "库存记录";
        this.upload.open = true;
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/save/export', {
          ...this.queryParams
        }, `库存记录.xlsx`)
      }
    }
  };
</script>
