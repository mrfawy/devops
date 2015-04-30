<div class="container">
    <h3>Information for application developers </h3>

    <p> Coming soon </p>

    <div class="row">
        <div class="col-xs-12">
            <div class="panel panel-info">
                <!-- Default panel contents -->
                <div class="panel-heading">
                    <label>Retrieving settings for a token</label>
                </div>
                <div class="col-xs-12">

                    <table class="table table-striped">
                        <tr>
                            <th>Request Method</th>
                            <td>GET</td>
                        </tr>
                        <tr>
                            <th>URL Format</th>
                            <td>/api/settings/$env/$app/$token/$service?</td>
                        </tr>
                        <tr>
                            <th>Required params</th>
                            <td>
                                <ul>
                                    <li>Environment</li>
                                    <li>Application name</li>
                                    <li>Token name</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>optional params</th>
                            <td><strong>Service Name: </strong> will filter and return properties that belongs to
                                service
                            </td>
                        </tr>

                    </table>

                    <div>
                        <h3>Example Usage</h3>


                        <ul>
                            <li>
                                <h4>Retrieve settings at service level</h4>

                                <table class="table table-striped">
                                    <tr>
                                        <th colspan="2">Request</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>
                                                    <th>Method</th>
                                                    <td>GET</td>
                                                </tr>
                                                <tr>
                                                    <th>URL</th>
                                                    <td>/api/settings/ST/ME/mytoken/RetrieveAccounts</td>
                                                </tr>
                                                <tr>
                                                    <th>Note</th>
                                                    <td>Retrieve settings for application (ME) in Environment (ST),
                                                        using
                                                        the
                                                        token
                                                        (myToken), get properties of
                                                        service (RetrieveAccounts)
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colspan="2">Response</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>
                                                    <th>Response</th>
                                                    <td>
                                                        <code>{"name":"RetrieveAccounts","properties":[{"name":"Region","value":"AB"}]}</code>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Note</th>
                                                    <td>list of properties associated with this service , in the example
                                                        one
                                                        property
                                                        with
                                                        name of region and value of
                                                        AB
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </li>

                            <li>
                                <h4>Retrieve settings at token</h4>

                                <table class="table table-striped">
                                    <tr>
                                        <th colspan="2">Request</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>
                                                    <th>Method</th>
                                                    <td>GET</td>
                                                </tr>
                                                <tr>
                                                    <th>URL</th>
                                                    <td>/api/settings/ST/ME/mytoken</td>
                                                </tr>
                                                <tr>
                                                    <th>Note</th>
                                                    <td>Retrieve settings for application (ME) in Environment (ST),
                                                        using
                                                        the
                                                        token
                                                        (myToken), get all available services associated with this token
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colspan="2">Response</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>
                                                    <th>Response</th>
                                                    <td>
                                                        <code>{"app":"ME","env":"ST","owner":"root","services":[{"name":"RetreiveAccounts","properties":[{"name":"Region","value":"ABC"}]},{"name":"paymentHistory","properties":[{"name":"DataBase","value":"TestDB2"}]}],"token":"mytoken"}</code>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="panel panel-info">
                <!-- Default panel contents -->
                <div class="panel-heading">
                    <label>Updating default app settings</label>
                </div>
                <div class="col-xs-12">
                    <p>It's strongly recommended updating Dashboard with Application default settings.Testers will need
                        to
                        know what
                        default
                        values they want to override anyway .
                        To do this a special token named (Default), should be available for each (Env,App).You can
                        update it
                        manually every
                        time you change your settings (e.g. in .properties file ), but of course this is error prone and
                        easy to
                        miss
                        updates .
                        A rest service is created just to meet this need, you need to call this service once you need to
                        update
                        default
                        token settings .Technique could be different from app to app , but generally in spring you can
                        have
                        initializing
                        bean to or other kind of init method to do it for you.</p>
                    <table class="table table-striped">
                        <tr>
                            <th>Request Method</th>
                            <td>POST</td>
                        </tr>
                        <tr>
                            <th>URL Format</th>
                            <td>/api/settings/default/$env/$app/</td>
                        </tr>
                        <tr>
                            <th>Required Url params</th>
                            <td>
                                <ul>
                                    <li>Environment</li>
                                    <li>Application name</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>Request Body (JSON)</th>
                            <td>
                                <ul>
                                    <li>Authentication section : user name and password</li>
                                    <li>services section: List of services and their properties values</li>
                                </ul>
                            </td>
                        </tr>

                    </table>
                    <div>
                        <h3>Example Usage</h3>
                        <ul>
                            <li>
                                <h4>Insert/Update Default settings for application</h4>

                                <table class="table table-striped">
                                    <tr>
                                        <th colspan="2">Request</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>
                                                    <th>Method</th>
                                                    <td>POST</td>
                                                </tr>
                                                <tr>
                                                    <th>Content-Type</th>
                                                    <td>application/json</td>
                                                </tr>
                                                <tr>
                                                    <th>URL</th>
                                                    <td> /api/settings/default/ST/ME/</td>
                                                </tr>
                                                <tr>
                                                    <th>Request Body</th>
                                                    <td><code>{"auth":{"user":"root","password":"root"},services:[{"name":"RetrieveAccounts","properties":[{"name":"Region","value":"AA"}]},{"name":"paymentHistory","properties":[{"name":"DataBase","value":"TestDB2"}]}]}</code>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Note</th>
                                                    <td>Services section is validated to match defined application
                                                        template in Dashboard.
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colspan="2">Response</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>
                                                    <th>Possible Responses</th>
                                                    <td>
                                                        <ul>
                                                            <li>Success message</li>
                                                            <li>Authentication error message : check Auth section and
                                                                make sure you can login to DashBoard using the provided
                                                                user
                                                                and password
                                                            </li>
                                                            <li>Template Mismatch message: check the template services
                                                                and names are valid and in a valid format , to retrieve
                                                                your
                                                                current saved template use the Receiving application
                                                                template service (see below)
                                                            </li>
                                                            <li>service error : please check Dashboard logs or reach to
                                                                a Dashboard admin
                                                            </li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="panel panel-info">
                <!-- Default panel contents -->
                <div class="panel-heading">
                    <label>Retrieving Defined Application template</label>
                </div>
                <div class="col-xs-12">

                    <table class="table table-striped">
                        <tr>
                            <th>Request Method</th>
                            <td>GET</td>
                        </tr>
                        <tr>
                            <th>URL Format</th>
                            <td>/api/settings/template/$app</td>
                        </tr>
                        <tr>
                            <th>Required Url params</th>
                            <td>
                                <ul>
                                    <li>Application name</li>
                                </ul>
                            </td>
                        </tr>

                    </table>
                    <div>
                        <h3>Example Usage</h3>
                        <ul>
                            <li>
                                <h4>Retrieve stored template for Application</h4>

                                <table class="table table-striped">
                                    <tr>
                                        <th colspan="2">Request</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>
                                                    <th>Method</th>
                                                    <td>GET</td>
                                                </tr>

                                                <tr>
                                                    <th>URL</th>
                                                    <td> /api/settings/template/ME        </td>
                                                </tr>

                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Response</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>

                                                    <td>
                                                        <code>[{"name":"RetrieveAccounts","properties":[{"name":"Region","value":""}]},{"name":"paymentHistory","properties":[{"name":"DataBase","value":""}]}]
                                                            List of services and their properties defined for this app .</code>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>If your app has a mismatch with these properties please check with administration console how to define a new app
                                                        template to replace the current one</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>



