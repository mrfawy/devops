var module = angular.module('dashBoard.adminModule');
module.controller('AdminUserController', ['$scope', '$log','ToasterService', 'userService',
    function($scope, $log,toasterService, userService) {
        var ctrl = this;


        ctrl.refresh = function() {
            ctrl.userNames=[];
            userService.loadUsers("admin").success(
                function(data, status, headers) {
                    ctrl.adminUsers = data;
                    var adminUserNames=[]
                    for(var i=0;i<ctrl.adminUsers.length;i++){
                        var userName=ctrl.adminUsers[i].name
                        adminUserNames.push(userName)
                        ctrl.userNames.push(userName)
                    }
                    ctrl.countOwnedTokens(adminUserNames)
                });
            userService.loadUsers("user").success(
                function(data, status, headers) {
                    ctrl.normalUsers = data;
                    var normalUserNames=[]
                     for(var i=0;i<ctrl.normalUsers.length;i++){
                        var userName=ctrl.normalUsers[i].name;
                        normalUserNames.push(userName)
                                            ctrl.userNames.push(userName)
                                        }
                                        ctrl.countOwnedTokens(normalUserNames)
                });
        };
        ctrl.countOwnedTokens=function(ownerList){
            userService.countOwnedTokens(ownerList).success(
                            function(data, status, headers) {
                            if(!ctrl.tokenCount){
                                ctrl.tokenCount={};
                            }

                                for (var userName in data) {
                                  if (data.hasOwnProperty(userName)) {
                                    ctrl.tokenCount[userName]=data[userName];
                                  }
                                }

                            });
        }
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
    };
    var countOwnedTokens=function(ownerList){
         var body={}
         body.owners=ownerList
         return $http.post("/analytics/countOwnedTokens",body);
    };
    return {
        loadUsers: function(role) {
            return loadUsers(role);
        },
        removeUser: function(user) {
            return removeUser(user);
        },
        assignUsertoRole: function(user, role) {
            return assignUsertoRole(user, role);
        },
        countOwnedTokens:function(ownerList){
            return countOwnedTokens(ownerList);
        }
    };
}]);

