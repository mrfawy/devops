<html>
<head>
    <meta name="layout" content="main"/>
</head>
<body>
<div ng-controller="SelectEnvAppCtrl as ctrl">
{{env}} -  {{app}}

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


    <div ng-repeat="user in ctrl.userIds">{{user.userId}}</div>

</div>

<div  ng-init="qty=1;cost=2">
    <b>Invoice:</b>

    <div>
        Quantity: <input type="number" min="0" ng-model="qty"/>
    </div>
    <div>
        Costs: <input type="number" min="0" ng-model="cost"/>
    </div>
    <div>
        <b>Total:</b> {{qty * cost | currency}}
    </div>
</div>
</body>
</html>