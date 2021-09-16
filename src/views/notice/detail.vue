<template>
  <div class="notice-list-warp">
    <public-hearder></public-hearder>
    <div class="notice-link" @click="toIndex()">
      <span><i class="el-icon-arrow-left"></i> 返回首页</span>
    </div>
    <div class="notice-content">
      <div class="notice-title">
        <label @click="toList()">{{ type == "notice" ? "公告" : "行业资讯" }} </label>
        <span class="font12 color99">
          <i class="el-icon-arrow-right"></i> 详情
        </span>
      </div>
      <div class="n-news">
        <div class="news-title">
          {{ newsInfo.noticeTitle }}
        </div>
        <div class="news-time color99">
          {{ newsInfo.updateTime ? newsInfo.updateTime : newsInfo.createTime }}
        </div>
        <div class="news-html" v-html="newsInfo.noticeContent"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { getNotice } from "@/api/system/notice";
import publicHearder from "@/components/public/header";
export default {
  components: {
    publicHearder,
  },
  data() {
    return {
      type: this.$route.query.tp,
      newsInfo: {},
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      getNotice(this.$route.query.nid).then((response) => {
        this.newsInfo = response.data;
      });
    },
    toList() {
      this.$router.push({path: "/notice/index", query: {tp: this.type}});
    },
    toIndex() {
      this.$router.push("/index");
    },
  },
};
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
        color: #20b235;
      }
    }
  }
  .notice-content {
    padding: 20px 48px 50px;
    .notice-title {
      padding-bottom: 20px;
      font-size: 16px;
      border-bottom: 1px solid #dcdee0;
      label {
        cursor: pointer;
        &:hover {
          color: rgba(#20b235, 0.8);
        }
      }
    }
    .n-news {
      padding: 0 52px;
      .news-title {
        margin-top: 31px;
        font-size: 22px;
        font-weight: 580;
        color: #323233;
      }
      .news-time {
        margin-top: 10px;
        margin-bottom: 25px;
      }
      .news-html {
        /deep/ img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>