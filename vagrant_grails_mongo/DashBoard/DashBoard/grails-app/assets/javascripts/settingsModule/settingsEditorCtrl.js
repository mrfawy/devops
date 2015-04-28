var module = angular.module('dashBoard.settingsModule');
module.controller('SettingsEditorCtrl', ['$scope', '$log', '$modal', 'ToasterService', 'SettingsService', 'SessionService', 'ServicePropertiesValuesService',
    function($scope, $log, $modal, toasterService, settingsService, sessionService, servicePropertiesValuesService) {
        var ctrl = this;
        ctrl.serviceCollapsed = []
        ctrl.propertyValues = {}
        ctrl.propertyValues.values = []

        sessionService.loadSessionData().success(
            function(data, status, headers) {
                $scope.owner = data.session.userName;
                $scope.isAdmin = data.session.isAdmin;

                $log.info("owner: " + $scope.owner)
                $log.info("isAdmin: " + $scope.isAdmin)
            }).error(function(data, status, headers, config) {
            toasterService.showError("Service Error", data);
        });

        ctrl.refresh = function() {
            settingsService.loadSettings($scope.env, $scope.app, $scope.token)
                .success(function(data, status, headers) {
                    if (!data || data.code) {
                        ctrl.settings = null;
                    } else {
                        ctrl.settings = data;
                        for (var i = 0; i < ctrl.settings.services.length; i++) {
                            ctrl.serviceCollapsed[ctrl.settings.services[i].name] = true;
                        }

                    }
                    $scope.editable = false;

                }).error(function(data, status, headers, config) {
                    toasterService.showError("Service Error", data);
                });
        };

        ctrl.updateEditableState = function() {
            if ($scope.tokenOwner === $scope.owner || $scope.isAdmin) {
                $scope.canEdit = true;
            } else {
                $scope.canEdit = false;
            }
        }

        ctrl.editSettings = function() {
            $scope.editable = true;
            if ($scope.clonedSettings) {
                ctrl.cloneable = true;
            }
        }
        ctrl.saveSettings = function() {
            settingsService.saveSettings($scope.env, $scope.app, $scope.token, ctrl.settings)
                .success(function(data, status, headers) {
                    toasterService.showSuccess('Save Settings', 'saved Settings successfully');
                    $log.info("saved Settings successfully");
                    $scope.editable = false;

                }).error(function(data, status, headers, config) {
                    toasterService.showError("Service Error", data);
                });
        };
        ctrl.clone = function(o) {
            return JSON.parse(JSON.stringify(o));
        }
        ctrl.cloneSettings = function() {
            $scope.clonedSettings = ctrl.clone(ctrl.settings);
            $scope.clonedSettingsApp = $scope.app
            toasterService.showInfo('Cloning', 'Cloned settings successfully');
        }
        ctrl.updateCloneableState = function() {
            if ($scope.clonedSettings == null || $scope.app != $scope.clonedSettingsApp) {
                //reset clone
                $scope.clonedSettings = null;
                $scope.clonedSettingsApp = null;
            }

        }

        ctrl.applyClonedSettings = function() {
            if ($scope.clonedSettings) {
                if ($scope.clonedSettings.app === ctrl.settings.app) {
                    var clone = ctrl.clone($scope.clonedSettings);
                    clone.env = ctrl.settings.env;
                    clone.token = ctrl.settings.token;
                    ctrl.settings = clone;
                }
            } else {
                toasterService.showError('Cloning', "Can't clone to a different app");
                $log.error("can't clone to different app");
            }
        }
        ctrl.checkPropertiesValues = function(app, service, property) {
            if (!ctrl.propertyValues) {
                ctrl.propertyValues = {}
                ctrl.propertyValues.service = service
                ctrl.propertyValues.app = app
                servicePropertiesValuesService.loadServiceProperties(app, service)
                    .success(function(data, status, headers) {
                        ctrl.propertyValues.values = data
                    }).error(function(data, status, headers, config) {
                        toasterService.showError("Service Error", data);
                    });
            } else {
                if (ctrl.propertyValues.service != service || ctrl.propertyValues.app != app) {
                    ctrl.propertyValues = {}
                    ctrl.propertyValues.service = service
                    ctrl.propertyValues.app = app
                    servicePropertiesValuesService.loadServiceProperties(app, service)
                        .success(function(data, status, headers) {
                            ctrl.propertyValues.values = data
                        }).error(function(data, status, headers, config) {
                            toasterService.showError("Service Error", data);
                        });
                }
                //else do nothing
            }
        }
        ctrl.getActiveToken = function() {
            if ($scope.token != null && $scope.tokens != null) {
                var selectedToken = null;
                for (var i = 0; i < $scope.tokens.length; i++) {
                    if ($scope.tokens[i].token === $scope.token) {
                        return $scope.tokens[i];
                    }
                }
            }
            return null;
        }
        ctrl.exportSettings = function() {
            $scope.selectedToken = ctrl.getActiveToken();
            //show modal containing settings data in JSON
            if ($scope.selectedToken) {
                var modalInstance = $modal.open({
                    templateUrl: '/assets/settingsModule/exportSettingsTemplate.html',
                    controller: function($scope, $modalInstance, token, settings) {
                        $scope.token = token;
                        $scope.settings = settings;
                        $scope.suggestedFileName = token.env + "_" + token.app + "_" + token.token + ".json"
                        $scope.ok = function() {
                            $modalInstance.close();
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    size: 'lg',
                    resolve: {
                        token: function() {
                            return $scope.selectedToken;
                        },
                        settings: function() {
                            return ctrl.settings;
                        }

                    }
                });

            }


        }
        ctrl.importSettings = function() {
            $scope.importedToken = null;
            $scope.tobeReplacedToken = ctrl.getActiveToken();
            var modalInstance = $modal.open({
                templateUrl: '/assets/settingsModule/importSettingsTemplate.html',
                controller: function($scope, $modalInstance, tobeReplacedToken) {
                    $scope.importedTokenJsonStr = ""
                    $scope.suggestedFileName = tobeReplacedToken.env + "_" + tobeReplacedToken.app + "_" + tobeReplacedToken.token + ".json"
                    $scope.ok = function() {
                        $modalInstance.close($scope.importedTokenJsonStr);
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: 'lg',
                resolve: {
                    tobeReplacedToken: function() {
                        return $scope.tobeReplacedToken;
                    }
                }
            });
            modalInstance.result.then(function(importedTokenJsonStr) {
                $scope.importedTokenJsonStr = importedTokenJsonStr;
                $log.info('Modal dismissed with : ' + $scope.importedTokenJsonStr);
                $log.info("merging ......")
                ctrl.merge(ctrl.settings, $scope.importedTokenJsonStr)
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        ctrl.merge = function(targetToken, importedTokenJsonStr) {
            //check if valid JSON format
            var sourceToken = null;
            try {
                sourceToken = JSON.parse(importedTokenJsonStr)
            } catch (e) {
                toasterService.showError("Merge Settings", "Settings are not in a valid JSON format.")
                $log.error("Settings are not in a valid JSON format.");
                return;
            }
            try {
                //match service name
                for (var i = 0; i < targetToken.services.length; i++) {
                    for (var j = 0; j < sourceToken.services.length; j++) {
                        //matching service found
                        if (targetToken.services[i].name === sourceToken.services[j].name) {
                            $log.info("matching service found : " + targetToken.services[i].name)
                            for (var m = 0; m < targetToken.services[i].properties.length; m++) {
                                for (var n = 0; n < sourceToken.services[j].properties.length; n++) {
                                    var targetProp = targetToken.services[i].properties[m];
                                    var sourceProp = sourceToken.services[j].properties[n];
                                    //matching property found
                                    if (targetProp.name === sourceProp.name) {
                                        $log.info("matching Property found : " + targetProp.name)
                                        targetProp.value = sourceProp.value;
                                    }
                                }
                            }
                        }
                    }
                }
                toasterService.showSuccess("Merge Settings", "Merged settings successfully")
            } catch (e) {
                $log.error(e)
                toasterService.showError("Merge Settings", "Merge Failed , check log for details")
            }


        }


        $scope.$watchGroup(['app', 'env', 'token'], function(newValues, oldValues, scope) {
            if (scope.token != null && scope.env != null && scope.app != null) {
                ctrl.refresh();
                ctrl.updateCloneableState();
                ctrl.updateEditableState();
            } else {
                ctrl.settings = null;
            }

        });
        $scope.$watchGroup(['clonedSettings', 'editable'], function(newValues, oldValues, scope) {
            if ($scope.clonedSettings != null && scope.editable) {
                $scope.cloneable = true;
            } else {
                $scope.cloneable = false;
            }
        });
    }
]);

module.factory('SettingsService', ['$http', function($http) {
    var loadSettings = function(env, app, token) {
        return $http({
            method: 'GET',
            url: "/settings/" + env + "/" + app + "/" + token
        });
    };
    var saveSettings = function(env, app, token, settings) {
        return $http.put("/settings/" + env + "/" + app + "/" + token, settings);
    };
    return {
        loadSettings: function(env, app, token) {
            return loadSettings(env, app, token);
        },
        saveSettings: function(env, app, token, settings) {
            return saveSettings(env, app, token, settings);
        },
    };
}]);

module.factory('ServicePropertiesValuesService', ['$http', function($http) {
    var loadServiceProperties = function(app, service) {
        return $http({
            method: 'GET',
            url: "/analytics/values/" + app + "/" + service
        });
    };

    return {
        loadServiceProperties: function(app, service) {
            return loadServiceProperties(app, service);
        }
    };
}]);