<html>
<head>
    <meta name="layout" content="main"/>
</head>
<body>
<div class="container" ng-controller="HelpController as ctrl">
    <div class="row help">
        <div class="col-xs-12">
            <tabset>
                <tab heading="Introduction" active="true">
                    <g:render template="intro"/>
                </tab>
                <tab heading="Testers">
                    <g:render template="tester"/>
                </tab>
                <tab heading="App Developers">
                    <g:render template="appDeveloper"/>
                </tab>
                <tab heading="Dashboard contributors">
                    <g:render template="contributors"/>
                </tab>
            </tabset>

        </div>

    </div>
</div>

</body>
</html>