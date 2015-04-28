var module = angular.module('dashBoard.adminModule');
module.controller('AdminUserController', ['$scope', '$log', '$modal', 'ToasterService', 'userService',
    function($scope, $log, $modal, toasterService, userService) {
        var ctrl = this;

        ctrl.refresh = function() {
            ctrl.userNames = [];
            userService.loadUsers("admin").success(
                function(data, status, headers) {
                    ctrl.adminUsers = data;
                    var adminUserNames = []
                    for (var i = 0; i < ctrl.adminUsers.length; i++) {
                        var userName = ctrl.adminUsers[i].name
                        adminUserNames.push(userName)
                        ctrl.userNames.push(userName)
                    }
                    ctrl.countOwnedTokens(adminUserNames)
                }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
            userService.loadUsers("user").success(
                function(data, status, headers) {
                    ctrl.normalUsers = data;
                    var normalUserNames = []
                    for (var i = 0; i < ctrl.normalUsers.length; i++) {
                        var userName = ctrl.normalUsers[i].name;
                        normalUserNames.push(userName)
                        ctrl.userNames.push(userName)
                    }
                    ctrl.countOwnedTokens(normalUserNames)
                }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
        };
        ctrl.countOwnedTokens = function(ownerList) {
            userService.countOwnedTokens(ownerList).success(
                function(data, status, headers) {
                    if (!ctrl.tokenCount) {
                        ctrl.tokenCount = {};
                    }

                    for (var userName in data) {
                        if (data.hasOwnProperty(userName)) {
                            ctrl.tokenCount[userName] = data[userName];
                        }
                    }

                }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
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
            if (role === "user" && ctrl.adminUsers.length == 1) {
                toasterService.showWarning("Toggle Role", "At least one administrator is required");
                return
            }
            userService.assignUsertoRole(user.name, role).success(
                function(data, status, headers) {
                    toasterService.showInfo("Toggle Role", "User " + user.name + "'s" + " role is toggled successfully");
                    ctrl.refresh();
                }).error(function(data, status, headers, config) {
                                  toasterService.showError("Service Error", data);
                              });

        }

        ctrl.removeUser = function(user) {
            //check only minimum of one admin
            if (user.role === "admin" && ctrl.adminUsers.length == 1) {
                toasterService.showWarning("Remove User", "At least one administrator is required");
                return
            }
            userService.removeUser(user.name).success(function(data, status, headers) {
                $log.info("user removed successfully");
                toasterService.showSuccess("Remove User", "Removed User " + user.name + " successfully");
                ctrl.refresh();
            }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
        }

        ctrl.changeUserPasswordModal = function(userName) {
            $scope.newPassword = null;
            $scope.passwordChangeUserName = userName;
            var modalInstance = $modal.open({
                templateUrl: '/assets/adminModule/changeUserPassword.html',
                controller: function($scope, $modalInstance, userName) {
                    $scope.userName = userName
                    $scope.ok = function() {
                        $modalInstance.close($scope.password);
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: 'lg',
                resolve: {
                    userName: function() {
                        return $scope.passwordChangeUserName;
                    }
                }
            });
            modalInstance.result.then(function(password) {
                $scope.newPassword = password;
                ctrl.changeUserPassword($scope.passwordChangeUserName, $scope.newPassword);
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        ctrl.changeUserPassword = function(userName, password) {
            if (!userName) {
                toasterService.showError("Change Password", "Invalid User name");
                return;
            }
            if (!password) {
                toasterService.showError("Change Password", "Invalid password");
                return;
            }
            userService.changeUserPassword(userName, password).success(
                function(data, status, headers) {
                    toasterService.showSuccess("Change Password", "Changed password successfully for user  " + userName);
                }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
        };
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
    var changeUserPassword = function(userName, password) {
        return $http.put("/users/password/" + userName + "/" + password);
    };
    var assignUsertoRole = function(user, role) {
        return $http.put("/users/" + user + "/" + role);
    };
    var countOwnedTokens = function(ownerList) {
        var body = {}
        body.owners = ownerList
        return $http.post("/analytics/countOwnedTokens", body);
    };
    return {
        loadUsers: function(role) {
            return loadUsers(role);
        },
        removeUser: function(user) {
            return removeUser(user);
        },
        changeUserPassword: function(userName, password) {
            return changeUserPassword(userName, password);
        },
        assignUsertoRole: function(user, role) {
            return assignUsertoRole(user, role);
        },
        countOwnedTokens: function(ownerList) {
            return countOwnedTokens(ownerList);
        }
    };
}]);