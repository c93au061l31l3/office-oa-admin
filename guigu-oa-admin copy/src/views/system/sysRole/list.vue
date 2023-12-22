<template>
    <div class="app-container">

        <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名稱">
              <el-input style="width: 100%" v-model="searchObj.roleName" placeholder="角色名稱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" :loading="loading" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
          
        </el-row>
      </el-form>
      
    </div>

    <!-- 表格 -->
  
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      borderstyle="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange">

      <el-table-column type="selection"/>

      <el-table-column
        label="序號"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名稱" />
      <el-table-column prop="roleCode" label="角色编碼" />
      <el-table-column prop="createTime" label="創建時間" width="160"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除"/>
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignAuth(scope.row)" title="分配權限"/>
        </template>
      </el-table-column>
    </el-table>
    <br>

    <!-- 工具组件 -->    
    <div>
        <!-- 添加按鈕 -->
        <el-button type="success" icon="el-icon-plus" size="mini" @click="add" :disabled="$hasBP('bnt.sysRole.add')  === false">添 加</el-button>
          <!-- 批量刪除按鈕 -->
        <el-button class="btn-add"   size="mini" @click="batchRemove()">勾選刪除</el-button>
    </div>

    <!-- 分页组件 -->
    <el-pagination
        :current-page="page"
        :total="total"
        :page-size="limit"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchData"
    />

    <!-- 新增&修改角色彈出框-->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名稱">
          <el-input v-model="sysRole.roleName"/>
        </el-form-item>
        <el-form-item label="角色编碼">
          <el-input v-model="sysRole.roleCode"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
//引入定義接口的js文件
import api from '@/api/system/sysRole'

export default{
    //vue代碼結構
    //初始值在data內進行定義
    data(){
        return{
            list:[],//角色列表
            page:1,//當前頁
            limit:3,//每頁顯示數據數
            total:0,//總計錄數
            searchObj:{},//條件對象
            dialogVisible:false, //是否彈框
            sysRole:{}, //用於封裝新增角色表單的資料
            selections:[] //多個複選框值
        }
    },created(){ //頁面渲染前執行
        this.fetchData()
    },
    methods: {
     //條件分頁插件方法
     fetchData(current = 1){ //可接收參數，不傳則默認為1
        this.page = current
        api.getPageList(this.page,this.limit,this.searchObj)
            .then(response => {
                this.list = response.data.records
                this.total = response.data.total
            })
     },

     //刪除按鈕功能
     removeDataById(id){
        //確定刪除彈窗
        this.$confirm('此操作將永久刪除該紀錄，是否繼續?','提示',{
          confirmButtonText:'確定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(() => { //點擊確定執行then()，取消則會執行catch()，但這裡的catch()甚麼都不需要做
          return api.removedById(id) //return代表調用api.removedById(id)成功後會執行下一個then()
        }).then(response => {
          //刷新頁面
          this.fetchData()
          //提示信息
          this.$message.success(response.message || '刪除成功')
        }) 
     },

     //修改按鈕功能
     edit(id){
        //彈出窗
        this.dialogVisible = true
        //根據id查詢
        this.fetchDataById(id)
     },

     //根據id查詢
     fetchDataById(id){
        api.getById(id)
          .then(response => {
            this.sysRole = response.data
          })
     },

     //添加
     add(){
        this.dialogVisible = true //顯示彈窗
     },

     //添加或修改
     saveOrUpdate(){
        //根據是否有id來判斷是添加or修改
        if(!this.sysRole.id){
          this.save()
        }else{
          this.update()
        }
     },
     //添加
     save(){
        api.saveRole(this.sysRole)
        .then(response => {
          //提示
          this.$message.success(response.message || '操作成功')
          //關閉彈窗
          this.dialogVisible = false
          //刷新頁面
          this.fetchData()
        })
     },
     //修改
     update(){
        api.updateById(this.sysRole)
          .then(response => {
            //提示
            this.$message.success(response.message || '操作成功')
            //關閉彈窗
            this.dialogVisible = false
            //刷新頁面
            this.fetchData()
          })
     },

     //選擇複選框，把複選框所在行內容傳遞
     handleSelectionChange(selection){
        this.selections = selection
        
     },

     //實現批量刪除
     batchRemove(){
        //判斷是否有選取物件
        if(this.selections.length == 0){
            this.$message.warning('請選擇要刪除的紀錄!')
            return
        }
        this.$confirm('此操作將永久刪除該紀錄，是否繼續?','提示',{
          confirmButtonText:'確定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          var idList = []
          //將selections裡的資料的id轉化為數組
          this.selections.forEach(item => {
            var id = item.id
            idList.push(id)
          });
          return api.batchRemove(idList)
        }).then(response =>{
          
          //提示信息
          this.$message.success(response.message || '刪除成功')
          //刷新頁面
          this.fetchData()
        })
     },
     //跳轉到分配菜單的頁面
     showAssignAuth(row) {
        this.$router.push('/system/assignAuth?id='+row.id+'&roleName='+row.roleName);
      }
     
    }
}

</script>
