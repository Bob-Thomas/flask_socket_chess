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

