package dashboard

import grails.converters.JSON
import groovy.json.JsonSlurper

import static org.springframework.http.HttpStatus.*
import org.codehaus.groovy.runtime.powerassert.AssertionRenderer

class SettingsController {

    SettingsTemplateService settingsTemplateService
    SettingsService settingsService

    def index(){

    }

    def createUserSettings(){

        def template=settingsTemplateService.createTemplateForApp(params.env,params.app,params.userId)
        settingsService.upsertUserSettings(template)
        render ControllerResponse.success() as JSON
    }

    def loadUserSettings(){
        def result=settingsService.loadUserSettings(params.env,params.app,params.userId)
        if(!result){
            render ControllerResponse.noRecords() as JSON
        }else{
            render result as JSON
        }

    }

    def removeUserSettings(){
        def result=settingsService.removeUserSettings(params.env,params.app,params.userId)
    }
    def updateUserSettings(){
        def setting=request.JSON
        settingsService.upsertUserSettings(setting)
        render ControllerResponse.success() as JSON
    }
    def retrieveUserIds(){
        def result=settingsService.loadUsers(params.env,params.app)
        render result as JSON
    }
}
