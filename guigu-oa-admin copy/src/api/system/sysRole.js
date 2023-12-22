import request from '@/utils/request' //裡面封裝axios

const api_name = '/admin/system/sysRole' //抽取固定路徑片段

export default{
    //角色列表-條件分頁查詢
    getPageList(current,limit,searchObj){
        return request({
            url:`${api_name}/${current}/${limit}`,
            method:'get',
            //如果是普通對象參數 -> params:對象參數名稱
            //如果使用json格式傳遞 -> data:對象參數名稱
            //data
            params:searchObj //查詢條件
        })
    },

    //角色刪除
    removedById(id){
        return request({
            url:`${api_name}/remove/${id}`,
            method:'delete'
        })
    },

    //新增角色
    saveRole(role){
        return request({
            url:`${api_name}/save`,
            method:'post',
            data:role,
            contentType: 'application/json;charset=UTF-8'
        })
    },

    //根據id查詢
    getById(id){
        return request({
            url:`${api_name}/get/${id}`,
            method:'get',
        })
    },

    //修改
    updateById(role){
        return request({
            url:`${api_name}/update`,
            method:'put',
            data:role
        })
    },

    //批量刪除
    batchRemove(idList){
        return request({
            url:`${api_name}/batchRemove`,
            method:'delete',
            data:idList
        })
    },
    getRoles(adminId) {
        return request({
          url: `${api_name}/toAssign/${adminId}`,
          method: 'get'
        })
      },
      
      assignRoles(assginRoleVo) {
        return request({
          url: `${api_name}/doAssign`,
          method: 'post',
          data: assginRoleVo
        })
      }
}