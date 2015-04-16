package dashboard

import grails.converters.JSON

class SettingsController {
    SettingsService settingsService

    def index() { }

    def retrieveEnvironments(){
        render settingsService.loadEnvs() as JSON
    }

    def retrieveApps(){
        render settingsService.loadApps() as JSON
    }
    def retrieveUserIds(){
        def result=settingsService.loadUsers(params.env,params.app)
        render result as JSON
    }
}
