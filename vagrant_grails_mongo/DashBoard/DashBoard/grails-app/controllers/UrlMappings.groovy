class UrlMappings {

    static mappings = {

        "/envs/" (controller:"setup" , action:"retrieveEnvironments")
        "/envs/$name" (controller:"setup" ,action : [DELETE:"removeEnvironment", POST:"addEnvironment"])

        "/apps" (controller:"setup" , action:"retrieveApps")
        "/apps/$name" (controller:"setup" ,action : [DELETE:"removeApp", POST:"addApp"])

        "/settings/$env/$app/$userId" (controller:"settings" , action : [ GET:"loadUserSettings",POST:"createUserSettings", PUT:"updateUserSettings", DELETE:"removeUserSettings"])


        "/userIds/$env/$app" (controller:"settings" , action:"retrieveUserIds")

        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(controller:"authentication" , action:"index")
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
