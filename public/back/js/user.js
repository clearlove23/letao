$(function(){
  var currentPage=1;
  var pageSize=5;
  render();
  function render(){
    //通过ajax动态渲染
    $.ajax({
      type:"get",
      url:"/user/queryUser",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function(info){
        // console.log(info);
        var str=template("tpl",info);
        $('.lt_content tbody').html(str);
        
      //  配置分页插件
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          //总共多少页
          totalPages:Math.ceil(info.total/info.size),
          currentPage:info.page,
          onPageClicked:function(a,b,c,page){
            currentPage = page;
            render();
        }
        })
      }
    });
  }
  
// 点击禁用按钮，显示模态框，事件委托
  $('.lt_content tbody').on("click",".btn",function(){
    $('#userModal').modal("show");
    var id=$(this).parent().data("id");
    var isDelete=$(this).hasClass("btn-success")?1:0;
    $('#submitBtn').off().click(function(){
      $.ajax({
        type:"post",
        url:"/user/updateUser",
        data:{
          id:id,
          isDelete:isDelete
        },
        success:function(){
          $("#userModal").modal("hide");
          render();
        }
      })
    })
  })
  
})