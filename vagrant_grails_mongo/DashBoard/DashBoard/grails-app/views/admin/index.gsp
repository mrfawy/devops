<html>
<head>
    <meta name="layout" content="main"/>
</head>
<body>
<div class="container" ng-controller="SelectEnvAppCtrl as ctrl">
    <div class="row">
        <div class="col-xs-12">
            <nav class="navbar navbar-default ">

                <div class="navbar-header">
                    <a id="home" class="navbar-brand" href="#">Welcome {{owner}}</a>
                </div>
                <div class="collapse navbar-collapse navHeaderCollapse">

                    <ul class="nav navbar-nav navbar-right">
                        <li>
                            <g:link controller="settings" action="index">
											<span class="glyphicon glyphicon-list-alt"
                                                  aria-hidden="true"></span>  Settings
                            </g:link>
                        </li>

                        <li>
                            <g:link controller="authentication" action="logout">
											<span class="glyphicon glyphicon-log-out btnIcon "
                                                  aria-hidden="true"></span>  Sign out
                            </g:link>
                        </li>

                    </ul>

                </div>
            </nav>

        </div>

    </div>
    <div class="row">
        <div class="col-sm-10">
            <div class="jumbotron-info">
                <div class="page-header">
                    <h1>Admin Console
                        <small>Dashboard Administration tasks</small>
                    </h1>
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


                    <a href="#" ng-hide="ctrl.envCreationMode" ng-click="ctrl.createNewEnv()"> Create new environment
                        ?</a>

                    <div ng-show="ctrl.envCreationMode">
                        <h3>New Environment</h3>

                        <form class="form-inline">
                            <div class="form-group ">
                                <input ng-model="ctrl.newEnv" type="text" class="form-control"
                                       placeholder="Environment Name "
                                       aria-describedby="basic-addon1"></input>
                                <button class="btn btn-primary form-control" ng-click="ctrl.createEnv(ctrl.newEnv)">
                                    Create
                                </button>
                            </div>
                        </form>

                    </div>

                </div>


            </tab>
            <tab heading="Application">
                <div ng-controller="AdminAppController as ctrl">
                    <h2>Applications</h2>
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th>Application</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ng-repeat="app in ctrl.apps" ng-class="{'active': app==ctrl.selectedApp}"
                            ng-click="ctrl.setSelectedApp(app)">
                            <td>{{app.name}}</td>
                            <td>
                                <button ng-click="ctrl.removeApp(app.name)" class="btn btn-danger"
                                        tooltip-placement="right"
                                        tooltip="Will remove {{app.name}} and all it's settings as well.">remove
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="col-xs-12" ng-hide="ctrl.createAppMode">
                        <a href="#" ng-click="ctrl.createNewApp()"> Create new Application ?</a>
                    </div>
                    <div class="col-xs-12" ng-show="ctrl.createAppMode">
                        <div class="panel panel-danger">
                            <div class="panel-heading">Create new Application</div>
                            <div class="panel-body">
                                <div class="col-xs-12">
                                    <form class="form">
                                        <div class="alert alert-danger" role="alert">
                                            <strong>Warning!</strong>
                                            Invalid settings could result in application failure.Please check with app
                                            developers for valid values.
                                        </div>
                                        <div class="form-group ">
                                            <label>Name</label>
                                            <input class="form-control" placeholder="Enter application name "
                                                   aria-describedby="basic-addon1" ng-model="ctrl.newApp.name"></input>
                                        </div>
                                        <div class="form-group ">
                                            <label>Services</label>
                                            <textarea class="form-control editor"
                                                      ng-model="ctrl.newApp.services"></textarea>

                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="panel-footer panel-danger">
                                <button class="btn btn-primary" ng-click="ctrl.createApp()">Create</button>
                                <button class="btn btn-success" ng-click="ctrl.reset()">Cancel</button>
                            </div>
                        </div>
                    </div>


                </div>
            </tab>
            <tab heading="User">
                <div ng-controller="AdminUserController as ctrl">
                    <h2>Administrators </h2>

                    <div ng-show="ctrl.adminUsers.length==0">No Administrators at the moment</div>
                    <table class="table table-hover" ng-show="ctrl.adminUsers.length>0">
                        <thead>
                        <tr>
                            <th>User Name</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ng-repeat="user in ctrl.adminUsers">
                            <td> {{user.name}}    <span class="badge" tooltip-placement="top"
                                                        tooltip="Number of tokens owned by {{user.name}}.">{{ctrl.tokenCount[user.name]}}</span>
                            </td>
                            <td>
                                <button ng-click="ctrl.toggleRole(user)" class="btn btn-primary"
                                        tooltip-placement="left"
                                        tooltip="Will make {{user.name}} a normal user">Non Admin
                                </button>
                            </td>
                            <td>
                                <button ng-click="ctrl.removeUser(user)" class="btn btn-danger"
                                        tooltip-placement="right"
                                        tooltip="Will remove {{user.name}} and all it's settings as well.">remove
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <h2>Normal Users: </h2>

                    <div ng-show="ctrl.normalUsers.length==0">No Normal users at the moment</div>
                    <table class="table table-hover" ng-show="ctrl.normalUsers.length>0">
                        <thead>
                        <tr>
                            <th>User Name</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ng-repeat="user in ctrl.normalUsers">
                            <td> {{user.name}}    <span class="badge" tooltip-placement="top"
                                                        tooltip="Number of tokens owned by {{user.name}}.">{{ctrl.tokenCount[user.name]}}</span>
                            </td>
                            <td>
                                <button ng-click="ctrl.toggleRole(user)" class="btn btn-warning"
                                        tooltip-placement="left"
                                        tooltip="Will make {{user.name}} an Admin user">Add to Admins
                                </button>
                            </td>
                            <td>
                                <button ng-click="ctrl.removeUser(user)" class="btn btn-danger"
                                        tooltip-placement="right"
                                        tooltip="Will remove {{user.name}} and all it's settings as well.">remove
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </tab>
        </tabset>
    </div>
</div>


</body>
</html>