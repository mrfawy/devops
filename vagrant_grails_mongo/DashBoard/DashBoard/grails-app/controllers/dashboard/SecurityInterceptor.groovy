package dashboard


class SecurityInterceptor {

    SecurityInterceptor() {
        matchAll().excludes(controller:"authentication")

    }

    boolean before() {
        if (!getSession()?.authenticated) {
            redirect(controller: "authentication", action: "index")
            return false
        }
        return true
    }
    boolean after() { true }

    void afterView() {
        // no-op
    }

}
