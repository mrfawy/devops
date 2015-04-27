package dashboard

import grails.artefact.Controller
import grails.artefact.Interceptor
import grails.converters.JSON

import javax.servlet.http.HttpSession


class SecurityInterceptor implements Interceptor,Controller {


    SecurityInterceptor() {
        matchAll().excludes(controller:"authentication")

    }

    boolean before() {
        println "checking authentication for  action ${actionName} , @ ${controllerName}"
        try{
            if (!session?.authenticated ||(controllerName=="admin" && !session?.isAdmin)) {
                    response.status = 500
                    render ControllerResponse.authorizationError() as JSON
                return false
            }
            return true

        }catch (e){
            e.printStackTrace()
            return false;
        }

    }
    boolean after() { true }

    void afterView() {
        // no-op
    }


}
