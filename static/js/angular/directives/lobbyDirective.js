app.directive('lobbyChat',function($rootScope,socket){
    var
        linkFn,
        restrict = 'E'
        ;


    linkFn = function(scope,element,attrs){
        $('input[name="chatInput"]').keypress(function(e){

            if (e.keyCode == 13 && $(this).val().replace(" ","").length > 0){
                console.log("boe")
                var today=new Date(),
                    h=today.getHours(),
                    m=today.getMinutes(),
                    message = {
                        rank:scope.userRank,
                        name:scope.userName,
                        time:h+":"+m,
                        message:$(this).val()
                    };
                socket.emit('sendMessage',message)
                $(this).val("")
            }
        });

        socket.on('message',function(data){
            var area = $(".chatBox");
            area.animate({
                scrollTop: area.prop('scrollHeight') - area.height() + 40
            }, 1);
        })
    };

    return{
        restrict:restrict,
        link:linkFn
    }

});

app.directive('roomItems',function($rootScope,socket){
    var
        linkFn,
        restrict = 'A'
        ;


    linkFn = function(scope,element,attrs){
        var itemHover,
            itemLeave;

        itemHover = function(element){
            element.css({'backgroundColor':'RGBA(0,0,0,0.2)'})
        }
        itemLeave = function(element){
            element.css({'backgroundColor':'white'})
        }
        element.on('mouseenter',function(){itemHover(element)}   )
        element.on('mouseleave',function(){itemLeave(element)}   )


    }

    return{
        restrict:restrict,
        link:linkFn
    }

});


app.directive('scrollDiv',function($rootScope,socket){
    var
        linkFn,
        restrict = 'A'
        ;


    linkFn = function(scope,element,attrs){

        $(function() {
            console.log(attrs.id)
            $("#"+attrs['id']).mousewheel(function(event, delta) {
                                                     console.log("ola")
                this.scrollTop -= (delta * 30);

                event.preventDefault();

            });

        });
    }
    return{
        restrict:restrict,
        link:linkFn
    }
});