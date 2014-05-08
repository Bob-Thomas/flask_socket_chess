/**
 * Created by bob on 11/30/13.
 */

var socket = (function (){

    var socket = io.connect("http://"+document.domain+":"+location.port+"/"+document.URL.split("/")[3]);
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                callback.apply(socket, args);
            });
        },

        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                if(callback) {
                    callback.apply(socket, args);
                }
            })
        },

        connected: function() {
            return socket.socket.connected
        },
        clients:function(){
            return s
        }
    }
}());