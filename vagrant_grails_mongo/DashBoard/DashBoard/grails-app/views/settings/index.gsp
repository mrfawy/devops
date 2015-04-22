<html>
<head>
    <meta name="layout" content="main"/>
</head>
<body>
<div ng-controller="SelectEnvAppCtrl as ctrl">

    <select ng-model="env">
        <option ng-repeat="env in ctrl.envs" value="{{env.name}}">
            {{env.name}}
        </option>
    </select>

    <select ng-model="app">
        <option ng-repeat="app in ctrl.apps" value="{{app.name}}">
            {{app.name}}
        </option>
    </select>

    <select ng-model="userId">
        <option ng-repeat="user in ctrl.userIds" value="{{user.userId}}">
            {{user.userId}}
        </option>
    </select>

    <div>
        Create New UserId
        <div>
            <input ng-model="ctrl.newUserId"/>
            <button ng-click="ctrl.createUserId()">create UserId</button>
        </div>
    </div>

    <div ng-controller="SettingsEditorCtrl as settingsEditorCtrl">
        <h2>Settings</h2>
        <button ng-click="settingsEditorCtrl.saveSettings()">Save </button>
        <button ng-click="settingsEditorCtrl.refresh()">Reset </button>
        <button ng-click="settingsEditorCtrl.cloneSettings()">clone </button>
        <button ng-click="settingsEditorCtrl.applyClonedSettings()">paste </button>
        <div ng-repeat="service in settingsEditorCtrl.settings.services">
            <h4>Service : {{service.name}}</h4>
            <div ng-repeat="property in service.properties">
                Name:{{property.name}}
                Value:<input type="text" ng-model="property.value"/>
            </div>
        </div>
        {{settingsEditorCtrl.settings}}
    </div>





</div>

</body>
</html>