$(function(){
  var currentPage=1;
  var pageSize=5;
  render();
  function render(){
    $.ajax({
      type:"GET",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        var str=template("secondTpl",info);
        $('.lt_content tbody').html(str);
        $('#paginator').bootstrapPaginator({
          // 设置一个版本号
          bootstrapMajorVersion: 3,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),
          // 当前页
          currentPage: info.page,
          // 点击页码渲染页面
          onPageClicked: function( a, b, c, page ) {
            // 更新当前页
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
    $.ajax({
      type:"GET",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        var str=template("dropdownTpl",info);
        $('.dropdown-menu').html(str);
      }
    })
  });
  $('.dropdown-menu').on("click","a",function(){
    var txt=$(this).text();
    $('#dropdownText').text(txt);
    var id=$(this).data("id");
    $('[name="categoryId"]').val(id);
    // 设置隐藏域的校验状态为 VALID
    // $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
    $('#form').data("bootstrapValidator").updateStatus("categoryId","VALID");
  });
    $('#fileupload').fileupload({
      dataType:"json",
      done:function(e,data){
        var picUrl=data.result.picAddr;
        $('#imgBox img').attr("src",picUrl);
        // $('[name="brandLogo"]').val( picUrl );
        $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID");
      }
    })

  
  
  //  表单校验
  $('#form').bootstrapValidator({
    
    // 默认对隐藏域不进行校验, 我们需要重置
    excluded: [],
    
    // 指定校验时的图标显示
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    // 配置校验的字段
    fields: {
      // categoryId 所属分类 id
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      
      // brandName 品牌名称, 二级分类
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      
      // brandLogo 图片地址
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
      
    }
  });
  
  // 6. 注册表单校验成功事件, 阻止默认提交, 通过 ajax 进行提交
  $('#form').on("success.form.bv", function( e ) {
    // 阻止默认的表单提交
    e.preventDefault();
    
    console.log($('#form').serialize());
    
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 添加二级分类成功
          // 隐藏模态框
          $('#addModal').modal("hide");
          // 重新渲染第一页
          currentPage = 1;
          render();
          
          // 将表单内容重置 resetForm(true)
          $('#form').data("bootstrapValidator").resetForm( true );
          
          // 将文本重置
          $('#dropdownText').text("请选择一级分类");
          
          // 将图片重置
          $('#imgBox img').attr("src", "./images/none.png");
        }
      }
    })
  })
})