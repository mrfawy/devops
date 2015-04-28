var module = angular.module('dashBoard.adminModule');
module.controller('AdminAppController', ['$scope', '$log', 'ToasterService', 'appService',
    function($scope, $log, toasterService, appService) {
        var ctrl = this;
        ctrl.selectedApp = null;
        ctrl.setSelectedApp = function(app) {
            ctrl.selectedApp = app
        }
        ctrl.refresh = function() {
            appService.loadApps().success(
                function(data, status, headers) {

                    ctrl.apps = data;
                }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
        };
        ctrl.reset = function() {
            ctrl.newApp = {}
            ctrl.newApp.name = null
            services = []
            var service1 = {}
            service1.name = "YOUR_SERVICE_NAME_HERE"
            service1.properties = []
            var prop = {
                name: "PROPERTY_NAME_HERE",
                value: ""
            }
            service1.properties.push(prop)
            service1.properties.push(prop)

            services.push(service1)
            services.push(service1)
            ctrl.newApp.services = JSON.stringify(services, null, "\t")
            ctrl.createAppMode = false;


        };
        ctrl.createNewApp = function() {
            ctrl.createAppMode = true;
        }
        ctrl.createApp = function() {
            var app = {}
                //validate new App
            if (!ctrl.newApp) {
                toasterService.showWarning("Create Application", "Application is missing")
                $log.error("ctrl.newApp doesn't exist");
                return;
            }
            if (!ctrl.newApp.name) {
                toasterService.showWarning("Create Application", "Application name is missing")
                $log.error("Application name is missing");
                return;
            }
            if (ctrl.newApp.name.indexOf(' ') > 0) {
                toasterService.showWarning("Create Application", "Application name can't contain spaces")
                $log.error("Application name can't contain spaces");
                return;
            }
            app.name = ctrl.newApp.name;
            try {
                app.services = JSON.parse(ctrl.newApp.services)
            } catch (e) {
                toasterService.showWarning("Create Application", "Application Services is not in a valid JSON format.")
                $log.error("Application Services is not a valid JSON format.");
                return;
            }
            //check no service or propertName has spaces
            for (var i = 0; i < app.services.length; i++) {
                if (app.services[i].name.indexOf(" ") > 0) {
                    toasterService.showWarning("Create Application", "Service name can't contain spaces. Check " + app.services[i].name)
                    return;
                }
                for (var j = 0; j < app.services[i].properties.length; j++) {
                    if (app.services[i].properties[j].name.indexOf(" ") > 0) {
                        toasterService.showWarning("Create Application", "Property name can't contain spaces. Check " + app.services[i].properties[j].name)
                        return;
                    }
                }
            }
            appService.createApp(app.name, app).success(
                function(data, status, headers) {
                    toasterService.showSuccess("Create Application", "Application " + app.name + " is created successfully");
                    $log.info("app created successfully");
                    ctrl.createAppMode = false;
                    ctrl.refresh();
                }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
        }
        ctrl.removeApp = function(appName) {
            appService.removeApp(appName).success(function(data, status, headers) {
                toasterService.showSuccess("Remove Application", "Application " + appName + " is removed successfully");
                $log.info("app removed successfully");
                ctrl.refresh();
            }).error(function(data, status, headers, config) {
                toasterService.showError("Service Error", data);
            });
        }
        ctrl.refresh();
        ctrl.reset();
    }
]);

module.factory('appService', ['$http', function($http) {
    var loadApps = function() {
        return $http.get("/apps");
    };
    var removeApp = function(appName) {
        return $http.delete("/apps/" + appName);
    };
    var createApp = function(appName, app) {
        return $http.post("/apps/" + appName, app);
    }
    return {
        loadApps: function() {
            return loadApps();
        },
        removeApp: function(appName) {
            return removeApp(appName);
        },
        createApp: function(appName, app) {
            return createApp(appName, app);
        },
    };
}]);