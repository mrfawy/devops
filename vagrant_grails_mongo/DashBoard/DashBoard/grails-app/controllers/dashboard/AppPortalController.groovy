package dashboard

import grails.converters.JSON

class AppPortalController {
    SettingsService settingsService
    AuthenticationService authenticationService

    def index() {}

    def loadTokenSettings() {

        def result = settingsService.loadTokenSettings(params.env, params.app, params.token, params.service)

        if (!result) {
            render ControllerResponse.noRecords() as JSON
        } else {
            response.status = 500
            render result as JSON
        }

    }

    def retrieveAppTemplate(){
        def appTemplateSettings=settingsService.retrieveAppTemplate(params.app)
        if(!appTemplateSettings){
            render ControllerResponse.noRecords() as JSON
            return
        }
        render appTemplateSettings as JSON


    }

    def createDefaultTokenSettings() {
        def req = request.JSON
        //check Authentication
        def isValidAuth = checkReqAuthentication(req)
        if (!isValidAuth) {
            response.status = 500
            render ControllerResponse.authorizationAPIError() as JSON
            return
        }
        def appTemplateSettings=settingsService.retrieveAppTemplate(params.app)
        def isMatching=isMatchingTemplate(appTemplateSettings,req.services)
        if(!isMatching){
            response.status = 500
            render new ControllerResponse(code: "0002",status: "Matching app template failed ",message: "Application Settings template are not matching with your request ") as JSON
            return
        }
        def tokenSettings=settingsService.generateTokenSettingsForApp(params.env,params.app,"Default",req.auth.user)
        tokenSettings.services=req.services
        settingsService.upsertTokenSettings(tokenSettings)
        render ControllerResponse.success() as JSON
    }

    def checkReqAuthentication(req) {
        if (!req?.auth?.user || !req?.auth?.password) {

            return false
        }
        def user = authenticationService.authenticateUser(req.auth.user, req.auth.password)
        if (!user) {
            return false
        }
        return true

    }

    /**
     * Check if all services and  properties from template are found in the request
     * @param templateServices
     * @param requestServices
     * @return
     */

    def isMatchingTemplate(templateServices, requestServices) {
        if (templateServices.length != requestServices.length) {
            return false
        }
        try{
            templateServices.each { templateService ->
                def serviceMatch = false
                requestServices.each { requestService ->
                    if (templateService.name == requestService.name) {
                        serviceMatch = true
                        templateService.properties.each { templateProperty ->
                            def propertyMatch = false
                            requestService.properties.each { requestProperty ->
                                if (templateProperty.name == requestProperty.name) {
                                    propertyMatch = true
                                    return
                                }

                            }
                            if(!propertyMatch){
                                throw new RuntimeException("Property not matching:"+templateProperty.name)
                            }
                        }

                    }
                }
                if (!serviceMatch) {
                    throw new RuntimeException("Service not matching:"+templateService.name)
                }
            }
            return true

        }catch (e){
                e.printStackTrace()
                return false
        }


    }


}
