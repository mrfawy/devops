var module = angular.module('dashBoard.adminModule');
module.controller('AdminUserController', ['$scope', '$log', 'userService',
    function($scope, $log, userService) {
        var ctrl = this;

        ctrl.refresh = function() {
            userService.loadUsers("admin").success(
                function(data, status, headers) {

                    ctrl.adminUsers = data;
                });
            userService.loadUsers("user").success(
                            function(data, status, headers) {

                                ctrl.normalUsers = data;
                            });
        };
        ctrl.toggleRole=function(user){
            var role=user.role;
            if(role==="admin"){
                role="user";
            }
            else{
                role="admin";
            }
            userService.assignUsertoRole(user.name,role)
            ctrl.refresh();
        }

        ctrl.removeUser = function(user) {
            userService.removeUser(user).success(function(data, status, headers) {
                $log.info("user removed successfully");
                ctrl.refresh();
            });
        }
        ctrl.refresh();
    }
]);

module.factory('userService', ['$http', function($http) {
    var loadUsers = function(role) {
        var url="/users"
        if(role){
        url+="?role="+role
        }
        return $http.get(url);
    };
    var removeUser = function(user) {
        return $http.delete("/users/" + user);
    };
    var assignUsertoRole = function(user,role) {
        return $http.put("/users/" +user+"/"+role);
    }
    return {
        loadUsers: function(role) {
            return loadUsers(role);
        },
        removeUser: function(user) {
            return removeUser(user);
        },
        assignUsertoRole: function(user,role) {
            return assignUsertoRole(user,role);
        }
    };
}]);