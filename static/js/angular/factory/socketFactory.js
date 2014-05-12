app.factory('socket', function ($rootScope) {
//    var socket = io.connect("http://"+document.domain+":"+location.port+"/"+;
    var socket = io.connect("http://chess.bmthomas.nl:9000/"+document.URL.split("/")[3]);
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
        connected : function(){
            return socket.socket.connected;
        }
    };
});


