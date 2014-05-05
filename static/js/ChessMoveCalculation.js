app.MoveValidation = function MoveValidation(piece,clickPosition){
    this.piece = piece;
    this.clickPosition = clickPosition;
};





app.MoveValidation.prototype.Lightpath = function LightPath(tiles,piece,canJump){
    var tileList,
        tile,
        tileItem,
        color,
        ctx = app.init.ctx;
    //app.UpdateTiles();
    for(tileList = 0; tileList < tiles.length; tileList++){
        for(tile = 0; tile < tiles[tileList].length; tile++){
            if(tiles[tileList][tile][0]+65 >= 65){
                tileItem = [tiles[tileList][tile][0],tiles[tileList][tile][1]]

                if(app.pieceClicked(tileItem,"check") === "empty"){

//                    $(tileItem).prepend("<div class='overlayTile'></div>")
                    console.log("path lighted BLUE")
                    ctx.beginPath();
                    ctx.rect(tileItem[1]*75,tileItem[0]*75,75,75);
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = 'blue';
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                }
                else if(app.pieceClicked(tileItem,"check") === "player"){
//                    $(tileItem).prepend("<div style='position:absolute' class='overlayTile friendly'></div>")
                    console.log("path lighted GREEN")
                    ctx.beginPath();
                    ctx.rect(tileItem[1]*75,tileItem[0]*75,75,75);
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = 'green';
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                    if(canJump === false){
                        break;
                    }
                }
                if(app.pieceClicked(tileItem,"check") === "enemy"){
//                    $(tileItem).prepend("<div style='position:absolute' class='overlayTile blocked'></div>")
                    console.log("path lighted RED")
                    if(app.pieceClicked(tileItem,'check','return').getId() === app.enemy[0]+"K"){

                        return
                    }
                    ctx.beginPath();
                    ctx.rect(tileItem[1]*75,tileItem[0]*75,75,75);
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                    if(canJump === false){
                        break;
                    }

                }

            }
        }
    }

    app.MoveValidation.prototype.ClickPath = function ClickPath(piece,steps,clickedPos){
        var tileList,
            tile,
            tileItem,
            list,
            checks
        color,
            tiles,
            ctx = app.init.ctx
        ;
        var strikeCoords,
            oldPos = piece.getposition();
        tiles = steps.move;
        strikeCoords = steps.strike;
        if(piece){
            console.log(piece)
            for(tileList = 0; tileList < tiles.length; tileList++){
                for(tile = 0; tile < tiles[tileList].length; tile++){
                    if(tiles[tileList][tile][0]+65 >= 65){
                        tileItem = [tiles[tileList][tile][0],tiles[tileList][tile][1]]
                        if(clickedPos[0] === tileItem[0] && clickedPos[1] === tileItem[1] && app.pieceClicked(tileItem,'checks') == 'empty' && (app.gameState.getState != 'incheck' || app.gameState.getState != 'checkmate') ){
                            app.selectedPiece = null;
                            if(piece.getId()[1] == 'P'){
                                if(piece.getEnpasStrike()){
                                    console.log("you moved u bastard")
                                    delete app.pieceSet[app.team][piece.getId()+piece.getId()[2]]
                                    socket.emit('removeDummy',{
                                        team:app.team,
                                        id:piece.getId()+piece.getId()[2],
                                        position:[piece.getposition()[0]-1,piece.getposition()[1]]
                                    })
                                    piece.setEnpasStrike(false)
                                }
                                if(piece.getposition()[0]-2 == clickedPos[0]){
                                    app.pieceSet[app.team][piece.getId()+piece.getId()[2]] = new app.Pawn(  [piece.getposition()[0]-1,piece.getposition()[1]],piece.getId()[0]+'P',piece.getId()+piece.getId()[2],'','dummy')
                                    app.pieceSet[app.team][piece.getId()+piece.getId()[2]].setAlive(false)
                                    socket.emit('addDummy',{
                                        team:app.team,
                                        id:piece.getId()+piece.getId()[2],
                                        position:[piece.getposition()[0]-1,piece.getposition()[1]]
                                    })
                                    piece.setEnpasStrike(true)

                                }



                            }
                            piece.setPosition(tileItem)
                            app.turn = app.enemy
                            socket.emit("updateBoard",{
                                hash:window.location.href.toString().split('/')[4],
                                board:app.helper.parseBoard(),
                                team:app.team,
                                newPos:tileItem,
                                oldPos:oldPos
                            })
                            socket.emit('turnOver',{
                                turn:app.turn,
                                hash:window.location.href.toString().split('/')[4]
                            })
                            if(piece.getType()[1] == "P"){
                                if(tileItem[0] == 0){
                                    piece.promote()
                                    socket.emit("promotePiece",{
                                        color:app.team,
                                        id:piece.getId()

                                    })
                                }
                                piece.enpasent = false;
                            }
                            app.render()
                            app.MoveValidation.prototype.showHistory(oldPos,tileItem,'normal')

                        }

                    }
                }
            }
            for(list = 0; list < strikeCoords.length; list++) {
                for(checks = 0; checks < strikeCoords[list].length; checks++)
                    if(65+strikeCoords[list][checks][0] >= 65){
                        tileItem = [strikeCoords[list][checks][0],strikeCoords[list][checks][1]]
                        if(clickedPos[0] === tileItem[0] && clickedPos[1] === tileItem[1] && app.pieceClicked(tileItem,'checks') == 'enemy' ){
                            for(var object in app.pieceSet[app.enemy]){
                                var enemyPiece = app.pieceSet[app.enemy][object]
                                var
                                    enemyX = enemyPiece.getposition()[1],
                                    enemyY = enemyPiece.getposition()[0]
                                    ;
                                if(clickedPos[1] == enemyX && clickedPos[0] == enemyY){
                                    enemyPiece.setAlive(false)
                                    enemyPiece.setPosition([-1,-1])
                                    console.log(enemyPiece.getId().length)
                                    if(enemyPiece.getId().length == 4){
                                        console.log('deleted THE REAL PIECE')
                                        app.pieceSet[app.enemy][enemyPiece.getId()[0]+enemyPiece.getId()[1]+enemyPiece.getId()[2]].setAlive(false)
                                        app.pieceSet[app.enemy][enemyPiece.getId()[0]+enemyPiece.getId()[1]+enemyPiece.getId()[2]].setPosition([-1,-1])
                                        socket.emit('removeDummy',{
                                            team:app.enemy,
                                            id:piece.getId(),
                                            position:[enemyPiece.getposition()[0]+1,enemyPiece.getposition()[1]]
                                        })
                                        socket.emit('removeDummy',{
                                            team:app.enemy,
                                            id:enemyPiece.getId()[0]+enemyPiece.getId()[1]+enemyPiece.getId()[2],
                                            position:[enemyPiece.getposition()[0],enemyPiece.getposition()[1]]
                                        })
                                    }
                                    piece.setPosition(tileItem)
                                    socket.emit('strikePiece',{
                                            enemy:enemyPiece.getId(),
                                            move:tileItem,
                                            player:piece.getId()
                                        }
                                    )

                                    if(piece.getType()[1] == 'P'){
                                        if(tileItem[0] == 0){
                                            piece.promote()
                                            socket.emit("promotePiece",{
                                                color:app.team,
                                                id:piece.getId()

                                            })
                                        }
                                        piece.enpasent = false;

                                    }
                                    if(enemyPiece.getType()[1] == 'K'){
                                        socket.emit("gameOver",app.team)
                                    }
                                    socket.emit("updateBoard",{
                                        hash:window.location.href.toString().split('/')[4],
                                        board:app.helper.parseBoard(),
                                        team:app.team,
                                        newPos:tileItem,
                                        oldPos:oldPos
                                    })
                                    app.turn = app.enemy
                                    socket.emit('turnOver',{
                                            turn:app.turn,
                                            hash:window.location.href.toString().split('/')[4]
                                        }
                                    )
                                    app.selectedPiece = undefined;
                                    app.render();
                                    app.MoveValidation.prototype.showHistory(oldPos,tileItem,'normal');
                                }



                            }

                        }
                    }
            }




        }
    }

}
app.MoveValidation.prototype.ClearPath = function ClearPath(){
    app.render()
}
app.MoveValidation.prototype.CheckStrikeAble =  function CheckStrikeAble(strikeCoords,piece,canJump,direction){
    var
        tileItem,
        checks,
        color,
        list,
        ctx = app.init.ctx
        ;
    //app.UpdateTiles();
    for(list = 0; list < strikeCoords.length; list++) {
        for(checks = 0; checks < strikeCoords[list].length; checks++)
            if(65+strikeCoords[list][checks][0] >= 65){
                tileItem = [strikeCoords[list][checks][0],strikeCoords[list][checks][1]]

                if(app.pieceClicked(tileItem,"check") === "player" && app.pieceClicked(tileItem,'check','return').getDummy() == false){

                    ctx.beginPath();
                    ctx.rect(tileItem[1]*75,tileItem[0]*75,75,75);
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                    if(canJump === false && direction === "axes"){
                        break;
                    }

                }
                else if(app.pieceClicked(tileItem,"check") === "enemy"){
                    console.log(tileItem)
                    console.log(app.pieceClicked(tileItem,'check','return'))
                    ctx.beginPath();
                    ctx.rect(tileItem[1]*75,tileItem[0]*75,75,75);
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = 'yellow';
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                    if(app.pieceClicked(tileItem,'check','return').getId() === app.enemy[0]+"K"){
                        console.log("CHECKES")
                        app.soundManager().checkMate;
                        return
                    }
                    if(canJump === false && direction === "axes"){
                        break;
                    }

                }




            }
    }
}

