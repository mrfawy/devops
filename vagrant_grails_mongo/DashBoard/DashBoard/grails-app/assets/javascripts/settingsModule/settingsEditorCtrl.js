var module = angular.module('dashBoard.settingsModule');
module.controller('SettingsEditorCtrl', ['$scope', '$log', 'ToasterService', 'SettingsService',
    function($scope, $log, toasterService, settingsService) {
        var ctrl = this;

        this.refresh = function() {
            settingsService.loadSettings($scope.env, $scope.app, $scope.userId)
                .success(function(data, status, headers) {
                    if (!data || data.code) {
                        ctrl.settings = null;
                    } else {
                        ctrl.settings = data;
                    }
                    $scope.editable = false;

                });
        };

        ctrl.editSettings = function() {
            $scope.editable=true;
            if($scope.clonedSettings){
                ctrl.cloneable=true;
            }
        }
        ctrl.saveSettings = function() {
            settingsService.saveSettings($scope.env, $scope.app, $scope.userId, ctrl.settings)
                .success(function(data, status, headers) {
                    toasterService.showSuccess('Save Settings', 'saved Settings successfully');
                    $log.info("saved Settings successfully");
                    $scope.editable = false;

                });
        };
        ctrl.clone = function(o) {
            return JSON.parse(JSON.stringify(o));
        }
        ctrl.cloneSettings = function() {
            $scope.clonedSettings = ctrl.clone(ctrl.settings);
            $scope.clonedSettingsApp=$scope.app
            toasterService.showInfo('Cloning', 'Cloned settings successfully');
        }
        ctrl.updateCloneableState=function(){
            if($scope.clonedSettings ==null ||  $scope.app!=$scope.clonedSettingsApp){
               //reset clone
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
                toasterService.showError('Cloning', "Can't clone to a different app");
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
        $scope.$watchGroup(['clonedSettings','editable'],function(newValues,oldValues,scope){
            if($scope.clonedSettings !=null && scope.editable ){
                $scope.cloneable=true;
            }
            else{
                $scope.cloneable=false;
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