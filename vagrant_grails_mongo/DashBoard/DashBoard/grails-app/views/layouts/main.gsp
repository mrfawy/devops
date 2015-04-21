<html lang="en" class="no-js">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title><g:layoutTitle default="Dashboard" /></title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>


        <!-- jQuery /jQueryUI -->
        <asset:javascript src="/libs/jquery.js" />
        <asset:javascript src="/libs/jquery-ui.min.js" />
        <!-- Bootstrap's JavaScript plugins-->
        <asset:javascript src="/libs/bootstrap.min.js" />

        <asset:javascript src="/libs/angular.min.js" />

        <!-- CSS -->
        <asset:stylesheet href="bootstrap.min.css" />
        <asset:stylesheet href="jquery-ui.css" />
        <asset:stylesheet href=" jquery-ui.theme.css" />
        <asset:stylesheet href="jquery-ui.structure.css" />


        <asset:stylesheet href="modal_alert.css" />
        <asset:javascript src="loading-overlay.min.js" />


        <asset:stylesheet src="application.css"/>
        <asset:javascript src="application.js"/>

        <asset:javascript src="/settingsModule/settingsModule.js"/>
        <asset:javascript src="/settingsModule/selectEnvAppCtrl.js"/>

        <g:layoutHead/>
    </head>
    <body ng-app="dashBoardApp">
    <div>
    		<g:render template="/common/modal_alert" />
    	</div>
    	<g:layoutBody />

    </body>
</html>
