var app = {}
app.team = undefined
app.init = (function(){
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext("2d");
    var bgReady = false;
    var bgImage = new Image();
    bgImage.src = "../static/img/bg.jpg";

    bgImage.onload = function () {
        bgReady = true;
    };
    return {
        ctx:ctx,
        canvas:canvas
    }
}())



app.soundManager = function(){
    var
        turn,
        checkMate
        ;
        turn = new Audio('/static/audio/turn.wav');
        checkMate = new Audio('/static/audio/checkmate.mp3');


   return {
	turn:turn,
	checkMate:checkMate
   }
};


