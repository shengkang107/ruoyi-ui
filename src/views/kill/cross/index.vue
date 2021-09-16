<template>
  <div class="kill-cross-warp">
    <div class="cross-list">
      <div class="cross-title">
        <span
          class="c-t-wh"
          :class="{'active': item.id == WarehouseInfo.id}"
          v-for="(item, index) in WarehouseList"
          :key="index"
          @click="WarehouseTab(item)"
        >{{item.warehouseName}}</span>
        <div class="cross-title-btn" v-if="checkRole(['manage','warehouse','admin'])">
          <span @click="addWarehouseDialog = true">新增仓库</span>
          <span @click="openDialog('addCross')">新增道口</span>
        </div>
      </div>
      <div class="cross-content" v-loading="crossLoading">
        <div class="child-td cross-content-title" v-if="crossList.length > 0">
          <div class="td cross-number">道口</div>
          <div class="cross-article">
            <div class="td">业务类型</div>
            <div class="td">货品规格</div>
            <div class="td">地区类别</div>
            <div class="td">备注</div>
            <div class="td">道口状态</div>
            <div class="td cross-task">当前任务</div>
          </div>
          <div class="td cross-btn" v-if="checkRole(['manage','warehouse','admin'])">操作</div>
        </div>
        <div class="all-cross">
          <div class="child-td cross-content-child" v-for="(item, index) in crossList" :key="index">
            <div class="td cross-number">
              <span>{{item.crossName}}</span>
            </div>
            <div class="cross-article" :class="{'gray': item.crossStatus == 3 || item.crossStatus == 4}" v-if="item.crossStatus != 5">
              <div class="td">
                <span v-for="item2 in item.businessType" :key="item2"><i class="el-icon-circle-check"></i> {{ businessTypeFormat(item2) }}</span>
              </div>
              <div class="td">
                <span v-for="item2 in item.cabinetType" :key="item2"><i class="el-icon-circle-check"></i> {{ cabinetTypeFormat(item2) }}</span>
              </div>
              <div class="td">
                <span v-for="item2 in item.isDanger" :key="item2"><i class="el-icon-circle-check"></i> {{ isDangerFormat(item2) }}</span>
              </div>
              <div class="td">
                <span>{{item.remark}}</span>
              </div>
              <div class="td" v-if="item.crossStatus == 0">
                <span> {{ crossStatusFormat(item.crossStatus) }}</span>
              </div>
              <div class="td orange" v-if="item.crossStatus == 1">
                <span class="el-icon-circle-check"> {{ crossStatusFormat(item.crossStatus) }}</span>
              </div>
              <div class="td green" v-if="item.crossStatus == 2">
                <span class="el-icon-video-pause"> {{ crossStatusFormat(item.crossStatus) }}</span>
              </div>
              <div class="td red" v-if="item.crossStatus == 3">
                <span class="el-icon-remove-outline"> {{ crossStatusFormat(item.crossStatus) }}</span>
              </div>
              <div class="td red" v-if="item.crossStatus == 4">
                <span class="el-icon-remove-outline"> {{ crossStatusFormat(item.crossStatus) }}</span>
              </div>
              <div class="td cross-task" v-if="item.crossTask">
                <div>
                  预约单号：{{item.crossTask.orderNumber}}
                </div>
                <div v-if="item.crossTask.taskType != 2">
                  箱柜号：{{item.crossTask.cabinetNumber}}
                </div>
                <div>
                  车牌号：{{item.crossTask.carNumber}}
                </div>
              </div>
              <div class="td cross-task" v-if="!item.crossTask">
                <span v-if="item.crossStatus == 4">暂停原因：{{item.reason}}</span>
                <span v-else>-</span>
              </div>
            </div>
            <div class="cross-article error-status" v-if="item.crossStatus == 5">
              <span class="el-icon-circle-close"> 不可用</span>    
            </div>
            <div class="td cross-btn" v-if="checkRole(['manage','warehouse','admin'])">
              <span class="set-type" @click="openDialog('setAttribute', item)">设置属性</span>
              <span class="continue" v-if="item.crossStatus == 2" @click="openDialog('finishTask', item)">已完成</span>
              <span class="suspend" v-if="item.crossStatus == 2" @click="openDialog('specialTask', item)">特殊情况</span>
              <span class="continue" v-if="item.crossStatus == 3 || item.crossStatus == 4" @click="continueTask(item)">开启</span>
              <span class="suspend" v-if="item.crossStatus == 1" @click="pauseTask(item)">暂停</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增仓库 -->
    <el-dialog title="新增仓库" :visible.sync="addWarehouseDialog" width="500px" append-to-body>
      <el-form ref="warehouseForm" :model="warehouseForm" :rules="rules" label-width="100px">
        <el-form-item label="仓库名称：" prop="warehouseName">
          <el-input
            v-model="warehouseForm.warehouseName"
            placeholder="请输入仓库名称"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="仓库排序：" prop="warehouseSort">
          <el-input
            v-model="warehouseForm.warehouseSort"
            placeholder="请输入仓库排序"
            clearable
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addWarehouseDialog = false">取 消</el-button>
        <el-button type="success" @click="addWarehouseSumbit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增道口 -->
    <el-dialog :title="crossType == 'add' ? WarehouseInfo.warehouseName + '：新增道口': '设置属性'" :visible.sync="setAttributeDialog" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="crossRules" label-width="100px">
        <el-form-item label="道口名称：" prop="crossName" v-if="crossType == 'add'">
          <el-input
            v-model="form.crossName"
            placeholder="请输入道口名称"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="业务类型：" prop="businessType">
          <el-checkbox-group v-model="form.businessType">
            <el-checkbox v-for="(type, index) in businessTypeOptions" :label="type.dictValue" :key="index">{{type.dictLabel}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="货品规格：" prop="cabinetType">
          <el-checkbox-group v-model="form.cabinetType">
            <el-checkbox v-for="(type, index) in cabinetTypeOptions" :label="type.dictValue" :key="index">{{type.dictLabel}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="地区类别：" prop="isDanger">
          <el-checkbox-group v-model="form.isDanger">
            <el-checkbox v-for="(type, index) in isDangerOptions" :label="type.dictValue" :key="index">{{type.remark}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="道口状态：" prop="crossStatus" v-if="crossType == 'add'">
          <el-radio-group v-model="form.crossStatus" style="line-height: 30px;">
            <el-radio v-for="(item, index) in crossStatusOptions" :key="index" :label="item.dictValue">{{item.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="道口排序：" prop="crossSort">
          <el-input
            v-model="form.crossSort"
            placeholder="请输入道口排序"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="道口备注：" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="请输入道口备注"
            clearable
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setAttributeDialog = false">取 消</el-button>
        <el-button type="success" @click="setAttributeSumbit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'特殊情况'" :visible.sync="specialTaskDialog" width="500px" append-to-body>
      <el-form ref="stopTaskForm" :model="stopTaskForm" :rules="stopTaskRules" label-width="90px">
        <el-form-item label="当前订单" prop="orderStatus">
          <el-radio v-model="stopTaskForm.orderStatus" :label="1">重新安排靠口</el-radio>
          <el-radio v-model="stopTaskForm.orderStatus" :label="2">暂时扣押</el-radio>
        </el-form-item>
        <el-form-item label="道口状态" prop="crossStatus">
          <el-radio v-model="stopTaskForm.crossStatus" :label="1">可靠口</el-radio>
          <el-radio v-model="stopTaskForm.crossStatus" :label="2">暂停作业</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="reason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="stopTaskForm.reason"
            placeholder="请输入备注"
            clearable
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="specialTaskDialog = false">取 消</el-button>
        <el-button type="success" @click="specialTaskSumbit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="完成作业" :visible.sync="finishDialog" width="500px" append-to-body>
      <div class="finish-tak">
        <div class="finish-task-msg" v-if="crossRow.crossTask">
          <span>订单号：{{crossRow.crossTask.orderNumber}}</span>
          <span>车牌号：{{crossRow.crossTask.carNumber}}</span>
          <span v-if="crossRow.crossTask.taskType != 2">箱柜号：{{crossRow.crossTask.cabinetNumber}}</span>
        </div>
        <div class="list-title">请选择</div>
        <div class="other-price-list">
          <span v-for="(item,index) in personTypeOptions" :key="index" @click="addChild(item)">
            {{item.dictLabel}}
          </span>
        </div>
        <div class="add-list">
          <div class="add-child" v-for="(item,index) in addList" :key="index">
            <div class="a-c-td">
              {{item.title}} <i class="el-icon-remove-outline a-c-right" v-if="!item.require" @click="delChild(index)"></i>
            </div>
            <div class="a-c-msg">
              <span>
                姓名：<el-input class="a-c-number" size="mini" v-model="item.personName" placeholder="请输入姓名"></el-input>
              </span>
              <span>
                所属单位：<el-input class="a-c-number" size="mini" v-model="item.personCompany" placeholder="请输入所属单位"></el-input>
              </span>
            </div>
            <div class="a-c-tips" v-if="item.tips"> {{item.tips}} </div>
          </div>
        </div>
      </div>
      <el-form ref="finishTaskForm" :model="form" :rules="finishTaskRules" label-width="5px">
        <el-form-item prop="sample">
          <el-radio v-model="form.sample" label="1">已采样</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="finishDialog = false">取 消</el-button>
        <el-button type="success" @click="finishTaskSumbit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { checkRole } from '@/utils/permission';
import { WarehouseList, addWarehouse, crossList, addCross, editCross, continueCross, pauseCross, finishCross, specialCross, crossDetail } from '@/api/system/warehouse';
export default {
  data() {
    return {
      WarehouseList: [],
      //字典
      isDangerOptions: [],
      cabinetTypeOptions: [],
      businessTypeOptions: [],
      crossStatusOptions: [],
      personTypeOptions: [],
      crossList: [],
      crossLoading: false,
      //新增仓库
      addWarehouseDialog: false,
      warehouseForm: {
        warehouseName: null,
        warehouseSort: null
      },
      WarehouseInfo: {},
      crossRow: {},
      //设置属性-新增道口
      crossType: "add",
      setAttributeDialog: false,
      form: {
        crossName: null,
        businessType: [],
        cabinetType: [],
        isDanger: [],
        crossStatus: null,
        crossSort: null
      },
      //特殊情况
      specialTaskDialog: false,
      stopTaskForm: {
        crossStatus: null,
        reason: null
      },
      rules: {
        warehouseName: [{
          required: true,
          message: "请输入仓库名称",
          trigger: "blur"
        }],
        warehouseSort: [{
          required: true,
          message: "请输入仓库排序",
          trigger: "blur"
        },
        {
          pattern: /^[0-9]*$/,
          message: '仓库排序只能是数字',
          trigger: 'blur'
        }]
      },
      crossRules: {
        crossName: [{
          required: true,
          message: "请输入道口名称",
          trigger: "blur"
        }],
        businessType: [{
          required: true,
          message: "请选择业务类型",
          trigger: "change"
        }],
        cabinetType: [{
          required: true,
          message: "请选择货品规格",
          trigger: "change"
        }],
        isDanger: [{
          required: true,
          message: "请选择地区类别",
          trigger: "change"
        }],
        crossStatus: [{
          required: true,
          message: "请选择道口状态",
          trigger: "change"
        }],
        crossSort: [{
          required: true,
          message: "请输入道口排序",
          trigger: "blur"
        },
        {
          pattern: /^[0-9]*$/,
          message: '道口排序只能是数字',
          trigger: 'blur'
        }]
      },
      stopTaskRules: {
        orderStatus: [{
          required: true,
          message: "请选择订单状态",
          trigger: "change"
        }],
        crossStatus: [{
          required: true,
          message: "请选择道口状态",
          trigger: "change"
        }],
        reason: [{
          required: true,
          message: "请输入备注",
          trigger: "blur"
        }]
      },
      finishDialog: false,
      finishTaskRules: {
        sample: [{
          required: true,
          message: "是否已采样",
          trigger: "change"
        }]
      },
      addList: []
    }
  },
  created() {
    this.getDicts('kill_danger').then(response => {
      this.isDangerOptions = response.data
    });
    this.getDicts("cabinet_type").then((response) => {
      if (response.data.length > 0) {
        this.cabinetTypeOptions = response.data;
      }
    });
    this.getDicts('business_type').then(response => {
      this.businessTypeOptions = response.data;
    });
    this.getDicts('cross_status').then(response => {
      this.crossStatusOptions = response.data;
    });
    //人员类型
    this.getDicts('person_type').then(response => {
      this.personTypeOptions = response.data;
      this.addListDefault(response.data);
    })
    this.getWarehouseList();
  },
  methods: {
    checkRole,
    addListDefault(list) {
      //必须有2个搬运工，1个消杀人员--require: true
      this.addList = [{
        title: list[0].dictLabel,
        personType: list[0].dictValue,
        personName: "",
        personCompany: "",
        require: true
      },{
        title: list[0].dictLabel,
        personType: list[0].dictValue,
        personName: "",
        personCompany: "",
        require: true
      },{
        title: list[0].dictLabel,
        personType: list[0].dictValue,
        personName: "",
        personCompany: ""
      },{
        title: list[0].dictLabel,
        personType: list[0].dictValue,
        personName: "",
        personCompany: ""
      },{
        title: list[1].dictLabel,
        personType: list[1].dictValue,
        personName: "",
        personCompany: "",
        require: true
      }]
    },
    WarehouseTab(item) {
      //切换仓库
      this.WarehouseInfo = item;
      this.getCrossList();
    },
    getWarehouseList() {
      //查询仓库列表
      WarehouseList().then(response => {
        if (response.code == 200) {
          this.WarehouseList = response.rows;
          if (this.WarehouseList.length > 0) {
            this.WarehouseInfo = this.WarehouseList[0];
            this.getCrossList();
          }
        }
      })
    },
    getCrossList() {
      //查询道口列表
      this.crossLoading = true;
      crossList(this.WarehouseInfo.id).then(response => {
        if (response.code == 200) {
          response.rows.map(item => {
            item.businessType = item.businessType.split(",");
            item.cabinetType = item.cabinetType.split(",");
            item.isDanger = item.isDanger.split(",");
          })
          this.crossList = response.rows;
          this.crossLoading = false;
        }
      })
    },
    openDialog(type, row) {
      //设置属性
      switch(type) {
        case "addCross":
          if (this.WarehouseList.length == 0) {
            this.$message({
              message: '请先新增一个仓库',
              type: 'error'
            });
            return false;
          }
          this.setAttributeDialog = true;
          this.crossType = "add";
          break;
        case "setAttribute":
          crossDetail(row.id).then(response => {
            if (response.code === 200) {
              var res = response.data;
              res.businessType = res.businessType.split(",");
              res.cabinetType = res.cabinetType.split(",");
              res.isDanger = res.isDanger.split(",");
              this.form = res;
            }
          })
          this.setAttributeDialog = true;
          this.crossType = "edit";
          break;
        case "specialTask":
          this.crossRow = row;
          this.specialTaskDialog = true;
          break;
        case "finishTask":
          this.crossRow = row;
          if (row.crossTask.taskType == 2) {
            //出库-人员非必填
            this.addList = [];
          }
          this.finishDialog = true;
          break;
      }
    },
    addChild(item) {
      this.addList.push({
        title: item.dictLabel,
        personType: item.dictValue,
        personName: "",
        personCompany: ""
      })
    },
    delChild(index) {
      this.addList.splice(index, 1);
    },
    finishTaskSumbit() {
      //已完成
      let statusL = true;
      if (this.addList.length == 0 && this.crossRow.crossTask.taskType != 2) {
        this.$message({
          message: '请填写搬运工、消杀人员信息',
          type: 'error'
        });
        return;
      } else {
        this.addList.map((item, index) => {
          statusL = true;
          if (item.personName == "" || item.personCompany == "") {
            item.tips = '请填写姓名、所属单位';
            this.addList.splice(index, 1, item);
            statusL = false;
            return;
          } else {
            item.tips = '';
            this.addList.splice(index, 1, item);
          }
        })
      }
      if (statusL) {
        this.$refs["finishTaskForm"].validate(valid => {
          if (valid) {
            var str = {
              crossId: this.crossRow.id,
              taskType: this.crossRow.crossTask.taskType,
              crossTaskPersonList: this.addList
            }
            finishCross(str).then(response => {
              if (response.code === 200) {
                this.form.sample = null;
                this.addListDefault(this.personTypeOptions);
                this.msgSuccess('作业完成，释放道口');
                this.finishDialog = false;
                this.getCrossList();
              }
            })
          }
        })
      }
    },
    pauseTask(item) {
      //暂停
      this.$confirm(item.crossName+'暂停？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var str = {
          crossId: item.id
        }
        pauseCross(str).then(response => {
          if (response.code === 200) {
            this.msgSuccess('该道口已暂停作业');
            this.getCrossList();
          }
        })
      }).catch(() => {})
    },
    continueTask(item) {
      //开启
      this.$confirm(item.crossName+'开启？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var str = {
          crossId: item.id
        }
        continueCross(str).then(response => {
          if (response.code === 200) {
            this.msgSuccess('该道口已开启');
            this.getCrossList();
          }
        })
      }).catch(() => {})
    },
    specialTaskSumbit() {
      //特殊情况
      this.$refs["stopTaskForm"].validate(valid => {
        if (valid) {
          this.stopTaskForm.crossId = this.crossRow.id;
          this.stopTaskForm.taskType = this.crossRow.crossTask.taskType;
          specialCross(this.stopTaskForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess('操作成功');
              this.specialTaskDialog = false;
              this.getCrossList();
            }
          })
        }
      })
    },
    addWarehouseSumbit() {
      //新增仓库
      this.$refs["warehouseForm"].validate(valid => {
        if (valid) {
          addWarehouse(this.warehouseForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess('新增成功');
              this.addWarehouseDialog = false;
              this.resetForm("warehouseForm");
              this.getWarehouseList();
            }
          })
        }
      })
    },
    addCrossSumbit() {
      //新增道口
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form["pid"] = this.WarehouseInfo.id; //仓库ID
          this.form.businessType = this.form.businessType.join(",");
          this.form.cabinetType = this.form.cabinetType.join(",");
          this.form.isDanger = this.form.isDanger.join(",");
          addCross(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('新增成功');
              this.setAttributeDialog = false;
              this.resetForm("form");
              this.getCrossList();
            }
          })
        }
      })
    },
    setAttributeSumbit() {
      if (this.crossType == "add") {
        //新增道口
        this.addCrossSumbit();
        return false;
      }
      //设置属性提交
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form["pid"] = this.WarehouseInfo.id; //仓库ID
          this.form.businessType = this.form.businessType.join(",");
          this.form.cabinetType = this.form.cabinetType.join(",");
          this.form.isDanger = this.form.isDanger.join(",");
          editCross(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('设置成功');
              this.setAttributeDialog = false;
              this.resetForm("form");
              this.getCrossList();
            }
          })
        }
      })
    },
    // 是否高风险
    isDangerFormat(row, column) {
      return this.selectDictRemark(this.isDangerOptions, row);
    },
    //货品规格字典翻译
    cabinetTypeFormat(row, column) {
      return this.selectDictLabel(this.cabinetTypeOptions, row)
    },
    //业务类型
    businessTypeFormat(row, column) {
      return this.selectDictLabel(this.businessTypeOptions, row)
    },
    //道口状态
    crossStatusFormat(row, column) {
      return this.selectDictLabel(this.crossStatusOptions, row)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.kill-cross-warp {
  background: #F3F4F4;
  font-size: 14px;
  min-height: calc(100vh - 84px);
  box-sizing: border-box;
  padding: 12px 16px;
  .cross-list {
    background: #fff;
    .cross-title {
      height: 50px;
      line-height: 50px;
      padding: 0 16px;
      border-bottom: 1px solid #F3F4F3;
      .c-t-wh {
        margin: 0 20px;
        padding: 0 10px;
        cursor: pointer;
        &.active {
          border-bottom: 3px solid $themeGreen;
          padding-bottom: 14px;
        }
      }
      .cross-title-btn {
        float: right;
        span {
          border: 1px solid $themeGreen;
          color: $themeGreen;
          padding: 5px 15px;
          border-radius: 2px;
          margin-left: 20px;
          cursor: pointer;
        }
      }
    }
    .cross-content {
      position: relative;
      display: inline-block;
      padding: 23px 15px;
      .all-cross {
        float: left;
        margin-left: 103px;
      }
      .child-td {
        display: inline-block;
        border: 1px solid #EAEAEA;
        margin-bottom: 20px;
        .td {
          border-top: 1px solid #EAEAEA;
          height: 53px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:first-child {
            border-top: none;
          }
          span {
            margin-right: 20px;
            &:last-child {
              margin-right: 0;
            }
            i.el-icon-circle-check {
              color: $themeGreen;
            }
          }
          &.cross-number {
            height: 48px;
            border-bottom: 1px solid #EAEAEA;
          }
          &.cross-task {
            height: 80px;
          }
          &.cross-btn {
            height: 65px;
          }
        }
        &.cross-content-title {
          position: absolute;
          top: 23px;
          left: 15px;
          background: #F5F5F5;
          color: $text66;
          width: 103px;
        }
        &.cross-content-child {
          width: 225px;
          .cross-number {
            //道口
            background: #F5F5F5;
            color: $text00;
            font-size: 18px;
          }
          .cross-article {
            // 内容块
            &.gray {
              background: rgba(#EEEEEE, 0.65);
            }
            &.error-status {
              text-align: center;
              height: 292px;
              line-height: 292px;
              font-size: 18px;
            }
            .green {
              background: rgba($themeGreen, 0.1);
              color: $themeGreen;
            }
            .orange {
              background: rgba($orangeC18, 0.1);
              color: $orangeC18;
            }
            .red {
              color: #FF312B;
            }
          }
          .cross-task {
            //当前任务
            color: $text66;
            display: grid;
            font-size: 12px;
            padding: 15px 0;
          }
          .cross-btn {
            //操作按钮
            span {
              padding: 3px 8px;
              border-radius: 2px;
              margin-right: 6px;
              font-size: 12px;
              cursor: pointer;
              &:last-child {
                margin-right: 0;
              }
              &.set-type {
                background: $themeGreen;
                border: 1px solid $themeGreen;
                color: #fff;
              }
              &.continue {
                border: 1px solid $themeGreen;
                color: $themeGreen;
              }
              &.suspend {
                border: 1px solid #FF312B;
                color: #FF312B;
              }
            }
          }
        }
      }
    }
  }
}
.finish-tak {
  .finish-task-msg {
    span {
      font-size: 12px;
      padding-right: 10px;
      margin-right: 10px;
      border-right: 1px solid #ECECEC;
      &:last-child {
        border-right: none;
      }
    }
  }
  .list-title {
    margin-top: 15px;
    color: #666;
  }
  .other-price-list {
    padding: 20px 10px;
    span {
      background: rgba($themeGreen, 0.1);
      border: 1px solid $themeGreen;
      color: $themeGreen;
      padding: 6px 10px;
      border-radius: 4px;
      margin-right: 15px;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .add-list {
    border-top: 1px solid #EBEDF0;
    margin-bottom: 10px;
    .add-child {
      position: relative;
      border-bottom: 1px solid #EBEDF0;
      padding: 13px 15px 10px;
      .a-c-number {
        width: 125px;
      }
      .a-c-td {
        color: #333;
        font-weight: 500;
        margin-bottom: 10px;
        .a-c-right {
          float: right;
          color: #C03639;
          cursor: pointer;
        }
      }
      .a-c-msg {
        span {
          color: #666;
          font-size: 12px;
          padding-right: 15px;
          margin-right: 10px;
          border-right: 1px solid #EBEDF0;
          &:last-child {
            border-right: none;
          }
        }
      }
      .a-c-tips {
        padding-top: 10px;
        color: #ff4949;
        font-size: 12px;
      }
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 3px;
        margin-top: -2px;
        width: 4px;
        height: 4px;
        background: #666;
        border: 1px solid;
        border-radius: 50%;
      }
    }
  }
}
</style>