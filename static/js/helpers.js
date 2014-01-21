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

app.helper.clearDummy = function(team){
        for(var object in app.pieceSet[team]){
            var piece = app.pieceSet[team][object]
                if(piece.getDummy() === true){
                    piece.setPosition([-1,-1])
                    delete piece
                }

        }

}

app.helper.parseBoard = function parseBoard(build,team,firstLoad){
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
        console.log("turn = "+app.turn + ": team = "+app.team)
        console.log("BOARD FROM DATABASE")
        for(var i =0; i < newBoard.length;i++){
            console.log(newBoard[i])
        }

        if(!firstLoad){
            if(app.team !== app.turn){
                newBoard = newBoard.reverse()

                for(var i = 0; i < newBoard.length; i++){
                    newBoard[i] = newBoard[i].reverse()
                }
            }

            if(app.team  === app.turn){
                newBoard = newBoard.reverse()
            }
        }
        else{


            if(app.team  === app.turn){
                newBoard = newBoard.reverse()
                console.log("flip vertical and horizontal")

                for(var i = 0; i < newBoard.length; i++){
                    newBoard[i] = newBoard[i].reverse()
                }
            }

        }
        console.log("NEW BOARD")

        for(var i =0; i < newBoard.length;i++){
            console.log(newBoard[i])
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
                        if(newBoard[i][j].length > 3){
                            // dummy code
                            app.pieceSet[app.team][newBoard[i][j]] = new app.Pawn(  [newBoard[i],newBoard[j]],newBoard[i][j][0]+'P',newBoard[i][j],'','dummy')
                            app.pieceSet[app.team][newBoard[i][j]].setAlive(false)
                        }
                    }
                }

            }

        }


    }else{
        board =
            [   ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x']
            ]



        for ( var team in app.pieceSet){
            for(var object in app.pieceSet[team]){
                var
                    piece = app.pieceSet[team][object],
                    pieceX = piece.getposition()[1],
                    pieceY = piece.getposition()[0]
                    ;
                if(pieceY >= 0 || pieceX >= 0){
                    board[pieceY][pieceX] = piece.getId()
                }

            }
        }


        return board.toString()



    }

}