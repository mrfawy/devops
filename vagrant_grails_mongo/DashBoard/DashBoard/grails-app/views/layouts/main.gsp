<html lang="en" class="no-js">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>
        <g:layoutTitle default="Dashboard"/>
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>


    <!-- jQuery /jQueryUI -->
    <asset:javascript src="/libs/jquery.js"/>
    <asset:javascript src="/libs/jquery-ui.min.js"/>

    <!-- AngularJs-->
    <asset:javascript src="/libs/angular.min.js"/>
    <asset:javascript src="/libs/angular-animate.min.js"/>
    <asset:javascript src="/libs/toaster.min.js"/>


    <!-- Angular bootstrap-->
    <asset:javascript src="/libs/angular-ui-bootstrap-0.12.1.min"/>

    <!-- CSS -->
    <asset:stylesheet href="bootstrap.min.css"/>

    <asset:stylesheet href="toaster.min.css"/>

    <asset:stylesheet href="jquery-ui.css"/>
    <asset:stylesheet href=" jquery-ui.theme.css"/>
    <asset:stylesheet href="jquery-ui.structure.css"/>


    <asset:stylesheet href="modal_alert.css"/>
    <asset:javascript src="loading-overlay.min.js"/>


    <!--Application Modules -->
    <asset:javascript src="application.js"/>
    <asset:stylesheet src="application.css"/>


    <asset:javascript src="/settingsModule/settingsModule.js"/>
    <asset:javascript src="/settingsModule/selectEnvAppCtrl.js"/>
    <asset:javascript src="/settingsModule/settingsEditorCtrl.js"/>

    <asset:javascript src="/adminModule/adminModule.js"/>
    <asset:javascript src="/adminModule/adminEnvCtrl.js"/>
    <asset:javascript src="/adminModule/adminAppCtrl.js"/>
    <asset:javascript src="/adminModule/adminUserCtrl.js"/>

    <g:layoutHead/>
</head>
<body>
<div ng-app="dashBoardApp">
    <toaster-container></toaster-container>
    <g:layoutBody/>
</div>

</body>
</html>
