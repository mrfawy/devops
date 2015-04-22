<html>
<head>
    <meta name="layout" content="main"/>
</head>
<body>

<div ng-controller="AdminEnvController as ctrl">
    <h2>Environments</h2>
    <div ng-repeat="env in ctrl.envs">
        {{env.name}}
        <button ng-click="ctrl.removeEnv(env.name)">remove</button>
    </div>
    <input ng-model="ctrl.newEnv"/>  <button ng-click="ctrl.createEnv(ctrl.newEnv)">create</button>

</div>


<div ng-controller="AdminAppController as ctrl">
    <h2>Apps</h2>
    <div ng-repeat="app in ctrl.apps">
        {{app.name}}
        <button ng-click="ctrl.removeApp(app.name)">remove</button>
    </div>
    <button ng-click="ctrl.createApp()">create</button>
    <button ng-click="ctrl.reset()">reset</button>
    <input ng-model="ctrl.newApp.name"></input>
    <textarea ng-model="ctrl.newApp.services"></textarea>


</div>

<div  ng-controller="AdminUserController as ctrl">
    <h2>Users</h2>
    Admins:
    <div ng-repeat="user in ctrl.adminUsers">
        {{user.name}}
        <button ng-click="ctrl.toggleRole(user)">toggle Role</button>
        <button ng-click="ctrl.removeUser(user.name)">Remove</button>
    </div>

    Users:
    <div ng-repeat="user in ctrl.normalUsers">
        {{user.name}}
        <button ng-click="ctrl.toggleRole(user)">toggle Role</button>
        <button ng-click="ctrl.removeUser(user.name)">Remove</button>
    </div>
</div>
</body>
</html>