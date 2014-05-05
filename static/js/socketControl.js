socket.on('getTurn',function(data){
    console.log("test " + data)
    app.soundManager().turn
    app.turn = data;

})
socket.on('redrawBoard',function(data){
    app.helper.clearDummy(app.enemy)
    app.helper.parseBoard(data['board'],data['team'])
    app.render()
    console.log("history gogogo")
    console.log(data)
    if(data['oldPos']){
        app.MoveValidation.prototype.showHistory(data['oldPos'],data['newPos'])
    }
})
socket.on('moveEnemy',function(data){
    console.log("move")
    for(var object in app.pieceSet[app.enemy]){
        var piece = app.pieceSet[app.enemy][object]
        console.log()
        console.log("od "+ piece.getId())
        console.log("id" +data['player'])
        if(piece.getId() == data['player']){
            console.log('moved')
            console.log("movepiece  "+data['move'])
            console.log("y  " + (7-data['move'][0]))
            if(app.team == 'white'){
                piece.setPosition([7-data['move'][0],data['move'][1]])
            }else{
                piece.setPosition([7-data['move'][0],data['move'][1]])
            }
            break;
        }
    }
})

socket.on('strikeEnemy',function(data){
    console.log("strike")

    for(var object in app.pieceSet[app.team]){
        var enemyPiece = app.pieceSet[app.team][object];

        if(enemyPiece.getId() == data['enemy']){
            enemyPiece.setAlive(false)
            enemyPiece.setPosition([-1,-1])
            break;
        }

    }
    for(var object in app.pieceSet[app.enemy]){
        var piece = app.pieceSet[app.enemy][object]

        if(piece.getId() == data['player']){
            piece.setPosition([7-data['move'][0],data['move'][1]])
            break;
        }
    }

})


socket.on('gameFinished',function(data){
    if(app.team == data){
        // winner show winner screen
        document.write("player: "+data+" Won the game, GG WP")
    }
    else{
        //loser screen
        document.write("player: "+data+" Won the game, U suck")

    }
})

socket.on("getPlayHistory",function(data){

})

socket.on('promotePiece',function(data){
    app.pieceSet[data['color']][data['id']].promote()
})

socket.on('addDummy',function(data){
    app.pieceSet[data['team']][data['id']] = new app.Pawn(data['position'],data['id']+'P',data['id'],'','dummy')
    app.pieceSet[data['team']][data['id']].setAlive(false)
})

socket.on('removeDummy',function(data){
    console.log('deleted')
    app.pieceSet[data['team']][data['id']].setPosition([-1,-1])
})
