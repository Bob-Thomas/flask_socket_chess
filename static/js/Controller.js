/**
 * Created by Bob.Thomas on 21-11-13.
 */
app.whoseTurn = function whoseTurn(){

};
app.createControls = function createControls(color){
    $(".piece").each(function(){
        var type, piece;
        type = $(this).attr("data-piece");
        if(type[0] == color[0] && !$(this).hasClass('initialized')){
            $(this).addClass("initialized");
            $(this).click(function(){
                console.log(type)
                piece = app.pieceSet[color][type];
                app.MoveValidation.prototype.ClearPath();
                console.log(piece.type)
                console.log(piece.getposition())
                switch(piece.type){
                    case  color[0]+"P":app.ValidatePawn(piece);
                        break;
                    case  color[0]+"Q":app.ValidateQueen(piece);
                        break;
                    case  color[0]+"R":app.ValidateRook(piece);
                        break;
                    case  color[0]+"B":app.ValidateBishop(piece);
                        break;
                    case  color[0]+"K":app.ValidateKing(piece);
                        break;
                    case + color[0]+"N":app.ValidateKnight(piece);
                        break;
                    default:console.log("boe")
                }
                app.UpdateTiles();

            });
        }

    });

}

app.UpdateTiles = function UpdateTiles(){
    var tiles = $(".tile");
    tiles.each(function(){
        if($(this).children().length >= 1 ){
            if($(this).hasClass("free-tile")){
                $(this).removeClass('free-tile');

            }
            $(this).removeClass('occupied-tile');
            $(this).addClass("occupied-tile");
        }
        else{
            $(this).removeClass('occupied-tile');
            if(!$(this).hasClass("free-tile")){
                $(this).addClass('free-tile');

            }
        }
    })
}
app.MovePiece = function MovePiece(object,position,socketized){
    var id,type,
        id = object.getId(),
        html,
        row,
        enemyPosition,
        tile = ".tile-"+String.fromCharCode(65+position[0])+position[1],
        piece = $(".piece[data-piece='"+id+"']");
    html = $(piece).clone();
    $(piece).remove();
    $(tile).append(html);
    $(tile).children().removeClass('initialized');
    object.setPosition(position)
    if(object.getType()[1] == "P" && position[0] == 0){
        object.promote()
    }
    console.log(app.pieceSet['black'][ 'b'+id[1]+id[2] ])
    app.createControls()
    app.UpdateTiles();
    enemyPosition = {
        id:id,
        position:[7-position[0],7-position[1]]
    }
    if(socketized === true){
       app.chessClient.moveEnemy(enemyPosition)
    }
};
app.StrikePiece = function StrikePiece(position,socketized){
    var tile;
    console.log("Strike")
    console.log(position);

    tile = ".tile-"+String.fromCharCode(position[0]+65)+position[1]
    console.log(tile);
    $(tile).children().eq(-1).remove();
    app.UpdateTiles();
    if(socketized === true){
        app.StrikePiece(position)
    }


}