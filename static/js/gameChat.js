app.chatControl = function(){
    console.log("chat started")
    var
        board = document.getElementById('board'),
        messagebox = document.querySelectorAll('.messages')[0],
        messageContainer = document.getElementById('chat'),
        input =  document.querySelectorAll('.chatInput')[0],
        nameDiv = document.getElementById('player'),
        name = nameDiv.innerHTML,
        avatar = document.getElementById('rank').innerHTML,
        slideChat = document.querySelectorAll('.chatSlider')[0],
        slideAction = 'close',
        sliderLeft = 0

        ;
    app.chatMessages = []
    input.addEventListener('keydown',function(event){sendmessage(event)})
    slideChat.addEventListener('click',function(){openCloseMessageBox(slideAction)})

    socket.on('gameMessage',function(data){
        console.log(messagebox)
        var html = '<div class="message"><div class="sender"><img src="/static/img/chesspieces/'+data['avatar']+'.png" width="32" height="32" />'+data['sender']+'</div><div class="horizontalDivider"></div><div class="messageContent">'+data['message']+'</div></div>'
        app.chatMessages.push(html)
        messagebox.innerHTML = ''
        for(var i =0;i<app.chatMessages.length;i++){
            messagebox.innerHTML = messagebox.innerHTML+app.chatMessages[i]
        }
        messagebox.scrollTop = messagebox.scrollHeight;


    })

    function sendmessage(ev){
        if(slideAction == 'close'){
            console.log(ev.keyCode)
            if (ev.keyCode === 13){
                if(input.value.replace(' ','').length > 0){
                    console.log("clicked")
                    socket.emit("sendMessageGameroom",{
                        sender:name,
                        message:input.value,
                        hash:window.location.href.toString().split('/')[4],
                        avatar:avatar
                    })
//                    var html = '<div class="message"><div class="sender"><img src="/static/img/chesspieces/'+avatar+'.png" width="32" height="32" />'+name+'</div><div class="horizontalDivider"></div><div class="messageContent">'+input.value+'</div></div>'
//                    app.chatMessages.push(html)
//                    messagebox.innerHTML = ''
//                    for(var i =0;i<app.chatMessages.length;i++){
//                        messagebox.innerHTML = messagebox.innerHTML+app.chatMessages[i]
//                    }
//                    messagebox.scrollTop = messagebox.scrollHeight;
                    input.value = ''
                }
            }
        }

    }


    function openCloseMessageBox(action){
        var
            timer
            ;
        console.log('slider is clicked action = ' + action)
        console.log(messageContainer.offsetLeft)

        if(action == 'close'){
            timer = setInterval(function(){
                console.log(messagebox.offsetLeft)
                sliderLeft += 4;
                messageContainer.style.left = (sliderLeft) +"px"
                console.log(messageContainer.style.left)
                if(sliderLeft >= board.offsetWidth - 330){
                    messageContainer.offsetLeft = board.offsetWidth - (board.offsetWidth-330);
                    slideAction = 'open'
                    document.querySelectorAll('.openChat')[0].className = document.querySelectorAll('.openChat')[0].className.replace('right','left')
                    clearInterval(timer)
                }

            },1)
        }else{
            timer = setInterval(function(){
                sliderLeft -= 4;
                messageContainer.style.left = (sliderLeft)+"px"
                if(sliderLeft <= 0){
                    messageContainer.style.left = 0;
                    slideAction = 'close'
                    document.querySelectorAll('.openChat')[0].className = document.querySelectorAll('.openChat')[0].className.replace('left','right')
                    clearInterval(timer)
                }

            },1)
        }

    }

}
