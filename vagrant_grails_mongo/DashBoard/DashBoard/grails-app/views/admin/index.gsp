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
                    <h1>Admin Console</h1>
                </div>


            </div>
        </div>
    </div>
    <div class="row">
        <tabset>
            <tab heading="Environment">
                <div ng-controller="AdminEnvController as ctrl">
                    <h2>Environments</h2>
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th>Environment</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ng-repeat="env in ctrl.envs">
                            <td>{{env.name}}</td>
                            <td>
                                <button ng-click="ctrl.removeEnv(env.name)" class="btn btn-danger"
                                        tooltip-placement="right"
                                        tooltip="Will remove {{env.name}} and all it's settings as well.">remove
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>


                    <a href="#" ng-hide="ctrl.envCreationMode" ng-click="ctrl.createNewEnv()"> Create new environment ?</a>

                <div ng-show="ctrl.envCreationMode">
                    <h3>New Environment</h3>
                    <form class="form-inline">
                        <div class="form-group ">
                            <input ng-model="ctrl.newEnv" type="text" class="form-control"
                                   placeholder="Environment Name "
                                   aria-describedby="basic-addon1"></input>
                            <button class="btn btn-primary form-control" ng-click="ctrl.createEnv(ctrl.newEnv)"> Create
                            </button>
                        </div>
                    </form>

                </div>

                </div>


            </tab>
            <tab heading="Application">
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
            </tab>
            <tab heading="User">
                <div ng-controller="AdminUserController as ctrl">
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
            </tab>
        </tabset>
    </div>
</div>


</body>
</html>