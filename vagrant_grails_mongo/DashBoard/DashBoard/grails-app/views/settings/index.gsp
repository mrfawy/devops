<html>
<head>
    <meta name="layout" content="main"/>
</head>
<body>
<div class="container" ng-controller="SelectEnvAppCtrl as ctrl">
    <div class="row">
        <div class="col-sm-10">
            <div class="jumbotron-info">
                <div>
                    <h1>Settings</h1>
                </div>


            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <div class="panel panel-info">
                <!-- Default panel contents -->
                <div class="panel-heading">
                    <label> User Selection</label>
                </div>
                <div class="container-fluid ">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="col-xs-4">
                                <form class="form">
                                    <div class="form-group ">
                                        <label class="control-label ">Environment</label>
                                        <select ng-model="env" class="form-control " placeholder="Environment">
                                            <option ng-repeat="env in ctrl.envs" value="{{env.name}}">
                                                {{env.name}}
                                            </option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div class="col-xs-4">
                                <form class="form">
                                    <div class="form-group ">
                                        <label class="control-label ">Application</label>
                                        <select ng-model="app" class="form-control " placeholder="Application">
                                            <option ng-repeat="app in ctrl.apps" value="{{app.name}}">
                                                {{app.name}}
                                            </option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div class="col-xs-4">
                                <form class="form">
                                    <div class="form-group ">
                                        <label class="control-label">UserId</label>
                                        <select ng-model="userId" class="form-control" placeholder="UserId">
                                            <option ng-repeat="user in ctrl.userIds" value="{{user.userId}}">
                                                {{user.userId}}
                                            </option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-xs-12">
                            <div class="col-xs-4" ng-hide="ctrl.userIdCreationMode">
                                <a href="#" ng-click="ctrl.createNewUserId()"> Create new userId ?</a>
                            </div>
                            <div class="col-xs-4" ng-show="ctrl.userIdCreationMode">
                                <form class="form">
                                    <div class="form-group ">
                                        <input ng-model="ctrl.newUserId" type="text" class="form-control"
                                               placeholder="Enter New UserId "
                                               aria-describedby="basic-addon1"></input>
                                        <button class="btn btn-primary form-control" ng-click="ctrl.createUserId()">
                                            Create
                                        </button>
                                    </div>

                                </form>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
    <div class="row" ng-show="userId!=null" ng-controller="SettingsEditorCtrl as settingsEditorCtrl">
        <div class="col-xs-12">
            <div class="panel panel-info">
                <!-- Default panel contents -->
                <div class="panel-heading">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6">
                                <label> {{userId |uppercase}}'s Settings</label>
                            </div>
                            <div class="col-md-6">
                                <div class="col-md-1" popover="Edit settings" popover-trigger="mouseenter"
                                     ng-hide="editable">
                                    <a ng-click="settingsEditorCtrl.editSettings()">
                                        <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    </a>
                                </div>
                                <div class="col-md-1" popover="Save settings" popover-trigger="mouseenter"
                                     ng-show="editable">
                                    <a ng-click="settingsEditorCtrl.saveSettings()">
                                        <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
                                    </a>
                                </div>
                                <div class="col-md-1" popover="Refresh settings" popover-trigger="mouseenter"
                                     ng-show="editable">
                                    <a ng-click="settingsEditorCtrl.refresh()">
                                        <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                                    </a>
                                </div>

                                <div class="col-md-1" popover="Clone settings" popover-trigger="mouseenter"
                                     ng-hide="editable">
                                    <a ng-click="settingsEditorCtrl.cloneSettings()">
                                        <span class="glyphicon glyphicon-random" aria-hidden="true"></span>
                                    </a>
                                </div>

                                <div class="col-md-1" popover="Apply cloned settings" popover-trigger="mouseenter"
                                     ng-show="cloneable">
                                    <a ng-click="settingsEditorCtrl.applyClonedSettings()">
                                        <span class="glyphicon glyphicon-paste" aria-hidden="true"></span>

                                    </a>
                                </div>


                            </div>
                        </div>

                    </div>

                </div>

                <div class="row">
                    <div class="col-xs-12">
                        <div class="row " ng-repeat="service in settingsEditorCtrl.settings.services">
                            <div class="col-xs-12">
                                <table class="table table-hover service-table" ng-hide="editable">
                                    <thead>
                                    <tr>
                                        <th colspan="2">{{service.name}}</th>
                                    </tr>
                                    </thead>
                                    <tr ng-repeat="property in service.properties">
                                        <th>{{property.name}}</th>
                                        <td>{{property.value}}</td>
                                    </tr>
                                </table>

                                <div class="panel panel-info" ng-show="editable" >
                                    <div class="panel-heading" ng-click="settingsEditorCtrl.serviceCollapsed[service.name]=!settingsEditorCtrl.serviceCollapsed[service.name]">
                                        <label>Service: {{service.name}}</label>
                                    </div>
                                    <div class="col-xs-12">
                                        <form class="form" collapse="settingsEditorCtrl.serviceCollapsed[service.name]">
                                            <div class="form-group" ng-repeat="property in service.properties" >
                                                <label class="control-label">{{property.name}}</label>
                                                <input type="text" ng-model="property.value" typeahead="val for val in settingsEditorCtrl.propertyValues.values[property.name] | filter:$viewValue "
                                                       class="form-control"
                                                       ng-show="editable" ng-focus="settingsEditorCtrl.checkPropertiesValues(app,service.name,property.name)"/>
                                            </div>

                                        </form>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </div>


    </div>
</div>

</body>
</html>