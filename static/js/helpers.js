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
        if(app.team == 'black' && team == 'white'){
            board.reverse()
            for(var h = 0; h <= board.length;h+=1){
                if(board[h][0] =='w'){
                    if(board[h][2]){
                        var number = board[h][2];
                        if(board[h][1] != 'P'){
                            switch(number){
                                case '1':
                                    board[h] = board[h].replace(number,'2')
                                case '2':
                                    board[h] =  board[h].replace(number,'1')

                            }
                        }
                        else{
                            var newNumber = 7-parseInt(number)
                            board[h] =  board[h].replace(number,newNumber)
                        }

                    }
                }

        }
        }
        if(app.team == 'white' && team == 'black'){
            for(var h = 0; h <= board.length;h+=1){
                if(board[h][0] == 'b'){
                    if(board[h][2] && board[h][0] =='w'){
                        var number = board[h][2];
                        if(board[h][1] != 'P'){
                            switch(number){
                                case '1':
                                    board[h] = board[h].replace(number,'2')
                                case '2':
                                    board[h] =  board[h].replace(number,'1')

                            }
                        }
                        else{
                            var newNumber = 7-parseInt(number)
                            board[h] =  board[h].replace(number,newNumber)
                        }

                    }
                }

        }
        }
            for(var pieces =0; pieces <= board.length;pieces+=1){

                if(pieces % 8 === 0 && pieces !== 0){
                    newBoard.push(rowString)
                    rowString = []
                }
                rowString.push(board[pieces])

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