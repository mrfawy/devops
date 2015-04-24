var module = angular.module('dashBoard.adminModule');
module.controller('AdminUserController', ['$scope', '$log','ToasterService', 'userService',
    function($scope, $log,toasterService, userService) {
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
        ctrl.toggleRole = function(user) {
            var role = user.role;
            if (role === "admin") {
                role = "user";
            } else {
                role = "admin";
            }
            //check only minimum of one admin
            if(role==="user" && ctrl.adminUsers.length==1){
                toasterService.showWarning("Toggle Role","At least one administrator is required");
                return
            }
            userService.assignUsertoRole(user.name, role).success(
                function(data, status, headers) {
                     toasterService.showInfo("Toggle Role","User "+user.name+"'s" +" role is toggled successfully");
                    ctrl.refresh();
                });

        }

        ctrl.removeUser = function(user) {
            //check only minimum of one admin
            if(user.role==="admin" && ctrl.adminUsers.length==1){
                toasterService.showWarning("Remove User","At least one administrator is required");
                return
            }
            userService.removeUser(user.name).success(function(data, status, headers) {
                $log.info("user removed successfully");
                toasterService.showSuccess("Remove User","Removed User "+ user.name+" successfully");
                ctrl.refresh();
            });
        }
        ctrl.refresh();
    }
]);

module.factory('userService', ['$http', function($http) {
    var loadUsers = function(role) {
        var url = "/users"
        if (role) {
            url += "?role=" + role
        }
        return $http.get(url);
    };
    var removeUser = function(user) {
        return $http.delete("/users/" + user);
    };
    var assignUsertoRole = function(user, role) {
        return $http.put("/users/" + user + "/" + role);
    }
    return {
        loadUsers: function(role) {
            return loadUsers(role);
        },
        removeUser: function(user) {
            return removeUser(user);
        },
        assignUsertoRole: function(user, role) {
            return assignUsertoRole(user, role);
        }
    };
}]);