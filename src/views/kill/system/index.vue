<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="箱柜号" prop="cabinetNumber">
        <el-input
          v-model="queryParams.cabinetNumber"
          placeholder="请输入箱柜号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="入园时间" prop="inDate">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.inDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择入园时间">
        </el-date-picker>
      </el-form-item> -->
      <!-- <el-form-item label="客户姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入客户姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="是否还箱" prop="returnCabinet">
        <el-select v-model="queryParams.returnCabinet" placeholder="请选择" clearable size="small">
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in stateOptions"
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
          v-has-role="['sale','manage']"
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
          v-hasPermi="['system:system:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-has-role="['sale','manage']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="systemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id"/>
      <!-- <el-table-column label="入园时间" align="center" prop="inDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="箱柜号" align="center" prop="cabinetNumber"/>
      <!-- <el-table-column label="客户姓名" align="center" prop="name"/> -->
      <el-table-column label="是否还箱" align="center" prop="returnCabinet">
        <template slot-scope="scope">
          {{ scope.row.returnCabinet == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormat"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-has-role="['sale','manage']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:system:remove']"
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

    <!-- 添加或修改上港系统对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="入园时间" prop="inDate">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.inDate"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择入园时间">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="箱柜号" prop="cabinetNumber">
          <el-input v-model="form.cabinetNumber" placeholder="请输入箱柜号"/>
        </el-form-item>
        <!-- <el-form-item label="客户姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户姓名"/>
        </el-form-item> -->
        <el-form-item label="是否还箱" prop="returnCabinet">
          <el-radio-group v-model="form.returnCabinet">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio :label="1">待入园</el-radio>
            <el-radio :label="2">已入园</el-radio>
            <el-radio :label="3">异常核销</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" :loading="addLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listSystem, getSystem, delSystem, addSystem, updateSystem} from "@/api/system/system";

export default {
  name: "System",
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
      // 上港系统表格数据
      systemList: [],
      //上港系统状态字典
      stateOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        state: null,
        // inDate: null,
        cabinetNumber: null,
        name: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      addLoading: false
    };
  },
  created() {
    this.getList();
    this.getDicts('system_state').then(response => {
      this.stateOptions = response.data;
    })
  },
  methods: {
    /** 查询上港系统列表 */
    getList() {
      this.loading = true;
      listSystem(this.queryParams).then(response => {
        this.systemList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 上港系统字典翻译
    stateFormat(row, column) {
      if (row.state) {
        return this.selectDictLabel(this.stateOptions, row.state)
      }
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
        // inDate: null,
        state: null,
        cabinetNumber: null,
        name: null,
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
      this.title = "添加上港系统";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSystem(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改上港系统";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.addLoading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSystem(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.addLoading = false;
              } else {
                this.addLoading = false;
              }
            });
          } else {
            addSystem(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.addLoading = false;
              } else {
                this.addLoading = false;
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除上港系统编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delSystem(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/system/export', {
        ...this.queryParams
      }, `上港系统.xlsx`)
    }
  }
};
</script>
