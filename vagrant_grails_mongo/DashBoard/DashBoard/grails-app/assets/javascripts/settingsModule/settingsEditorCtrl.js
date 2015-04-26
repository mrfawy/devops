var module = angular.module('dashBoard.settingsModule');
module.controller('SettingsEditorCtrl', ['$scope', '$log', 'ToasterService', 'SettingsService','ServicePropertiesValuesService',
    function($scope, $log, toasterService, settingsService,servicePropertiesValuesService) {
        var ctrl = this;
        ctrl.propertyValues={}
        ctrl.propertyValues.values=[]

        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

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
        ctrl.checkPropertiesValues=function(app,service,property){
            if(!ctrl.propertyValues){
                ctrl.propertyValues={}
                ctrl.propertyValues.service=service
                ctrl.propertyValues.app=app
                 servicePropertiesValuesService.loadServiceProperties(app, service)
                                .success(function(data, status, headers) {
                                    ctrl.propertyValues.values=data
                                });
            }
            else{
                if(ctrl.propertyValues.service!=service ||ctrl.propertyValues.app!=app){
                    ctrl.propertyValues={}
                                    ctrl.propertyValues.service=service
                                    ctrl.propertyValues.app=app
                                     servicePropertiesValuesService.loadServiceProperties(app, service)
                                                    .success(function(data, status, headers) {
                                                        ctrl.propertyValues.values=data
                                                    });
                }
                //else do nothing
            }
        }
        ctrl.loadPropertiesValues=function(app,service){
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

module.factory('ServicePropertiesValuesService', ['$http', function($http) {
    var loadServiceProperties = function(app, service) {
        return $http({
            method: 'GET',
            url: "/analytics/values/"+app+"/"+ service
        });
    };

    return {
        loadServiceProperties: function(app, service) {
            return loadServiceProperties(app, service);
        }
    };
}]);