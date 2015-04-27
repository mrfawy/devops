var app=angular.module('dashBoardApp')
app.factory('ToasterService', ['toaster', function(toaster) {
    var showInfo = function(title, body) {
        popup('info',title,body);
    };
     var showSuccess = function(title, body) {
            popup('success',title,body);
        };
     var showError = function(title, body) {
            popup('error',title,body);
     };
      var showWarning = function(title, body) {
             popup('warning',title,body);
         };
    var popup=function(type,title,body){
        toaster.pop({
                                "type": type,
                                "title": title,
                                "body": body,
                                showCloseButton: true
                            });
    }
    var saveSettings = function(env, app, token, settings) {
        return $http.put("/settings/" + env + "/" + app + "/" + token, settings);
    };
    return {
        showInfo: function(title,body) {
            return showInfo(title, body);
        },
        showSuccess: function(title,body) {
                    return showSuccess(title, body);
                },
        showWarning: function(title,body) {
                    return showWarning(title, body);
                },
        showError: function(title,body) {
                    return showError(title, body);
                }
    };
}]);