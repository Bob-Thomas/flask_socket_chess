app.MoveValidation = function MoveValidation(piece){
    this.piece = piece;
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

    app.MoveValidation.prototype.ClickPath = function ClickPath(piece){
        $(".overlayTile").each(function(){

            $(this).click(function(){
                if(!$(this).hasClass("blocked")){
                    var
                        positionList = $(this).parent().attr("class").split(' '),
                        position = app.helper.CheckList(positionList,/^tile-../),
                        y = position.replace("tile-","").charCodeAt(position[0])-65,
                        x = position.replace("tile-","")[1];
                    if(!$(this).hasClass("strikeAble")&& !$(this).hasClass("friendly") ){
                        app.MovePiece(piece,[y,x],true)
                        piece.enpasent = false;
                        app.MoveValidation.prototype.ClearPath()
                    }
                    else if($(this).hasClass('strikeAble')){

                        app.StrikePiece([y,x],true)
                        app.MovePiece(piece,[y,x],true)
                        app.MoveValidation.prototype.ClearPath()
                    }
                    else if($(this).hasClass("friendly")){
                        app.MoveValidation.prototype.ClearPath();
                    }
                }
            });
        });
    }

}
app.MoveValidation.prototype.ClearPath = function ClearPath(){
    app.render()
}
app.MoveValidation.prototype.CheckStrikeAble =  function CheckStrikeAble(strikeCoords,piece,canJump,direction){
    var strikeTile,checks,color,list;
    //app.UpdateTiles();
    for(list = 0; list < strikeCoords.length; list++) {
        for(checks = 0; checks < strikeCoords[list].length; checks++)
            if(65+strikeCoords[list][checks][0] >= 65){
                strikeTile = ".tile-"+String.fromCharCode(65+strikeCoords[list][checks][0])+strikeCoords[list][checks][1]
                color =  $(strikeTile).children('img').attr("data-piece");
                if(color !== undefined){
                    color = color[0]
                }
                if($(strikeTile).hasClass("occupied-tile") && color === piece.getColor() ){
                    $(strikeTile).prepend("<div style='position:absolute' class='overlayTile friendly'></div>")
                    if(canJump === false && direction === "axes"){
                        break;
                    }

                }
                else if($(strikeTile).hasClass("occupied-tile") && color !== piece.getColor() ){
                    $(strikeTile).prepend("<div style='position:absolute' class='overlayTile strikeAble'></div>")
                    if(canJump === false && direction === "axes"){
                        break;
                    }

                }


            }
    }
}

app.ValidatePawn = function ValidatePawn(){
    app.MoveValidation.apply(this,arguments)
    var maxSteps,
        position,
        tiles= [],
        list = [],
        steps,
        color,
        coord,
        strikeCoords  = [],
        color = this.piece.getColor();

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
       // app.MoveValidation.prototype.CheckStrikeAble(strikeCoords,this.piece,false,'diagonal')
        app.MoveValidation.prototype.Lightpath(list,this.piece,false)
        //app.MoveValidation.prototype.ClickPath(this.piece);

    };

}

app.ValidateRook = function ValidateRook(){
    app.MoveValidation.apply(this,arguments)
    var position,
        list = [],
        x,
        y,
        u,
        d,
        l,
        r,
        list = [],
        up = [],
        down = [],
        left = [],
        right = [];
    position = this.piece.position;
    y = parseInt(position[0]);
    x = parseInt(position[1]);
    for(u = y; u > 0; u-=1){
        up.push([ u-1,position[1] ])
    }
    for(d = y; d <= 7; d+=1 )  {
        down.push([ d+1,position[1] ])
    }

    for(l = x; l > 0; l-=1){
        left.push([position[0],l-1 ])
    }
    for(r = x; r <= 7; r+=1 )  {
        right.push([position[0],r+1 ])
    }


    coord = [parseInt(position[0]),parseInt(position[1])]
    list.push(up);
    list.push(down);
    list.push(left);
    list.push(right);
    ///app.MoveValidation.prototype.CheckStrikeAble(list,this.piece,false,"axes")

    app.MoveValidation.prototype.Lightpath(list,this.piece,false)

    ///app.MoveValidation.prototype.ClickPath(this.piece);

}

