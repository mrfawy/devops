class UrlMappings {

    static mappings = {


        "/envs/$name?" (controller:"setup" ,action : [GET:"retrieveEnvironments",DELETE:"removeEnvironment", POST:"addEnvironment"])


        "/apps/$name?" (controller:"setup" ,action : [GET:"retrieveApps",DELETE:"removeApp", POST:"addApp"])

        "/settings/$env/$app/$token" (controller:"settings" , action : [ GET:"loadTokenSettings",POST:"createTokenSettings", PUT:"updateTokenSettings", DELETE:"removeTokenSettings"])


        "/tokens/$env/$app" (controller:"settings" , action:"retrieveTokens")


        "/users/$user?/$role?"(controller:"setup" , action:[GET:"loadUsers",POST:"createUser",PUT:"assignUsertoRole",DELETE:"removeUser"])

        "/session/" (controller:"authentication" , action:"loadSessionData")


        "/analytics/values/$app/$service/$property?" (controller:"analytics" , action:"retrieveStoredValuesForProperty")
        "/analytics/countOwnedTokens" (controller:"analytics" , action:[POST:"countOwnedTokens"])


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
