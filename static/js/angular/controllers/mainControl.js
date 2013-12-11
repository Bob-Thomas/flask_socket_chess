app.controller('loginControl',['$scope','socket','$http', function($scope,socket,$http){
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

    }

    $scope.submitLogin = function(){
        var data = {
            username:$scope.username,
            password:$scope.password
        }
        $http({
            method: 'POST',
            url: '',
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    }


}]);