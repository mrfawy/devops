var module=angular.module('dashBoard.settingsModule');
module.controller('SelectEnvAppCtrl', ['$scope', 'loadService','userIdsService',
    function($scope,loadService,userIdsService) {
    var ctrl=this;
    loadService.loadData("envs")
               .success(function(data, status, headers) {
                 ctrl.envs=data;
               });
   loadService.loadData("apps")
                  .success(function(data, status, headers) {
                    ctrl.apps=data;
                  });
   this.loadUserIds=function(){
           if($scope.env!=null && $scope.app!=null){
               userIdsService.loadData($scope.env,$scope.app)
                              .success(function(data, status, headers) {
                                ctrl.userIds=data;
                              });
           }

       }

    $scope.$watch('app', function() {
            ctrl.loadUserIds();
       });
       $scope.$watch('env', function() {
                   ctrl.loadUserIds();
              });



}]);

module.factory('loadService', ['$http', function($http) {
    var doRequest = function(src) {
      return $http({
        method: 'GET',
        url: "/"+src
      });
    }
    return {
      loadData: function(src) { return doRequest(src); },
    };
  }]);

module.factory('userIdsService', ['$http', function($http) {
    var doRequest = function(env,app) {
      return $http({
        method: 'GET',
        url: "/userIds/"+env+"/"+app
      });
    }
    return {
      loadData: function(env,app) { return doRequest(env,app); },
    };
  }]);