app.ValidateBishop = function ValidateBishop(){
    app.MoveValidation.apply(this,arguments)
    var
        position,
        list = [],
        x,
        y,
        uR,
        uL,
        dR,
        dL,
        upRight = [],
        upLeft = [],
        downRight = [],
        downLeft = [],
        position = this.piece.position;
    y = parseInt(position[0]);
    x = parseInt(position[1]);
    for(uR = y; uR > 0; uR-=1){
        upRight.push([ uR-1,x+(y-uR)+1 ])
    }
    for(uL = y; uL > 0; uL-=1){
        upLeft.push([ uL-1,x-(y-uL)-1 ])
    }

    for(dR = y; dR < 7; dR+=1){
        downRight.push([ dR+1,x+(y-dR)-1 ])
    }
    for(dL = y; dL < 7; dL+=1){
        downLeft.push([ dL+1,x-(y-dL)+1 ])
    }


    list.push(upRight);
    list.push(upLeft);
    list.push(downRight);
    list.push(downLeft);
    //app.MoveValidation.prototype.CheckStrikeAble(list,this.piece,false,"diagonal")

    app.MoveValidation.prototype.Lightpath(list,this.piece,false)

    //app.MoveValidation.prototype.ClickPath(this.piece);

}

app.ValidateQueen = function ValidateQueen(){
    app.MoveValidation.apply(this,arguments)
    var
        position,
        list = [],
        x,
        y,
        uR,
        uL,
        dR,
        dL,
        u,
        d,
        l,
        r,
        up = [],
        down = [],
        left = [],
        right = [],

        upRight = [],
        upLeft = [],
        downRight = [],
        downLeft = []
    position = this.piece.position;
    y = parseInt(position[0]);
    x = parseInt(position[1]);



    for(u = y; u > 0; u-=1){
        up.push([ u-1,position[1] ])
    }
    for(d = y; d <= 7; d+=1 )  {
        down.push([ d+1,position[1] ])
    }

    for(l = x; l > 0; l-=1){
        left.push([position[0],l-1 ])
    }
    for(r = x; r <= 7; r+=1 )  {
        right.push([position[0],r+1 ])
    }

    for(uR = y; uR > 0; uR-=1){
        upRight.push([ uR-1,x+(y-uR)+1 ])
    }
    for(uL = y; uL > 0; uL-=1){
        upLeft.push([ uL-1,x-(y-uL)-1 ])
    }

    for(dR = y; dR < 7; dR+=1){
        downRight.push([ dR+1,x+(y-dR)-1 ])
    }
    for(dL = y; dL < 7; dL+=1){
        downLeft.push([ dL+1,x-(y-dL)+1 ])
    }


    list.push(up);
    list.push(down);
    list.push(left);
    list.push(right);

    list.push(upRight);
    list.push(upLeft);
    list.push(downRight);
    list.push(downLeft);
    //app.MoveValidation.prototype.CheckStrikeAble(list,this.piece,false,"axes")

    app.MoveValidation.prototype.Lightpath(list,this.piece,false)

    //app.MoveValidation.prototype.ClickPath(this.piece);

}

app.ValidateKing = function ValidateKing(){
    app.MoveValidation.apply(this,arguments)
    var position,
        up = [],
        down = [],
        left = [],
        right = [],
        upRight = [],
        upLeft = [],
        downRight = [],
        downLeft = [],
        list= [];

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
    //app.MoveValidation.prototype.CheckStrikeAble(list,this.piece,false,'axes')
    app.MoveValidation.prototype.Lightpath(list,this.piece,false)
   // app.MoveValidation.prototype.ClickPath(this.piece);


}


app.ValidateKnight = function ValidateKnight(){
    app.MoveValidation.apply(this,arguments)
    var position,
        up = [],
        down = [],
        left = [],
        right = [],
        list= [];

    position = this.piece.getposition();
    position[0] = parseInt(position[0]);
    position[1] = parseInt(position[1]);
    console.log(position[0]+65)

    up.push([   position[0]-2,  position[1]+1  ], [ position[0]-2,  position[1]-1  ]);
    left.push([ position[0]+1,  position[1]+2  ], [ position[0]-1,  position[1]+2  ]);
    right.push([position[0]+1,  position[1]-2  ], [ position[0]-1,  position[1]-2  ]);
    down.push([ position[0]+2,  position[1]+1  ], [ position[0]+2,  position[1]-1  ]);


    list.push(up);
    list.push(down);
    list.push(left);
    list.push(right);
    console.log(list)
    //app.MoveValidation.prototype.CheckStrikeAble(list,this.piece,true,'axes')
    app.MoveValidation.prototype.Lightpath(list,this.piece,true)
    //app.MoveValidation.prototype.ClickPath(this.piece);
    //app.MoveValidation.prototype.ClickPath(this.piece);


}



app.ValidatePawn.prototype = app.helper.inherit(app.MoveValidation.prototype);
app.ValidateRook.prototype = app.helper.inherit(app.MoveValidation.prototype);
app.ValidateBishop.prototype = app.helper.inherit(app.MoveValidation.prototype);
app.ValidateKnight.prototype = app.helper.inherit(app.MoveValidation.prototype);
app.ValidateQueen.prototype = app.helper.inherit(app.MoveValidation.prototype);
app.ValidateKing.prototype = app.helper.inherit(app.MoveValidation.prototype);
