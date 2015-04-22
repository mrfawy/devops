var module = angular.module('dashBoard.adminModule');
module.controller('AdminEnvController', ['$scope', '$log', 'envService',
    function($scope, $log, envService) {
        var ctrl = this;

        ctrl.refresh = function() {
            envService.loadEnv().success(
                function(data, status, headers) {

                    ctrl.envs = data;
                });
        };
        ctrl.createEnv = function(env) {
            envService.createEnv(env).success(
                function(data, status, headers) {
                    $log.info("env created successfully");
                    ctrl.refresh();
                });
        }
        ctrl.removeEnv = function(env) {
            envService.removeEnv(env).success(function(data, status, headers) {
                $log.info("env removed successfully");
                ctrl.refresh();
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