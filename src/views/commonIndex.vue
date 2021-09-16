<template>
  <div class="common-index-warp">
    <public-hearder type="index"></public-hearder>
    <div class="common-index">
      <div class="common-left">
        <div class="common-msg shadow">
          <div class="msg-logo">
            <img src="@/assets/image/index/msg-logo.png" />
            <div class="msg-logo-tips">
              <span v-for="(item,index) in userInfo.roles" :key="index">{{item.roleName}} </span>
            </div>
          </div>
          <div class="msg-remark">
            <div class="user-name">
              {{userInfo.userName}}
            </div>
            <div class="user-msg">
              <label>账户ID</label>
              <span>{{userInfo.userId}}</span>
            </div>
            <div class="user-msg">
              <label>邮箱</label>
              <span>{{userInfo.email}}</span>
            </div>
            <!-- <div class="user-msg">
              <label>商家认证</label>
              <span>暂未认证</span>
              <span class="store-btn">申请商家认证</span>
            </div> -->
            <div class="user-phone">
              <span><img src="@/assets/image/index/phone.png" /> {{userInfo.phoneNumber | phone}}</span>
              <!-- <span><img src="@/assets/image/index/company.png" /> 上海华辰</span> -->
            </div>
          </div>
        </div>
        <div class="icon-content shadow">
          <div class="icon-title">
            防疫消杀
          </div>
          <div class="icon-list">
            <div class="icon-child c-kill" v-for="(item,index) in killList" :key="index" @click="routerTo(item)">
              <img :src="item.logo" />
              <span>{{item.title}}</span>
            </div>
          </div>
        </div>
        <div class="icon-content shadow">
          <div class="icon-title">
            仓库服务
          </div>
          <div class="icon-list">
            <div class="icon-child c-warehouse" v-for="(item,index) in warehouseList" :key="index" @click="routerTo(item)">
              <img :src="item.logo" />
              <span>{{item.title}}</span>
            </div>
          </div>
        </div>
        <div class="icon-content shadow">
          <div class="icon-title">
            海关查验
          </div>
          <div class="icon-list">
            <div class="icon-child c-customs">
              <img src="@/assets/image/index/icon-add.png" />
              <span class="color99">敬请期待</span>
            </div>
          </div>
        </div>
      </div>
      <div class="common-right">
        <div class="r-phone shadow">
          <img class="r-phone-icon" src="@/assets/image/index/phone-icon.png" />
          <div class="r-phone-msg">
            <div class="color99">客服电话（8:30-17:30）</div>
            <div class="r-p-number">
              021-6831-8888
            </div>
          </div>
          <img class="r-phone-wifi" src="@/assets/image/index/phone-wifi.png" />
        </div>
        <!-- banner图 -->
        <div class="r-banner">
          <el-carousel height="184px">
            <el-carousel-item v-for="(item, index) in bannerList" :key="index">
              <div class="small" v-html="item.noticeContent"></div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 公告 -->
        <div class="r-notice">
          <div class="r-notice-title">
            <label>公告</label>
            <span @click="toNotice('notice')">更多</span>
          </div>
          <div class="r-notice-list">
            <div class="r-notice-child" v-for="(item, index) in noticeList" :key="index" v-show="index < 5" @click="toDetail('notice', item)">
              <span class="r-title">{{item.noticeTitle}}</span>
              <span class="r-time">{{item.createTime | createTime}}</span>
            </div>
          </div>
        </div>
        <!-- 行业资讯 -->
        <div class="r-notice">
          <div class="r-notice-title">
            <label>行业资讯</label>
            <span @click="toNotice('news')">更多</span>
          </div>
          <div class="r-notice-list">
            <div class="r-notice-child" v-for="(item, index) in newsList" :key="index" v-show="index < 5" @click="toDetail('news', item)">
              <span class="r-title">{{item.noticeTitle}}</span>
              <span class="r-time">{{item.createTime | createTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { listNotice } from '@/api/system/notice'
import publicHearder from '@/components/public/header'
export default {
  components: { publicHearder },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      bannerList: [],
      noticeList: [],
      newsList: [],
      userInfo: {},
      killList: [
        {
          logo: require('@/assets/image/index/kill-one.png'),
          title: "预约消杀",
          type: 1,
          url: "/kill/reservation/index",
        },
        {
          logo: require('@/assets/image/index/kill-two.png'),
          title: "查看预约",
          type: 2,
          url: "/kill/review/index"
        },
        {
          logo: require('@/assets/image/index/kill-three.png'),
          title: "查询消杀证明",
          type: 3,
          url: "/checkCode"
        },
        {
          logo: require('@/assets/image/index/kill-four.png'),
          title: "核酸报告下载",
          type: 4,
          url: "/kill/sum/index"
        }
      ],
      warehouseList: [
        {
          logo: require('@/assets/image/index/wh-one.png'),
          title: "出库预约",
          type: 1,
          url: "/warehouse/reserveOut",
        },
        {
          logo: require('@/assets/image/index/wh-two.png'),
          title: "入库预约",
          type: 2,
          url: ""
        },
        {
          logo: require('@/assets/image/index/wh-three.png'),
          title: "出入库查询",
          type: 3,
          url: "/warehouse/in"
        },
        {
          logo: require('@/assets/image/index/wh-four.png'),
          title: "凭证下载",
          type: 4,
          url: "/warehouse/save"
        }
      ],
    };
  },
  mounted() {
    this.getList();
    this.userInfo = this.$store.state.user.info;
  },
  methods: {
    getList() {
      listNotice(this.queryParams).then(response => {
        response.rows.map(item => {
          if (item.status == '0') {
            if (item.noticeType == 2) {
              this.noticeList.push(item);
            } else if (item.noticeType == 3) {
              this.newsList.push(item);
            } else if (item.noticeType == 4) {
              this.bannerList.push(item);
            }
          }
        })
      })
    },
    toNotice(type) {
      //公告列表
      this.$router.push({path: "/notice/index", query: {tp: type}});
    },
    toDetail(type, item) {
      //公告详情
      this.$router.push({path: "/notice/detail", query: {tp: type, nid: item.noticeId}});
    },
    routerTo(item) {
      //跳转
      if (item.url && item.url != '') {
        this.$router.push(item.url);
      } else {
        this.$message("暂未开放");
      }
    }
  },
  filters: {
    phone(val) {
      if (val) {
        return val.slice(0,3) + "-" + val.slice(3,7) + "-" + val.slice(7,11);
      }
    },
    createTime(val) {
      if (val) {
        return val.slice(0, 10);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/index.scss";
.common-index-warp {
  background: #F7F8FA;
  height: 100%;
  padding: 20px;
  font-size: 14px;
  .common-index {
    @include display-flex;
    margin-top: 52px;
    .common-left {
      @include flex(2);
      margin-right: 16px;
      .common-msg {
        background: #fff;
        padding: 30px;
        .msg-logo {
          float: left;
          text-align: center;
          margin-right: 25px;
          img {
            width: 74px;
          }
          .msg-logo-tips {
            border: 1px solid #20B235;
            font-size: 12px;
            color: #20B235;
            padding: 2px 5px;
            margin-top: 10px;
            border-radius: 2px;
            max-width: 80px;
            height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .msg-remark {
          .user-name {
            color: #000;
            font-size: 16px;
            margin-bottom: 20px;
            font-weight: 500;
          }
          .user-msg {
            margin-bottom: 8px;
            label {
              color: #888;
              font-weight: 500;
              margin-right: 16px;
            }
            .store-btn {
              background: rgba(#FF9600, 0.1);
              color: #FF5900;
              margin-left: 20px;
              padding: 3px 8px;
              border-radius: 2px;
              cursor: pointer;
            }
          }
          .user-phone {
            margin-top: 20px;
            span {
              margin-right: 24px;
              img {
                height: 13px;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .icon-content {
        background: #fff;
        margin-top: 16px;
        .icon-title {
          color: #000;
          font-weight: 500;
          font-size: 16px;
          padding: 16px;
        }
        .icon-list {
          @include display-flex;
          padding: 8px 40px 34px;
          text-align: center;
          .icon-child {
            width: 180px;
            // text-align: center;
            height: 88px;
            line-height: 88px;
            margin-left: 42px;
            border-radius: 2px;
            cursor: pointer;
            &:first-child {
              margin-left: 0px;
            }
            img {
              vertical-align: middle;
              margin-right: 5px;
              margin-top: 8px;
            }
          }
          .c-kill {
            img {
              max-width: 58px;
            }
            &:first-child {
              background: rgba(#FF9B00, 0.1);
            }
            &:nth-child(2) {
              background: rgba(#5288F5, 0.1);
            }
            &:nth-child(3) {
              background: rgba(#2EB7C2, 0.1);
            }
            &:last-child {
              background: rgba(#20B235, 0.1);
            }
          }
          .c-warehouse {
            img {
              max-width: 48px;
            }
            &:first-child {
              background: rgba(#60ADFC, 0.1);
            }
            &:nth-child(2) {
              background: rgba(#FFC968, 0.1);
            }
            &:nth-child(3) {
              background: rgba(#7CD7A7, 0.1);
            }
            &:last-child {
              background: rgba(#B5ACFF, 0.1);
            }
          }
          .c-customs {
            img {
              max-width: 46px;
              margin-top: 0px;
            }
            &:first-child {
              background: rgba(#8491A6, 0.1);
            }
          }
        }
      }
    }
    .common-right {
      width: 456px;
      min-width: 456px;
      display: inline-block;
      .r-phone {
        position: relative;
        background: #fff;
        padding: 26px 45px;
        .r-phone-icon {
          display: inline-block;
          vertical-align: middle;
          width: 60px;
          margin-right: 16px;
        }
        .r-phone-msg {
          display: inline-block;
          vertical-align: middle;
          .r-p-number {
            font-size: 20px;
            color: #000;
            margin-top: 8px;
          }
        }
        .r-phone-wifi {
          position: absolute;
          top: 7px;
          right: 6px;
          width: 60px;
        }
      }
      .r-banner {
        background: #fff;
        margin: 16px auto;
        .small {
          /deep/ p {
            margin: 0;
          }
          /deep/ img {
            max-height: 100%;
            max-width: 100%;
          }
        }
      }
      .r-notice {
        background: #fff;
        margin-top: 16px;
        .r-notice-title {
          height: 45px;
          line-height: 45px;
          padding: 0 16px;
          label {
            font-weight: 500;
            color: #000;
          }
          span {
            float: right;
            color: #25BD3F;
            cursor: pointer;
          }
        }
        .r-notice-list {
          padding-bottom: 16px;
          .r-notice-child {
            height: 30px;
            line-height: 30px;
            padding: 0 16px;
            cursor: pointer;
            &:hover {
              background: rgba(#20B235, 0.05);
            }
            .r-title {
              color: #888;
              width: 60%;
              display: inline-block;
              height: 30px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .r-time {
              float: right;
              color: #999;
            }
          }
        }
      }
    }
    .shadow {
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.08);
      border-radius: 4px;
    }
  }
}
</style>