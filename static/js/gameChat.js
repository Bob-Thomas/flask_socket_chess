app.chatControl = function(){
    console.log("chat started")
    var
        messagebox = document.querySelectorAll('.messages')[0],
        input =  document.querySelectorAll('.chatInput')[0],
        nameDiv = document.getElementById('player'),
        name = nameDiv.innerHTML
    ;

    app.chatMessages = []

    input.addEventListener('keydown',function(event){sendmessage(event)})
    socket.on('gameMessage',function(data){
        console.log(messagebox)
          var html = '<div class="message"><div class="sender">'+data['sender']+'</div><div class="horizontalDivider"></div><div class="messageContent">'+data['message']+'</div></div>'
          app.chatMessages.push(html)
        messagebox.innerHTML = ''
        for(var i =0;i<app.chatMessages.length;i++){
              messagebox.innerHTML = messagebox.innerHTML+app.chatMessages[i]
          }

    })
    function sendmessage(ev){
        console.log(ev.keyCode)
        if (ev.keyCode === 13){
            console.log("clicked")
            socket.emit("sendMessageGameroom",{
                sender:name,
                message:input.value,
                hash:window.location.href.toString().split('/')[4]
            })
            var html = '<div class="message"><div class="sender">'+name+'</div><div class="horizontalDivider"></div><div class="messageContent">'+input.value+'</div></div>'
            app.chatMessages.push(html)
            messagebox.innerHTML = ''
            for(var i =0;i<app.chatMessages.length;i++){
                messagebox.innerHTML = messagebox.innerHTML+app.chatMessages[i]
            }

            input.value = ''
        }

    }


}
