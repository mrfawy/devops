var module = angular.module('dashBoard.settingsModule');
module.controller('SelectEnvAppCtrl', ['$scope', '$log', 'ToasterService', 'loadService', 'SessionService', 'TokenService',
    function($scope, $log, toasterService, loadService, sessionService, tokenService) {
        var ctrl = this;

        sessionService.loadSessionData().success(
            function(data, status, headers) {
                ctrl.owner = data.session.userName;
            });
        loadService.loadData("envs")
            .success(function(data, status, headers) {
                ctrl.envs = data;
            });
        loadService.loadData("apps")
            .success(function(data, status, headers) {
                ctrl.apps = data;
            });
        ctrl.loadTokens = function() {
            if ($scope.env != null && $scope.app != null) {
                tokenService.loadTokens($scope.env, $scope.app)
                    .success(function(data, status, headers) {
                        $scope.token = null;
                        if (data.length > 0) {
                            ctrl.tokens = data;
                        }

                    });
            }


        }
        ctrl.tokenCreationMode = false;
        ctrl.createNewToken = function() {
            ctrl.tokenCreationMode = true;
        }
        ctrl.createToken = function() {
            if (ctrl.newToken) {
                tokenService.createToken($scope.env, $scope.app, ctrl.newToken,ctrl.owner)
                    .success(function(data, status, headers) {
                        $log.info("added Token successfully");
                        toasterService.showInfo("Create Token", "Token created , check Token list");
                        ctrl.loadTokens();
                        ctrl.newToken = null;
                        ctrl.tokenCreationMode = false;
                    });
            } else {
                if ($scope.env == null || $scope.app == null) {
                    toasterService.showWarning("Create Token", "Please select Environment and Application first");
                    $log.error("Please select Environment and App first")
                }
                toasterService.showWarning("Create Token", "Missing Token");
                $log.error("Missing Token")
            }
        }

        $scope.$watchGroup(['app', 'env'], function() {
            ctrl.loadTokens();
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

module.factory('TokenService', ['$http', function($http) {
    var loadTokens = function(env, app) {
        return $http.get("/tokens/" + env + "/" + app);
    }
    var createToken = function(env, app, token, owner) {
        return $http.post("/settings/" + env + "/" + app + "/" + token, {
            "owner": owner
        });
    }
    return {
        loadTokens: function(env, app) {
            return loadTokens(env, app);
        },
        createToken: function(env, app, token, owner) {
            return createToken(env, app, token, owner);
        },
    };
}]);