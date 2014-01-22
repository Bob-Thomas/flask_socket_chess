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
                    app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateMovement(app.selectedPiece,'returnOnly').tiles,position)
                    break;
                case 'R':
                    app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateMovement(app.selectedPiece,'returnOnly').tiles,position)

                    break;
                case 'N':
                    app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateMovement(app.selectedPiece,'returnOnly').tiles,position)

                    break;
                case 'B':
                    app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateMovement(app.selectedPiece,'returnOnly').tiles,position)

                    break;
                case 'K':
                    app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateMovement(app.selectedPiece,'returnOnly').tiles,position)

                    break;
                case 'Q':
                    app.MoveValidation.prototype.ClickPath(app.selectedPiece,app.ValidateMovement(app.selectedPiece,'returnOnly'),position)

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
            if(team === app.team && pieceY === y && pieceX === x){
                if(arguments.length == 1){
                    app.showWalkingPatern(piece,position)
                    app.selectedPiece = piece
                }
                if(arguments.length == 3){
                    return piece
                }
                return "player";

            }
            else if(team === app.enemy && pieceY === y && pieceX === x){
                if(arguments.length == 3){
                    return piece
                }
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
            app.ValidateMovement(piece)
            break;
        case 'R':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidateMovement(piece)
            break;
        case 'N':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidateMovement(piece)
            break;
        case 'B':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidateMovement(piece)
            break;
        case 'K':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidateMovement(piece)
            break;
        case 'Q':
            app.MoveValidation.prototype.ClearPath(position);
            app.ValidateMovement(piece)
            break;

    }
};

app.gameState = (function(){
    var
        state = 'inplay'
        ;

    return{
        getState:state,
        setState:function(state){
            this.state = state;
        }
    }
}())