app.MoveValidation.prototype.showHistory = function showHistory(oldPos,newPos){
    var tileList,
        tile,
        tileItem,
        color,
        ctx = app.init.ctx;
    console.log("movu des")
    if(arguments.length == 2){
        if(app.enemy == 'black'){
            oldPos[1] = 7-oldPos[1]
            oldPos[0] = 7-oldPos[0]
            newPos[1] = 7-newPos[1]
            newPos[0] = 7-newPos[0]
        }else{
            oldPos[1] = 7+-oldPos[1]
            oldPos[0] = 7+-oldPos[0]
            newPos[1] = 7+-newPos[1]
            newPos[0] = 7+-newPos[0]
        }
    }
    ctx.beginPath();
    ctx.rect(oldPos[1]*75,oldPos[0]*75,75,75);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'purple';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.rect(newPos[1]*75,newPos[0]*75,75,75);
    ctx.fillStyle = 'purple';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

app.ValidateMovement = function ValidateMovement(){
    app.MoveValidation.apply(this,arguments)
    var
        maxSteps,
        tiles= [],
        list = [],
        steps,
        coord,
        strikeCoords  = [],
        color = this.piece.getColor(),
        uR,
        uL,
        dR,
        dL,
        nextPosition,
        u,
        d,
        l,
        r,
        upRight = [],
        upLeft = [],
        downRight = [],
        downLeft = [],
        up = [],
        down = [],
        left = [],
        right = [],
        position = this.piece.position,
        y = parseInt(position[0]),
        x = parseInt(position[1])

    ;

    switch(this.piece.getId()[1]){

        case 'P':
            if(this.piece.getEnpasent() == true){
                maxSteps = 2;
            }
            else{
                maxSteps = 1;
            }
            if(this.piece.inBounds(this.piece.getposition())){
                position = this.piece.getposition();
                position[0] = parseInt(position[0]);
                position[1] = parseInt(position[1]);
                coord = [position[0],position[1]]
                strikeCoords.push( [ [ coord[0]-1,(coord[1]+1)],[coord[0]-1,(coord[1]-1) ] ] )

                for(steps = 0; steps < maxSteps; steps+=1){
                    tiles.push([ (position[0]-1)-steps,position[1] ])

                }
                list.push(tiles)
                if(arguments.length == 1){
                    app.MoveValidation.prototype.Lightpath(list,this.piece,false)
                    app.MoveValidation.prototype.CheckStrikeAble(strikeCoords,this.piece,false,'diagonal')

                }

                return {
                    tiles:{
                        move:list,
                        strike:strikeCoords
                    }
                }

            }
            break;
        case 'R':


        for(u = y; u > 0; u-=1){
            nextPosition = [ u-1,position[1] ];
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                up.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                up.push(nextPosition)
                console.log('breaku des')
                break;

            }

        }
        for(d = y; d <= 7; d+=1 )  {
            nextPosition = [ d+1,position[1] ]
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                down.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                down.push(nextPosition)
                console.log('breaku des')
                break;

            }
        }

        for(l = x; l > 0; l-=1){
            nextPosition = [position[0],l-1 ]
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                left.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                left.push(nextPosition)
                console.log('breaku des')
                break;

            }
        }
        for(r = x; r <= 7; r+=1 )  {
            nextPosition = [position[0],r+1 ]

            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                right.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                right.push(nextPosition)
                console.log('breaku des')
                break;

            }
        }


        coord = [parseInt(position[0]),parseInt(position[1])]
        list.push(up);
        list.push(down);
        list.push(left);
        list.push(right);

        if(arguments.length === 1){
            app.MoveValidation.prototype.Lightpath(list,this.piece,false)
            app.MoveValidation.prototype.CheckStrikeAble(list,this.piece,false,"axes")


        }
        return {
            tiles:{
                move:list,
                strike:list
            }
        }

    break;

        case 'B':

            position = this.piece.position;
            y = parseInt(position[0]);
            x = parseInt(position[1]);
        for(uR = y; uR > 0; uR-=1){
            nextPosition = [ uR-1,x+(y-uR)+1 ];
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                upRight.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                upRight.push(nextPosition)
                console.log('breaku des')
                break;

            }
        }
        for(uL = y; uL > 0; uL-=1){
            nextPosition =[ uL-1,x-(y-uL)-1 ]
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                upLeft.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                upLeft.push(nextPosition)
                console.log('breaku des')
                break;

            }

        }

        for(dR = y; dR < 7; dR+=1){
            nextPosition = [ dR+1,x+(y-dR)-1 ]
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                downRight.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                downRight.push(nextPosition)
                console.log('breaku des')
                break;

            }

        }
        for(dL = y; dL < 7; dL+=1){
            nextPosition = [ dL+1,x-(y-dL)+1 ]
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                downLeft.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                downLeft.push(nextPosition)
                console.log('breaku des')
                break;

            }
        }


        list.push(upRight);
        list.push(upLeft);
        list.push(downRight);
        list.push(downLeft);

        if(arguments.length === 1){

            app.MoveValidation.prototype.Lightpath(list,this.piece,false)
            app.MoveValidation.prototype.CheckStrikeAble(list,this.piece,false,"diagonal")



        }
        return {
            tiles:{
                move:list,
                strike:list
            }
        }
            break;
        case 'Q':



        for(u = y; u > 0; u-=1){
            nextPosition = [ u-1,position[1] ];
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                up.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                up.push(nextPosition)
                console.log('breaku des')
                break;

            }

        }
        for(d = y; d <= 7; d+=1 )  {
            nextPosition = [ d+1,position[1] ]
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                down.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                down.push(nextPosition)
                console.log('breaku des')
                break;

            }
        }

        for(l = x; l > 0; l-=1){
            nextPosition = [position[0],l-1 ]
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                left.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                left.push(nextPosition)
                console.log('breaku des')
                break;

            }
        }
        for(r = x; r <= 7; r+=1 )  {
            nextPosition = [position[0],r+1 ]

            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                right.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                right.push(nextPosition)
                console.log('breaku des')
                break;

            }
        }

        for(uR = y; uR > 0; uR-=1){
            nextPosition = [ uR-1,x+(y-uR)+1 ];
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                upRight.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                upRight.push(nextPosition)
                console.log('breaku des')
                break;

            }
        }
        for(uL = y; uL > 0; uL-=1){
            nextPosition =[ uL-1,x-(y-uL)-1 ]
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                upLeft.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                upLeft.push(nextPosition)
                console.log('breaku des')
                break;

            }

        }

        for(dR = y; dR < 7; dR+=1){
            nextPosition = [ dR+1,x+(y-dR)-1 ]
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                downRight.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                downRight.push(nextPosition)
                console.log('breaku des')
                break;

            }

        }
        for(dL = y; dL < 7; dL+=1){
            nextPosition = [ dL+1,x-(y-dL)+1 ]
            if(app.pieceClicked(nextPosition,'checks') == "empty" ){
                downLeft.push(nextPosition)
            }else if(app.pieceClicked(nextPosition,'checks') == "enemy" || app.pieceClicked(nextPosition,'checks') == "player"){
                downLeft.push(nextPosition)
                console.log('breaku des')
                break;

            }
        }



        list.push(up);
        list.push(down);
        list.push(left);
        list.push(right);

        list.push(upRight);
        list.push(upLeft);
        list.push(downRight);
        list.push(downLeft);

        if(arguments.length === 1){


            app.MoveValidation.prototype.Lightpath(list,this.piece,false)
            app.MoveValidation.prototype.CheckStrikeAble(list,this.piece,false,"axes")


        }

        return {
            move:list,
            strike:list
        }
    break;
        case 'K':


        position = this.piece.getposition();
        position[0] = parseInt(position[0]);
        position[1] = parseInt(position[1]);
        if(position[0]-1 >= 0){
            up.push([ position[0]-1,position[1]  ]);
            upRight.push([ position[0]-1,position[1]+1  ]);
            upLeft.push([ position[0]-1,position[1]-1  ]);
        }
        down.push([ position[0]+1,position[1]  ]);
        left.push([ position[0],  position[1]+1  ]);
        right.push([ position[0],  position[1]-1  ]);
        downLeft.push([ position[0]+1,  position[1]+1  ]);
        downRight.push([ position[0]+1,  position[1]-1  ]);

        list.push(up);
        list.push(down);
        list.push(left);
        list.push(right);

        list.push(upRight);
        list.push(upLeft);
        list.push(downRight);
        list.push(downLeft);

        if(arguments.length === 1){

            app.MoveValidation.prototype.Lightpath(list,this.piece,false)
            app.MoveValidation.prototype.CheckStrikeAble(list,this.piece,false,'axes')

        }
        return {
            tiles:{
                move:list,
                strike:list
            }
        };
    break;
        case "N":
        position = this.piece.getposition();
        position[0] = parseInt(position[0]);
        position[1] = parseInt(position[1]);

        up.push([   position[0]-2,  position[1]+1  ], [ position[0]-2,  position[1]-1  ]);
        left.push([ position[0]+1,  position[1]+2  ], [ position[0]-1,  position[1]+2  ]);
        right.push([position[0]+1,  position[1]-2  ], [ position[0]-1,  position[1]-2  ]);
        down.push([ position[0]+2,  position[1]+1  ], [ position[0]+2,  position[1]-1  ]);


        list.push(up);
        list.push(down);
        list.push(left);
        list.push(right);
        if(arguments.length === 1){

            app.MoveValidation.prototype.Lightpath(list,this.piece,true)
            app.MoveValidation.prototype.CheckStrikeAble(list,this.piece,true,'axes')

        }
        return {
            tiles:{
                move:list,
                strike:list
            }
        };
        break;
    }
}



    app.ValidateMovement.prototype   = app.helper.inherit(app.MoveValidation.prototype);
