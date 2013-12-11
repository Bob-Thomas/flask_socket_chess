app.directive('loginWidget',function($rootScope,socket){
    var
        linkFn,
        restrict = 'E'
        ;


    linkFn = function(scope,element,attrs){
        var
            styleInput,
            sideMessage,
            backButton,
            registerButton,
            clearInputs,
            checkLogin,
            loginButton
            ;
    socket.on('connect',function(){
        $(".box.login").fadeIn("slow")
        $(".register-box").hide();
        $(".loader").remove();
        $("#login").attr("disabled",'disabled').addClass('disabled')
    })

    socket.on("validation",function(data){
        var
            name = data.name,
            answer = data.answer,
            input = $('#'+name)
            ;
        if(scope.state == 'register'){
            if(answer == true){
                scope.loginInput[name]['state'] = 'error'
            }else if(answer == false){
                scope.loginInput[name]['state'] = 'correct'
            }
            else if(answer == 'invalid'){
                scope.loginInput[name]['state'] = 'error'
            }
        }


    })

    scope.$watch('loginInput',function(){
            var loginObject = scope.loginInput;
            for(var key in loginObject){
                if(loginObject.hasOwnProperty(key)){
                    var input = $('#'+key);
                    // console.log(loginObject[key].state)
                    console.log(input,loginObject[key].state)
                    styleInput(input,loginObject[key].state)
                }

        }
    },true);

    clearInputs = function(){
        var loginObject = scope.loginInput;
        $(".box.login input").each(function(){
            if($(this).attr('type') !== 'submit'){
                var $this = $(this);
                 $this.val('')
                $this.removeClass("input-error").removeClass("input-correct");
                sideMessage($this,'','remove')
                $("#register").removeAttr('disabled').removeClass('disabled');

            }
        });

        for( var k in loginObject) {
            if(loginObject.hasOwnProperty(k)){
                 loginObject[k].state = 'neutral'
                 console.log(loginObject[k].state)

            }

        }
    }

    sideMessage = function(input,message,action){
        var
            label,
            name = input.attr("name")
            ;
        switch(action){
            case 'add':
                if(!input.hasClass('input-error')){
                    label = '<label for="'+name+'" class="inline-error">'+message+'</label>'
                    input.after(label).next('label').hide().fadeIn('slow').css({'display':'inline'});
                }
                break;
            case 'remove':
                input.next('label').fadeOut('fast',function(){input.next('label').remove()})
                break;
        }

    }

    styleInput = function(input,state) {
        var
            name = input.attr('name'),
            message
            ;
        if(input.val().replace(" ",'').length > 0 ){
            switch(name){
                case 'username':
                    message = "Username already exists";
                    break;
                case 'password':
                    message = "passwords are not equal";
                    break;
                case 'passwordRepeat':
                    message = "passwords are not equal";
                    break;
                case 'email':
                    message = "Email address already exists";
                    break;
            }
            switch(state){
                case 'error':
                    if(scope.state == 'register'){
                    if(input.hasClass('input-correct')){
                        input.removeClass("input-correct");
                    };
                    sideMessage(input,message,'add')
                    input.addClass('input-error')
                    }
                    break;
                case 'correct':
                    if(scope.state == 'register'){
                    if(input.hasClass('input-error')){
                        input.removeClass("input-error");
                    };
                    input.addClass('input-correct');
                    sideMessage(input,'','remove')
                    }
                    break;
                case 'neutral':
                    input.removeClass("input-error").removeClass("input-correct");
                    break;
            }
        }
        else{
            if(input.hasClass('input-correct')){
                input.removeClass("input-correct");
                message = 'blank fields are not allowed';
                sideMessage(input,message,'add')
                input.addClass('input-error');
            }
        }
        if(scope.state == 'register'){
            if($("input").length-3 === $("input.input-correct").length){
                $("#register").removeAttr('disabled').removeClass('disabled');
            }
            else{
                $("#register").attr('disabled','true').addClass('disabled')

            }
        }


    }

    registerButton = function(){
        if(scope.state == "login"){
           clearInputs();
        };
        scope.state ='register'
        $("#login").addClass("hidden")
        $(".register-box").slideDown("slow")
        $("#back").show();
        $(this).val("Register").removeClass("leftButton").addClass('rightButton')
        if($("input").length-3 === $("input.input-correct").length){
            $("form#registerForm").submit();
        }
    }

    backButton = function(){
        clearInputs();
        scope.state = 'login'
        $("#login").removeClass("hidden")
        $(".register-box").slideUp("slow")
        $("#back").hide().addClass("hidden");
        $("#register").val("No acount?").removeClass("rightButton").addClass('leftButton')

    };
    loginButton =  function(){
        console.log("ola")
            $("form#loginForm").submit();
        }
    checkLogin = function(){
        var
            username = $("#username").val().replace(" ",''),
            pw = $("#password").val().replace(" ",'')
        ;
        console.log(username)
        console.log(pw)
        if(username.length > 0 && pw.length > 0){
            $("#login").removeAttr("disabled").removeClass('disabled')
        }
        else
        {
            $("#login").attr("disabled",'disabled').addClass('disabled')
        }
    }
    $("#login").on("click",loginButton)
    $("#username,#password").bind('blur',function(){checkLogin()});
    $("#back").on('click',backButton);
    $("#register").on('click',registerButton)

}

return{
    restrict:restrict,
    link:linkFn
}

});