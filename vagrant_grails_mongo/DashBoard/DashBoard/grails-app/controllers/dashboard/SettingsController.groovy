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

    def createTokenSettings(){
        def r=request.JSON
        def template=settingsService.generateTokenSettingsForApp(params.env,params.app,params.token,r.owner)
        settingsService.upsertTokenSettings(template)
        render ControllerResponse.success() as JSON
    }

    def loadTokenSettings(){
        def result=settingsService.loadTokenSettings(params.env,params.app,params.token)
        if(!result){
            render ControllerResponse.noRecords() as JSON
        }else{
            render result as JSON
        }

    }

    def removeUserSettings(){
        def result=settingsService.removeTokenSettings(params.env,params.app,params.token)
    }
    def updateTokenSettings(){
        def setting=request.JSON
        settingsService.upsertTokenSettings(setting)
        render ControllerResponse.success() as JSON
    }
    def retrieveTokens(){
        def result=settingsService.loadTokens(params.env,params.app)
        render result as JSON
    }
}
