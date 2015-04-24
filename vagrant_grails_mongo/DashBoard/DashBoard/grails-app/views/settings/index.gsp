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

        <div class="panel panel-info">
            <!-- Default panel contents -->
            <div class="panel-heading">
                <label> User Selection</label>
            </div>
            <div class="container ">
                <div class="row">
                    <form class="form">
                        <div class="form-group ">
                            <label class="control-label ">Environment</label>
                            <select ng-model="env" class="form-control " placeholder="Environment">
                                <option ng-repeat="env in ctrl.envs" value="{{env.name}}">
                                    {{env.name}}
                                </option>
                            </select>
                        </div>
                        <div class="form-group ">
                            <label class="control-label ">Application</label>
                            <select ng-model="app" class="form-control " placeholder="Application">
                                <option ng-repeat="app in ctrl.apps" value="{{app.name}}">
                                    {{app.name}}
                                </option>
                            </select>
                        </div>
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
                <div class="row">
                    <form class="form-inline">
                        <div class="form-group">
                            <input ng-model="ctrl.newUserId" type="text" class="form-control"
                                   placeholder="Create New UserId here"
                                   aria-describedby="basic-addon1"></input>

                            <button class="btn btn-primary" ng-click="ctrl.createUserId()"> Create</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>
    <div class="row" ng-show="userId!=null" ng-controller="SettingsEditorCtrl as settingsEditorCtrl">
        <div class="panel panel-info">
            <!-- Default panel contents -->
            <div class="panel-heading">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <label> {{userId |uppercase}}'s Settings</label>
                        </div>
                        <div class="col-md-6">
                            <div title="Edit Settings " class="col-md-1" ng-hide="editable" >
                                <a ng-click="settingsEditorCtrl.editSettings()" >
                                    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                </a>
                            </div>
                            <div title="Save Settings " class="col-md-1" ng-show="editable">
                                <a ng-click="settingsEditorCtrl.saveSettings()" >
                                    <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
                                </a>
                            </div>
                            <div title="Reload Settings " class="col-md-1" ng-show="editable">
                                <a ng-click="settingsEditorCtrl.refresh()" >
                                    <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                                </a>
                            </div>

                            <div title="Clone Settings " class="col-md-1" ng-hide="editable">
                                <a ng-click="settingsEditorCtrl.cloneSettings()" >
                                    <span class="glyphicon glyphicon-random" aria-hidden="true"></span>
                                </a>
                            </div>

                            <div title="Apply Cloned Settings " class="col-md-1" ng-show="cloneable">
                                <a ng-click="settingsEditorCtrl.applyClonedSettings()">
                                    <span class="glyphicon glyphicon-paste" aria-hidden="true"></span>

                                </a>
                            </div>


                        </div>
                    </div>

                </div>

            </div>
            <div class="container">
                Service(s) settings:
                <div ng-repeat="service in settingsEditorCtrl.settings.services">
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            <label>Service: {{service.name}}</label>
                        </div>
                        <div class="container-fluid">
                            <div ng-repeat="property in service.properties" class="row">
                                <label class="col-md-2">{{property.name}}</label>
                                <div class="col-md-6" ng-hide="settingsEditorCtrl.editable">{{property.value}}</div>
                                <input type="text" ng-model="property.value" class="col-md-10 form-control" ng-show="settingsEditorCtrl.editable"/>

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