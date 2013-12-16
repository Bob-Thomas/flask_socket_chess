app.chessClient = function() {
    var interval,
        letter = -1;

    socket.on("move enemy",function(data){
        var piece,
            position =  data.position;
        console.log('b'+data.id[1]+(7-data.id[2]))
        if(!data.id[2]){
            console.log("king queen")
            piece = app.pieceSet.black["b"+data.id[1]];
        }
        else if(parseInt(data.id[2]) >= 0 && data.id[1] === "P") {
            console.log("pawns")
            piece = app.pieceSet.black["b"+data.id[1]+(7-data.id[2])];
        }
        else if(parseInt(data.id[2]) >= 0 && data.id[1] !== "P"){
            var number;
            if(data.id[2] == "1"){
                number = "2";
            };

            if(data.id[2] == "2"){
                number = "1";
            };

            console.log("special units")
            console.log("b"+data.id[1]+(data.id[2]))
            piece = app.pieceSet.black["b"+data.id[1]+number];
        }
        console.log(piece)
        app.MovePiece(piece,position)
    });

    interval = setInterval(function(){
        var connector =  $(".connecting-signal"),
            word = "connecting";
        console.log(socket.connected());
        if(socket.connected() === false){
            letter +=1
            connector.append(word[letter]);
            if(letter >= word.length){
                connector.text('');
                letter = -1;
            }

        }
        else{
            window.clearInterval(interval)
            connector.text("connected")
            connector.addClass("hidden")
            $(".login").removeClass("connecting").hide();
            $(".login").fadeIn("slow")
        }

    },500)
    socket.on("check clients",function(data){
        var clients = data,
            color,
            player;
        console.log(data)
        if(clients == 0){
            color = "white"
            player = "first"
        }
        else{
            color = "black"
            player = "second"
        }
        app.createboard();
        app.createPieces(player);
        app.drawPieces();
        app.drawBoard();
        app.createControls(color)
        app.UpdateTiles();
        $(".login").remove();
        $("#chessboard").removeClass("connecting");
    });

    $('.login-form').submit(function (ev) {
        socket.emit('nickname', $('.nickname').val(), function (set) {
        });
        return false;
    });





};

app.chessClient.moveEnemy = function(data){
    socket.emit("move",data);
}

