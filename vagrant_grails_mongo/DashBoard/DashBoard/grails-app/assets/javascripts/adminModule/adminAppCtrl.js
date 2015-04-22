var module = angular.module('dashBoard.adminModule');
module.controller('AdminAppController', ['$scope', '$log', 'appService',
    function($scope, $log, appService) {
        var ctrl = this;
        ctrl.refresh = function() {
            appService.loadApps().success(
                function(data, status, headers) {

                    ctrl.apps = data;
                });
        };
        ctrl.reset=function(){
            ctrl.newApp={}
            ctrl.newApp.name="app name here"

            services=[]
            var service1={}
            service1.name="YOUR_SERVICE_NAME_HERE"
            service1.properties=[]
            var prop={name:"PROPERTY_NAME_HERE",value:""}
            service1.properties.push(prop)
            service1.properties.push(prop)

            services.push(service1)
            services.push(service1)
            ctrl.newApp.services=JSON.stringify(services,null,"\t")


        };
        ctrl.createApp = function() {
            if(!ctrl.newApp){
                $log.error("ctrl.newApp doesn't exist");
                return;
            }
            var app={}
            app.name=ctrl.newApp.name;
            app.services=JSON.parse(ctrl.newApp.services)
            appService.createApp(ctrl.newApp.name,app).success(
                function(data, status, headers) {
                    $log.info("app created successfully");
                    ctrl.refresh();
                });
        }
        ctrl.removeApp = function(appName) {
            appService.removeApp(appName).success(function(data, status, headers) {
                $log.info("app removed successfully");
                ctrl.refresh();
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
    var createApp = function(appName,app) {
        return $http.post("/apps/"+ appName,app);
    }
    return {
        loadApps: function() {
            return loadApps();
        },
        removeApp: function(appName) {
            return removeApp(appName);
        },
        createApp: function(appName,app) {
            return createApp(appName,app);
        },
    };
}]);