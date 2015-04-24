var module = angular.module('dashBoard.settingsModule');
module.controller('SettingsEditorCtrl', ['$scope', '$log', 'toaster', 'SettingsService',
    function($scope, $log, toaster, settingsService) {
        var ctrl = this;
        ctrl.toast = function(type, title, body) {
            toaster.pop({
                "type": type,
                "title": title,
                "body": body,
                showCloseButton: true
            });
        };

        this.refresh = function() {
            settingsService.loadSettings($scope.env, $scope.app, $scope.userId)
                .success(function(data, status, headers) {
                    if (!data || data.code) {
                        ctrl.settings = null;
                    } else {
                        ctrl.settings = data;
                    }
                    ctrl.editable = false;
                    ctrl.toast('success', 'Loading', 'data loaded successfully');
                    ctrl.updateCloneableState()

                });
        };

        ctrl.editSettings = function() {
            ctrl.editable=true;
           ctrl.toast('success', 'Loading', 'data loaded successfully');
            if($scope.clonedSettings!=null){
                ctrl.cloneable=true;
            }
        }
        ctrl.saveSettings = function() {
            settingsService.saveSettings($scope.env, $scope.app, $scope.userId, ctrl.settings)
                .success(function(data, status, headers) {
                    $log.info("saved Settings successfully");
                    ctrl.editable = false;

                });
        };
        ctrl.clone = function(o) {
            return JSON.parse(JSON.stringify(o));
        }
        ctrl.cloneSettings = function() {
            $scope.clonedSettings = ctrl.clone(ctrl.settings);
            $scope.clonedSettingsApp=$scope.app
            ctrl.toast('info', 'Cloning', 'Cloned settings successfully');
        }
        ctrl.updateCloneableState=function(){
            if($scope.clonedSettings && $scope.app===$scope.clonedSettingsApp){
               //keep clone , do nothing
            }
            else{
                $scope.clonedSettings=null;
                $scope.clonedSettingsApp=null;
            }
        }
        ctrl.applyClonedSettings = function() {
            if ($scope.clonedSettings) {
                if ($scope.clonedSettings.app === ctrl.settings.app) {
                    var clone = ctrl.clone($scope.clonedSettings);
                    clone.env = ctrl.settings.env;
                    clone.userId = ctrl.settings.userId;
                    ctrl.settings = clone;

                }
            } else {
                $log.error("can't clone to different app");
            }
        }

        $scope.$watchGroup(['app', 'env', 'userId'], function(newValues, oldValues, scope) {
            if (scope.userId != null && scope.env != null && scope.app != null) {
                ctrl.refresh();
                ctrl.updateCloneableState();
            } else {
                ctrl.settings = null;
            }

        });
    }
]);

module.factory('SettingsService', ['$http', function($http) {
    var loadSettings = function(env, app, userId) {
        return $http({
            method: 'GET',
            url: "/settings/" + env + "/" + app + "/" + userId
        });
    };
    var saveSettings = function(env, app, userId, settings) {
        return $http.put("/settings/" + env + "/" + app + "/" + userId, settings);
    };
    return {
        loadSettings: function(env, app, userId) {
            return loadSettings(env, app, userId);
        },
        saveSettings: function(env, app, userId, settings) {
            return saveSettings(env, app, userId, settings);
        },
    };
}]);