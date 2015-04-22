package dashboard

import grails.artefact.Interceptor
import grails.core.GrailsApplication
import grails.web.servlet.mvc.GrailsHttpSession
import org.grails.web.servlet.mvc.GrailsWebRequest
import org.springframework.web.context.request.RequestContextHolder

import java.lang.annotation.Annotation


class SecurityInterceptor {


    SecurityInterceptor() {
        matchAll().excludes(controller:"authentication")

    }

    boolean before() {
        //if (!session['authenticated']) {
            //redirect(controller: "authentication", action: "index")
            //return false
        //}
        return true
    }
    boolean after() { true }

    void afterView() {
        // no-op
    }


}
