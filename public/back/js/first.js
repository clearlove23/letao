$(function(){
  var currentPage=1;
  var pageSize=5;
  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        var str=template("firstTpl",info);
        $('.lt_content tbody').html(str);
      //  分页配置
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          totalPages:Math.ceil(info.total/info.size),
          currentPage:info.page,
          onPageClicked: function( a, b, c, page ) {
          // 将当前页更新成 page
          currentPage = page;
          // 重新渲染页面
          render();
        }
        })
      }
    })
  }
  $('#addBtn').click(function(){
    $('#addModal').modal("show");
  });
  $('#form').bootstrapValidator({
    // 指定校验时的图标显示
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:"请输入一级分类"
          }
        }
      }
    }
  });
  $('#form').on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$("#form").serialize(),
      success:function(info){
        if(info.success){
          $('#addModal').modal("hide");
          currentPage=1;
          render();
          $('#form').data("bootstrapValidator").resetForm(true);
        }
      }
    })
  })
})