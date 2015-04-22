var module = angular.module('dashBoard.settingsModule');
module.controller('SelectEnvAppCtrl', ['$scope', '$log', 'loadService', 'userIdsService',
    function($scope, $log, loadService, userIdsService) {
        var ctrl = this;
        loadService.loadData("envs")
            .success(function(data, status, headers) {
                ctrl.envs = data;
            });
        loadService.loadData("apps")
            .success(function(data, status, headers) {
                ctrl.apps = data;
            });
        this.loadUserIds = function() {
            if ($scope.env != null && $scope.app != null) {
                userIdsService.loadUserIds($scope.env, $scope.app)
                    .success(function(data, status, headers) {
                        ctrl.userIds = data;
                    });
            }


        }
        this.createUserId = function() {
            if (ctrl.newUserId) {
                userIdsService.createUserId($scope.env, $scope.app, ctrl.newUserId)
                    .success(function(data, status, headers) {
                        $log.info("added userID successfully");
                        ctrl.loadUserIds();
                    });
            } else {
                $log.error("missing UserID")
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