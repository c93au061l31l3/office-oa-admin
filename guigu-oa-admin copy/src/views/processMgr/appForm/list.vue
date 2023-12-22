<template>
    <div class="app-container">
        <!-- 按鈕 -->
        <el-row style="display:flex">
            <el-button icon="el-icon-refresh" size="mini"  @click="findPending2()">待處理</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="findProcessed2()">已處理</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="findStarted2()" >已發起</el-button>
            <!-- <el-button icon="el-icon-refresh" size="mini" @click=showProcessInfo()>測試</el-button> -->
        </el-row>

      <div class="container">
          <div class="list-wrap" >
          <h3 id="processStatusInfo" >{{ processStatusInfo }}</h3>
          <!-- <van-pull-refresh > -->
            
              <van-cell v-for="item in list" :key="item.id" >
                <template slot="default">
                  <div class="item-wrap">
                    <div class="item-header">
                      <img src="https://static.dingtalk.com/media/lALOnahFD80CgM0CgA_640_640.png_450x10000q90.jpg" alt="">
                      <h3>{{item.title}}</h3>
                      <span>審批提出日期: {{item.createTime}}</span>
                    </div>
                    
                    <div class="item-block">
                      <p v-for="(value,key) in item.formValues.formShowData"  v-if="key !== '图片'">{{ key }}：<span v-html="value"></span></p>
                    </div>
                    <div class="item-status">
                      <span :class="item.status === 1 ? '審批中' : item.status === 2 ? 'pass' : 'refused'">{{ item.status === 1 ? '審批中' : item.status === 2 ? '審批通過' : '審批拒絕' }}</span>
                    </div>

                    <!-- 流程圖 -->
                    <van-cell class="processSchedule">
                      <template slot="default">
                        <div class="result">
                          <!-- <h3>流程</h3> -->
                          <van-steps direction="vertical" :active="item.processRecordList.length - 1">
                            <van-step v-for="item2 in item.processRecordList">
                              <h4>{{ item2.operateUser }} {{ item2.description }}</h4>
                              <p>{{ item2.createTime }}</p>
                            </van-step>
                          </van-steps>
                        </div>
                      </template>
                    </van-cell>

                    <el-button class="processBtn" icon="el-icon-refresh" size="mini" @click="showProcessSchedule(item,$event)">查看</el-button>
                    <el-button class="" icon="el-icon-refresh" size="mini" v-if="processStatus == 1" @click="approve(item.id,item.taskId,1)">審批通過</el-button>
                    <el-button class="" icon="el-icon-refresh" size="mini" v-if="processStatus == 1" @click="approve(item.id,item.taskId,-1)">審批拒絕</el-button>
                  </div>
                </template>
              </van-cell>
            
          <!-- </van-pull-refresh> -->
        </div>
      </div>
      <!-- 分頁 -->
      <el-pagination
        :current-page="pageNo"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="prev, pager, next, jumper, ->, total, slot"
        @current-change="pageChange"
      />

    </div>
</template>

<script>
import api from '@/api/process'


