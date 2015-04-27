var app=angular.module('dashBoardApp')
app.factory('SessionService', ['$http', function($http) {
    var loadSessionData = function() {
         return $http.get("/session/");
    };
    return {
        loadSessionData: function() {
            return loadSessionData();
        }
    };
}]);