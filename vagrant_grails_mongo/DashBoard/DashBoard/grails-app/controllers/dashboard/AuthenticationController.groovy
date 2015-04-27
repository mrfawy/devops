package dashboard

import grails.converters.JSON

class AuthenticationController {
    def authenticationService

    def index(){}

    def login(){
        def user=authenticationService.authenticateUser(params.userName,params.password)
        if(user){
            session.authenticated=true
            session.userName=params.userName
            if(user.get("role")=="admin"){
                session.isAdmin=true
            }
            redirect(controller: 'settings', action: 'index')

        }
        else{
            request.error="Invalid user name or passowrd ."
            render(view: "index")
        }

    }
    def loadSessionData(){
        def builder = new groovy.json.JsonBuilder()
        def s = builder.session {
            userName session?.userName
        }
        render s as JSON

    }
    def register(){
        def result=authenticationService.registerUser(params.userName,params.password,"user")
        if(result){
            redirect(controller: 'settings', action: 'index')
        }
        else{
            request.error="user already exists ."
            render(view: "index")
        }
    }
    def logout(){
        session.invalidate()
        redirect(action:"index")
    }
}
