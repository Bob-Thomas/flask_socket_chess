app.clickController = function(ev){
    if(app.turn == app.team){
    var     mouseX =  ev.clientX - app.init.canvas.offsetLeft,
        mouseY = ev.clientY - app.init.canvas.offsetTop,
        position = app.screenToBlock(mouseX,mouseY)
        ;
    console.log(app.selectedPiece)
    app.pieceClicked(position)
    if(app.selectedPiece){
        switch(app.selectedPiece.getType()[1]){
            case 'P':
                app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidatePawn(app.selectedPiece,'returnOnly').tiles,position)
                break;
            case 'R':
                app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateRook(app.selectedPiece,'returnOnly').tiles,position)

                break;
            case 'N':
                app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateKnight(app.selectedPiece,'returnOnly').tiles,position)

                break;
            case 'B':
                app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateBishop(app.selectedPiece,'returnOnly').tiles,position)

                break;
            case 'K':
                app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateKing(app.selectedPiece,'returnOnly').tiles,position)

                break;
            case 'Q':
                app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateQueen(app.selectedPiece,'returnOnly'),position)

                break;

        };
    }

    }

}

app.screenToBlock = function screenToBlock(x, y)
{
    var block=[ Math.floor(y / 75),Math.floor(x / 75) ]

    return block;
}

app.pieceClicked = function(position){
    var
        x = position[1],
        y = position[0]
        ;

    for(var team in app.pieceSet){
        for(var object in app.pieceSet[team]){
            var
                piece = app.pieceSet[team][object],
                pieceX = piece.getposition()[1],
                pieceY = piece.getposition()[0]
                ;
            if(arguments.length == 1){
            }
            if(team === app.team && pieceY === y && pieceX === x){
                if(arguments.length == 1){
                    app.showWalkingPatern(piece,position)
                    app.selectedPiece = piece
                }
                return "player";

            }
            else if(team === app.enemy && pieceY === y && pieceX === x){
                return "enemy";

            }
        }

    }


    return "empty"

}

app.showWalkingPatern = function(piece,position){
    switch(piece.getType()[1]){
        case 'P':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidatePawn(piece)
            break;
        case 'R':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidateRook(piece)
            break;
        case 'N':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidateKnight(piece)
            break;
        case 'B':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidateBishop(piece)
            break;
        case 'K':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidateKing(piece)
            break;
        case 'Q':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidateQueen(piece)
            break;

    }
}

