package dashboard

import grails.converters.JSON

class SetupController {

    SettingsService settingsService

    def index() { }

    def retrieveEnvironments(){
        render settingsService.loadEnvs() as JSON
    }
    def addEnvironment(){
        settingsService.addEnvironment(params.name)
        render ControllerResponse.success() as JSON
    }
    def removeEnvironment(){
        settingsService.removeEnvironment(params.name)
        render ControllerResponse.success() as JSON
    }

    def retrieveApps(){
        render settingsService.loadApps() as JSON

    }
    def addApp(){
        def app=request.JSON
        settingsService.addApp(params.name,app)
        render ControllerResponse.success() as JSON
    }
    def removeApp(){
        settingsService.removeApp(params.name)
        render ControllerResponse.success() as JSON
    }
}
