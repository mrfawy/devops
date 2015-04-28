var module = angular.module('dashBoard.adminModule');
module.controller('AdminEnvController', ['$scope', '$log', 'ToasterService', 'envService',
    function($scope, $log, toasterService, envService) {
        var ctrl = this;

        ctrl.refresh = function() {
            envService.loadEnv().success(
                function(data, status, headers) {

                    ctrl.envs = data;
                }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });

        };
        ctrl.envCreationMode = false;
        ctrl.createNewEnv = function() {
            ctrl.envCreationMode = true;
        }
        ctrl.createEnv = function(env) {
            if (!env) {
                toasterService.showWarning("Environment", "Environment name is missing.")
                return;
            }
            if (env.indexOf(" ") > 0) {
                toasterService.showWarning("Environment", "Environment name can't contain spaces.")
                return;
            }
            envService.createEnv(env).success(
                function(data, status, headers) {
                    toasterService.showSuccess("Environment", "Environment " + env + " created successfully")
                    $log.info("Environment created successfully");
                    ctrl.envCreationMode = false;
                    ctrl.newEnv = null;
                    ctrl.refresh();
                }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
        }
        ctrl.removeEnv = function(env) {
            envService.removeEnv(env).success(function(data, status, headers) {
                toasterService.showSuccess("Environment", "Environment " + env + " removed successfully")
                $log.info("env removed successfully");
                ctrl.refresh();
            }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
        }
        ctrl.refresh();
    }
]);

module.factory('envService', ['$http', function($http) {
    var loadEnv = function() {
        return $http.get("/envs");
    };
    var removeEnv = function(env) {
        return $http.delete("/envs/" + env);
    };
    var createEnv = function(env) {
        return $http.post("/envs/" + env);
    }
    return {
        loadEnv: function() {
            return loadEnv();
        },
        removeEnv: function(env) {
            return removeEnv(env);
        },
        createEnv: function(env) {
            return createEnv(env);
        },
    };
}]);