<template>
  <div class="dialog-warp">
    <div class="other-price-content">
      <div class="o-p-title">
        预约单号：{{ rowDetail.orderNumber }}
      </div>
      <el-table class="mt10" v-loading="tableLoading" :data="list" v-if="list.length > 0">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="名称" align="center" prop="title"/>
        <el-table-column label="单价" align="center" prop="itemPrice"/>
        <el-table-column label="数量" align="center" prop="itemCount"/>
        <el-table-column label="总价" align="center" prop="itemTotal"/>
      </el-table>
      <div class="list-title">请选择</div>
      <div class="other-price-list">
        <span v-for="(item,index) in otherPriceOptions" :key="index" @click="addChild(item)">
          {{item.dictLabel}}
        </span>
      </div>
      <div class="add-list">
        <div class="add-child" v-for="(item,index) in addList" :key="index">
          <div class="a-c-td">
            {{item.title}} <i class="el-icon-remove-outline a-c-right" @click="delChild(index)" v-if="!item.id"></i>
          </div>
          <div class="a-c-msg">
            <span>
              单价：￥{{item.itemPrice}}
            </span>
            <span v-if="item.id">
              数量：{{item.itemCount}}
            </span>
            <span v-else>
              数量：<el-input class="a-c-number" size="mini" v-model="item.itemCount" placeholder="请输入数量"></el-input>
            </span>
            <span>
              总价格：￥{{item.itemTotal = item.itemPrice * item.itemCount}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="success" @click="submitBox" :loading="loading">确 定</el-button>
    </div>
  </div>
</template>
<script>
import { addOtherPrice, otherPriceList } from '@/api/system/recordKill'
export default {
  props: {
    rowDetail: {
      type: Object,
      required: {}
    }
  },
  data() {
    return {
      addList: [],
      list: [],
      // 附加费用字典
      otherPriceOptions: [],
      loading: false,
      tableLoading: true
    }
  },
  created() {
    // 附加费用字典
    this.getDicts('other_price').then(response => {
      this.otherPriceOptions = response.data
    })
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.list = [];
      this.addList = [];
      var data = {
        orderNumber: this.rowDetail.orderNumber
      }
      otherPriceList(data).then(response => {
        this.tableLoading = false;
        this.list = response.rows;
      })
    },
    addChild(item) {
      this.addList.push({
        orderNumber: this.rowDetail.orderNumber,
        title: item.dictLabel,
        itemType: item.dictValue,
        itemCount: "",
        itemPrice: item.remark,
        itemTotal: 0
      })
    },
    delChild(index) {
      this.addList.splice(index, 1);
    },
    submitBox() {
      this.loading = true;
      addOtherPrice(this.addList).then((response) => {
        if (response.code == 200) {
          this.loading = false;
          this.cancel();
        } else {
          this.loading = false;
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.other-price-content {
  font-size: 14px;
  .o-p-title {
    color: #333;
  }
  .list-title {
    margin-top: 15px;
    color: #333;
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
    margin-bottom: 25px;
    .add-child {
      position: relative;
      border-bottom: 1px solid #EBEDF0;
      padding: 13px 15px 10px;
      .a-c-number {
        width: 100px;
      }
      .a-c-td {
        color: #333;
        font-weight: 500;
        margin-bottom: 5px;
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
          margin-right: 20px;
          border-right: 1px solid #EBEDF0;
          &:last-child {
            border-right: none;
          }
        }
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