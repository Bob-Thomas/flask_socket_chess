app.render = function(){
    var ctx = app.init.ctx;
    ctx.clearRect(0,0,600,600)
    app.createBoard();
    var image = new Image();
    image.src = "../static/img/chesspieces/spriteSheet.png";
    image.onload = function(){
        app.image = image;
        app.drawPieces()

    }

    app.init.canvas.addEventListener('click',app.clickController,false)

};

app.drawPieces = function(){
    var
        ctx = app.init.ctx,
        spriteSheetpos={
            R:0,
            N:75,
            B:75*2,
            K:75*3,
            Q:75*4,
            P:75*5
        },
        y = 0,
        image = app.image
        ;

    app.init.ctx.globalAlpha = 1;
    for(key in app.pieceSet){
        for(piece in app.pieceSet[key]){
            var piece = app.pieceSet[key][piece];
            if(key == 'white'){
                y = 75;
            }else{
                y = 0;
            }
            var position = spriteSheetpos[piece.getId()[1]]
            if(piece.getAlive()){

                ctx.drawImage(image,position,y,75,75,piece.getposition()[1]*75,piece.getposition()[0]*75,75,75)
            }else{
                console.log("piece put to the side")
            }
        }
    }
}

app.drawBlock = function(position){
    var
        ctx =app.init.ctx,
        row = position[0],
        col = position[1],
        color = '#3a2415';
    ;

    ctx.beginPath();
    ctx.rect(row,col,75,75);
    if(row  % 2){
        (col % 2) ? color='#3a2415' : color='#966234'
    }
    else{
        (col % 2) ? color='#966234' : color='#3a2415'

    }
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}
app.createBoard = function(){

    var
        color = '#3a2415',
        size = 75,
        endboard = 75 * 8,
        x = 0,
        y = 0,
        row = 0,
        ctx = app.init.ctx
        ;
    for (var i = 0;i < 64 ; i+=1){

        if (x == endboard){
            x = 0
            y += 75
            row +=1
        }
        ctx.beginPath();
        ctx.rect(x,y,size,size);
        if(row  % 2){
            (i % 2) ? color='#3a2415' : color='#966234'
        }
        else{
            (i % 2) ? color='#966234' : color='#3a2415'

        }
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        x += 75
    }
}