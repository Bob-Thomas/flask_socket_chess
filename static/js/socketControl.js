socket.on('getTurn',function(data){
    console.log("test " + data)
    app.turn = data;
})
socket.on('redrawBoard',function(data){
    app.helper.parseBoard(data['board'],data['team'])
    app.render()

})
//socket.on('moveEnemy',function(data){
//    console.log("move")
//    for(var object in app.pieceSet[app.enemy]){
//        var piece = app.pieceSet[app.enemy][object]
//        console.log()
//        console.log("od "+ piece.getId())
//        console.log("id" +data['player'])
//        if(piece.getId() == data['player']){
//            console.log('moved')
//            console.log("movepiece  "+data['move'])
//            console.log("y  " + (7-data['move'][0]))
//            if(app.team == 'white'){
//                piece.setPosition([7-data['move'][0],data['move'][1]])
//            }else{
//                piece.setPosition([7-data['move'][0],data['move'][1]])
//            }
//            app.render()
//            break;
//        }
//    }
//})
//
//socket.on('strikeEnemy',function(data){
//    console.log("strike")
//
//    for(var object in app.pieceSet[app.team]){
//        var enemyPiece = app.pieceSet[app.team][object];
//
//        if(enemyPiece.getId() == data['enemy']){
//            enemyPiece.setAlive(false)
//            enemyPiece.setPosition([-1,-1])
//            break;
//        }
//
//    }
//    for(var object in app.pieceSet[app.enemy]){
//        var piece = app.pieceSet[app.enemy][object]
//
//        if(piece.getId() == data['player']){
//            piece.setPosition([7-data['move'][0],data['move'][1]])
//            break;
//        }
//    }
//    app.render()
//
//})

