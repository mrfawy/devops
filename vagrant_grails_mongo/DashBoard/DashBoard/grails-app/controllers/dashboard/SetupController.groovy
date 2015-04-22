package dashboard

import grails.converters.JSON

class SetupController {

    SettingsService settingsService
    AuthenticationService authenticationService

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

    def loadUsers(){
        render authenticationService.loadUsers(params.role) as JSON
    }
    def removeUser(){
        authenticationService.removeUser(params.user)
        render ControllerResponse.success() as JSON
    }
    def createUser(){
        def user=request.JSON
        def result=authenticationService.registerUser(user.userName,user.password,"user")
        if(result){
            render ControllerResponse.success() as JSON
        }
        else{
            render new ControllerResponse(code: "0001",status: "warning",message: "already exists") as JSON
        }

    }
    def assignUsertoRole(){
        authenticationService.assignUserRole(params.user,params.role)
        render ControllerResponse.success() as JSON
    }

}
