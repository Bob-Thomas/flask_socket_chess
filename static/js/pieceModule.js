app.Piece = function Piece(position, type, id,color){
    this.position = position;
    this.type = type;
    this.id = id;
    this.color = color;
    this.alive = true;
    this.dummy = false;

};
//app.Piece.prototype.color = function(color){this.color=color};
app.Piece.prototype.setPosition = function(position){
    this.position = position;
};
app.Piece.prototype.getposition = function(){
    return this.position
};
app.Piece.prototype.getType = function(){
    return this.type
};
app.Piece.prototype.getColor = function(){
    return this.color
};
//app.Piece.prototype.id = function(id){this.id=id};
app.Piece.prototype.getId = function(){
    return this.id
};
app.Piece.prototype.Invalid = function(){
    console.log("illegal move")};
app.Piece.prototype.getColor = function(){
    return this.id[0]
};
app.Piece.prototype.inBounds = function (position){
    return ((position[0]+1) <= 8 && parseInt(position[0]) > 0 && position[1]-1 <= 8 && position[1] >= 0)
};
app.Piece.prototype.draw = function(){
    return this.type
}
app.Piece.prototype.setAlive = function(alive){
    this.alive = alive;
}
app.Piece.prototype.getAlive = function(){
    return this.alive
}
app.Piece.prototype.getDummy = function(){
    return this.dummy
}

app.Pawn = function Pawn(){
    app.Piece.apply(this, arguments);
    this.enpasent = true;
    this.enpasStrike = false;
    console.log("WHAT AM I : " +this.id.length)
    if(this.id.length > 3){
        console.log(this.id + " i am a dummy")
        this.dummy = true;
    }
    this.setEnpasStrike = function(val){
        this.enpasStrike = val;
    }

    this.getEnpasStrike = function(){
        return this.enpasStrike
    }
    this.getEnpasent = function() {
        return this.enpasent
    }
    this.promote = function(){
        var piece,parent,color,queen;
        delete app.pieceSet[this.color][this.id]
        app.pieceSet[this.color][this.id[0]+'Q'+this.id[2]] = new app.Queen([0,this.position[1]],this.id[0]+"Q",this.id[0]+"Q"+this.id[2],this.color)

    }


};

app.King = function King(){
    app.Piece.apply(this, arguments);

};

app.Queen = function Queen(){
    app.Piece.apply(this, arguments);
    this.scream = function(){
        console.log("aaaaah")
    }

};

app.Rook = function Rook(){
    app.Piece.apply(this, arguments);

};

app.Knight = function Knight(){
    app.Piece.apply(this, arguments);

};
app.Bishop = function Bishop(){
    app.Piece.apply(this, arguments);

};



app.Pawn.prototype   = app.helper.inherit(app.Piece.prototype);
app.King.prototype   = app.helper.inherit(app.Piece.prototype);
app.Queen.prototype  = app.helper.inherit(app.Piece.prototype);
app.Bishop.prototype = app.helper.inherit(app.Piece.prototype);
app.Knight.prototype = app.helper.inherit(app.Piece.prototype);
app.Rook.prototype   = app.helper.inherit(app.Piece.prototype);

app.blackPieces = {};
app.whitePieces = {};
app.pieceSet = {};





app.blackPieces = {};
app.whitePieces = {};
app.selectedPiece = undefined;
app.startingPositions = function(){
    var
        whitePawns,
        blackPawns
        ;
    if(app.team == 'white'){
    app.blackPieces ={
        bR1:new app.Rook(  [0,0],'bR',"bR1"),
        bN1:new app.Knight([0,1],'bN',"bN1"),
        bB1:new app.Bishop([0,2],'bB',"bB1"),
        bK: new app.King(  [0,3],"bK","bK"),
        bQ: new app.Queen( [0,4],'bQ',"bQ"),
        bB2:new app.Bishop([0,5],'bB',"bB2"),
        bN2:new app.Knight([0,6],'bN',"bN2"),
        bR2:new app.Rook(  [0,7],'bR',"bR2")
    };


    app.whitePieces = {
        wR1:new app.Rook(  [7,0],'wR',"wR1"),
        wN1:new app.Knight([7,1],'wN',"wN1"),
        wB1:new app.Bishop([7,2],'wB',"wB1"),
        wK :new app.King(  [7,3],"wK","wK"),
        wQ :new app.Queen( [7,4],'wQ',"wQ"),
        wB2:new app.Bishop([7,5],'wB',"wB2"),
        wN2:new app.Knight([7,6],'wN',"wN2"),
        wR2:new app.Rook(  [7,7],'wR',"wR2")
    };

        for(blackPawns=0; blackPawns < 8;blackPawns++){
            app.blackPieces["bP"+blackPawns]= new app.Pawn([1,blackPawns],"bP",("bP"+blackPawns),"black")
        }
        for(whitePawns=0; whitePawns < 8;whitePawns++){
            app.whitePieces["wP"+whitePawns] = new app.Pawn([6,whitePawns],"wP",("wP"+whitePawns),"white")
        }
    }
    else{
        app.blackPieces ={
            bR1:new app.Rook(  [7,0],'bR',"bR1"),
            bN1:new app.Knight([7,1],'bN',"bN1"),
            bB1:new app.Bishop([7,2],'bB',"bB1"),
            bK: new app.King(  [7,3],"bK","bK"),
            bQ: new app.Queen( [7,4],'bQ',"bQ"),
            bB2:new app.Bishop([7,5],'bB',"bB2"),
            bN2:new app.Knight([7,6],'bN',"bN2"),
            bR2:new app.Rook(  [7,7],'bR',"bR2")
        };


        app.whitePieces = {
            wR1:new app.Rook(  [0,0],'wR',"wR1"),
            wN1:new app.Knight([0,1],'wN',"wN1"),
            wB1:new app.Bishop([0,2],'wB',"wB1"),
            wK :new app.King(  [0,3],"wK","wK"),
            wQ :new app.Queen( [0,4],'wQ',"wQ"),
            wB2:new app.Bishop([0,5],'wB',"wB2"),
            wN2:new app.Knight([0,6],'wN',"wN2"),
            wR2:new app.Rook(  [0,7],'wR',"wR2")
        };

        for(blackPawns=0; blackPawns < 8;blackPawns++){
            app.blackPieces["bP"+blackPawns]= new app.Pawn([6,blackPawns],"bP",("bP"+blackPawns),"black")
        }
        for(whitePawns=0; whitePawns < 8;whitePawns++){
            app.whitePieces["wP"+whitePawns] = new app.Pawn([1,whitePawns],"wP",("wP"+whitePawns),"white")
        }
    }



    app.pieceSet={
        white:app.whitePieces,
        black:app.blackPieces
    }


}
