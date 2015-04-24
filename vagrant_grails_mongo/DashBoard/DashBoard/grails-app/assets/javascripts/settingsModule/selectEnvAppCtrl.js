var module = angular.module('dashBoard.settingsModule');
module.controller('SelectEnvAppCtrl', ['$scope', '$log','ToasterService', 'loadService', 'userIdsService',
    function($scope, $log,toasterService, loadService, userIdsService) {
        var ctrl = this;
        loadService.loadData("envs")
            .success(function(data, status, headers) {
                ctrl.envs = data;
            });
        loadService.loadData("apps")
            .success(function(data, status, headers) {
                ctrl.apps = data;
            });
        ctrl.loadUserIds = function() {
            if ($scope.env != null && $scope.app != null) {
                userIdsService.loadUserIds($scope.env, $scope.app)
                    .success(function(data, status, headers) {
                        $scope.userId = null;
                        if(data.length>0){
                            ctrl.userIds = data;
                        }

                    });
            }


        }
        ctrl.userIdCreationMode=false;
        ctrl.createNewUserId=function(){
            ctrl.userIdCreationMode=true;
        }
        ctrl.createUserId = function() {
            if (ctrl.newUserId) {
                userIdsService.createUserId($scope.env, $scope.app, ctrl.newUserId)
                    .success(function(data, status, headers) {
                        $log.info("added userID successfully");
                        toasterService.showInfo("Create UserId","UserId created , check userId list");
                        ctrl.loadUserIds();
                        ctrl.newUserId=null;
                        ctrl.userIdCreationMode=false;
                    });
            } else {
            if($scope.env==null||$scope.app==null){
                 toasterService.showWarning("Create UserId","Please select Environment and Application first");
                 $log.error("Please select Environment and App first")
            }
                toasterService.showWarning("Create UserId","Missing UserId");
                $log.error("Missing UserId")
            }
        }

        $scope.$watchGroup(['app', 'env'], function() {
            ctrl.loadUserIds();
        });

    }
]);

module.factory('loadService', ['$http', function($http) {
    var doRequest = function(src) {
        return $http({
            method: 'GET',
            url: "/" + src
        });
    }
    return {
        loadData: function(src) {
            return doRequest(src);
        },
    };
}]);

module.factory('userIdsService', ['$http', function($http) {
    var loadUserIds = function(env, app) {
        return $http.get("/userIds/" + env + "/" + app);
    }
    var createUserId = function(env, app, userId) {
        return $http.post("/settings/" + env + "/" + app + "/" + userId);
    }
    return {
        loadUserIds: function(env, app) {
            return loadUserIds(env, app);
        },
        createUserId: function(env, app, userId) {
            return createUserId(env, app, userId);
        },
    };
}]);