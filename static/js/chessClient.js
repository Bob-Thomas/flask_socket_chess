app.chessClient = function() {
    var interval,
        letter = -1;


        app.createboard();
        app.createPieces(1);
        app.drawPieces();
        app.drawBoard();
        app.createControls('black')
        app.UpdateTiles();
        $(".login").remove();
        $("#chessboard").removeClass("connecting");




};

app.chessClient.moveEnemy = function(data){
    socket.emit("move",data);
}

