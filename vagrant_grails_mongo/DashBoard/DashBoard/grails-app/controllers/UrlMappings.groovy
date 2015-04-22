class UrlMappings {

    static mappings = {


        "/envs/$name?" (controller:"setup" ,action : [GET:"retrieveEnvironments",DELETE:"removeEnvironment", POST:"addEnvironment"])


        "/apps/$name?" (controller:"setup" ,action : [GET:"retrieveApps",DELETE:"removeApp", POST:"addApp"])

        "/settings/$env/$app/$userId" (controller:"settings" , action : [ GET:"loadUserSettings",POST:"createUserSettings", PUT:"updateUserSettings", DELETE:"removeUserSettings"])


        "/userIds/$env/$app" (controller:"settings" , action:"retrieveUserIds")


        "/users/$user?/$role?"(controller:"setup" , action:[GET:"loadUsers",POST:"createUser",PUT:"assignUsertoRole",DELETE:"removeUser"])


        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(controller:"authentication" , action:"index")
        "500"(controller:"error", action:"index")
        "404"(controller:"error",action:"index")
    }
}
