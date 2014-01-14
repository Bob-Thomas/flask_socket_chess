app.helper = function Helper(){};

app.helper.CheckList = function CheckList(list,name){
    var items;
    for(items = 0; items < list.length; items+=1){
        if(list[items].match(name)){
            console.log(list[items]);
            console.log("bamaam");
            return list[items];
        };

    };
}

app.helper.inherit = function inherit(proto){

    function F(){};
    F.prototype = proto;
    return new F()
}


app.helper.parseBoard = function parseBoard(build,team){
    var board
    var col
    if(build){
        var
            board = new Array(),
            newBoard = [],
            rowString = []
            ;
        board = build.split(','),

            console.log("build board " +board.length)
        console.log("building board of team " + team)

        for(var pieces =0; pieces <= board.length;pieces+=1){

            if(pieces % 8 === 0 && pieces !== 0){
                newBoard.push(rowString)
                rowString = []
            }
            rowString.push(board[pieces])

        }
        if(app.team == 'black' && team == 'white'){
            console.log("swagaroni " +newBoard.length)
            newBoard = newBoard.reverse()
            for(var i = 0; i < newBoard.length; i++){
                newBoard[i] = newBoard[i].reverse()
            }


        }

        if(app.team == 'white' && team == 'black'){
            for(var i = 0; i < newBoard.length; i++){
                newBoard[i] = newBoard[i].reverse()
            }

        }
        for(var i = 0; i < 8 ; i+=1){
            for(var j =0; j < 8; j+=1) {
                for ( var team in app.pieceSet){
                    for(var object in app.pieceSet[team]){
                        var
                            piece = app.pieceSet[team][object]
                            ;
                        if(newBoard[i][j] == piece.getId()){
                            piece.setPosition([i,j])
                        }
                    }
                }

            }

        }


    }else{
        board =
            [['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x']]



        for ( var team in app.pieceSet){
            for(var object in app.pieceSet[team]){
                var
                    piece = app.pieceSet[team][object],
                    pieceX = piece.getposition()[1],
                    pieceY = piece.getposition()[0]
                    ;
                if(pieceY > 0 || pieceX > 0){
                    board[pieceY][pieceX] = piece.getId()
                }

            }
        }


        if(app.team == 'white'){
            return board.toString()
        }
        else{
            return board.reverse().toString()
        }


    }

}