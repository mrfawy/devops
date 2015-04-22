package dashboard

import grails.artefact.Interceptor
import grails.artefact.controller.support.ResponseRedirector


class SecurityInterceptor implements ResponseRedirector{


    SecurityInterceptor() {
        matchAll().excludes(controller:"authentication")

    }

    boolean before() {

        true
    }
    boolean after() { true }

    void afterView() {
        // no-op
    }


}
