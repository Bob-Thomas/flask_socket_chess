app.controller('loginControl',['$scope','socket','$interval', function($scope,socket){
        $scope.loginInput =
        {
            username:{
                error:false
                ,name:$scope.username
            },
            password:{
                error:false
                ,name:$scope.password
            },
            passwordRepeat:{
                error:false
                ,name:$scope.passwordRepeat
            },
            email:{
                error:false
                ,name:$scope.email
            }
        }

        $scope.validateInput = function(name,element){
            if(name === "password " || name === "password-repeat"){
                var password,
                    passwordRepeat;
                password = $scope.password;
                passwordRepeat = $scope.passwordRepeat;

                if(password === passwordRepeat && passwordRepeat === password){
                   $scope.loginInput.password.error = false;
                   $scope.loginInput.passwordRepeat.error = false;

                }
                else{
                    $scope.loginInput.password.error = true;
                    $scope.loginInput.passwordRepeat.error = true;
                }
            }
            else{
                socket.emit('verify',{name:name,value:value})
            }
        }

}]);