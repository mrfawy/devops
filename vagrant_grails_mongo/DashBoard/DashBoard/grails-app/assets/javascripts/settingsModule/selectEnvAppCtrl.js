var module = angular.module('dashBoard.settingsModule');
module.controller('SelectEnvAppCtrl', ['$scope', '$log', 'ToasterService', 'loadService', 'SessionService', 'TokenService',
    function($scope, $log, toasterService, loadService, sessionService, tokenService) {
        var ctrl = this;

        sessionService.loadSessionData().success(
            function(data, status, headers) {
                $scope.owner = data.session.userName;
                $scope.isAdmin = data.session.isAdmin
            });
        loadService.loadData("envs")
            .success(function(data, status, headers) {
                ctrl.envs = data;
            }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
        loadService.loadData("apps")
            .success(function(data, status, headers) {
                ctrl.apps = data;
            }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
        ctrl.loadTokens = function() {
            if ($scope.env != null && $scope.app != null) {
                tokenService.loadTokens($scope.env, $scope.app)
                    .success(function(data, status, headers) {
                        $scope.tokens = null;
                        $scope.tokens = data;
                        //filter tokens to owner only
                        ctrl.showAllTokens(false);

                    }).error(function(data, status, headers, config) {
                        toasterService.showError("Service Error", data);
                    });
            }


        }
        ctrl.tokenCreationMode = false;
        ctrl.createNewToken = function() {
            ctrl.tokenCreationMode = true;
        }
        ctrl.createToken = function() {
            if (!ctrl.newToken) {
                toasterService.showWarning("Create Token", "Missing Token");
                $log.error("Missing Token")
                return
            }
            if (ctrl.newToken.indexOf(' ') >= 0) {
                toasterService.showWarning("Create Token", "Token Can't contain spaces");
                $log.error("Token Can't contain spaces")
                return;
            }
            //check if token exists
            for (var i = 0; i < $scope.tokens.length; i++) {
                if ($scope.tokens[i].token == ctrl.newToken) {
                    toasterService.showWarning("Create Token", "Token already exists in current context, please check token filter");
                    $log.error("Token already exist")
                    return;
                }
            }
            if ($scope.env == null || $scope.app == null) {
                toasterService.showWarning("Create Token", "Please select Environment and Application first");
                $log.error("Please select Environment and App first")
            }

            //create Token
            tokenService.createToken($scope.env, $scope.app, ctrl.newToken, $scope.owner)
                .success(function(data, status, headers) {
                    $log.info("added Token successfully");
                    toasterService.showInfo("Create Token", "Token created , check Token list");
                    ctrl.loadTokens();
                    ctrl.newToken = null;
                    ctrl.tokenCreationMode = false;
                }).error(function(data, status, headers, config) {
                    toasterService.showError("Service Error", data);
                });

        }
        ctrl.updateTokenOwner = function() {
            if ($scope.token != null && $scope.tokens != null && $scope.tokens.length > 0) {
                for (var i = 0; i < $scope.tokens.length; i++) {
                    if ($scope.tokens[i].token === $scope.token) {
                        $scope.tokenOwner = $scope.tokens[i].owner;
                    }
                }
            }
            $log.info("Token owner : " + $scope.tokenOwner);
        }
        ctrl.showAllTokens = function(flag) {
            ctrl.showAllTokensMode = flag;
            ctrl.filterTokens(!flag);

        };

        ctrl.filterTokens = function(flag) {
            if (!flag) {
                ctrl.filteredTokens = $scope.tokens
            } else {
                ctrl.filteredTokens = []
                for (var i = 0; i < $scope.tokens.length; i++) {
                    if ($scope.tokens[i].owner === $scope.owner) {
                        ctrl.filteredTokens.push($scope.tokens[i]);
                    }
                }
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