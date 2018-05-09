$(function(){
  //表单验证功能
  $('#form').bootstrapValidator({
    // 指定校验时的图标显示
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      username:{
        validators:{
          notEmpty:{
            message:"用户名不能为空"
          },
          stringLength:{
            min:2,
            max:6,
            message:"用户名必须为2-6位"
          },
          callback:{
            message:"用户名不存在"
          }
        }
      },
      password:{
        validators:{
          notEmpty:{
            message:"密码不能为空"
          },
          stringLength:{
            min:6,
            max:12,
            message:"密码长度必须为6-12位"
          },
          callback:{
            message:"密码错误"
          }
        }
      }
    }
  });
  //校验成功时触发的事件
  $('#form').on("success.form.bv",function(e){
    //阻止默认的提交行为
    e.preventDefault();
    // console.log($('#form').serialize());
    $.ajax({
      type:"post",
      dataType:"json",
      url:"/employee/employeeLogin",
      data:$('#form').serialize(),
      success:function(info){
        // console.log(info);
        if(info.success){
          location.href="index.html";
        }
        if(info.error===1001){
          $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
        if(info.error===1000){
          $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }
      }
    })
  });
  
//  重置功能
  $('[type="reset"]').click(function(){
    $('#form').data("bootstrapValidator").resetForm(true);
  })
})