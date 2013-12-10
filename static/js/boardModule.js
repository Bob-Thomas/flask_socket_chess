app.createboard = function(){
        var size = 8,
            board = $("#chessboard"),
            boardArray,
            fenString;
        //fenString = "rnbkqbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBKQBNR w"
        boardArray = [['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
                      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x']]

    return{
        array:boardArray
    }
};
app.drawBoard = function(){

       var boardList,
           board = $("#chessboard"),
           table,
           color,
           imageroot = "",
           x,
           y,
           color = 'black',
           piece;
       boardList = app.drawPieces().boardList
       board.append("<table class='boardTable'></table>");
       table = $(".boardTable");
       for(y = 0;y < boardList.length; y++){
           row = table.append("<tr class="+'row-'+String.fromCharCode(65+y)+">   </tr>");
           for(x = 0; x<8;x++){
               if(boardList[y][x] != 'x')
               {
                piece = boardList[y][x]
                $("tr").eq(y).append("<td class='occupied-tile tile  tile-"+String.fromCharCode(65+y)+x+"'"+"><img class ='piece' data-piece='"+piece.getId()+"' src="+'./img/chesspieces/'+piece.draw()+'.png'+""+" height='75px' width='75px'/></td>")
               }
               else{
                   $("tr").eq(y).append("<td class='free-tile tile  tile-"+String.fromCharCode(65+y)+x+"'"+"></td>")
               }
           }
       }






};
app.drawPieces =function(color){
    var boardList = app.createboard().array, j, i, create, item;
    create = app.pieceSet
    _.each(create,function(key,value){
        _.each(key,function(key,value){
                item = key
                boardList[item.getposition()[0]][item.getposition()[1]] = item;
        });
    });


    return{
        boardList:boardList
    }
}