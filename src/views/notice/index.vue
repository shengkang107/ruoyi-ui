<template>
  <div class="notice-list-warp">
    <public-hearder></public-hearder>
    <div class="notice-link" @click="toIndex()">
      <span><i class="el-icon-arrow-left"></i> 返回首页</span>
    </div>
    <div class="notice-content">
      <div class="notice-title">
        {{ type == 'notice' ? '公告' : '行业资讯'}}
      </div>
      <div class="notice-list">
        <div class="notice-child" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
          <div class="n-topic">
            {{ item.noticeTitle }}
          </div>
          <div class="n-time">
            {{ item.updateTime ? item.updateTime : item.createTime }}
          </div>
        </div>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { listNotice } from '@/api/system/notice'
import publicHearder from '@/components/public/header'
export default {
  components: {
    publicHearder
  },
  data() {
    return {
      type: this.$route.query.tp,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeType: this.$route.query.tp == 'notice' ? 2 : 3
      },
      //总条数
      total: 0,
      list: []
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      listNotice(this.queryParams).then(response => {
        this.list = response.rows;
        this.total = response.total;
      })
    },
    toDetail(item) {
      this.$router.push({path: "/notice/detail", query: {tp: this.type, nid: item.noticeId}});
    },
    toIndex() {
      this.$router.push("/index");
    }
  }
}
</script>
<style lang="scss" scoped>
.notice-list-warp {
  font-size: 14px;
  border: 20px solid #f3f7f9;
  padding-top: 33px;
  .notice-link {
    padding: 22px;
    border-top: 20px solid #f3f7f9;
    span {
      cursor: pointer;
      &:hover {
        color: #20B235;
      }
    }
  }
  .notice-content {
    padding: 20px 48px 50px;
    .notice-title {
      padding-bottom: 20px;
      font-size: 16px;
      font-weight: 580;
      border-bottom: 1px solid #DCDEE0;
    }
    .notice-list {
      padding-bottom: 30px;
      .notice-child {
        padding: 24px 10px;
        border-bottom: 1px solid #DCDEE0;
        cursor: pointer;
        &:hover {
          background: rgba(#20B235, 0.05);
        }
        .n-time {
          margin-top: 9px;
          font-size: 12px;
          color: #9E9E9E;
        }
      }
    }
  }
}
</style>