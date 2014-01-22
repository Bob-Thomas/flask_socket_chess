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
        turn = new Audio('../audio/turn.mp3');
        checkMate = new Audio('../audio/checkmate.mp3');

    function playSound(sound){
        console.log("play sound weee")
        sound.src = sound.src;
        sound.pause();
        sound.currentTime = 0;
        sound.play();
    }
};


