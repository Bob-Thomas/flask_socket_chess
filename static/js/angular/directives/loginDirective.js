app.directive('loginWidget',function(){
   var linkFn,
       restrict = 'E';


       linkFn = function(scope,element,attrs){
           //console.log($scope.username)


   }

    return{
        restrict:restrict,
        link:linkFn
    }

});