export default {
    data() {
      return {
        list:[], //返回資料
        processRecord:[], //返回資料中的流程進度資料
        pageNo: 1, //當前頁數
        total: 0, //總資料數
        dialogVisible: false,
        processRecordListVisible: [],
        processStatus: 1, //目前的請求類型(1:待處理/2:已處理/3:已發起)
        processStatusInfo: "", //提示目前的請求類型
      }
    },

    created(){
      this.findPending2()
    },

    methods:{

      //待處理
      // findPending(){
      //   this.list = [];
      //   api.findPending(1, 10).then(response => {
      //     console.log(response.data);

      //     for (let i=0;i<response.data.records.length;i++) {
      //     let item = response.data.records[i]
      //     item.formValues = JSON.parse(item.formValues)
      //     this.list.push(item);
      //     }
      //   });
      // },
      
      //請求待處理的流程資料
      findPending2(){
        this.list = [];
        this.processStatus = 1;
        api.findPending2(this.pageNo, 10).then(response => {
          console.log(response.data);
          this.total = response.data.total;
          for (let i=0;i<response.data.records.length;i++) {
            let item = response.data.records[i]
            item.formValues = JSON.parse(item.formValues)
            this.list.push(item);
          }
          this.showProcessInfo();
        });
        
      },
      

      //已處理
      // findProcessed(){
      //   this.list = [];
      //   api.findProcessed(1, 10).then(response => {
      //     console.log(response.data);

      //     for (let i=0;i<response.data.records.length;i++) {
      //     let item = response.data.records[i]
      //     item.formValues = JSON.parse(item.formValues)
          
      //     this.list.push(item);
      //     }
      //   });
      // },

      //請求已處理的流程資料
      findProcessed2(){
        this.list = [];
        this.processStatus = 2;
        api.findProcessed2(this.pageNo, 10).then(response => {
          console.log(response.data);
          this.total = response.data.total;
          for (let i=0;i<response.data.records.length;i++) {
            let item = response.data.records[i]
            item.formValues = JSON.parse(item.formValues)
            this.list.push(item);
          }
          this.showProcessInfo();
        });
  
      },

      //已發起
      // findStarted(){
      //   this.list = [];
      //   api.findStarted(1, 10).then(response => {
      //     console.log(response.data);

      //     for (let i=0;i<response.data.records.length;i++) {
      //       let item = response.data.records[i]
      //       item.formValues = JSON.parse(item.formValues)
      //       this.list.push(item);
      //     }
      //   });
      // },

      //請求已發起的流程資料
      findStarted2(){
        this.list = [];
        this.processStatus = 3;
        api.findStarted2(this.pageNo, 10).then(response => {
          this.total = response.data.total;
          for (let i=0;i<response.data.records.length;i++) {
            let item = response.data.records[i]
            item.formValues = JSON.parse(item.formValues)
            this.list.push(item);
          }
          this.showProcessInfo();
        });

      },

      info(id, taskId) {
        this.$router.push({ path: '/show/'+id+'/'+taskId })
      },
      //換頁
      pageChange(pageNumber){
        this.pageNo = pageNumber;
        if(this.processStatus == 1){
          this.findPending2();
        }
        if(this.processStatus == 2){
          this.findProcessed2();
        }
        if(this.processStatus == 3){
          this.findStarted2();
        }
      },

      //流程圖示的顯示開關
      showProcessSchedule(item,event){
        console.log(item)
        var processScheduleElement = event.currentTarget.previousElementSibling;
        if(processScheduleElement.style.display =="block"){
          processScheduleElement.style.display = "none"
        }else{
          processScheduleElement.style.display = "block"
        }
      },
      //進行審批
      approve(processId ,taskId , status) {
        let approvalVo = {
          processId: processId,
          taskId: taskId,
          status: status
        }
        api.approve(approvalVo).then(response => {
          this.findPending2();
        })
      },

      //顯示資訊狀態
      showProcessInfo(){
        
        if(this.processStatus == 1){
          this.processStatusInfo = "待處理的審批:" 
          if(this.total == 0){
            this.processStatusInfo = "待處理的審批: 暫無審批"
          }
        }
        if(this.processStatus == 2){
          this.processStatusInfo = "已處理的審批:" 
          if(this.total == 0){
            this.processStatusInfo = "已處理的審批: 暫無審批"
          }
        }
        if(this.processStatus == 3){
          this.processStatusInfo = "已發起的審批:" 
          if(this.total == 0){
            this.processStatusInfo = "已發起的審批: 暫無審批"
          }
        }
      }

    }
  }

</script>

<style lang="scss" scoped>
 .van-nav-bar {
  background: #1D1E20;
}
 .van-nav-bar__title {
  color: #fff;
}
.container {
  padding-bottom: 50px;
  .list-wrap {
    margin-top: 4px;
    border-top: 1px solid #ebedf0;
  }
  .processSchedule{
    display: none;
  }
  .item-wrap {
    font-size: 12px;
    color: #A7A8A9;
    .item-header {
      display: flex;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        margin-right: 4px;
      }
      h3 {
        flex: 1;
        font-size: 15px;
        color: #000;
        padding: 0;
        margin: 0;
      }

    }

    .item-block {
      padding: 4px 0;
      font-size: 14px;
      p {
        padding: 0;
        margin: 0;
        line-height: 20px;
      }
    }
    .item-status {
      .pass {
        color: #4CB971;
      }
      .refused {
        color: #EB8473;
      }
    }
  }
  .result {
    font-size: 14px;
    h4, p {
      margin: 5px;
      font-size: 14px;
    }
  }
}
</style>
