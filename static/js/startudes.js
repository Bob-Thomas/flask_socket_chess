app.startGame = function (datbaseBoard) {
    if(!datbaseBoard){
        app.startingPositions()
    }
    else{
        app.startingPositions()
        app.helper.parseBoard(datbaseBoard)
    }
    app.render()
};

socket.on('connect',function(){
    console.log("connected")
    var nameDiv = document.getElementById('player');
    var name = nameDiv.innerHTML;
    socket.emit("getTeam",{
            hash:window.location.href.toString().split('/')[4],
            name:name
        }
    )
})

socket.on("receiveTeam",function(data){
    app.team = data['team']
    app.turn = 'white'
    app.enemy = (app.team == 'white') ? "black" : "white"
    console.log(app.team)
    if(data['board']){
        app.startGame(data['board'])
    }else{
        app.startGame()
    }
})

