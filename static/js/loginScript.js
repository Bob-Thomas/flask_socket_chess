/**
 * Created by Bob.Thomas on 5-12-13.
 */
$(function(){

    var error,type, interval = setInterval(function(){
        var connector =  $(".connecting-signal"),
            word = "connecting";
        //console.log(socket.connected());
        if(socket.connected() === false){

        }
        else{
            window.clearInterval(interval)
            $(".box.login").fadeIn("slow")
            $(".loader").remove();
        }

    },500)

    function validation(input,type){
       switch(type){
           case 'error':
               input.addClass('input-error');
               break;
           case 'correct':
               input.addClass('input-correct');
               break;
           case 'clear':
               input.val('');
               input.removeClass('input-error').removeClass('input-correct')
       }
    };
    socket.on("validation",function(data){
        if(data.answer === false){
            validation($("#"+data.name),'correct');
        }
        else{
            validation($("#"+data.name),'error');
        }
    })

    $("#register").click(function(){
        type = 'register';
        $("#login").addClass("hidden")
        $(".register-box").slideDown("slow")
        $("#back").show();
        $(this).val("Register").removeClass("leftButton").addClass('rightButton')
        $(".box.login input").each(function(){
            if($(this).attr('type') !== 'submit'){
                validation($(this),'clear')
            };
        });
    })

    $("#back").click(function(){
        type = 'login'
        $("#login").removeClass("hidden")
        $(".register-box").slideUp("slow")
        $("#back").hide().addClass("hidden");
        $("#register").val("No acount?").removeClass("rightButton").addClass('leftButton')
        $(".box.login input").each(function(){
            if($(this).attr('type') !== 'submit'){
                validation($(this),'clear')
            };
        });a
    });
    $("#username,#email").blur(function(){
        if(type === 'register'){
            socket.emit("verify",{
                value:$(this).val(),
                name:$(this).attr("name")
            }
            );
        };
    })
    $("#password-repeat,#password").blur(function(){
        var password = $("#password")
        if(type === 'register'){

            console.log($(this).val() + "   "+password.val())
            if($(this).val() == password.val()){
                validation($(this),'correct')
                validation(password,'correct')

            }
            else{
                validation($(this),'error')
                validation(password,'error')
            }
        };
    })


}())