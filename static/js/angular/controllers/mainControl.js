app.controller('loginControl',['$scope','socket','$http','$window', function($scope,socket,$http,$window){
    $scope.state  = 'login';
    $scope.loginInput =
    {
        username:{
            state:'neutral'
        },
        password:{
            state:'neutral'
        },
        passwordRepeat:{
            state:'neutral'
        },
        email:{
            state:'neutral'
        }
    }

    $scope.validateInput = function(name,element){
        if(name === "password" || name === "passwordRepeat"){
            var password,
                passwordRepeat;
            password = $scope.password;
            passwordRepeat = $scope.passwordRepeat;

            if(password === passwordRepeat && passwordRepeat === password){
                $scope.loginInput.password.state = 'correct';
                $scope.loginInput.passwordRepeat.state = 'correct';

            }
            else{
                $scope.loginInput.password.state = 'error';
                $scope.loginInput.passwordRepeat.state = 'error';
            }
        }
        else{
            socket.emit('verify',{name:name,value:element})
        }

    }

    $scope.submitRegister = function(){
        var data = $.param({
            type:'register',
            username:$scope.username,
            password:$scope.password,
            repeat:$scope.passwordRepeat,
            email:$scope.email
        });
        if($scope.state === "register"){
            $http({
                method: 'POST',
                url: '/',
                data: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        }

    }

    $scope.submitLogin = function(){
        var data = $.param({
            type:'login',
            username:$scope.username,
            password:$scope.password
        });
        $http({
            method: 'POST',
            url: '/',
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).
            success(function(data, status, headers, config) {
               $window.location = data
                console.log(data)
            });

    }


}]);




app.controller('lobbyControl',["$scope","socket",function($scope,socket){

    $scope.rooms = [];
    $scope.messages = [];
    $scope.user = '';
    $scope.userRank = ''
    $scope.stats = {wins:0,loses:0}

    socket.emit('enterLobby',$scope.userName);

    socket.on('nickname',function(data){
        $scope.user = data['name'];
        $scope.userRank = data['rank']
        $scope.stats.wins = data['wins']
        $scope.stats.loses = data['loses']
        console.log(data)
    })

    socket.on('message',function(data){
        var message = {
            rank:data['rank'],
            name:data['name'],
            time:data['time'],
            message:data['message']
        }
        $scope.messages.push(message)

    })

    socket.on('lobbyCreated',  function(data){
        $scope.rooms = []
        for(var stuff in data){
            if ($scope.rooms[stuff] !== data[stuff]){
                console.log("testing" +data[stuff]['players'])
                if(data[stuff]['players'] <= 1){
                    $scope.rooms.push(data[stuff])
                }
            }
        }
        console.log($scope.rooms)
    });

    socket.on("lobbyRemoved",function(data){
        $scope.rooms.remove(data)
    })

    $scope.createRoom = function(){
        socket.emit("create",{roomName:$scope.roomName})

    }

    $scope.joinRoom = function(hash){
        socket.emit("joinGame",{
                name:$scope.user,
                hash:hash
            })
    }




}]);