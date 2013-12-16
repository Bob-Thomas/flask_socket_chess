app.directive('lobbyChat',function($rootScope,socket){
    var
        linkFn,
        restrict = 'E'
        ;


    linkFn = function(scope,element,attrs){
         $('input[name="chatInput"').keypress(function(e){

            if (e.keyCode == 13 && $(this).val().replace(" ","").length > 0){
                console.log("boe")
                var today=new Date(),
                h=today.getHours(),
                m=today.getMinutes(),
                s=today.getSeconds(),
                message = {
                    name:scope.userName,
                    time:h+":"+m+":"+s,
                    message:$(this).val()
                };
                socket.emit('sendMessage',message)
                var chat_div = document.getElementById('chat');
                chat_div.scrollTop = chat_div.scrollHeight+300;
                $(this).val("")
            }
        });

        scope.$watch(scope.messages,function(newVal,oldVal){
            if(newVal !== oldVal){
                var chat_div = document.getElementById('chat');
                chat_div.scrollTop = chat_div.scrollHeight+100;
            }

        },true)

    }

    return{
        restrict:restrict,
        link:linkFn
    }

});