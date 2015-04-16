class UrlMappings {

    static mappings = {
        "/envs" (controller:"settings" , action:"retrieveEnvironments")
        "/apps" (controller:"settings" , action:"retrieveApps")
        "/userIds/$env/$app" (controller:"settings" , action:"retrieveUserIds")
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(view:"/index")
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
